import { useState } from "react";
import { Loader2, KeyRound } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { API_BASE_URL, getAuthJsonHeaders, handleApiResponse } from "@/config/api";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type FieldErrors = {
  current_password?: string;
  new_password?: string;
  confirm_password?: string;
  form?: string;
};

export default function ChangePasswordDialog({ open, onOpenChange }: Props) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setCurrent(""); setNext(""); setConfirm(""); setErrors({}); setSubmitting(false);
  };

  const close = () => {
    reset();
    onOpenChange(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: FieldErrors = {};
    if (!current) errs.current_password = "Current password is required";
    if (!next) errs.new_password = "New password is required";
    else if (next.length < 8) errs.new_password = "New password must be at least 8 characters";
    if (!confirm) errs.confirm_password = "Please confirm your new password";
    else if (next !== confirm) errs.confirm_password = "Passwords do not match";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
        method: "PUT",
        headers: getAuthJsonHeaders(),
        body: JSON.stringify({ current_password: current, new_password: next }),
      });

      if (res.status === 200) {
        toast.success("Password changed successfully");
        close();
        return;
      }
      if (res.status === 401) {
        // Do NOT trigger global session-expired flow here — this 401 means the
        // current password is wrong, not an expired token.
        setErrors({ current_password: "Current password is incorrect" });
        return;
      }
      if (res.status === 422) {
        let msg = "Validation error";
        try {
          const data = await res.json();
          msg = data?.message || data?.error || msg;
          if (data?.errors && typeof data.errors === "object") {
            const fe: FieldErrors = {};
            if (data.errors.current_password) fe.current_password = String(data.errors.current_password);
            if (data.errors.new_password) fe.new_password = String(data.errors.new_password);
            setErrors(Object.keys(fe).length ? fe : { new_password: msg });
            return;
          }
        } catch { /* ignore */ }
        setErrors({ new_password: msg });
        return;
      }
      // Other errors (including 500) — let global handler catch real 401s only
      await handleApiResponse(res).catch(() => {});
      setErrors({ form: "Something went wrong. Please try again." });
      toast.error("Failed to change password");
    } catch {
      setErrors({ form: "Network error. Please try again." });
      toast.error("Failed to change password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-4 w-4" /> Change Password
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="current_password">Current Password</Label>
            <Input
              id="current_password"
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              autoComplete="current-password"
              className="mt-1"
            />
            {errors.current_password && <p className="text-xs text-destructive mt-1">{errors.current_password}</p>}
          </div>
          <div>
            <Label htmlFor="new_password">New Password</Label>
            <Input
              id="new_password"
              type="password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              autoComplete="new-password"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">Must be at least 8 characters.</p>
            {errors.new_password && <p className="text-xs text-destructive mt-1">{errors.new_password}</p>}
          </div>
          <div>
            <Label htmlFor="confirm_password">Confirm New Password</Label>
            <Input
              id="confirm_password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              className="mt-1"
            />
            {errors.confirm_password && <p className="text-xs text-destructive mt-1">{errors.confirm_password}</p>}
          </div>
          {errors.form && <p className="text-sm text-destructive">{errors.form}</p>}
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={close} disabled={submitting}>Cancel</Button>
            <Button type="submit" disabled={submitting} className="bg-primary text-primary-foreground hover:bg-primary-dark gap-1.5">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
              Change Password
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
