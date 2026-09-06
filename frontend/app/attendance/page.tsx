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
  const [records, setRecords] = useState<AttendanceRecord[] | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState("");
  const [marking, setMarking] = useState(false);
  const [searching, setSearching] = useState(false);
  const [form, setForm] = useState({ studentId: "", date: "", subject: "", status: "PRESENT" });

  async function handleMark(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMarking(true);
    try {
      await api.post("/attendance", { ...form, studentId: Number(form.studentId) });
      setForm({ studentId: "", date: "", subject: "", status: "PRESENT" });
    } catch (err: any) {
      setError(err?.response?.data || "Failed to mark attendance.");
    } finally {
      setMarking(false);
    }
  }

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSearching(true);
    try {
      const [recRes, sumRes] = await Promise.all([
        api.get(`/attendance/student/${studentId}`),
        api.get(`/attendance/student/${studentId}/summary`),
      ]);
      setRecords(recRes.data);
      setSummary(sumRes.data);
    } catch (err: any) {
      setError(err?.response?.data || "Failed to load attendance.");
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Attendance</h1>
        <p>Mark daily attendance and review per-student summaries.</p>
      </div>

      {error && <p className="error">{String(error)}</p>}

      <div className="card">
        <h3>Mark attendance</h3>
        <form className="form-grid" onSubmit={handleMark}>
          <div className="field">
            <label>Student ID</label>
            <input type="number" required value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} />
          </div>
          <div className="field">
            <label>Date</label>
            <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div className="field">
            <label>Subject</label>
            <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          </div>
          <div className="field">
            <label>Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="PRESENT">Present</option>
              <option value="ABSENT">Absent</option>
            </select>
          </div>
          <button className="primary" type="submit" disabled={marking}>
            {marking ? "Marking…" : "Mark"}
          </button>
        </form>
      </div>

      <div className="card">
        <h3>Look up a student</h3>
        <form className="form-grid" onSubmit={handleLookup} style={{ marginBottom: 16 }}>
          <div className="field">
            <label>Student ID</label>
            <input type="number" required value={studentId} onChange={(e) => setStudentId(e.target.value)} />
          </div>
          <button className="primary" type="submit" disabled={searching}>
            {searching ? "Searching…" : "Search"}
          </button>
        </form>

        {summary && (
          <div className="stat-grid" style={{ marginBottom: 16 }}>
            <div className="stat-card">
              <div className="stat-value">{summary.percentage}%</div>
              <div className="stat-label">Attendance rate</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{summary.presentCount}/{summary.totalClasses}</div>
              <div className="stat-label">Classes attended</div>
            </div>
          </div>
        )}

        {records === null ? (
          <div className="empty-state">Search a student ID to see their attendance history.</div>
        ) : records.length === 0 ? (
          <div className="empty-state">No attendance records for this student yet.</div>
        ) : (
          <table>
            <thead>
              <tr><th>Date</th><th>Subject</th><th>Status</th></tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td>{r.date}</td>
                  <td>{r.subject}</td>
                  <td>
                    <span className={`badge ${r.status === "PRESENT" ? "badge-present" : "badge-absent"}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
