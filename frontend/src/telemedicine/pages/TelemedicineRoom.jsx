import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Camera, CameraOff, Mic, MicOff, PhoneCall, RefreshCw } from "lucide-react";
import { auth } from "../../config/firebase";
import { generateJoinToken, getSessionById, updateSessionStatus } from "../services/telemedicineApi";

export default function TelemedicineRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [role, setRole] = useState("host");

  const loadSession = async () => {
    try {
      setLoading(true);
      const data = await getSessionById(id);
      setSession(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSession();
  }, [id]);

  const handleJoin = async () => {
    try {
      setJoining(true);
      const data = await generateJoinToken(id, {
        uid: auth.currentUser?.uid || "guest",
        role,
        expireInSeconds: 3600
      });
      setTokenData(data);
      await updateSessionStatus(id, "LIVE");
      await loadSession();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || error.message || "Unable to join session");
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    try {
      await updateSessionStatus(id, "ENDED");
      navigate(-1);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center text-slate-500">Loading session...</div>;
  }

  if (!session) {
    return <div className="rounded-2xl bg-white p-6 text-slate-600 shadow-sm">Session not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-white">{session.status}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Telemedicine Room</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight">{session.channelName}</h1>
              <p className="mt-1 text-sm text-slate-400">Provider: {session.provider} · Appointment {session.appointmentId}</p>
            </div>
            <PhoneCall className="h-10 w-10 text-sky-300" />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900 p-4">
              <div className="flex h-64 items-center justify-center rounded-[1.25rem] border border-dashed border-white/10 bg-black/30">
                <div className="text-center">
                  <Camera className="mx-auto h-12 w-12 text-sky-300" />
                  <p className="mt-3 text-sm font-bold">Remote participant video</p>
                  <p className="mt-1 text-xs text-slate-400">SDK hooks can attach here later.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <button onClick={() => setMicOn((prev) => !prev)} className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black transition ${micOn ? "bg-emerald-500 text-white" : "bg-white/10 text-white"}`}>
                {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                {micOn ? "Mic on" : "Mic off"}
              </button>
              <button onClick={() => setCameraOn((prev) => !prev)} className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black transition ${cameraOn ? "bg-sky-400 text-slate-950" : "bg-white/10 text-white"}`}>
                {cameraOn ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
                {cameraOn ? "Camera on" : "Camera off"}
              </button>
              <button onClick={handleJoin} disabled={joining} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-slate-100 disabled:opacity-60">
                <RefreshCw className="h-4 w-4" /> {joining ? "Joining..." : "Join Room"}
              </button>
              <button onClick={handleLeave} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500 px-4 py-3 text-sm font-black text-white transition hover:bg-rose-400">
                Leave Call
              </button>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h2 className="text-lg font-black text-slate-900">Session Details</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <Detail label="Status" value={session.status} />
              <Detail label="Provider" value={session.provider} />
              <Detail label="Patient ID" value={session.patientId} />
              <Detail label="Doctor ID" value={session.doctorId} />
              <Detail label="Channel" value={session.channelName} />
            </div>
          </div>

          <div className="rounded-[2rem] bg-slate-900 p-6 text-white shadow-xl shadow-slate-900/10">
            <h2 className="text-lg font-black">Join Token</h2>
            <p className="mt-2 text-sm text-slate-300">Generate a join token for the current user and use it in the SDK integration.</p>
            <div className="mt-4 rounded-2xl bg-slate-950/70 p-4">
              <label className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Role</label>
              <select value={role} onChange={(event) => setRole(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none">
                <option value="host">Host</option>
                <option value="audience">Audience</option>
              </select>
            </div>
            {tokenData?.token ? (
              <pre className="mt-4 max-h-40 overflow-auto rounded-2xl bg-black/30 p-4 text-[11px] leading-5 text-slate-200 break-all whitespace-pre-wrap">{tokenData.token}</pre>
            ) : (
              <p className="mt-4 text-sm text-slate-400">Press join to generate a token and mark the session live.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
      <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">{label}</span>
      <span className="font-bold text-slate-900">{value}</span>
    </div>
  );
}
