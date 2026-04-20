"use client";
import NavBar from "@/components/NavBar";
import { useState, useEffect, useRef } from "react";
import GameShell from "@/components/GameShell";
import { C } from "@/lib/theme";
import { useAuth } from "@/components/AuthProvider";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// Question banks for Unit 19
const BANKS: Record<string, { name: string; color: string; questions: { q: string; o: string[]; c: number }[] }> = {
  structures: { name: "Structures de donnees", color: "#0891B2", questions: [
    {q:"LinkedList stocke les elements dans :",o:["Un tableau","Des noeuds avec pointeurs","Un arbre","Une table de hash"],c:1},
    {q:"HashMap.get(key) complexite :",o:["O(n)","O(log n)","O(1)","O(n^2)"],c:2},
    {q:"Stack = :",o:["FIFO","LIFO","LILO","FILO"],c:1},
    {q:"Queue = :",o:["LIFO","FIFO","LILO","Random"],c:1},
    {q:"BST : inordre donne :",o:["Elements aleatoires","Elements TRIES","La racine d'abord","Les feuilles"],c:1},
    {q:"ArrayList.get(index) :",o:["O(n)","O(1)","O(log n)","O(n^2)"],c:1},
    {q:"LinkedList.get(index) :",o:["O(1)","O(n)","O(log n)","O(n^2)"],c:1},
    {q:"HashMap resout les collisions par :",o:["Suppression","Chainage ou open addressing","Tri","Recursion"],c:1},
  ]},
  sorting: { name: "Algorithmes de tri", color: "#DC2626", questions: [
    {q:"Bubble Sort complexite :",o:["O(n)","O(n log n)","O(n^2)","O(log n)"],c:2},
    {q:"Quick Sort complexite moyenne :",o:["O(n^2)","O(n log n)","O(n)","O(2^n)"],c:1},
    {q:"Merge Sort est :",o:["In-place","Stable","Les deux","Aucun"],c:1},
    {q:"Tri le plus rapide en moyenne :",o:["Bubble","Insertion","Quick Sort","Selection"],c:2},
    {q:"Merge Sort complexite :",o:["O(n^2)","O(n log n)","O(n)","O(log n)"],c:1},
    {q:"Insertion Sort meilleur cas :",o:["O(n^2)","O(n)","O(n log n)","O(1)"],c:1},
  ]},
  bigo: { name: "Big O", color: "#F97316", questions: [
    {q:"O(1) signifie :",o:["Lineaire","Constant","Quadratique","Logarithmique"],c:1},
    {q:"2 boucles imbriquees (0 a n) :",o:["O(n)","O(2n)","O(n^2)","O(n log n)"],c:2},
    {q:"Binary search :",o:["O(n)","O(log n)","O(n^2)","O(1)"],c:1},
    {q:"O(n^2) pour n=1000 donne :",o:["1000","10000","1000000","100"],c:2},
    {q:"Terme dominant de 3n^2 + 5n + 2 :",o:["3n^2","5n","2","n^2"],c:3},
    {q:"HashMap.put() amorti :",o:["O(n)","O(1)","O(log n)","O(n^2)"],c:1},
  ]},
  exceptions: { name: "Exceptions & JUnit", color: "#7C3AED", questions: [
    {q:"throw vs throws :",o:["Identiques","throw LANCE, throws DECLARE","throw declare, throws lance","Aucun rapport"],c:1},
    {q:"finally s'execute :",o:["Si exception","Si pas d'exception","TOUJOURS","Jamais"],c:2},
    {q:"@BeforeEach :",o:["Apres chaque test","Avant CHAQUE test","Une seule fois","Jamais"],c:1},
    {q:"assertThrows verifie :",o:["Pas d'exception","Exception EST lancee","Type de retour","Performance"],c:1},
    {q:"Checked exception :",o:["Optionnelle","Compilateur OBLIGE catch/throws","Runtime seulement","N'existe pas"],c:1},
    {q:"Auto-increment en Java :",o:["id++","compteur dans la classe Gestion","Math.random()","list.size()"],c:1},
  ]},
};

type Mode = "menu" | "host" | "player";

export default function QuizLive() {
  const { user, student, loading, isTeacher } = useAuth();
  const [lockChecked, setLockChecked] = useState(false);
  const [sectionLocked, setSectionLocked] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.from("cq_locks").select("*").eq("section", "quiz_live").maybeSingle();
        if (data) setSectionLocked(data.locked === true);
      } catch {}
      setLockChecked(true);
    })();
  }, []);

  const [mode, setMode] = useState<Mode>("menu");
  const [selectedBank, setSelectedBank] = useState<string>("structures");
  const [sessionCode, setSessionCode] = useState("");
  const [hostQuestions, setHostQuestions] = useState<any[]>([]);
  const [hostIdx, setHostIdx] = useState(-1);
  const [hostShowAnswer, setHostShowAnswer] = useState(false);
  const [playerCode, setPlayerCode] = useState("");
  const [playerAnswer, setPlayerAnswer] = useState<number|null>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [playerWaiting, setPlayerWaiting] = useState(true);
  const [playerQ, setPlayerQ] = useState<any>(null);

  if (loading || !lockChecked) return <div style={{ minHeight: "100vh", background: "#0a0f1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>Chargement...</div>;
  if (!user) { if (typeof window !== "undefined") window.location.href = "/login"; return null; }
  if (sectionLocked && !isTeacher) return (
    <div style={{ minHeight: "100vh", background: "#0a0f1a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#e2e8f0", gap: 12 }}>
      <div style={{ fontSize: 48 }}>🔒</div>
      <div style={{ fontSize: 20, fontWeight: 700 }}>Acces bloque</div>
      <div style={{ fontSize: 13, color: "#94a3b8" }}>Cette section est verrouillee par le professeur</div>
      <a href="/" style={{ color: "#32E0C4", marginTop: 8, textDecoration: "none" }}>Retour au Hub</a>
    </div>
  );




  // Host: create session
  const createSession = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setSessionCode(code);
    const bank = BANKS[selectedBank];
    const shuffled = [...bank.questions].sort(() => Math.random() - 0.5).slice(0, 8);
    setHostQuestions(shuffled);
    setHostIdx(-1);
    setMode("host");
  };

  const hostNext = () => {
    setHostShowAnswer(false);
    setHostIdx(i => i + 1);
  };

  const hostReveal = () => setHostShowAnswer(true);

  // Host view
  if (mode === "host") {
    if (hostIdx < 0) return (
      <GameShell title="Quiz Live — Host" color={C.gold}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 64, fontWeight: 800, color: C.gold, letterSpacing: 8, fontFamily: "monospace" }}>{sessionCode}</div>
          <p style={{ color: C.muted, fontSize: 14, marginTop: 8 }}>Les eleves rejoignent avec ce code</p>
          <p style={{ color: C.text, fontSize: 13, marginTop: 4 }}>Banque : {BANKS[selectedBank].name} ({hostQuestions.length} questions)</p>
          <button onClick={hostNext} style={{ marginTop: 20, padding: "14px 40px", background: C.gold, color: C.bg, border: "none", borderRadius: 10, fontWeight: 700, fontSize: 16, cursor: "pointer" }}>Demarrer</button>
        </div>
      </GameShell>
    );

    if (hostIdx >= hostQuestions.length) return (
      <GameShell title="Quiz Live — Termine" color={C.gold}>
        <div style={{ maxWidth: 400, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: C.success }}>Quiz termine !</div>
          <button onClick={() => setMode("menu")} style={{ marginTop: 16, padding: "10px 24px", background: C.gold, color: C.bg, border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Retour</button>
        </div>
      </GameShell>
    );

    const q = hostQuestions[hostIdx];
    const btnColors = [C.danger, C.secondary, C.gold, C.success];
    return (
      <GameShell title={`Question ${hostIdx + 1}/${hostQuestions.length}`} color={C.gold}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ fontSize: 11, color: C.muted, textAlign: "center", marginBottom: 8 }}>Code : {sessionCode}</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.text, textAlign: "center", marginBottom: 20 }}>{q.q}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {q.o.map((o: string, i: number) => (
              <div key={i} style={{
                padding: "16px", borderRadius: 10, background: hostShowAnswer ? (i === q.c ? C.success + "30" : C.card) : btnColors[i] + "20",
                border: `2px solid ${hostShowAnswer ? (i === q.c ? C.success : C.border) : btnColors[i] + "40"}`,
                textAlign: "center", fontSize: 16, fontWeight: 600, color: C.text,
              }}>
                {String.fromCharCode(65 + i)}. {o}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 16 }}>
            {!hostShowAnswer && <button onClick={hostReveal} style={{ padding: "10px 24px", background: C.accent, color: C.bg, border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Reveler la reponse</button>}
            {hostShowAnswer && <button onClick={hostNext} style={{ padding: "10px 24px", background: C.gold, color: C.bg, border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Question suivante</button>}
          </div>
        </div>
      </GameShell>
    );
  }

  // Menu
  return (
    <><NavBar/>
    <GameShell title="Quiz Live" color={C.gold}>
      <div style={{ maxWidth: 500, margin: "0 auto" }}>
        <p style={{ color: C.muted, fontSize: 14, textAlign: "center", marginBottom: 20 }}>Quiz en temps reel — style Kahoot</p>

        {isTeacher && (
          <div style={{ padding: "16px", background: C.card, borderRadius: 12, border: "1px solid " + C.border, marginBottom: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.gold, marginBottom: 10 }}>Creer un quiz (Prof)</div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>Choisir une banque de questions :</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 12 }}>
              {Object.entries(BANKS).map(([key, bank]) => (
                <button key={key} onClick={() => setSelectedBank(key)}
                  style={{ padding: "8px", background: selectedBank === key ? bank.color + "20" : C.card, border: `1px solid ${selectedBank === key ? bank.color : C.border}`, borderRadius: 6, color: selectedBank === key ? bank.color : C.muted, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
                  {bank.name}
                </button>
              ))}
            </div>
            <button onClick={createSession} style={{ width: "100%", padding: "12px", background: C.gold, color: C.bg, border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Lancer le quiz</button>
          </div>
        )}

        <div style={{ padding: "16px", background: C.card, borderRadius: 12, border: "1px solid " + C.border }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.accent, marginBottom: 10 }}>Rejoindre un quiz</div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>Le professeur projette les questions, vous repondez ici</div>
          <p style={{ fontSize: 11, color: C.dimmed }}>Le Quiz Live utilise Supabase Realtime. Demandez le code au professeur.</p>
        </div>
      </div>
    </GameShell>
    </>
  );
}
