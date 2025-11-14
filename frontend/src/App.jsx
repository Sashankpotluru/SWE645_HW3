import { useEffect, useState } from "react";
import SurveyForm from "./components/SurveyForm";
import SurveyList from "./components/SurveyList";
import "./styles.css";

// Use Nginx proxy inside k8s: FE calls /api -> proxied to backend Service
const API_BASE = ""; // so fetch(`${API_BASE}/api/...`) => "/api/..."

export default function App() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  async function load() {
    setLoading(true);
    setErrMsg("");
    try {
      const res = await fetch(`${API_BASE}/api/surveys`);
      if (!res.ok) throw new Error(`GET /api/surveys failed: ${res.status}`);
      const data = await res.json();
      setSurveys(data);
    } catch (e) {
      console.error(e);
      setErrMsg("Failed to load surveys. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(payload) {
    setErrMsg("");
    try {
      const res = await fetch(`${API_BASE}/api/surveys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`POST /api/surveys failed: ${res.status}`);
      await load();
    } catch (e) {
      console.error(e);
      setErrMsg("Failed to create survey.");
    }
  }

  async function handleDelete(id) {
    setErrMsg("");
    try {
      const res = await fetch(`${API_BASE}/api/surveys/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`DELETE /api/surveys/${id} failed`);
      await load();
    } catch (e) {
      console.error(e);
      setErrMsg("Failed to delete survey.");
    }
  }

  async function handleUpdate(id, payload) {
    setErrMsg("");
    try {
      const res = await fetch(`${API_BASE}/api/surveys/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`PUT /api/surveys/${id} failed`);
      await load();
    } catch (e) {
      console.error(e);
      setErrMsg("Failed to update survey.");
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>SSSN — Student Survey</h1>
        <p className="muted">
          Team: SSSN (Sri Sashank Potluru, Nisha Rajput, Srikar Vuppala, Shriya Challapuram)
        </p>
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
        {errMsg && <div className="error-banner">{errMsg}</div>}
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
