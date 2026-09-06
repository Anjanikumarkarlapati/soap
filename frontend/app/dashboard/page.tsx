"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { getSession, Session } from "@/lib/auth";

export default function Dashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [studentCount, setStudentCount] = useState<number | null>(null);

  useEffect(() => {
    setSession(getSession());
    api
      .get("/students")
      .then((res) => setStudentCount(res.data.length))
      .catch(() => setStudentCount(null));
  }, []);

  if (!session) return null;

  return (
    <div className="container">
      <div className="page-header">
        <h1>Welcome back, {session.username}</h1>
        <p>Signed in as {session.role}. Here is what's happening across the academy.</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-value">{studentCount ?? "…"}</div>
          <div className="stat-label">Enrolled students</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{session.role}</div>
          <div className="stat-label">Access level</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">4</div>
          <div className="stat-label">Microservices online</div>
        </div>
      </div>

      <div className="link-grid">
        <Link className="link-card" href="/students">
          <div className="link-title">Students</div>
          <div className="link-desc">View, add, and manage student profiles.</div>
        </Link>
        <Link className="link-card" href="/attendance">
          <div className="link-title">Attendance</div>
          <div className="link-desc">Mark daily attendance and check per-student summaries.</div>
        </Link>
        <Link className="link-card" href="/results">
          <div className="link-title">Results</div>
          <div className="link-desc">Record marks and generate full report cards.</div>
        </Link>
      </div>
    </div>
  );
}
