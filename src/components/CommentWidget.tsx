"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const BORDER="#1E3A5F",CARD="#111827",TEXT="#E2E8F0",MUTED="#94A3B8",TEAL="#0891B2",GREEN="#16A34A";

export default function CommentWidget({ chapter, studentEmail }: { chapter: string; studentEmail?: string }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!message.trim()) return;
    setSending(true);
    await supabase.from("cq_comments").insert({
      student_email: studentEmail || "anonyme",
      chapter,
      message: message.trim(),
      unit: "Unit 19",
      created_at: new Date().toISOString(),
    });
    setSending(false);
    setSent(true);
    setMessage("");
    setTimeout(() => { setSent(false); setOpen(false); }, 2000);
  };

  if (!open) return (
    <button onClick={() => setOpen(true)}
      style={{ position: "fixed", bottom: 20, right: 20, padding: "10px 16px", background: TEAL, color: "white", border: "none", borderRadius: 24, fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px #0891B240", zIndex: 1000 }}>
      Question ?
    </button>
  );

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, width: 300, background: CARD, border: "1px solid " + BORDER, borderRadius: 12, padding: "14px", zIndex: 1000, boxShadow: "0 8px 24px #00000060" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>Question — {chapter}</span>
        <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: MUTED, cursor: "pointer", fontSize: 16 }}>X</button>
      </div>
      {sent ? (
        <div style={{ padding: "12px", background: GREEN + "15", borderRadius: 8, fontSize: 13, color: GREEN, textAlign: "center" }}>Message envoye au prof !</div>
      ) : (
        <>
          <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Ecrivez votre question..."
            rows={3} style={{ width: "100%", padding: "8px", background: "#0B1120", border: "1px solid " + BORDER, borderRadius: 8, color: TEXT, fontSize: 13, outline: "none", resize: "none", boxSizing: "border-box" }} />
          <button onClick={send} disabled={sending || !message.trim()}
            style={{ width: "100%", marginTop: 8, padding: "8px", background: TEAL, color: "white", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer", opacity: sending ? 0.7 : 1 }}>
            {sending ? "Envoi..." : "Envoyer"}
          </button>
        </>
      )}
    </div>
  );
}
