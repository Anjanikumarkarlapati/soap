"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { saveSession } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { username, password });
      saveSession(res.data);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data || "Login failed");
    }
  }

  return (
    <div className="container">
      <div className="card login-box">
        <h2>Sign in</h2>
        <form onSubmit={handleSubmit} style={{ flexDirection: "column" }}>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="primary" type="submit">Login</button>
          {error && <p className="error">{String(error)}</p>}
        </form>
      </div>
    </div>
  );
}
