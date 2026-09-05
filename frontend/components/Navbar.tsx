"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearSession, getSession, Session } from "@/lib/auth";

export default function Navbar() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setSession(getSession());
  }, []);

  if (!session) {
    return (
      <nav>
        <Link className="brand" href="/">EduPulse Academy</Link>
      </nav>
    );
  }

  return (
    <nav>
      <Link className="brand" href="/dashboard">EduPulse Academy</Link>
      <Link href="/students">Students</Link>
      <Link href="/attendance">Attendance</Link>
      <Link href="/results">Results</Link>
      <span>{session.username} ({session.role})</span>
      <button
        onClick={() => {
          clearSession();
          router.push("/login");
        }}
      >
        Logout
      </button>
    </nav>
  );
}
