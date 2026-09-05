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
    try {
      const res = await api.get("/students");
      setStudents(res.data);
    } catch (err: any) {
      setError(err?.response?.data || "Failed to load students");
    }
  }

  useEffect(() => {
    setIsAdmin(getSession()?.role === "ADMIN");
    load();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/students", { ...form, semester: Number(form.semester) });
      setForm({ name: "", rollNumber: "", department: "", semester: "", email: "", phone: "" });
      load();
    } catch (err: any) {
      setError(err?.response?.data || "Failed to add student");
    }
  }

  async function handleDelete(id: number) {
    try {
      await api.delete(`/students/${id}`);
      load();
    } catch (err: any) {
      setError(err?.response?.data || "Failed to delete student");
    }
  }

  return (
    <div className="container">
      <h1>Students</h1>
      {error && <p className="error">{String(error)}</p>}

      {isAdmin && (
        <div className="card">
          <h3>Add Student</h3>
          <form onSubmit={handleAdd}>
            <input placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Roll Number" required value={form.rollNumber} onChange={(e) => setForm({ ...form, rollNumber: e.target.value })} />
            <input placeholder="Department" required value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
            <input placeholder="Semester" type="number" required value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} />
            <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <button className="primary" type="submit">Add</button>
          </form>
        </div>
      )}

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Roll No.</th><th>Department</th><th>Semester</th><th>Email</th>
              {isAdmin && <th></th>}
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.rollNumber}</td>
                <td>{s.department}</td>
                <td>{s.semester}</td>
                <td>{s.email}</td>
                {isAdmin && (
                  <td>
                    <button onClick={() => handleDelete(s.id)}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
