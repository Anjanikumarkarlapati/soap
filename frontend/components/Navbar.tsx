"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearSession, getSession, Session } from "@/lib/auth";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/students", label: "Students" },
  { href: "/attendance", label: "Attendance" },
  { href: "/results", label: "Results" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setSession(getSession());
  }, [pathname]);

  if (!session) {
    return (
      <nav className="topbar">
        <Link className="brand" href="/">EduPulse Academy</Link>
      </nav>
    );
  }

  return (
    <nav className="topbar">
      <Link className="brand" href="/dashboard">EduPulse Academy</Link>
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`nav-link${pathname === link.href ? " active" : ""}`}
        >
          {link.label}
        </Link>
      ))}
      <div className="spacer" />
      <span className="user-chip">
        <strong>{session.username}</strong> · {session.role}
      </span>
      <button
        className="logout"
        onClick={() => {
          clearSession();
          router.push("/login");
        }}
      >
        Log out
      </button>
    </nav>
  );
}
