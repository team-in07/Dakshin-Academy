import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const clean = (v, max) => String(v ?? '').trim().slice(0, max);
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    if (body.website) return Response.json({ ok: true }); // honeypot

    const d = {
      parentName: clean(body.parentName, 100),
      studentName: clean(body.studentName, 100),
      grade: clean(body.grade, 30),
      program: clean(body.program, 120),
      phone: clean(body.phone, 30),
      email: clean(body.email, 150),
      preferredTiming: clean(body.preferredTiming, 120),
      message: clean(body.message, 1500),
      source: clean(body.source, 120) || 'Website',
    };
    if (!d.parentName || !d.studentName || !d.phone || !/^\S+@\S+\.\S+$/.test(d.email)) {
      return Response.json({ error: 'Please fill in the required fields with valid details.' }, { status: 400 });
    }

    const record = await base44.asServiceRole.entities.Enquiry.create({ ...d, followUpStatus: 'new' });

    const admins = await base44.asServiceRole.entities.User.filter({ role: 'admin' });
    const html = `<h2>New enquiry — Dakshin Academy</h2>
<p><b>Parent:</b> ${esc(d.parentName)}<br><b>Student:</b> ${esc(d.studentName)} (Grade ${esc(d.grade)})<br>
<b>Program:</b> ${esc(d.program)}<br><b>Phone:</b> ${esc(d.phone)}<br><b>Email:</b> ${esc(d.email)}<br>
<b>Preferred timing:</b> ${esc(d.preferredTiming)}<br><b>Source:</b> ${esc(d.source)}</p>
<p><b>Message:</b><br>${esc(d.message)}</p>`;
    await Promise.allSettled(
      (admins.items ?? admins).map((a) =>
        base44.asServiceRole.integrations.Core.SendEmail({
          to: a.email,
          subject: `New enquiry: ${d.studentName} — ${d.program || 'General'}`,
          body: html,
          from_name: 'Dakshin Academy Website',
        })
      )
    );

    return Response.json({ ok: true, id: record.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}