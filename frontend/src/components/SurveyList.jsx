import { useState } from "react";

export default function SurveyList({ items, onDelete, onUpdate }) {
  if (!items?.length) {
    return <p className="muted">No surveys yet. Be the first to submit!</p>;
  }
  return (
    <div className="list">
      {items.map((s) => (
        <SurveyCard key={s.id} s={s} onDelete={onDelete} onUpdate={onUpdate} />
      ))}
    </div>
  );
}

function SurveyCard({ s, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [email, setEmail] = useState(s.email);
  const [likelihood, setLikelihood] = useState(s.likelihood);

  async function save() {
    await onUpdate(s.id, { ...s, email, likelihood });
    setEditing(false);
  }

  return (
    <div className="item">
      <div className="item-main">
        <div className="item-title">
          <strong>{s.first_name} {s.last_name}</strong>
          <span className="pill">{s.likelihood}</span>
        </div>
        <div className="item-sub">
          <span>{s.email}</span>
          <span>•</span>
          <span>{s.city}, {s.state}</span>
        </div>
      </div>

      <div className="item-actions">
        {!editing ? (
          <>
            <button className="btn ghost" onClick={()=>setEditing(true)}>Edit</button>
            <button className="btn danger" onClick={()=>onDelete(s.id)}>Delete</button>
          </>
        ) : (
          <>
            <input className="inline-input" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <select className="inline-input" value={likelihood} onChange={(e)=>setLikelihood(e.target.value)}>
              <option>Very Likely</option>
              <option>Likely</option>
              <option>Unlikely</option>
            </select>
            <button className="btn" onClick={save}>Save</button>
            <button className="btn ghost" onClick={()=>setEditing(false)}>Cancel</button>
          </>
        )}
      </div>
    </div>
  );
}
