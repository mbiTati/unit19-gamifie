"use client";
import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════
// 1. TARGET — Arrow hits based on response time
// ═══════════════════════════════════════
export function TargetHit({ timeMs, show }: { timeMs: number; show: boolean }) {
  if (!show) return null;
  // Calculate arrow position based on time
  // <3s = bullseye, 3-6s = inner, 6-10s = outer, >10s = miss
  const maxR = 90;
  let arrowR: number, label: string, color: string;
  if (timeMs < 3000) { arrowR = 0; label = "Bullseye!"; color = "#16A34A"; }
  else if (timeMs < 6000) { arrowR = 25; label = "Rapide"; color = "#3B82F6"; }
  else if (timeMs < 10000) { arrowR = 55; label = "Correct"; color = "#F97316"; }
  else { arrowR = 85; label = "Lent..."; color = "#DC2626"; }

  // Random angle for arrow position
  const angle = (timeMs * 7.3) % 360;
  const rad = (angle * Math.PI) / 180;
  const ax = 100 + arrowR * Math.cos(rad);
  const ay = 100 + arrowR * Math.sin(rad);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <svg viewBox="0 0 200 200" width={90} height={90}>
        {/* Target rings */}
        <circle cx="100" cy="100" r="90" fill="#1E293B" stroke="#334155" strokeWidth="1" />
        <circle cx="100" cy="100" r="70" fill="#1E293B" stroke="#475569" strokeWidth="1" />
        <circle cx="100" cy="100" r="50" fill="#DC262620" stroke="#DC2626" strokeWidth="1" />
        <circle cx="100" cy="100" r="30" fill="#F9731620" stroke="#F97316" strokeWidth="1" />
        <circle cx="100" cy="100" r="12" fill="#16A34A40" stroke="#16A34A" strokeWidth="2" />
        {/* Arrow */}
        <line x1={ax - 15 * Math.cos(rad)} y1={ay - 15 * Math.sin(rad)} x2={ax} y2={ay} stroke={color} strokeWidth="3" strokeLinecap="round">
          <animate attributeName="x2" from={ax + 40 * Math.cos(rad)} to={String(ax)} dur="0.3s" fill="freeze" />
          <animate attributeName="y2" from={ay + 40 * Math.sin(rad)} to={String(ay)} dur="0.3s" fill="freeze" />
        </line>
        <circle cx={ax} cy={ay} r="4" fill={color}>
          <animate attributeName="r" from="0" to="4" dur="0.3s" fill="freeze" />
        </circle>
        {/* Impact flash */}
        <circle cx={ax} cy={ay} r="8" fill={color} opacity="0.4">
          <animate attributeName="r" from="4" to="16" dur="0.4s" fill="freeze" />
          <animate attributeName="opacity" from="0.6" to="0" dur="0.4s" fill="freeze" />
        </circle>
      </svg>
      <div style={{ fontSize: 13, fontWeight: 700, color }}>{label} ({(timeMs / 1000).toFixed(1)}s)</div>
    </div>
  );
}

// ═══════════════════════════════════════
// 2. CIRCLE TIMER — Animated countdown circle
// ═══════════════════════════════════════
export function CircleTimer({ totalSeconds, onTimeout, running }: { totalSeconds: number; onTimeout: () => void; running: boolean }) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const intervalRef = useRef(null as any);

  useEffect(() => {
    if (!running) { setRemaining(totalSeconds); return; }
    setRemaining(totalSeconds);
    intervalRef.current = setInterval(() => {
      setRemaining((r: number) => {
        if (r <= 1) { clearInterval(intervalRef.current); onTimeout(); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, totalSeconds]);

  const pct = remaining / totalSeconds;
  const circumference = 2 * Math.PI * 40;
  const offset = circumference * (1 - pct);
  const color = pct > 0.5 ? "#16A34A" : pct > 0.25 ? "#F97316" : "#DC2626";

  return (
    <div style={{ position: "relative", width: 56, height: 56 }}>
      <svg viewBox="0 0 100 100" width={56} height={56}>
        <circle cx="50" cy="50" r="40" fill="none" stroke="#1E3A5F" strokeWidth="6" />
        <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="6"
          strokeLinecap="round" strokeDasharray={String(circumference)} strokeDashoffset={String(offset)}
          transform="rotate(-90 50 50)" style={{ transition: "stroke-dashoffset 0.5s linear, stroke 0.5s" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color }}>
        {remaining}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// 3. FLAME STREAK — Growing flame animation
// ═══════════════════════════════════════
export function FlameStreak({ streak }: { streak: number }) {
  if (streak < 2) return null;
  const size = Math.min(streak * 8 + 20, 60);
  const intensity = Math.min(streak / 5, 1);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <svg viewBox="0 0 40 60" width={size * 0.7} height={size} style={{ filter: `drop-shadow(0 0 ${4 + streak * 2}px #F97316)` }}>
        <path d={`M20 5 Q10 25 15 35 Q12 30 10 40 Q8 50 20 55 Q32 50 30 40 Q28 30 25 35 Q30 25 20 5Z`}
          fill={`hsl(${30 - intensity * 15}, 100%, ${55 - intensity * 10}%)`} opacity={0.9}>
          <animate attributeName="d"
            values="M20 5 Q10 25 15 35 Q12 30 10 40 Q8 50 20 55 Q32 50 30 40 Q28 30 25 35 Q30 25 20 5Z;M20 3 Q8 23 14 33 Q11 28 9 38 Q7 48 20 53 Q33 48 31 38 Q29 28 26 33 Q31 23 20 3Z;M20 5 Q10 25 15 35 Q12 30 10 40 Q8 50 20 55 Q32 50 30 40 Q28 30 25 35 Q30 25 20 5Z"
            dur="0.6s" repeatCount="indefinite" />
        </path>
        {streak >= 4 && <path d="M20 15 Q15 30 17 38 Q16 35 15 42 Q14 48 20 50 Q26 48 25 42 Q24 35 23 38 Q25 30 20 15Z"
          fill="#FBBF24" opacity="0.8">
          <animate attributeName="opacity" values="0.6;0.9;0.6" dur="0.4s" repeatCount="indefinite" />
        </path>}
      </svg>
      <span style={{ fontSize: 14, fontWeight: 800, color: "#F97316", textShadow: `0 0 ${streak * 3}px #F97316` }}>
        x{streak}
      </span>
    </div>
  );
}

// ═══════════════════════════════════════
// 4. XP BAR — Animated progress bar
// ═══════════════════════════════════════
export function XPBar({ current, max, color = "#7C3AED" }: { current: number; max: number; color?: string }) {
  const pct = Math.min((current / max) * 100, 100);
  return (
    <div style={{ width: "100%", position: "relative" }}>
      <div style={{ height: 10, background: "#1E293B", borderRadius: 5, overflow: "hidden" }}>
        <div style={{ height: 10, background: `linear-gradient(90deg, ${color}, ${color}CC)`, borderRadius: 5,
          width: `${pct}%`, transition: "width 0.6s ease-out", boxShadow: `0 0 8px ${color}60` }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
        <span style={{ fontSize: 10, color: "#94A3B8" }}>{current} pts</span>
        <span style={{ fontSize: 10, color: "#94A3B8" }}>{max} pts</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// 5. CONFETTI — Particle celebration
// ═══════════════════════════════════════
export function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: 10 + Math.random() * 80,
    color: ["#16A34A", "#3B82F6", "#F97316", "#DC2626", "#7C3AED", "#0891B2", "#FBBF24"][i % 7],
    delay: Math.random() * 0.5,
    duration: 1.5 + Math.random() * 1.5,
    size: 4 + Math.random() * 6,
    rotation: Math.random() * 360,
  }));

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, overflow: "hidden" }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute", left: `${p.x}%`, top: -10,
          width: p.size, height: p.size * 1.5, background: p.color,
          borderRadius: p.size > 7 ? 2 : "50%", transform: `rotate(${p.rotation}deg)`,
          animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
        }} />
      ))}
      <style>{`@keyframes confettiFall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
      }`}</style>
    </div>
  );
}

// ═══════════════════════════════════════
// 6. SPINNING WHEEL — Topic selector
// ═══════════════════════════════════════
export function SpinningWheel({ segments, onResult }: { segments: { label: string; color: string }[]; onResult: (idx: number) => void }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null as number | null);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    const target = 1440 + Math.random() * 1440; // 4-8 full rotations
    const newRotation = rotation + target;
    setRotation(newRotation);
    setTimeout(() => {
      const segAngle = 360 / segments.length;
      const normalizedAngle = (360 - (newRotation % 360)) % 360;
      const idx = Math.floor(normalizedAngle / segAngle) % segments.length;
      setResult(idx);
      setSpinning(false);
      onResult(idx);
    }, 3000);
  };

  const segAngle = 360 / segments.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ position: "relative" }}>
        {/* Pointer */}
        <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", zIndex: 2, width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: "14px solid #E2E8F0" }} />
        <svg viewBox="0 0 200 200" width={200} height={200} style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? "transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none" }}>
          {segments.map((seg, i) => {
            const startAngle = i * segAngle - 90;
            const endAngle = (i + 1) * segAngle - 90;
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;
            const x1 = 100 + 95 * Math.cos(startRad);
            const y1 = 100 + 95 * Math.sin(startRad);
            const x2 = 100 + 95 * Math.cos(endRad);
            const y2 = 100 + 95 * Math.sin(endRad);
            const largeArc = segAngle > 180 ? 1 : 0;
            const midAngle = ((startAngle + endAngle) / 2 * Math.PI) / 180;
            const tx = 100 + 60 * Math.cos(midAngle);
            const ty = 100 + 60 * Math.sin(midAngle);
            return (
              <g key={i}>
                <path d={`M100,100 L${x1},${y1} A95,95 0 ${largeArc},1 ${x2},${y2} Z`} fill={seg.color} stroke="#0B1120" strokeWidth="1.5" />
                <text x={tx} y={ty} fill="white" fontSize={segments.length > 6 ? "8" : "10"} fontWeight="bold" textAnchor="middle" dominantBaseline="middle" transform={`rotate(${(startAngle + endAngle) / 2 + 90}, ${tx}, ${ty})`}>
                  {seg.label.length > 10 ? seg.label.slice(0, 9) + ".." : seg.label}
                </text>
              </g>
            );
          })}
          <circle cx="100" cy="100" r="12" fill="#0B1120" stroke="#E2E8F0" strokeWidth="2" />
        </svg>
      </div>
      <button onClick={spin} disabled={spinning}
        style={{ padding: "10px 28px", background: spinning ? "#1E3A5F" : "#7C3AED", color: "white", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: spinning ? "default" : "pointer" }}>
        {spinning ? "..." : "Tourner"}
      </button>
      {result !== null && !spinning && (
        <div style={{ fontSize: 14, fontWeight: 600, color: segments[result].color }}>{segments[result].label}</div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// 7. FLASHCARDS — Flip cards
// ═══════════════════════════════════════
export function FlashcardDeck({ cards }: { cards: { front: string; back: string; category?: string }[] }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);

  if (idx >= cards.length) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <div style={{ fontSize: 32, fontWeight: 800, color: "#16A34A" }}>{known}/{cards.length}</div>
        <div style={{ fontSize: 14, color: "#94A3B8", marginTop: 4 }}>cartes maitrisees</div>
        <button onClick={() => { setIdx(0); setFlipped(false); setKnown(0); }}
          style={{ marginTop: 16, padding: "8px 20px", background: "#7C3AED", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Recommencer</button>
      </div>
    );
  }

  const card = cards[idx];
  const next = (wasKnown: boolean) => { if (wasKnown) setKnown(k => k + 1); setFlipped(false); setTimeout(() => setIdx(i => i + 1), 150); };

  return (
    <div>
      <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 8 }}>{idx + 1}/{cards.length} | Maitrisees : {known}</div>
      <div onClick={() => setFlipped(!flipped)} style={{
        minHeight: 160, padding: "24px", background: flipped ? "#16A34A15" : "#111827",
        border: `2px solid ${flipped ? "#16A34A" : "#1E3A5F"}`, borderRadius: 12,
        cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
        transition: "all 0.3s", transform: flipped ? "rotateY(0deg)" : "rotateY(0deg)",
      }}>
        {card.category && <div style={{ fontSize: 10, color: "#0891B2", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{card.category}</div>}
        <div style={{ fontSize: flipped ? 14 : 16, fontWeight: flipped ? 400 : 600, color: "#E2E8F0", textAlign: "center", lineHeight: 1.5 }}>
          {flipped ? card.back : card.front}
        </div>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 12 }}>{flipped ? "Cliquez pour continuer" : "Cliquez pour reveler"}</div>
      </div>
      {flipped && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
          <button onClick={() => next(false)} style={{ padding: "10px", background: "#DC262620", border: "1px solid #DC2626", borderRadius: 8, color: "#DC2626", fontWeight: 600, cursor: "pointer" }}>A revoir</button>
          <button onClick={() => next(true)} style={{ padding: "10px", background: "#16A34A20", border: "1px solid #16A34A", borderRadius: 8, color: "#16A34A", fontWeight: 600, cursor: "pointer" }}>Maitrisee</button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// 8. DIGILOCK — Escape game padlock
// ═══════════════════════════════════════
export function DigiLock({ code, hint, onUnlock }: { code: string; hint: string; onUnlock: () => void }) {
  const [input, setInput] = useState("");
  const [shaking, setShaking] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const tryUnlock = () => {
    if (input.toUpperCase().trim() === code.toUpperCase().trim()) {
      setUnlocked(true);
      onUnlock();
    } else {
      setShaking(true);
      setAttempts(a => a + 1);
      setTimeout(() => setShaking(false), 500);
    }
  };

  if (unlocked) {
    return (
      <div style={{ textAlign: "center", padding: "1.5rem" }}>
        <svg viewBox="0 0 60 80" width={48} height={64}>
          <rect x="5" y="35" width="50" height="40" rx="5" fill="#16A34A" />
          <path d="M15 35 V20 A15 15 0 0 1 45 20 V25" stroke="#16A34A" strokeWidth="5" fill="none" />
        </svg>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#16A34A", marginTop: 8 }}>Deverrouille !</div>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ animation: shaking ? "lockShake 0.5s" : "none" }}>
        <svg viewBox="0 0 60 80" width={48} height={64}>
          <rect x="5" y="35" width="50" height="40" rx="5" fill="#DC2626" />
          <path d="M15 35 V20 A15 15 0 0 1 45 20 V35" stroke="#94A3B8" strokeWidth="5" fill="none" />
          <circle cx="30" cy="52" r="5" fill="#0B1120" />
          <rect x="28" y="52" width="4" height="10" rx="1" fill="#0B1120" />
        </svg>
      </div>
      <div style={{ fontSize: 12, color: "#94A3B8", margin: "8px 0" }}>{hint}</div>
      {attempts >= 3 && <div style={{ fontSize: 11, color: "#F97316", marginBottom: 6 }}>Indice : le code a {code.length} caracteres</div>}
      <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && tryUnlock()}
          placeholder="Code..." style={{ padding: "8px 12px", background: "#111827", border: "1px solid #1E3A5F", borderRadius: 8, color: "#E2E8F0", fontSize: 14, textAlign: "center", width: 120, outline: "none", fontFamily: "Consolas, monospace", letterSpacing: 3 }} />
        <button onClick={tryUnlock} style={{ padding: "8px 16px", background: "#7C3AED", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Ouvrir</button>
      </div>
      <style>{`@keyframes lockShake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }`}</style>
    </div>
  );
}

// ═══════════════════════════════════════
// 9. BUZZER — Virtual buzzer
// ═══════════════════════════════════════
export function Buzzer({ onBuzz, disabled = false, color = "#DC2626" }: { onBuzz: () => void; disabled?: boolean; color?: string }) {
  const [pressed, setPressed] = useState(false);

  const handleBuzz = () => {
    if (disabled) return;
    setPressed(true);
    onBuzz();
    setTimeout(() => setPressed(false), 300);
  };

  return (
    <button onClick={handleBuzz} disabled={disabled}
      style={{
        width: 80, height: 80, borderRadius: "50%",
        background: pressed ? `${color}CC` : color,
        border: `4px solid ${pressed ? "white" : color}`,
        boxShadow: pressed ? "none" : `0 6px 0 ${color}80, 0 8px 20px ${color}40`,
        transform: pressed ? "translateY(4px)" : "translateY(0)",
        transition: "all 0.1s",
        cursor: disabled ? "default" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "white", fontWeight: 800, fontSize: 14,
        opacity: disabled ? 0.4 : 1,
      }}>
      BUZZ
    </button>
  );
}
