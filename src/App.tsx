import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  AudioWaveform,
  BarChart3,
  BookOpen,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Download,
  FileWarning,
  Fingerprint,
  Gauge,
  LockKeyhole,
  Menu,
  Mic,
  Play,
  Radio,
  ScanLine,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  VolumeX,
  X,
  Zap,
} from "lucide-react";
import "./App.css";

type View = "overview" | "live" | "incident" | "enrollment" | "privacy";
type Phase = "genuine" | "synthetic" | "recovery";
type WindowResult = {
  time: string;
  synthetic: number;
  prosody: number;
  mismatch: number;
  risk: number;
  status: "genuine" | "suspicious" | "critical";
  voiceActive: boolean;
};

const baseWindows: WindowResult[] = [
  {
    time: "00:00",
    synthetic: 7,
    prosody: 9,
    mismatch: 4,
    risk: 11,
    status: "genuine",
    voiceActive: true,
  },
  {
    time: "00:03",
    synthetic: 9,
    prosody: 12,
    mismatch: 5,
    risk: 14,
    status: "genuine",
    voiceActive: true,
  },
  {
    time: "00:06",
    synthetic: 8,
    prosody: 10,
    mismatch: 6,
    risk: 12,
    status: "genuine",
    voiceActive: true,
  },
  {
    time: "00:09",
    synthetic: 38,
    prosody: 34,
    mismatch: 28,
    risk: 41,
    status: "suspicious",
    voiceActive: true,
  },
  {
    time: "00:12",
    synthetic: 94,
    prosody: 81,
    mismatch: 63,
    risk: 91,
    status: "critical",
    voiceActive: true,
  },
  {
    time: "00:15",
    synthetic: 91,
    prosody: 78,
    mismatch: 68,
    risk: 88,
    status: "critical",
    voiceActive: true,
  },
  {
    time: "00:18",
    synthetic: 82,
    prosody: 70,
    mismatch: 59,
    risk: 76,
    status: "suspicious",
    voiceActive: true,
  },
  {
    time: "00:21",
    synthetic: 22,
    prosody: 19,
    mismatch: 16,
    risk: 31,
    status: "suspicious",
    voiceActive: true,
  },
  {
    time: "00:24",
    synthetic: 10,
    prosody: 11,
    mismatch: 7,
    risk: 14,
    status: "genuine",
    voiceActive: true,
  },
  {
    time: "00:27",
    synthetic: 0,
    prosody: 0,
    mismatch: 0,
    risk: 0,
    status: "genuine",
    voiceActive: false,
  },
];
const navItems: { id: View; label: string; icon: typeof ShieldCheck }[] = [
  { id: "overview", label: "Overview", icon: Gauge },
  { id: "live", label: "Live Detection", icon: Radio },
  { id: "incident", label: "Incident Report", icon: FileWarning },
  { id: "enrollment", label: "Voice Enrollment", icon: Fingerprint },
  { id: "privacy", label: "Privacy Center", icon: LockKeyhole },
];

function App() {
  const [view, setView] = useState<View>("overview");
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [mobileNav, setMobileNav] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [vadEnabled, setVadEnabled] = useState(true);
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setStep((current) => {
        const nextWindow = baseWindows[current + 1];
        if (current >= baseWindows.length - 1 || !nextWindow?.voiceActive) {
          window.clearInterval(timer);
          setRunning(false);
          return nextWindow ? current + 1 : current;
        }
        return current + 1;
      });
    }, 950);
    return () => window.clearInterval(timer);
  }, [running]);
  const current = baseWindows[step];
  const phase: Phase =
    current.risk > 65
      ? "synthetic"
      : current.risk > 20
        ? "recovery"
        : "genuine";
  const liveWindows = useMemo(() => baseWindows.slice(0, step + 1), [step]);
  const startSimulation = () => {
    setView("live");
    setStep(0);
    setVadEnabled(true);
    setRunning(true);
  };
  const handleNav = (nextView: View) => {
    setView(nextView);
    setMobileNav(false);
  };
  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "is-open" : ""}`}>
        <div className="brand-lockup">
          <div className="brand-mark">
            <ShieldCheck size={22} />
            <AudioWaveform size={15} />
          </div>
          <div>
            <strong>
              VOX<span>SHIELD</span>
            </strong>
            <small>VOICE AUTHENTICITY</small>
          </div>
        </div>
        <div className="sidebar-label">Workspace</div>
        <nav>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-item ${view === id ? "active" : ""}`}
              onClick={() => handleNav(id)}
            >
              <Icon size={17} />
              <span>{label}</span>
              {id === "incident" && <i className="nav-alert">1</i>}
            </button>
          ))}
        </nav>
        <div className="sidebar-label demo-label">Simulation</div>
        <button className="nav-item" onClick={startSimulation}>
          <Play size={17} />
          <span>Run Attack Demo</span>
          <ArrowUpRight size={14} className="nav-arrow" />
        </button>
        <div className="sidebar-bottom">
          <div className="status-line">
            <span className="pulse-dot" /> Protection Active
          </div>
          <div className="sidebar-user">
            <div className="avatar">RM</div>
            <div>
              <strong>Rahul Mehta</strong>
              <small>Trusted speaker</small>
            </div>
            <Settings size={15} />
          </div>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <button
            className="icon-button menu-toggle"
            aria-label="Open navigation"
            onClick={() => setMobileNav(!mobileNav)}
          >
            <Menu size={20} />
          </button>
          <div className="breadcrumb">
            <span>Workspace</span>
            <ChevronDown size={13} />
            <strong>{navItems.find((item) => item.id === view)?.label}</strong>
          </div>
          <div className="top-actions">
            <div className="demo-pill">
              <span className="pill-dot" /> SIMULATED ML INFERENCE
            </div>
            <button className="icon-button" title="Help">
              <CircleHelp size={18} />
            </button>
            <button className="profile-button">
              <span className="avatar small">RM</span>
              <ChevronDown size={14} />
            </button>
          </div>
        </header>
        <div className="page-wrap">
          {view === "overview" && (
            <Overview
              current={current}
              phase={phase}
              onLaunch={startSimulation}
            />
          )}
          {view === "live" && (
            <LiveDetection
              current={current}
              phase={phase}
              running={running}
              step={step}
              windows={liveWindows}
              vadEnabled={vadEnabled}
              onToggleVad={() => setVadEnabled((enabled) => !enabled)}
              onLaunch={startSimulation}
            />
          )}
          {view === "incident" && <Incident />}
          {view === "enrollment" && (
            <Enrollment
              enrolled={enrolled}
              onEnroll={() => setEnrolled(true)}
            />
          )}
          {view === "privacy" && <Privacy />}
        </div>
      </main>
    </div>
  );
}
function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}
function RiskGauge({ risk }: { risk: number }) {
  const status = risk >= 70 ? "CRITICAL" : risk >= 30 ? "ELEVATED" : "LOW RISK";
  return (
    <div
      className="risk-gauge"
      style={{ "--risk": `${risk * 3.6}deg` } as React.CSSProperties}
    >
      <div className="gauge-ring">
        <div className="gauge-center">
          <span>{risk}</span>
          <small>/ 100</small>
        </div>
      </div>
      <div className={`risk-status ${status === "CRITICAL" ? "critical" : ""}`}>
        <span className="status-dot" /> {status}
      </div>
    </div>
  );
}
function SignalBar({
  label,
  value,
  color,
  detail,
}: {
  label: string;
  value: number;
  color: string;
  detail: string;
}) {
  return (
    <div className="signal-row">
      <div className="signal-label">
        <span>{label}</span>
        <b>{value}%</b>
      </div>
      <div className="progress-track">
        <span
          className={`progress-fill ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <small>{detail}</small>
    </div>
  );
}
function Waveform({ active = false }: { active?: boolean }) {
  return (
    <div className={`waveform ${active ? "wave-alert" : ""}`}>
      {Array.from({ length: 64 }, (_, i) => (
        <i
          key={i}
          style={{
            height: `${18 + ((i * 31) % 58)}%`,
            animationDelay: `${i * -0.07}s`,
          }}
        />
      ))}
    </div>
  );
}
function EngineCard({
  icon,
  title,
  model,
  value,
  color,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  model: string;
  value: number;
  color: string;
  description: string;
}) {
  return (
    <div className="engine-card">
      <div className={`engine-icon ${color}`}>{icon}</div>
      <div className="engine-title">
        <div>
          <h3>{title}</h3>
          <span>{model}</span>
        </div>
        <span className="analyzing">
          <i /> Analyzing
        </span>
      </div>
      <div className="engine-score">
        <strong>{value}%</strong>
        <span>confidence</span>
      </div>
      <div className="engine-meter">
        <span className={color} style={{ width: `${value}%` }} />
      </div>
      <p>{description}</p>
      <button className="text-button">
        View signal details <ArrowUpRight size={14} />
      </button>
    </div>
  );
}
function PipelineItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="pipeline-item">
      <div>{icon}</div>
      <span>{label}</span>
    </div>
  );
}
function Overview({
  current,
  phase,
  onLaunch,
}: {
  current: WindowResult;
  phase: Phase;
  onLaunch: () => void;
}) {
  return (
    <>
      <PageHeading
        eyebrow="Command center / protected call"
        title="Voice security, in real time."
        description="Continuously analyze short audio windows to isolate synthetic voice segments before they become costly decisions."
        action={
          <button className="primary-button" onClick={onLaunch}>
            <Play size={16} fill="currentColor" /> Launch attack simulation
          </button>
        }
      />
      <div className="call-banner">
        <div className="call-identity">
          <div className="call-avatar">
            <UserRound size={23} />
          </div>
          <div>
            <span className="section-kicker">
              <span className="pulse-dot" /> Protected call
            </span>
            <strong>Rahul Mehta</strong>
            <small>
              Speaker match <b>94%</b>{" "}
              <span className="verified">Verified</span>
            </small>
          </div>
        </div>
        <div className="call-meta">
          <div>
            <span>Call duration</span>
            <strong>04:37</strong>
          </div>
          <div>
            <span>Analysis latency</span>
            <strong>320 ms</strong>
          </div>
          <div>
            <span>Windows analyzed</span>
            <strong>87</strong>
          </div>
          <div className="call-state">
            <span className="pulse-dot" /> Real-time analysis active
          </div>
        </div>
      </div>
      <div className="overview-grid">
        <section className="panel risk-panel">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">Current assessment</span>
              <h2>Protection status</h2>
            </div>
            <button className="icon-button">
              <SlidersHorizontal size={17} />
            </button>
          </div>
          <div className="risk-layout">
            <RiskGauge risk={current.risk} />
            <div className="signal-bars">
              <SignalBar
                label="Synthetic speech"
                value={current.synthetic}
                color="cyan"
                detail="Spectral artifact confidence"
              />
              <SignalBar
                label="Prosody anomaly"
                value={current.prosody}
                color="violet"
                detail="Temporal pattern deviation"
              />
              <SignalBar
                label="Speaker mismatch"
                value={current.mismatch}
                color="amber"
                detail="Voiceprint distance"
              />
            </div>
          </div>
          <div className="assessment-note">
            <Sparkles size={15} />
            <span>
              <b>
                {phase === "synthetic"
                  ? "Multiple authenticity signals elevated."
                  : "Conversation signals look consistent."}
              </b>{" "}
              {phase === "synthetic"
                ? "Suspicious interval requires independent verification."
                : "VoxShield is watching for abrupt changes."}
            </span>
          </div>
        </section>
        <section className="panel waveform-panel">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">
                <span className="live-indicator" /> Live audio stream
              </span>
              <h2>Signal monitor</h2>
            </div>
            <span className="window-tag">2.4 sec window</span>
          </div>
          <Waveform active={phase === "synthetic"} />
          <div className="wave-footer">
            <span>
              <Activity size={14} /> Stream stable
            </span>
            <span>
              Rolling analysis <b>ON</b>
            </span>
          </div>
          <div className="mini-stats">
            <div>
              <span>F0 contour</span>
              <strong>126 Hz</strong>
              <small>Within baseline</small>
            </div>
            <div>
              <span>Voiceprint</span>
              <strong>94%</strong>
              <small>Strong match</small>
            </div>
          </div>
        </section>
      </div>
      <div className="section-heading">
        <div>
          <span className="eyebrow">Multi-signal analysis</span>
          <h2>Authenticity engines</h2>
        </div>
        <span className="muted">
          Three independent signals, one explainable decision.
        </span>
      </div>
      <div className="engine-grid">
        <EngineCard
          icon={<ScanLine />}
          title="Synthetic speech detector"
          model="AASIST / Wav2Vec2"
          value={current.synthetic}
          color="cyan"
          description="Searches for spectral and temporal characteristics inconsistent with natural speech."
        />
        <EngineCard
          icon={<AudioWaveform />}
          title="Prosody anomaly detector"
          model="F0 · jitter · shimmer · rate"
          value={current.prosody}
          color="violet"
          description="Measures unusual pitch contour, pauses, energy dynamics, and speaking rhythm."
        />
        <EngineCard
          icon={<Fingerprint />}
          title="Speaker consistency"
          model="ECAPA-TDNN"
          value={100 - current.mismatch}
          color="amber"
          description="Compares voice characteristics with the enrolled speaker. This is not identity proof."
        />
      </div>
      <div className="lower-grid">
        <section className="panel pipeline-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">How it works</span>
              <h2>From audio to action</h2>
            </div>
            <BookOpen size={18} className="muted" />
          </div>
          <div className="pipeline">
            <PipelineItem icon={<Mic />} label="Audio stream" />
            <PipelineItem icon={<BarChart3 />} label="2–3 sec windows" />
            <PipelineItem icon={<Sparkles />} label="3 detectors" />
            <PipelineItem icon={<Zap />} label="Risk fusion" />
            <PipelineItem icon={<AlertTriangle />} label="Alert + action" />
          </div>
          <p className="panel-copy">
            Temporal smoothing prevents one noisy window from causing a false
            alarm. Consecutive agreement is what turns a signal into a security
            event.
          </p>
        </section>
        <section className="panel context-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Contextual risk</span>
              <h2>Financial request detected</h2>
            </div>
            <span className="severity-badge">High risk</span>
          </div>
          <blockquote>
            “Send ₹4,50,000 to the new account immediately.”
          </blockquote>
          <div className="context-row">
            <span>Recommended response</span>
            <strong>Require second factor</strong>
          </div>
          <button
            className="outline-button full-width"
            onClick={() => alert("Demo only: no transaction is performed.")}
          >
            <ShieldCheck size={15} /> Independent verification required
          </button>
        </section>
      </div>
    </>
  );
}
function LiveDetection({
  current,
  phase,
  running,
  step,
  windows,
  vadEnabled,
  onToggleVad,
  onLaunch,
}: {
  current: WindowResult;
  phase: Phase;
  running: boolean;
  step: number;
  windows: WindowResult[];
  vadEnabled: boolean;
  onToggleVad: () => void;
  onLaunch: () => void;
}) {
  const silenceDetected = vadEnabled && !current.voiceActive;
  return (
    <>
      <PageHeading
        eyebrow="Live detection / simulated stream"
        title="The attack, isolated."
        description="Watch VoxShield separate a real voice from an inserted AI clone, window by window."
        action={
          <button className="primary-button" onClick={onLaunch}>
            {running ? (
              <Activity size={16} />
            ) : (
              <Play size={16} fill="currentColor" />
            )}{" "}
            {running ? "Simulation running" : "Replay simulation"}
          </button>
        }
      />
      <div className="live-hero panel">
        <div className="live-hero-top">
          <div>
            <span className="section-kicker">
              <span className="live-indicator" /> Live audio stream
            </span>
            <h2>
              {phase === "synthetic"
                ? "Synthetic voice detected"
                : phase === "recovery"
                  ? "Suspicious interval isolated"
                  : "Authentic voice"}
            </h2>
          </div>
          <div className={`phase-badge ${phase}`}>
            {phase === "synthetic"
              ? "CRITICAL SEGMENT"
              : phase === "recovery"
                ? "RECOVERING"
                : "LOW RISK"}
          </div>
        </div>
        <Waveform active={phase === "synthetic" && !silenceDetected} />
        <div className={`vad-status ${silenceDetected ? "paused" : "active"}`}>
          {silenceDetected ? <VolumeX size={15} /> : <Activity size={15} />}
          <div>
            <strong>
              {silenceDetected ? "VAD: Silence Detected" : "VAD: Voice Active"}
            </strong>
            <span>
              {silenceDetected
                ? "Inference paused · compute saved"
                : "Audio windows are being analyzed"}
            </span>
          </div>
          <button className="vad-toggle" onClick={onToggleVad}>
            {vadEnabled ? "Enabled" : "Disabled"}
          </button>
        </div>
        <div className="live-metrics">
          <span>
            <Clock3 size={14} /> Window <b>2.4 sec</b>
          </span>
          <span>
            <Zap size={14} /> Latency <b>320 ms</b>
          </span>
          <span>
            <BarChart3 size={14} /> Windows analyzed{" "}
            <b>{Math.max(87, 87 + step)}</b>
          </span>
          <span className="streaming">
            <i /> Stream{" "}
            {silenceDetected
              ? "paused by VAD"
              : running
                ? "processing"
                : "paused"}
          </span>
        </div>
      </div>
      <div className="live-grid">
        <section className="panel timeline-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Temporal evidence</span>
              <h2>Detection timeline</h2>
            </div>
            <span className="muted">Real → AI clone → Real</span>
          </div>
          <div className="timeline-rail">
            <div className="timeline-line" />
            {windows.map((item) => (
              <div
                className={`timeline-event ${item.status} ${!item.voiceActive ? "silence" : ""}`}
                key={item.time}
              >
                <div className="timeline-time">{item.time}</div>
                <div className="timeline-node" />
                <div className="timeline-copy">
                  <strong>
                    {!item.voiceActive
                      ? "Silence detected"
                      : item.status === "genuine"
                        ? "Genuine voice"
                        : item.status === "critical"
                          ? "Synthetic voice detected"
                          : "Suspicious transition"}
                  </strong>
                  <span>
                    {!item.voiceActive
                      ? "VAD paused inference to save compute"
                      : `Risk score ${item.risk} · synthetic ${item.synthetic}%`}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="timeline-legend">
            <span>
              <i className="legend-dot genuine" /> Genuine voice
            </span>
            <span>
              <i className="legend-dot suspicious" /> Suspicious interval
            </span>
            <span>
              <i className="legend-dot critical" /> Critical signal
            </span>
          </div>
        </section>
        <section className="panel alert-panel">
          <div className="alert-top">
            <div className="alert-icon">
              <AlertTriangle size={21} />
            </div>
            <div>
              <span className="eyebrow">
                {phase === "synthetic" ? "Immediate attention" : "Monitoring"}
              </span>
              <h2>
                {phase === "synthetic"
                  ? "Synthetic voice detected"
                  : "No active alert"}
              </h2>
            </div>
          </div>
          {phase === "synthetic" ? (
            <>
              <p className="alert-copy">
                Potential AI-generated speech detected in the current audio
                segment. Multiple independent signals agree.
              </p>
              <div className="evidence-list">
                <SignalBar
                  label="Synthetic speech score"
                  value={current.synthetic}
                  color="cyan"
                  detail=""
                />
                <SignalBar
                  label="Prosody anomaly"
                  value={current.prosody}
                  color="violet"
                  detail=""
                />
                <SignalBar
                  label="Speaker mismatch"
                  value={current.mismatch}
                  color="amber"
                  detail=""
                />
              </div>
              <div className="confidence">
                <span>Detection confidence</span>
                <strong>92%</strong>
              </div>
              <div className="recommendation">
                <span>Recommended action</span>
                <strong>Do not authorize the requested transaction.</strong>
              </div>
              <div className="alert-actions">
                <button className="primary-button small">
                  Verify via trusted callback
                </button>
                <button className="outline-button small">Request OTP</button>
              </div>
            </>
          ) : (
            <div className="empty-alert">
              <ShieldCheck size={30} />
              <strong>Protection is watching</strong>
              <span>
                Launch the simulation to inject an AI clone into the protected
                call.
              </span>
              <button className="text-button" onClick={onLaunch}>
                Start now <ArrowUpRight size={14} />
              </button>
            </div>
          )}
        </section>
      </div>
      <div className="section-heading">
        <div>
          <span className="eyebrow">Risk fusion engine</span>
          <h2>Explainable decision path</h2>
        </div>
      </div>
      <div className="fusion panel">
        <div className="fusion-inputs">
          <div>
            <span className="signal-dot cyan" /> Synthetic speech{" "}
            <b>{current.synthetic}</b>
          </div>
          <div>
            <span className="signal-dot violet" /> Prosody anomaly{" "}
            <b>{current.prosody}</b>
          </div>
          <div>
            <span className="signal-dot amber" /> Speaker mismatch{" "}
            <b>{current.mismatch}</b>
          </div>
        </div>
        <div className="fusion-core">
          <Sparkles size={22} />
          <strong>Risk fusion</strong>
          <span>Temporal smoothing</span>
        </div>
        <div className="fusion-output">
          <strong>
            {current.risk}
            <small>/100</small>
          </strong>
          <span className={current.risk > 65 ? "critical-text" : ""}>
            {current.risk > 65 ? "Critical risk" : "Low risk"}
          </span>
        </div>
        <div className="fusion-reasons">
          <span>
            <Check size={14} /> Multiple windows agreed
          </span>
          <span>
            <Check size={14} /> Suspicious interval detected
          </span>
          <span>
            <Check size={14} /> Context multiplier applied
          </span>
        </div>
      </div>
    </>
  );
}
function Incident() {
  return (
    <>
      <PageHeading
        eyebrow="Security events / incident 0042"
        title="Voice security incident."
        description="A complete, explainable record of the suspicious audio segment detected in the protected call."
        action={
          <button className="outline-button">
            <Download size={15} /> Export report
          </button>
        }
      />
      <div className="incident-header panel">
        <div className="incident-title">
          <div className="alert-icon large">
            <AlertTriangle size={24} />
          </div>
          <div>
            <span className="eyebrow">Severity</span>
            <h2>Critical</h2>
            <p>Potential AI voice impersonation</p>
          </div>
        </div>
        <div className="incident-meta">
          <span>
            Detected <b>Today, 14:32:18</b>
          </span>
          <span>
            Incident ID <b>VS-0042-AX</b>
          </span>
          <span>
            Status <b className="critical-text">Action required</b>
          </span>
        </div>
      </div>
      <div className="incident-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Evidence summary</span>
              <h2>Signals at peak</h2>
            </div>
          </div>
          <div className="incident-scores">
            <div>
              <strong>94%</strong>
              <span>Synthetic speech</span>
            </div>
            <div>
              <strong>81%</strong>
              <span>Prosody anomaly</span>
            </div>
            <div>
              <strong>63%</strong>
              <span>Speaker mismatch</span>
            </div>
            <div className="overall">
              <strong>
                91<small>/100</small>
              </strong>
              <span>Overall risk</span>
            </div>
          </div>
          <div className="incident-interval">
            <div>
              <span>Suspicious interval</span>
              <strong>10.2s — 15.8s</strong>
            </div>
            <div className="interval-track">
              <span />
            </div>
            <small>5.6 seconds isolated from an otherwise authentic call</small>
          </div>
        </section>
        <section className="panel recommendation-panel">
          <span className="eyebrow">Recommended action</span>
          <h2>Do not trust the voice request.</h2>
          <p>
            Verify the caller through a known, trusted contact method before
            authorizing any transfer or sharing sensitive information.
          </p>
          <button className="primary-button full-width">
            Mark as resolved <Check size={15} />
          </button>
          <button className="outline-button full-width">
            View timeline <ArrowUpRight size={15} />
          </button>
        </section>
      </div>
    </>
  );
}
function Enrollment({
  enrolled,
  onEnroll,
}: {
  enrolled: boolean;
  onEnroll: () => void;
}) {
  return (
    <>
      <PageHeading
        eyebrow="Identity signals / consent required"
        title="Enroll a trusted speaker."
        description="Create an encrypted voiceprint for consistency checks. Voice verification is a signal, not a standalone identity guarantee."
      />
      <div className="enrollment-grid">
        <section className="panel enrollment-card">
          <div className="record-orb">
            <div>
              <Mic size={30} />
              <span>{enrolled ? "Complete" : "Ready"}</span>
            </div>
          </div>
          <span className="eyebrow">Step {enrolled ? "4" : "1"} of 4</span>
          <h2>
            {enrolled ? "Voice enrollment complete" : "Record a voice sample"}
          </h2>
          <p>
            {enrolled
              ? "Rahul Mehta’s protected speaker representation is ready for consistency checks."
              : "Speak naturally for 10–20 seconds. The raw sample is processed temporarily, then deleted."}
          </p>
          {enrolled ? (
            <div className="enrolled-list">
              <span>
                <Check size={15} /> Speaker <b>Rahul Mehta</b>
              </span>
              <span>
                <LockKeyhole size={15} /> Voiceprint <b>Encrypted</b>
              </span>
              <span>
                <Check size={15} /> Raw audio <b>Deleted</b>
              </span>
            </div>
          ) : (
            <button className="primary-button" onClick={onEnroll}>
              <Mic size={16} /> Start recording
            </button>
          )}
        </section>
        <section className="panel steps-card">
          <span className="eyebrow">Protected pipeline</span>
          <h2>What happens next</h2>
          {[
            "Record 10–20 seconds of speech",
            "Extract speaker embedding",
            "Encrypt protected representation",
            "Delete raw enrollment audio",
          ].map((text, i) => (
            <div
              className={`enroll-step ${enrolled || i === 0 ? "done" : ""}`}
              key={text}
            >
              <span>{enrolled || i === 0 ? <Check size={14} /> : i + 1}</span>
              <strong>{text}</strong>
              <small>
                {i === 0
                  ? "Microphone access is optional in this demo"
                  : i === 3
                    ? "No conversation audio is retained"
                    : "Ephemeral processing only"}
              </small>
            </div>
          ))}
        </section>
      </div>
      <div className="warning-callout">
        <AlertTriangle size={17} />
        <span>
          <b>Important:</b> Voice verification compares characteristics with a
          voiceprint. It does not prove identity on its own.
        </span>
      </div>
    </>
  );
}
function Privacy() {
  return (
    <>
      <PageHeading
        eyebrow="Trust center / data controls"
        title="Privacy by design."
        description="Protection works with ephemeral audio windows and minimal security metadata, with consent at every sensitive boundary."
        action={
          <div className="toggle-control">
            <span className="pulse-dot" /> Protection on{" "}
            <div className="toggle on">
              <i />
            </div>
          </div>
        }
      />
      <div className="privacy-grid">
        <section className="panel privacy-controls">
          <span className="eyebrow">Active controls</span>
          <h2>Protection settings</h2>
          {[
            ["Raw audio storage", "OFF", "No recordings retained"],
            ["Speaker verification", "ON", "Consent granted"],
            ["Cloud processing", "OFF / Demo", "Local simulation only"],
            ["Temporary window", "2–3 sec", "Discarded after analysis"],
            ["Data retention", "Metadata only", "Security events retained"],
          ].map(([label, value, detail]) => (
            <div className="privacy-row" key={label}>
              <div>
                <strong>{label}</strong>
                <small>{detail}</small>
              </div>
              <b>{value}</b>
            </div>
          ))}
        </section>
        <section className="panel privacy-flow">
          <span className="eyebrow">Data lifecycle</span>
          <h2>Nothing permanent required.</h2>
          <div className="privacy-pipeline">
            {[
              ["MICROPHONE", Mic],
              ["TEMPORARY AUDIO WINDOW", AudioWaveform],
              ["ANALYSIS", ScanLine],
              ["RAW AUDIO DISCARDED", X],
              ["RISK METADATA ONLY", ShieldCheck],
            ].map(([label, Icon], i) => (
              <div className="privacy-node" key={label as string}>
                <div>
                  <Icon size={18} />
                </div>
                <strong>{label as string}</strong>
                {i < 4 && <span className="flow-arrow">↓</span>}
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="privacy-message">
        <LockKeyhole size={21} />
        <div>
          <strong>
            VoxShield does not need to permanently record your conversation.
          </strong>
          <span>
            Protection is active only when explicitly enabled. Speaker
            verification requires user consent. High-risk decisions should
            always use an independent verification method.
          </span>
        </div>
      </div>
    </>
  );
}
export default App;
