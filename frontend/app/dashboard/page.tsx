"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSession, Session } from "@/lib/auth";

export default function Dashboard() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setSession(getSession());
  }, []);

  if (!session) return <div className="container">Please log in.</div>;

  return (
    <div className="container">
      <h1>Welcome, {session.username}</h1>
      <div className="card">
        <p>Role: {session.role}</p>
        <p>Use the navigation above to manage student profiles, attendance, and results.</p>
        <p>
          <Link href="/students">Student Service</Link> ·{" "}
          <Link href="/attendance">Attendance Service</Link> ·{" "}
          <Link href="/results">Result Service</Link>
        </p>
      </div>
    </div>
  );
}
