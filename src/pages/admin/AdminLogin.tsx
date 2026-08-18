import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, User, ArrowLeft, ShieldCheck, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logoTripura from "@/assets/logo-tripura.png";
import logoTripuraForest from "@/assets/logo-tripuraforestdept.png";
import logoWorldBank from "@/assets/logo-theworldbank.jpg";
import { API_BASE_URL, resetSessionExpiredFlag } from "@/config/api";
import ForgotPasswordDialog from "@/components/admin/ForgotPasswordDialog";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [activeToken, setActiveToken] = useState<string | null>(null);
  const [activeError, setActiveError] = useState("");
  const [confirming, setConfirming] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user, password: pass }),
      });
      if (res.status === 200) {
        const data = await res.json();
        if (data?.already_active && data?.temp_token) {
          setActiveToken(data.temp_token);
          setActiveError("");
          return;
        }
        if (data?.mfa_required && data?.temp_token) {
          setTempToken(data.temp_token);
          setCode("");
          setCodeError("");
          return;
        }
        localStorage.setItem("element_admin_token", data.token);
        resetSessionExpiredFlag();
        navigate("/admin");
      } else if (res.status === 401) {
        setError("Invalid email or password");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch {
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setCodeError("Enter the 6-digit code from your authenticator app");
      return;
    }
    setCodeError("");
    setVerifying(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/mfa/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ temp_token: tempToken, code }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 200 && data?.already_active && data?.temp_token) {
        setActiveToken(data.temp_token);
        setActiveError("");
        setTempToken(null);
        setCode("");
        return;
      }
      if (res.status === 200 && data?.token) {
        localStorage.setItem("element_admin_token", data.token);
        resetSessionExpiredFlag();
        navigate("/admin");
        return;
      }
      setCodeError(data?.error || data?.message || "Invalid code");
      setCode("");
    } catch {
      setCodeError("Unable to connect to server");
    } finally {
      setVerifying(false);
    }
  };

  const onConfirmLogin = async () => {
    setActiveError("");
    setConfirming(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/confirm-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ temp_token: activeToken }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 200 && data?.token) {
        localStorage.setItem("element_admin_token", data.token);
        resetSessionExpiredFlag();
        navigate("/admin");
        return;
      }
      setActiveError(data?.error || data?.message || "Unable to continue. Please try again.");
    } catch {
      setActiveError("Unable to connect to server");
    } finally {
      setConfirming(false);
    }
  };

  const backToLogin = () => {
    setTempToken(null);
    setActiveToken(null);
    setActiveError("");
    setCode("");
    setCodeError("");
    setPass("");
  };


  return (
    <main className="min-h-screen bg-surface flex flex-col">
      <div className="bg-primary text-primary-foreground py-3">
        <div className="gov-container flex items-center justify-between">
          <Link
            to="/"
            className="text-sm flex items-center gap-2 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Public Website
          </Link>
          <span className="text-xs opacity-90">
            Government of Tripura | The World Bank
          </span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-card rounded-lg shadow-elevated border border-border overflow-hidden">
          <div className="bg-primary text-primary-foreground px-6 py-5 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <img
                src={logoTripura}
                alt="Tripura"
                className="h-10 w-10 bg-white rounded p-1"
              />
              <img
                src={logoTripuraForest}
                alt="Tripura Forest Department"
                className="h-10 w-auto bg-white rounded p-1"
              />
              <img
                src={logoWorldBank}
                alt="World Bank"
                className="h-10 w-auto bg-white rounded p-1"
              />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">ELEMENT</h1>
            <p className="text-xs opacity-90">
              Enhancing Landscape and Ecosystem Management
            </p>
            <p className="text-[11px] opacity-80 mt-1">Admin Portal</p>
          </div>

          {activeToken ? (
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <h2 className="font-semibold">Already logged in</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                This account is already logged in elsewhere. Do you want to end
                that session and continue here?
              </p>
              {activeError && (
                <p className="text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded px-3 py-2">
                  {activeError}
                </p>
              )}
              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={onConfirmLogin}
                  disabled={confirming}
                  className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground h-11 text-base font-semibold"
                >
                  {confirming ? "Continuing..." : "Continue"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={backToLogin}
                  disabled={confirming}
                  className="flex-1 h-11 text-base font-semibold"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : tempToken ? (
            <form onSubmit={onVerify} className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck className="h-5 w-5" />
                <h2 className="font-semibold">Enter verification code</h2>
              </div>
              <p className="text-xs text-muted-foreground">
                Enter the 6-digit code from your authenticator app to finish signing in.
              </p>
              <div>
                <Label htmlFor="mfa_code">Verification Code</Label>
                <Input
                  id="mfa_code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="000000"
                  className="mt-1 font-mono tracking-widest text-center"
                  autoFocus
                />
              </div>
              {codeError && (
                <p className="text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded px-3 py-2">
                  {codeError}
                </p>
              )}
              <Button
                type="submit"
                disabled={verifying || code.length !== 6}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-11 text-base font-semibold"
              >
                {verifying ? "Verifying..." : "Verify"}
              </Button>
              <button
                type="button"
                onClick={backToLogin}
                className="w-full text-xs text-primary hover:underline inline-flex items-center justify-center gap-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to login
              </button>
            </form>
          ) : (
          <form onSubmit={onSubmit} className="p-6 space-y-4">

            <div>
              <Label htmlFor="user">Username / Email</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="user"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  placeholder=""
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="pass">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="pass"
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2">
                <input type="checkbox" /> Remember me
              </label>
              {/*
              <button
                type="button"
                onClick={() => setForgotOpen(true)}
                className="text-primary hover:underline"
              >
                Forgot password?
              </button>
              */}
            </div>
            {error && (
              <p className="text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded px-3 py-2">
                {error}
              </p>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-11 text-base font-semibold"
            >
              {loading ? "Signing in..." : "Login to Dashboard"}
            </Button>
            <p className="text-[11px] text-center text-muted-foreground">
              Use your admin credentials.
            </p>
          </form>
          )}

        </div>
      </div>

      <footer className="bg-primary-dark text-primary-foreground text-xs py-3 text-center">
        © 2026 ELEMENT Project, Government of Tripura. All rights reserved.
      </footer>
      <ForgotPasswordDialog open={forgotOpen} onOpenChange={setForgotOpen} />
    </main>
  );
}
