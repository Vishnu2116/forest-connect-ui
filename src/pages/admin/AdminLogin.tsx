import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logoTripura from "@/assets/logo-tripura.png";
import logoTripuraForest from "@/assets/logo-tripuraforestdept.png";
import logoWorldBank from "@/assets/logo-theworldbank.jpg";
import { API_BASE_URL, resetSessionExpiredFlag } from "@/config/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

          <form onSubmit={onSubmit} className="p-6 space-y-4">
            <div>
              <Label htmlFor="user">Username / Email</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="user"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  placeholder="admin@element.tripura.gov.in"
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
                  required
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2">
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" className="text-primary hover:underline">
                Forgot password?
              </a>
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
              {USE_REAL_API
                ? "Use your admin credentials."
                : "Demo only — any credentials will be accepted."}
            </p>
          </form>
        </div>
      </div>

      <footer className="bg-primary-dark text-primary-foreground text-xs py-3 text-center">
        © 2026 ELEMENT Project, Government of Tripura. All rights reserved.
      </footer>
    </main>
  );
}
