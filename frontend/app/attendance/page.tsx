"use client";

import { useState } from "react";
import api from "@/lib/api";

interface AttendanceRecord {
  id: number;
  studentId: number;
  date: string;
  subject: string;
  status: "PRESENT" | "ABSENT";
}

interface Summary {
  studentId: number;
  totalClasses: number;
  presentCount: number;
  percentage: number;
}

export default function AttendancePage() {
  const [studentId, setStudentId] = useState("");
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ studentId: "", date: "", subject: "", status: "PRESENT" });

  async function handleMark(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/attendance", { ...form, studentId: Number(form.studentId) });
      setForm({ studentId: "", date: "", subject: "", status: "PRESENT" });
    } catch (err: any) {
      setError(err?.response?.data || "Failed to mark attendance");
    }
  }

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const [recRes, sumRes] = await Promise.all([
        api.get(`/attendance/student/${studentId}`),
        api.get(`/attendance/student/${studentId}/summary`),
      ]);
      setRecords(recRes.data);
      setSummary(sumRes.data);
    } catch (err: any) {
      setError(err?.response?.data || "Failed to load attendance");
    }
  }

  return (
    <div className="container">
      <h1>Attendance</h1>
      {error && <p className="error">{String(error)}</p>}

      <div className="card">
        <h3>Mark Attendance</h3>
        <form onSubmit={handleMark}>
          <input placeholder="Student ID" type="number" required value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} />
          <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <input placeholder="Subject" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
          </select>
          <button className="primary" type="submit">Mark</button>
        </form>
      </div>

      <div className="card">
        <h3>Lookup Attendance</h3>
        <form onSubmit={handleLookup}>
          <input placeholder="Student ID" type="number" required value={studentId} onChange={(e) => setStudentId(e.target.value)} />
          <button className="primary" type="submit">Search</button>
        </form>

        {summary && (
          <p>
            Total: {summary.totalClasses} · Present: {summary.presentCount} · Attendance: {summary.percentage}%
          </p>
        )}

        {records.length > 0 && (
          <table>
            <thead>
              <tr><th>Date</th><th>Subject</th><th>Status</th></tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td>{r.date}</td>
                  <td>{r.subject}</td>
                  <td>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
