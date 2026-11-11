
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function AdminRoute({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let active = true;

    async function loadSession() {
      const { data, error } = await supabase.auth.getSession();

      if (!active) return;

      setSession(error ? null : data.session);
      setLoading(false);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!active) return;
      setSession(newSession);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function verifyAdmin() {
      if (loading) return;

      if (!session?.user) {
        setStatus("unauthorized");
        return;
      }

      setStatus("checking");

      const { data, error } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (!active) return;

      if (error) {
        setStatus("error");
      } else if (data) {
        setStatus("allowed");
      } else {
        setStatus("unauthorized");
      }
    }

    verifyAdmin();

    return () => {
      active = false;
    };
  }, [session, loading]);

  if (loading || status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking administrator access...
      </div>
    );
  }

  if (status === "unauthorized") {
    return <Navigate to="/admin/login" replace />;
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        Unable to verify administrator access. Please refresh or try again.
      </div>
    );
  }

  return children;
}
