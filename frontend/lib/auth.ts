export interface Session {
  token: string;
  username: string;
  role: string;
}

const KEY = "edupulse-session";

export function saveSession(session: Session) {
  localStorage.setItem("token", session.token);
  localStorage.setItem(KEY, JSON.stringify(session));
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem(KEY);
}
