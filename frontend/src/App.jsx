import { useEffect, useState } from "react";
import SurveyForm from "./components/SurveyForm";
import SurveyList from "./components/SurveyList";
import "./styles.css";

const API =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:8000";

export default function App() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch(`${API}/api/surveys`);
    const data = await res.json();
    setSurveys(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(payload) {
    const res = await fetch(`${API}/api/surveys`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create");
    await load();
  }

  async function handleDelete(id) {
    await fetch(`${API}/api/surveys/${id}`, { method: "DELETE" });
    await load();
  }

  async function handleUpdate(id, payload) {
    await fetch(`${API}/api/surveys/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await load();
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>SSSN — Student Survey</h1>
        <p className="muted">Team: SSSN (Sashank, Nisha, Srikar, Shriya)</p>
      </header>

      <section className="card">
        <h2 className="section-title">Submit a Survey</h2>
        <SurveyForm onSubmit={handleCreate} />
      </section>

      <section className="card">
        <div className="list-header">
          <h2 className="section-title">
            All Surveys {loading ? "" : `(${surveys.length})`}
          </h2>
          {loading && <div className="spinner" aria-label="loading" />}
        </div>
        <SurveyList
          items={surveys}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      </section>

      <footer className="footer">
        <span>© {new Date().getFullYear()} SSSN</span>
      </footer>
    </div>
  );
}
