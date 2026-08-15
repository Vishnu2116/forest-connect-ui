import { useEffect, useState } from "react";
import { Loader2, ShieldCheck, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AdminPageHeader } from "./AdminLayout";
import { API_BASE_URL, getAuthHeaders, getAuthJsonHeaders } from "@/config/api";

export default function MfaSetupAdmin() {
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError("");
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/mfa/setup`, {
          method: "POST",
          headers: getAuthHeaders(),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || data?.message || "Unable to start MFA setup");
        if (cancelled) return;
        setQrCode(data.qrCode || "");
        setSecret(data.secret || "");
      } catch (err) {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : "Unable to start MFA setup");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const copySecret = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      toast.success("Secret copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Unable to copy");
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setCodeError("Enter the 6-digit code from your authenticator app");
      return;
    }
    setCodeError("");
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/mfa/verify-setup`, {
        method: "POST",
        headers: getAuthJsonHeaders(),
        body: JSON.stringify({ code }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setEnabled(true);
        toast.success(data?.message || "MFA enabled successfully");
        return;
      }
      setCodeError(data?.error || data?.message || "Invalid code. Please try again.");
      setCode("");
    } catch {
      setCodeError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Security / MFA Setup"
        subtitle="Add two-factor authentication to your admin account using an authenticator app."
      />

      {enabled ? (
        <div className="bg-card border border-border rounded-md p-6 max-w-2xl shadow-card">
          <div className="flex items-start gap-3 rounded-md border border-green-600/40 bg-green-600/10 p-4">
            <ShieldCheck className="h-5 w-5 text-green-700 mt-0.5" />
            <div>
              <p className="font-semibold text-green-800">MFA is now enabled for your account</p>
              <p className="text-sm text-muted-foreground mt-1">
                You will be asked for a 6-digit code from your authenticator app the next time you log in.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-md p-6 max-w-2xl shadow-card space-y-6">
          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Generating your setup code…
            </div>
          )}

          {!loading && loadError && <p className="text-sm text-destructive">{loadError}</p>}

          {!loading && !loadError && (
            <>
              <div>
                <h3 className="font-semibold text-primary mb-1">1. Scan the QR code</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Open your authenticator app (Google Authenticator, Authy, etc.) and scan this code.
                </p>
                {qrCode && (
                  <img
                    src={qrCode}
                    alt="MFA setup QR code"
                    className="h-48 w-48 border border-border rounded bg-white p-2"
                  />
                )}
              </div>

              <div>
                <h3 className="font-semibold text-primary mb-1">2. Or enter the key manually</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  If you can’t scan the QR code, type this secret into your app.
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 font-mono text-sm break-all bg-surface border border-border rounded px-3 py-2">
                    {secret || "—"}
                  </code>
                  <Button type="button" variant="outline" onClick={copySecret} disabled={!secret} className="gap-1.5">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    Copy
                  </Button>
                </div>
              </div>

              <form onSubmit={submit} className="border-t border-border pt-5">
                <h3 className="font-semibold text-primary mb-1">3. Verify the code</h3>
                <Label htmlFor="mfa_code" className="mt-3 block">Verification Code</Label>
                <Input
                  id="mfa_code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="000000"
                  className="mt-1 w-40 font-mono tracking-widest"
                />
                {codeError && <p className="text-xs text-destructive mt-1">{codeError}</p>}
                <div className="flex justify-end border-t border-border mt-5 pt-4">
                  <Button
                    type="submit"
                    disabled={submitting || code.length !== 6}
                    className="bg-primary text-primary-foreground hover:bg-primary-dark gap-1.5"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                    Verify &amp; Enable MFA
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
