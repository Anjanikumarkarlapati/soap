"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { getSession } from "@/lib/auth";

interface Student {
  id: number;
  name: string;
  rollNumber: string;
  department: string;
  semester: number;
  email: string;
  phone: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setForm] = useState({
    name: "",
    rollNumber: "",
    department: "",
    semester: "",
    email: "",
    phone: "",
  });

  async function load() {
    setLoading(true);
    try {
      const res = await api.get("/students");
      setStudents(res.data);
    } catch (err: any) {
      setError(err?.response?.data || "Failed to load students.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setIsAdmin(getSession()?.role === "ADMIN");
    load();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.post("/students", { ...form, semester: Number(form.semester) });
      setForm({ name: "", rollNumber: "", department: "", semester: "", email: "", phone: "" });
      load();
    } catch (err: any) {
      setError(err?.response?.data || "Failed to add student.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Remove ${name} from the academy?`)) return;
    try {
      await api.delete(`/students/${id}`);
      load();
    } catch (err: any) {
      setError(err?.response?.data || "Failed to delete student.");
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Students</h1>
        <p>{isAdmin ? "Manage student profiles across departments." : "Read-only view of enrolled students."}</p>
      </div>

      {error && <p className="error">{String(error)}</p>}

      {isAdmin && (
        <div className="card">
          <h3>Add student</h3>
          <form className="form-grid" onSubmit={handleAdd}>
            <div className="field">
              <label>Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="field">
              <label>Roll number</label>
              <input required value={form.rollNumber} onChange={(e) => setForm({ ...form, rollNumber: e.target.value })} />
            </div>
            <div className="field">
              <label>Department</label>
              <input required value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
            </div>
            <div className="field">
              <label>Semester</label>
              <input type="number" required value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="field">
              <label>Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <button className="primary" type="submit" disabled={saving}>
              {saving ? "Adding…" : "Add student"}
            </button>
          </form>
        </div>
      )}

      <div className="card">
        {loading ? (
          <div className="loading-state">Loading students…</div>
        ) : students.length === 0 ? (
          <div className="empty-state">No students yet. {isAdmin && "Add one above to get started."}</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th><th>Roll No.</th><th>Department</th><th>Semester</th><th>Email</th>
                {isAdmin && <th></th>}
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.rollNumber}</td>
                  <td>{s.department}</td>
                  <td>{s.semester}</td>
                  <td>{s.email}</td>
                  {isAdmin && (
                    <td>
                      <button className="link-btn" onClick={() => handleDelete(s.id, s.name)}>Remove</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
