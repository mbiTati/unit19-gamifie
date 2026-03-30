"use client";
import { useAuth } from "@/components/AuthProvider";
import { useState } from "react";
import TopBar from "@/components/TopBar";

const BG="#0B1120",CARD="#111827",BORDER="#1E3A5F",TEXT="#E2E8F0",MUTED="#94A3B8",GREEN="#16A34A",RED="#DC2626",ORANGE="#F97316",TEAL="#0891B2",PURPLE="#7C3AED";

const TABLE_SIZE = 8;

function hashFn(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) % TABLE_SIZE;
  return h;
}

interface Entry { key: string; value: string; }

export default function HashTableHero() {
  const { user: authUser, loading: authLoading } = useAuth();
  if (authLoading) return <div style={{ minHeight: "100vh", background: "#0a0f1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>Chargement...</div>;
  if (!authUser) { if (typeof window !== "undefined") window.location.href = "/login"; return null; }

  const [table, setTable] = useState<(Entry[])[]>(Array.from({length:TABLE_SIZE},():Entry[]=>[]));
  const [keyInput, setKeyInput] = useState("");
  const [valInput, setValInput] = useState("");
  const [message, setMessage] = useState("");
  const [highlightIdx, setHighlightIdx] = useState<number|null>(null);
  const [hashSteps, setHashSteps] = useState<string[]>([]);
  const [collisions, setCollisions] = useState(0);

  const insert = () => {
    if (!keyInput.trim()) { setMessage("Entrez une cle"); return; }
    const key = keyInput.trim();
    const val = valInput.trim() || key;
    const idx = hashFn(key);
    const steps = [`"${key}" → hashCode()`, `hash = ${idx} (modulo ${TABLE_SIZE})`];

    const newTable = table.map(b=>[...b]);
    const existing = newTable[idx].findIndex(e=>e.key===key);
    if (existing >= 0) {
      newTable[idx][existing].value = val;
      steps.push(`Cle existante → mise a jour`);
    } else {
      if (newTable[idx].length > 0) {
        setCollisions(c=>c+1);
        steps.push(`COLLISION au bucket ${idx} ! Chainage...`);
      }
      newTable[idx].push({ key, value: val });
      steps.push(`Insere dans bucket[${idx}]`);
    }

    setTable(newTable);
    setHashSteps(steps);
    setHighlightIdx(idx);
    setMessage(`"${key}" insere au bucket ${idx}${newTable[idx].length > 1 ? " (collision !)" : ""}`);
    setKeyInput(""); setValInput("");
    setTimeout(()=>setHighlightIdx(null), 2000);
  };

  const lookup = () => {
    if (!keyInput.trim()) return;
    const key = keyInput.trim();
    const idx = hashFn(key);
    setHighlightIdx(idx);
    const found = table[idx].find(e=>e.key===key);
    if (found) setMessage(`get("${key}") → bucket[${idx}] → "${found.value}" (O(1))`);
    else setMessage(`get("${key}") → bucket[${idx}] → non trouve`);
    setHashSteps([`"${key}" → hash = ${idx}`, found ? `Trouve : "${found.value}"` : "Non trouve dans le bucket"]);
    setTimeout(()=>setHighlightIdx(null), 2000);
  };

  const clear = () => { setTable(Array.from({length:TABLE_SIZE},():Entry[]=>[])); setCollisions(0); setMessage(""); setHashSteps([]); };

  const totalEntries = table.reduce((s,b)=>s+b.length,0);

  return (
    <div style={{minHeight:"100vh",background:BG,color:TEXT}}>
      <TopBar/>
      <div style={{maxWidth:700,margin:"0 auto",padding:"1.5rem"}}>
        <div style={{textAlign:"center",marginBottom:"1.5rem"}}>
          <div style={{fontSize:13,color:PURPLE,fontWeight:600,letterSpacing:2,textTransform:"uppercase"}}>Jeu interactif</div>
          <h1 style={{fontSize:28,fontWeight:800}}>Hash Table Hero</h1>
          <p style={{color:MUTED,fontSize:14}}>Visualisez le hashing, les insertions et les collisions</p>
        </div>

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16}}>
          <div style={{padding:"8px",background:CARD,borderRadius:8,border:"1px solid "+BORDER,textAlign:"center"}}>
            <div style={{fontSize:18,fontWeight:700,color:TEAL}}>{totalEntries}</div>
            <div style={{fontSize:10,color:MUTED}}>Entrees</div>
          </div>
          <div style={{padding:"8px",background:CARD,borderRadius:8,border:"1px solid "+BORDER,textAlign:"center"}}>
            <div style={{fontSize:18,fontWeight:700,color:collisions>0?RED:GREEN}}>{collisions}</div>
            <div style={{fontSize:10,color:MUTED}}>Collisions</div>
          </div>
          <div style={{padding:"8px",background:CARD,borderRadius:8,border:"1px solid "+BORDER,textAlign:"center"}}>
            <div style={{fontSize:18,fontWeight:700,color:ORANGE}}>{TABLE_SIZE}</div>
            <div style={{fontSize:10,color:MUTED}}>Buckets</div>
          </div>
        </div>

        {/* Hash table visualization */}
        <div style={{background:CARD,borderRadius:12,padding:"14px",border:"1px solid "+BORDER,marginBottom:16}}>
          {table.map((bucket,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:i<TABLE_SIZE-1?"1px solid "+BORDER:"none"}}>
              <div style={{width:24,height:24,borderRadius:4,background:highlightIdx===i?PURPLE+"40":BORDER,border:"1px solid "+(highlightIdx===i?PURPLE:BORDER),display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:highlightIdx===i?PURPLE:MUTED,transition:"all 0.3s"}}>{i}</div>
              <div style={{display:"flex",gap:4,flex:1,flexWrap:"wrap",minHeight:28}}>
                {bucket.length===0&&<span style={{fontSize:11,color:BORDER,fontStyle:"italic"}}>vide</span>}
                {bucket.map((entry,j)=>(
                  <div key={j} style={{display:"flex",alignItems:"center",gap:2}}>
                    {j>0&&<svg width="16" height="12" viewBox="0 0 16 12"><line x1="0" y1="6" x2="10" y2="6" stroke={ORANGE} strokeWidth="1.5"/><polygon points="10,3 16,6 10,9" fill={ORANGE}/></svg>}
                    <div style={{padding:"3px 8px",background:highlightIdx===i?PURPLE+"20":TEAL+"15",border:"1px solid "+(highlightIdx===i?PURPLE:TEAL)+"40",borderRadius:4,fontSize:11,transition:"all 0.3s"}}>
                      <span style={{color:TEAL,fontWeight:600}}>{entry.key}</span>
                      <span style={{color:MUTED}}>:{entry.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Hash steps */}
        {hashSteps.length>0&&(
          <div style={{padding:"10px 14px",background:PURPLE+"10",borderRadius:8,border:"1px solid "+PURPLE+"30",marginBottom:12}}>
            {hashSteps.map((s,i)=><div key={i} style={{fontSize:12,color:s.includes("COLLISION")?RED:PURPLE,padding:"2px 0"}}>{s}</div>)}
          </div>
        )}

        {/* Controls */}
        <div style={{display:"flex",gap:8,marginBottom:10}}>
          <input value={keyInput} onChange={e=>setKeyInput(e.target.value)} placeholder="Cle (ex: Alice)" onKeyDown={e=>e.key==="Enter"&&insert()}
            style={{flex:1,padding:"10px 12px",background:CARD,border:"1px solid "+BORDER,borderRadius:8,color:TEXT,fontSize:13,outline:"none"}}/>
          <input value={valInput} onChange={e=>setValInput(e.target.value)} placeholder="Valeur"
            style={{flex:1,padding:"10px 12px",background:CARD,border:"1px solid "+BORDER,borderRadius:8,color:TEXT,fontSize:13,outline:"none"}}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
          <button onClick={insert} style={{padding:"10px",background:GREEN+"20",border:"1px solid "+GREEN+"40",borderRadius:8,color:GREEN,fontWeight:600,fontSize:13,cursor:"pointer"}}>put()</button>
          <button onClick={lookup} style={{padding:"10px",background:TEAL+"20",border:"1px solid "+TEAL+"40",borderRadius:8,color:TEAL,fontWeight:600,fontSize:13,cursor:"pointer"}}>get()</button>
          <button onClick={clear} style={{padding:"10px",background:RED+"20",border:"1px solid "+RED+"40",borderRadius:8,color:RED,fontWeight:600,fontSize:13,cursor:"pointer"}}>clear()</button>
        </div>

        {message&&<div style={{marginTop:10,padding:"8px 12px",background:CARD,borderRadius:8,fontSize:12,color:ORANGE}}>{message}</div>}
      </div>
    </div>
  );
}
