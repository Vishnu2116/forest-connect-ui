import { API_BASE_URL } from "@/config/api";

export type Captcha = { question: string; token: string };

export async function fetchCaptcha(kind: "contact" | "feedback"): Promise<Captcha> {
  const res = await fetch(`${API_BASE_URL}/api/${kind}/captcha`);
  if (!res.ok) throw new Error("Failed to load captcha");
  return res.json();
}

export async function submitPublicForm(
  kind: "contact" | "feedback",
  body: Record<string, unknown>
): Promise<{ ok: boolean; status: number; data: any }> {
  const res = await fetch(`${API_BASE_URL}/api/${kind}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // ignore
  }
  return { ok: res.ok, status: res.status, data };
}

// Visually hidden style for honeypot (off-screen, not display:none so bots fill it)
export const honeypotStyle: React.CSSProperties = {
  position: "absolute",
  left: "-10000px",
  top: "auto",
  width: "1px",
  height: "1px",
  overflow: "hidden",
  opacity: 0,
};
