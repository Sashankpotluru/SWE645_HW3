import { useState } from "react";

const initial = {
  first_name: "",
  last_name: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  telephone: "",
  email: "",
  date_of_survey: "",
  liked_most: "",
  interested_via: "",
  likelihood: "",
};

export default function SurveyForm({ onSubmit }) {
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await onSubmit(form);
      setForm(initial);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="grid" onSubmit={handleSubmit}>
      <div className="grid-2">
        <label>
          First Name
          <input value={form.first_name} onChange={(e)=>set("first_name",e.target.value)} required />
        </label>
        <label>
          Last Name
          <input value={form.last_name} onChange={(e)=>set("last_name",e.target.value)} required />
        </label>
      </div>

      <div className="grid-2">
        <label>
          Street
          <input value={form.street} onChange={(e)=>set("street",e.target.value)} required />
        </label>
        <label>
          City
          <input value={form.city} onChange={(e)=>set("city",e.target.value)} required />
        </label>
      </div>

      <div className="grid-3">
        <label>
          State
          <input value={form.state} onChange={(e)=>set("state",e.target.value)} required />
        </label>
        <label>
          Zip
          <input value={form.zip} onChange={(e)=>set("zip",e.target.value)} required />
        </label>
        <label>
          Telephone
          <input value={form.telephone} onChange={(e)=>set("telephone",e.target.value)} required />
        </label>
      </div>

      <div className="grid-2">
        <label>
          Email
          <input type="email" value={form.email} onChange={(e)=>set("email",e.target.value)} required />
        </label>
        <label>
          Date of Survey
          <input type="date" value={form.date_of_survey} onChange={(e)=>set("date_of_survey",e.target.value)} required />
        </label>
      </div>

      <label>
        Liked Most (comma separated)
        <input placeholder="students,location,..." value={form.liked_most} onChange={(e)=>set("liked_most",e.target.value)} />
      </label>

      <div className="grid-2">
        <label>
          Interested Via
          <select value={form.interested_via} onChange={(e)=>set("interested_via",e.target.value)} required>
            <option value="">Select…</option>
            <option>friends</option>
            <option>television</option>
            <option>internet</option>
            <option>other</option>
          </select>
        </label>

        <label>
          Likelihood
          <select value={form.likelihood} onChange={(e)=>set("likelihood",e.target.value)} required>
            <option value="">Select…</option>
            <option>Very Likely</option>
            <option>Likely</option>
            <option>Unlikely</option>
          </select>
        </label>
      </div>

      <div className="form-actions">
        <button className="btn" disabled={busy}>{busy ? "Submitting…" : "Submit Survey"}</button>
      </div>
    </form>
  );
}
