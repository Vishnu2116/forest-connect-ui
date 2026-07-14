import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logoTripura from "@/assets/logo-tripura.png";
import logoTripuraForest from "@/assets/logo-tripuraforestdept.png";
import logoWorldBank from "@/assets/logo-theworldbank.jpg";
import { API_BASE_URL } from "@/config/api";

const Frame = ({ children }: { children: React.ReactNode }) => (
  <main className="min-h-screen bg-surface flex flex-col">
    <div className="bg-primary text-primary-foreground py-3">
      <div className="gov-container flex items-center justify-between">
        <Link to="/admin/login" className="text-sm flex items-center gap-2 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Login
        </Link>
        <span className="text-xs opacity-90">Government of Tripura | The World Bank</span>
      </div>
    </div>
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-card rounded-lg shadow-elevated border border-border overflow-hidden">
        <div className="bg-primary text-primary-foreground px-6 py-5 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img src={logoTripura} alt="Tripura" className="h-10 w-10 bg-white rounded p-1" />
            <img src={logoTripuraForest} alt="Tripura Forest Department" className="h-10 w-auto bg-white rounded p-1" />
            <img src={logoWorldBank} alt="World Bank" className="h-10 w-auto bg-white rounded p-1" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">ELEMENT</h1>
          <p className="text-xs opacity-90">Reset Password</p>
        </div>
        {children}
      </div>
    </div>
    <footer className="bg-primary-dark text-primary-foreground text-xs py-3 text-center">
      © 2026 ELEMENT Project, Government of Tripura. All rights reserved.
    </footer>
  </main>
);

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token") || "";

  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState<{ pw?: string; pw2?: string }>({});
  const [success, setSuccess] = useState(false);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => navigate("/admin/login"), 2500);
      return () => clearTimeout(t);
    }
  }, [success, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldError({});

    const fe: { pw?: string; pw2?: string } = {};
    if (pw.length < 8) fe.pw = "Password must be at least 8 characters";
    if (pw !== pw2) fe.pw2 = "Passwords do not match";
    if (fe.pw || fe.pw2) {
      setFieldError(fe);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: pw }),
      });
      if (res.status === 200) {
        setSuccess(true);
      } else if (res.status === 400) {
        setExpired(true);
      } else if (res.status === 422) {
        let data: any = {};
        try { data = await res.json(); } catch {}
        const msg = data?.errors?.new_password || data?.message || "Invalid password";
        setFieldError({ pw: msg });
      } else {
        setError("Something went wrong, please try again");
      }
    } catch {
      setError("Something went wrong, please try again");
    } finally {
      setLoading(false);
    }
  };

  const Frame = ({ children }: { children: React.ReactNode }) => (
    <main className="min-h-screen bg-surface flex flex-col">
      <div className="bg-primary text-primary-foreground py-3">
        <div className="gov-container flex items-center justify-between">
          <Link to="/admin/login" className="text-sm flex items-center gap-2 hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to Login
          </Link>
          <span className="text-xs opacity-90">Government of Tripura | The World Bank</span>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-card rounded-lg shadow-elevated border border-border overflow-hidden">
          <div className="bg-primary text-primary-foreground px-6 py-5 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <img src={logoTripura} alt="Tripura" className="h-10 w-10 bg-white rounded p-1" />
              <img src={logoTripuraForest} alt="Tripura Forest Department" className="h-10 w-auto bg-white rounded p-1" />
              <img src={logoWorldBank} alt="World Bank" className="h-10 w-auto bg-white rounded p-1" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">ELEMENT</h1>
            <p className="text-xs opacity-90">Reset Password</p>
          </div>
          {children}
        </div>
      </div>
      <footer className="bg-primary-dark text-primary-foreground text-xs py-3 text-center">
        © 2026 ELEMENT Project, Government of Tripura. All rights reserved.
      </footer>
    </main>
  );

  if (!token) {
    return (
      <Frame>
        <div className="p-6 space-y-4 text-center">
          <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded px-3 py-2">
            Invalid or missing reset link
          </p>
          <Link to="/admin/login" className="text-primary hover:underline text-sm">Go to Login</Link>
        </div>
      </Frame>
    );
  }

  if (success) {
    return (
      <Frame>
        <div className="p-6 space-y-4 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto" />
          <p className="text-sm font-medium">Password has been reset successfully</p>
          <p className="text-xs text-muted-foreground">Redirecting to login…</p>
          <Link to="/admin/login" className="text-primary hover:underline text-sm inline-block">Go to Login</Link>
        </div>
      </Frame>
    );
  }

  if (expired) {
    return (
      <Frame>
        <div className="p-6 space-y-4 text-center">
          <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded px-3 py-2">
            This reset link is invalid or has expired. Please request a new one.
          </p>
          <Link to="/admin/login" className="text-primary hover:underline text-sm">Back to Login</Link>
        </div>
      </Frame>
    );
  }

  return (
    <Frame>
      <form onSubmit={onSubmit} className="p-6 space-y-4">
        <div>
          <Label htmlFor="pw">New Password</Label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="pw" type="password" value={pw} onChange={(e) => setPw(e.target.value)} className="pl-9" required minLength={8} />
          </div>
          {fieldError.pw && <p className="text-xs text-destructive mt-1">{fieldError.pw}</p>}
        </div>
        <div>
          <Label htmlFor="pw2">Confirm New Password</Label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="pw2" type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} className="pl-9" required />
          </div>
          {fieldError.pw2 && <p className="text-xs text-destructive mt-1">{fieldError.pw2}</p>}
        </div>
        {error && (
          <p className="text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded px-3 py-2">{error}</p>
        )}
        <Button type="submit" disabled={loading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-11 text-base font-semibold">
          {loading ? "Resetting…" : "Reset Password"}
        </Button>
      </form>
    </Frame>
  );
}
