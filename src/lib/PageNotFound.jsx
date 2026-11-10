import { Link, useLocation } from "react-router-dom";

export default function PageNotFound() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-7xl font-light text-slate-300">404</h1>
        <div className="h-0.5 w-16 bg-slate-200 mx-auto" />
        <h2 className="text-2xl font-medium text-slate-800">
          Page Not Found
        </h2>
        <p className="text-slate-600">
          The page "{location.pathname}" could not be found.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 rounded-lg bg-brand-green text-white font-medium"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
