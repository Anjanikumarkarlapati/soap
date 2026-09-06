"use client";

import { useState } from "react";
import api from "@/lib/api";

interface ResultRecord {
  id: number;
  studentId: number;
  subject: string;
  marks: number;
  semester: number;
  grade: string;
}

interface ReportCard {
  student: { id: number; name: string; rollNumber: string; department: string; semester: number };
  attendance: { totalClasses: number; presentCount: number; percentage: number };
  results: ResultRecord[];
}

export default function ResultsPage() {
  const [studentId, setStudentId] = useState("");
  const [report, setReport] = useState<ReportCard | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [searching, setSearching] = useState(false);
  const [form, setForm] = useState({ studentId: "", subject: "", marks: "", semester: "" });

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.post("/results", {
        ...form,
        studentId: Number(form.studentId),
        marks: Number(form.marks),
        semester: Number(form.semester),
      });
      setForm({ studentId: "", subject: "", marks: "", semester: "" });
    } catch (err: any) {
      setError(err?.response?.data || "Failed to add result.");
    } finally {
      setSaving(false);
    }
  }

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNotFound(false);
    setSearching(true);
    try {
      const res = await api.get(`/results/student/${studentId}/report-card`);
      setReport(res.data);
    } catch (err: any) {
      setReport(null);
      setNotFound(true);
      setError(err?.response?.data || "Failed to load report card.");
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Results</h1>
        <p>Record marks and generate a combined report card.</p>
      </div>

      {error && <p className="error">{String(error)}</p>}

      <div className="card">
        <h3>Add marks</h3>
        <form className="form-grid" onSubmit={handleAdd}>
          <div className="field">
            <label>Student ID</label>
            <input type="number" required value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} />
          </div>
          <div className="field">
            <label>Subject</label>
            <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          </div>
          <div className="field">
            <label>Marks (0-100)</label>
            <input type="number" min={0} max={100} required value={form.marks} onChange={(e) => setForm({ ...form, marks: e.target.value })} />
          </div>
          <div className="field">
            <label>Semester</label>
            <input type="number" required value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} />
          </div>
          <button className="primary" type="submit" disabled={saving}>
            {saving ? "Saving…" : "Add marks"}
          </button>
        </form>
      </div>

      <div className="card">
        <h3>Report card</h3>
        <form className="form-grid" onSubmit={handleLookup} style={{ marginBottom: 16 }}>
          <div className="field">
            <label>Student ID</label>
            <input type="number" required value={studentId} onChange={(e) => setStudentId(e.target.value)} />
          </div>
          <button className="primary" type="submit" disabled={searching}>
            {searching ? "Generating…" : "Generate"}
          </button>
        </form>

        {!report && !notFound && (
          <div className="empty-state">Search a student ID to generate their report card.</div>
        )}
        {!report && notFound && (
          <div className="empty-state">No report card found for that student ID.</div>
        )}

        {report && (
          <>
            <div className="stat-grid" style={{ marginBottom: 16 }}>
              <div className="stat-card">
                <div className="stat-value">{report.student.name}</div>
                <div className="stat-label">{report.student.rollNumber} · {report.student.department} · Sem {report.student.semester}</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{report.attendance.percentage}%</div>
                <div className="stat-label">Attendance ({report.attendance.presentCount}/{report.attendance.totalClasses})</div>
              </div>
            </div>
            {report.results.length === 0 ? (
              <div className="empty-state">No marks recorded yet for this student.</div>
            ) : (
              <table>
                <thead>
                  <tr><th>Subject</th><th>Marks</th><th>Grade</th><th>Semester</th></tr>
                </thead>
                <tbody>
                  {report.results.map((r) => (
                    <tr key={r.id}>
                      <td>{r.subject}</td>
                      <td>{r.marks}</td>
                      <td><span className={`badge badge-grade-${r.grade}`}>{r.grade}</span></td>
                      <td>{r.semester}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  );
}
