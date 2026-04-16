import { useEffect, useState } from "react";
import { Brain, AlertTriangle, Sparkles, Activity, ShieldCheck, Clock3 } from "lucide-react";
import { auth } from "../../config/firebase";
import { analyzeSymptoms, fetchAssessmentHistory } from "../services/aiSymptomApi";

const initialForm = {
  symptoms: "",
  age: "",
  gender: "",
  medicalHistory: "",
  provider: "auto"
};

export default function AISymptomChecker() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState("");

  const loadHistory = async () => {
    try {
      setHistoryLoading(true);
      const patientId = auth.currentUser?.uid;
      if (!patientId) {
        setHistory([]);
        return;
      }
      const items = await fetchAssessmentHistory(patientId);
      setHistory(items.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        patientId: auth.currentUser?.uid,
        symptoms: form.symptoms,
        age: form.age,
        gender: form.gender,
        medicalHistory: form.medicalHistory
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
        provider: form.provider
      };

      const response = await analyzeSymptoms(payload);
      setResult(response);
      await loadHistory();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const recommendation = result?.result?.specialtyRanking?.[0];

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl shadow-slate-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(45,212,191,0.25),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.18),_transparent_30%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] p-8 md:p-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-teal-200">
              <Sparkles className="h-3.5 w-3.5" /> AI Symptom Checker
            </div>
            <h1 className="mt-5 max-w-2xl text-4xl font-black tracking-tight md:text-5xl">
              Triage symptoms fast, then route to the right specialty.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
              Enter symptoms and basic context. The service will give a specialty recommendation, urgency signal, and an AI summary when an LLM key is available.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-slate-300">Symptoms</label>
                <textarea
                  value={form.symptoms}
                  onChange={(event) => setForm((prev) => ({ ...prev, symptoms: event.target.value }))}
                  rows={5}
                  placeholder="Describe the main symptoms, duration, triggers, and anything that makes it better or worse..."
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/20"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-slate-300">Age</label>
                  <input
                    value={form.age}
                    onChange={(event) => setForm((prev) => ({ ...prev, age: event.target.value }))}
                    type="number"
                    min="0"
                    placeholder="32"
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-slate-300">Gender</label>
                  <input
                    value={form.gender}
                    onChange={(event) => setForm((prev) => ({ ...prev, gender: event.target.value }))}
                    placeholder="Female"
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-slate-300">Provider</label>
                  <select
                    value={form.provider}
                    onChange={(event) => setForm((prev) => ({ ...prev, provider: event.target.value }))}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/20"
                  >
                    <option value="auto">Auto</option>
                    <option value="openai">OpenAI</option>
                    <option value="claude">Claude</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-slate-300">Medical history notes</label>
                <textarea
                  value={form.medicalHistory}
                  onChange={(event) => setForm((prev) => ({ ...prev, medicalHistory: event.target.value }))}
                  rows={3}
                  placeholder={"Asthma\nDiabetes\nRecent surgery"}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/20"
                />
              </div>

              {error && (
                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Brain className="h-4 w-4" />
                {loading ? "Analyzing..." : "Analyze Symptoms"}
              </button>
            </form>
          </div>

          <div className="grid gap-4 self-start">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="flex items-center gap-3 text-teal-200">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-xs font-black uppercase tracking-[0.22em]">Safety first</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                The service returns a disclaimer and can fall back to rule-based specialty routing if the LLM is unavailable.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="flex items-center gap-3 text-blue-200">
                <Activity className="h-5 w-5" />
                <span className="text-xs font-black uppercase tracking-[0.22em]">Latest result</span>
              </div>

              {result ? (
                <div className="mt-4 space-y-4 text-sm text-slate-200">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Recommended specialty</p>
                    <p className="mt-1 text-xl font-black text-white">{result.result?.recommendedSpecialty}</p>
                    {recommendation && (
                      <p className="mt-2 text-xs text-slate-400">
                        Score {recommendation.score} via {recommendation.matchedKeywords.join(", ") || "rule fallback"}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <InfoChip label="Urgency" value={result.result?.urgency || "low"} />
                    <InfoChip label="Provider" value={result.providerUsed} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Advice</p>
                    <p className="mt-1 leading-6 text-slate-200">{result.result?.advice}</p>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-400">
                  Submit symptoms to see specialty guidance and an AI summary.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center gap-3">
            <Clock3 className="h-5 w-5 text-teal-600" />
            <h2 className="text-lg font-black text-slate-900">Assessment History</h2>
          </div>
          <div className="mt-5 space-y-4">
            {historyLoading && <p className="text-sm text-slate-500">Loading history...</p>}
            {!historyLoading && history.length === 0 && (
              <p className="text-sm text-slate-500">No prior assessments yet.</p>
            )}
            {history.map((item) => (
              <div key={item._id} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-slate-900 line-clamp-1">{item.symptomsText}</p>
                  <span className="rounded-full bg-teal-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-teal-700">
                    {item.providerUsed}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Specialty: {item.output?.result?.recommendedSpecialty || "General Medicine"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-slate-900 p-6 text-white shadow-xl shadow-slate-900/10">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-300" />
            <h2 className="text-lg font-black">Guidance</h2>
          </div>
          <div className="mt-4 space-y-4 text-sm leading-6 text-slate-300">
            <p>
              If symptoms worsen, become severe, or involve red-flag signs such as chest pain, confusion, or breathing issues, seek urgent care immediately.
            </p>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Disclaimer</p>
              <p className="mt-2">{result?.disclaimer || "AI guidance only. Not a medical diagnosis."}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoChip({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-950/70 p-3 ring-1 ring-white/10">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-white">{value}</p>
    </div>
  );
}
