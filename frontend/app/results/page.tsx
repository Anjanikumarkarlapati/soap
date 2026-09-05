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
  const [error, setError] = useState("");
  const [form, setForm] = useState({ studentId: "", subject: "", marks: "", semester: "" });

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/results", {
        ...form,
        studentId: Number(form.studentId),
        marks: Number(form.marks),
        semester: Number(form.semester),
      });
      setForm({ studentId: "", subject: "", marks: "", semester: "" });
    } catch (err: any) {
      setError(err?.response?.data || "Failed to add result");
    }
  }

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await api.get(`/results/student/${studentId}/report-card`);
      setReport(res.data);
    } catch (err: any) {
      setError(err?.response?.data || "Failed to load report card");
    }
  }

  return (
    <div className="container">
      <h1>Results</h1>
      {error && <p className="error">{String(error)}</p>}

      <div className="card">
        <h3>Add Marks</h3>
        <form onSubmit={handleAdd}>
          <input placeholder="Student ID" type="number" required value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} />
          <input placeholder="Subject" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          <input placeholder="Marks (0-100)" type="number" min={0} max={100} required value={form.marks} onChange={(e) => setForm({ ...form, marks: e.target.value })} />
          <input placeholder="Semester" type="number" required value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} />
          <button className="primary" type="submit">Add</button>
        </form>
      </div>

      <div className="card">
        <h3>Report Card</h3>
        <form onSubmit={handleLookup}>
          <input placeholder="Student ID" type="number" required value={studentId} onChange={(e) => setStudentId(e.target.value)} />
          <button className="primary" type="submit">Generate</button>
        </form>

        {report && (
          <>
            <p>
              <strong>{report.student.name}</strong> ({report.student.rollNumber}) · {report.student.department} · Sem {report.student.semester}
            </p>
            <p>Attendance: {report.attendance.percentage}% ({report.attendance.presentCount}/{report.attendance.totalClasses})</p>
            <table>
              <thead>
                <tr><th>Subject</th><th>Marks</th><th>Grade</th><th>Semester</th></tr>
              </thead>
              <tbody>
                {report.results.map((r) => (
                  <tr key={r.id}>
                    <td>{r.subject}</td>
                    <td>{r.marks}</td>
                    <td>{r.grade}</td>
                    <td>{r.semester}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
