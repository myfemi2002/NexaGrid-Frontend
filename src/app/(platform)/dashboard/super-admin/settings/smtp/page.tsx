"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/services/auth";
import { fetchMailSettings, sendMailTest, updateMailSettings, type MailSettingForm } from "@/services/platform-settings";

const defaultSettings: MailSettingForm = {
  mailer: "smtp",
  host: "",
  port: "465",
  username: "",
  password: "",
  from_name: "",
  from_address: "",
  encryption: "tls",
};

export default function SuperAdminSmtpSettingsPage() {
  const [form, setForm] = useState<MailSettingForm>(defaultSettings);
  const [testEmail, setTestEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    fetchMailSettings()
      .then((settings) => setForm(settings))
      .catch(() => setErrorMessage("We could not load SMTP settings right now."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardShell
      slug="super-admin"
      title="SMTP Settings"
      subtitle="Configure transactional email delivery from the super admin panel without editing environment files."
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link href="/dashboard/super-admin" className="text-sm font-medium text-emerald">
          Back to Super Admin Overview
        </Link>
      </div>

      <Card>
        <div className="border-b border-border pb-4">
          <h2 className="font-heading text-2xl font-semibold">SMTP Settings</h2>
        </div>

        {loading ? <p className="mt-6 text-sm text-muted-foreground">Loading SMTP settings...</p> : null}
        {message ? <p className="mt-6 rounded-2xl border border-emerald/20 bg-emerald/5 px-4 py-3 text-sm text-emerald">{message}</p> : null}
        {errorMessage ? <p className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p> : null}

        {!loading ? (
          <form
            className="mt-6 space-y-6"
            onSubmit={async (event) => {
              event.preventDefault();
              setSaving(true);
              setMessage(null);
              setErrorMessage(null);

              try {
                const response = await updateMailSettings(form);
                setMessage(response.message ?? "SMTP settings updated successfully.");
              } catch (error) {
                setErrorMessage(getApiErrorMessage(error, "This request could not be processed at the moment."));
              } finally {
                setSaving(false);
              }
            }}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-charcoal">Mail Mailer</label>
                <Input value={form.mailer} readOnly />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-charcoal">Mail Port</label>
                <Input value={form.port} onChange={(event) => setForm((current) => ({ ...current, port: event.target.value }))} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-charcoal">Mail Host</label>
                <Input value={form.host} onChange={(event) => setForm((current) => ({ ...current, host: event.target.value }))} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-charcoal">Mail Password</label>
                <Input type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-charcoal">Mail Username</label>
                <Input value={form.username} onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-charcoal">Mail From Name</label>
                <Input value={form.from_name} onChange={(event) => setForm((current) => ({ ...current, from_name: event.target.value }))} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-charcoal">Mail From Address</label>
                <Input value={form.from_address} onChange={(event) => setForm((current) => ({ ...current, from_address: event.target.value }))} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-charcoal">Mail Encryption</label>
                <select
                  className="h-12 w-full rounded-2xl border border-line bg-white px-4 text-sm outline-none"
                  value={form.encryption}
                  onChange={(event) => setForm((current) => ({ ...current, encryption: event.target.value as "tls" | "ssl" }))}
                >
                  <option value="tls">TLS</option>
                  <option value="ssl">SSL</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="px-8" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        ) : null}
      </Card>

      <Card className="mt-6">
        <h2 className="font-heading text-2xl font-semibold">Send Test Email</h2>
        <p className="mt-2 text-sm text-muted-foreground">Send a test message after saving to confirm your SMTP credentials are working.</p>
        <div className="mt-5 flex flex-col gap-3 md:flex-row">
          <Input placeholder="Recipient email address" value={testEmail} onChange={(event) => setTestEmail(event.target.value)} />
          <Button
            type="button"
            disabled={testing}
            onClick={async () => {
              setTesting(true);
              setMessage(null);
              setErrorMessage(null);

              try {
                const response = await sendMailTest(testEmail);
                setMessage(response.message ?? "Test email sent successfully.");
              } catch (error) {
                setErrorMessage(getApiErrorMessage(error, "We could not send the test email."));
              } finally {
                setTesting(false);
              }
            }}
          >
            {testing ? "Sending..." : "Send Test Email"}
          </Button>
        </div>
      </Card>
    </DashboardShell>
  );
}
