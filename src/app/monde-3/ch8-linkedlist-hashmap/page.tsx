"use client";
import { useState } from "react";

function LinkedListTypes() {
  const [listType, setListType] = useState<"simple" | "double" | "circular">("simple");
  const nodes = ["Alice", "Bob", "Clara"];
  const info: Record<string, {title:string;color:string;desc:string}> = {
    simple: {title:"Liste simplement chaînée",color:"#F97316",desc:"Chaque noeud: data + next. Dernier → null. Parcours → sens unique. Opérations: Insérer, Effacer."},
    double: {title:"Liste doublement chaînée",color:"#0891B2",desc:"Chaque noeud: data + next + prev. Parcours ↔ deux sens. Opérations: Parcourir, Insérer, Effacer. Plus de mémoire (2 pointeurs/noeud)."},
    circular: {title:"Liste circulaire (Ring Buffer)",color:"#16A34A",desc:"Le dernier noeud pointe vers le premier (pas de null). Forme une boucle. Opérations: Insérer, Effacer."},
  };
  const cur = info[listType];
  return (
    <div>
      <div style={{display:"flex",gap:6,marginBottom:12}}>
        {(["simple","double","circular"] as const).map(t=>(
          <button key={t} onClick={()=>setListType(t)} style={{padding:"6px 12px",borderRadius:6,border:listType===t?`2px solid ${info[t].color}`:"1px solid #1E3A5F",background:listType===t?`${info[t].color}20`:"#111827",color:listType===t?info[t].color:"#94A3B8",fontWeight:600,fontSize:12,cursor:"pointer"}}>
            {t==="simple"?"Simple":t==="double"?"Double":"Circulaire"}
          </button>
        ))}
      </div>
      <svg viewBox="0 0 600 110" style={{width:"100%",background:"#0D1117",borderRadius:10,marginBottom:10}}>
        <defs>
          <marker id="ao" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M2 1L8 5L2 9" fill="none" stroke="#F97316" strokeWidth="1.5"/></marker>
          <marker id="ab" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M2 1L8 5L2 9" fill="none" stroke="#0891B2" strokeWidth="1.5"/></marker>
          <marker id="ag" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M2 1L8 5L2 9" fill="none" stroke="#16A34A" strokeWidth="1.5"/></marker>
        </defs>
        {nodes.map((n,i)=>{const x=40+i*180;return(
          <g key={i}>
            <rect x={x} y={20} width={120} height={50} rx={8} fill="#1E293B" stroke={cur.color} strokeWidth={1.5}/>
            <text x={x+60} y={42} fill="#E2E8F0" fontSize={13} fontWeight={600} textAnchor="middle">{n}</text>
            <text x={x+60} y={58} fill="#64748B" fontSize={9} textAnchor="middle">data | next{listType==="double"?" | prev":""}</text>
            {i<nodes.length-1&&<line x1={x+120} y1={45} x2={x+180} y2={45} stroke="#F97316" strokeWidth={1.5} markerEnd="url(#ao)"/>}
            {listType==="double"&&i>0&&<line x1={x} y1={55} x2={x-60} y2={55} stroke="#0891B2" strokeWidth={1} markerEnd="url(#ab)" strokeDasharray="4 2"/>}
          </g>
        )})}
        {listType==="circular"&&<path d={`M ${40+2*180+120} 45 C 580 90, 20 90, 40 45`} fill="none" stroke="#16A34A" strokeWidth={1.5} strokeDasharray="4 2" markerEnd="url(#ag)"/>}
        {listType==="simple"&&<text x={40+2*180+125} y={50} fill="#DC2626" fontSize={11} fontWeight={600}>null</text>}
      </svg>
      <div style={{background:"#1E293B",borderRadius:8,padding:"10px 14px",fontSize:12,color:"#94A3B8"}}>
        <div style={{color:cur.color,fontWeight:600,marginBottom:4}}>{cur.title}</div>{cur.desc}
      </div>
    </div>
  );
}

function LinkedListSim() {
  const [nodes, setNodes] = useState(["Alice","Bob","Clara"]);
  const [input, setInput] = useState("");
  const [log, setLog] = useState(["Liste initialisée"]);
  const [score, setScore] = useState(0);
  const addFirst=()=>{if(!input.trim())return;setNodes([input.trim(),...nodes]);setLog(l=>[...l,`addFirst("${input.trim()}") → O(1)`]);setScore(s=>s+5);setInput("")};
  const addLast=()=>{if(!input.trim())return;setNodes([...nodes,input.trim()]);setLog(l=>[...l,`addLast("${input.trim()}") → O(1)`]);setScore(s=>s+5);setInput("")};
  const removeFirst=()=>{if(!nodes.length)return;setLog(l=>[...l,`removeFirst() → "${nodes[0]}" — O(1)`]);setNodes(nodes.slice(1));setScore(s=>s+5)};
  const removeLast=()=>{if(!nodes.length)return;setLog(l=>[...l,`removeLast() → "${nodes[nodes.length-1]}" — O(n)`]);setNodes(nodes.slice(0,-1));setScore(s=>s+5)};
  return (
    <div>
      <div style={{fontSize:12,color:"#F97316",fontWeight:600,marginBottom:6}}>Score: {score} | Taille: {nodes.length}</div>
      <div style={{display:"flex",gap:4,flexWrap:"wrap" as const,minHeight:40,alignItems:"center",padding:"6px 0"}}>
        {!nodes.length?<span style={{color:"#64748B",fontStyle:"italic",fontSize:13}}>(vide)</span>:nodes.map((n,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:2}}>
            <div style={{background:i===0?"#993C1D":"#D85A30",color:"white",padding:"5px 10px",borderRadius:6,fontSize:12,fontWeight:600}}>{n}<span style={{fontSize:9,opacity:.7,marginLeft:3}}>[{i}]</span></div>
            {i<nodes.length-1&&<span style={{color:"#D85A30",fontSize:14}}>→</span>}
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:6,margin:"8px 0",flexWrap:"wrap" as const}}>
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Nom..." style={{flex:1,minWidth:100,padding:"6px 10px",border:"1px solid #1E3A5F",borderRadius:6,fontSize:12,background:"#1E293B",color:"#E2E8F0"}}/>
        <button onClick={addFirst} style={{padding:"6px 8px",background:"#16A34A",color:"white",border:"none",borderRadius:6,fontSize:11,fontWeight:600,cursor:"pointer"}}>addFirst</button>
        <button onClick={addLast} style={{padding:"6px 8px",background:"#16A34A",color:"white",border:"none",borderRadius:6,fontSize:11,fontWeight:600,cursor:"pointer"}}>addLast</button>
        <button onClick={removeFirst} style={{padding:"6px 8px",background:"#DC2626",color:"white",border:"none",borderRadius:6,fontSize:11,fontWeight:600,cursor:"pointer"}}>removeFirst</button>
        <button onClick={removeLast} style={{padding:"6px 8px",background:"#DC2626",color:"white",border:"none",borderRadius:6,fontSize:11,fontWeight:600,cursor:"pointer"}}>removeLast</button>
      </div>
      <div style={{background:"#0D1117",borderRadius:8,padding:"6px 10px",maxHeight:80,overflowY:"auto" as const}}>
        {log.slice(-4).map((l,i)=><div key={i} style={{fontSize:11,color:"#94A3B8",fontFamily:"Consolas,monospace"}}>{l}</div>)}
      </div>
    </div>
  );
}

function HashMapSim() {
  const [map, setMap] = useState<Record<string,string>>({alice:"0612345678",bob:"0698765432"});
  const [key, setKey] = useState("");const [value, setValue] = useState("");
  const [log, setLog] = useState(["HashMap initialisée"]);
  const [score, setScore] = useState(0);
  const hashFn=(k:string)=>{let h=0;for(let i=0;i<k.length;i++)h=(h*31+k.charCodeAt(i))%16;return h};
  const put=()=>{if(!key.trim())return;const h=hashFn(key.trim());setMap({...map,[key.trim()]:value.trim()});setLog(l=>[...l,`put("${key.trim()}") → hash=${h} → bucket[${h}]`]);setScore(s=>s+5);setKey("");setValue("")};
  const get=()=>{if(!key.trim())return;const v=map[key.trim()];const h=hashFn(key.trim());setLog(l=>[...l,`get("${key.trim()}") → hash=${h} → ${v||"null"}`]);setScore(s=>s+3)};
  const remove=()=>{if(!key.trim()||!(key.trim()in map))return;const m={...map};delete m[key.trim()];setMap(m);setLog(l=>[...l,`remove("${key.trim()}") → supprimé`]);setScore(s=>s+5);setKey("")};
  return (
    <div>
      <div style={{fontSize:12,color:"#0891B2",fontWeight:600,marginBottom:6}}>Score: {score} | Taille: {Object.keys(map).length}</div>
      <div style={{background:"#0D1117",borderRadius:8,padding:"8px 10px",marginBottom:8}}>
        <div style={{fontSize:11,color:"#64748B",marginBottom:4}}>clé → hashCode() % 16 → bucket[index]</div>
        {Object.entries(map).map(([k,v])=>(
          <div key={k} style={{display:"flex",gap:4,alignItems:"center",marginBottom:3}}>
            <span style={{background:"#F97316",color:"white",padding:"2px 8px",borderRadius:4,fontSize:11,fontWeight:600,minWidth:60}}>{k}</span>
            <span style={{color:"#64748B",fontSize:10}}>→ h={hashFn(k)} →</span>
            <span style={{background:"#0891B2",color:"white",padding:"2px 8px",borderRadius:4,fontSize:11}}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:6,marginBottom:6}}>
        <input value={key} onChange={e=>setKey(e.target.value)} placeholder="Clé..." style={{flex:1,padding:"6px 10px",border:"1px solid #1E3A5F",borderRadius:6,fontSize:12,background:"#1E293B",color:"#E2E8F0"}}/>
        <input value={value} onChange={e=>setValue(e.target.value)} placeholder="Valeur..." style={{flex:1,padding:"6px 10px",border:"1px solid #1E3A5F",borderRadius:6,fontSize:12,background:"#1E293B",color:"#E2E8F0"}}/>
      </div>
      <div style={{display:"flex",gap:6}}>
        <button onClick={put} style={{padding:"6px 10px",background:"#16A34A",color:"white",border:"none",borderRadius:6,fontSize:11,fontWeight:600,cursor:"pointer"}}>put(k,v)</button>
        <button onClick={get} style={{padding:"6px 10px",background:"#3B82F6",color:"white",border:"none",borderRadius:6,fontSize:11,fontWeight:600,cursor:"pointer"}}>get(k)</button>
        <button onClick={remove} style={{padding:"6px 10px",background:"#DC2626",color:"white",border:"none",borderRadius:6,fontSize:11,fontWeight:600,cursor:"pointer"}}>remove(k)</button>
      </div>
      <div style={{background:"#0D1117",borderRadius:8,padding:"6px 10px",maxHeight:60,overflowY:"auto" as const,marginTop:6}}>
        {log.slice(-3).map((l,i)=><div key={i} style={{fontSize:11,color:"#94A3B8",fontFamily:"Consolas,monospace"}}>{l}</div>)}
      </div>
    </div>
  );
}

export default function Ch8Game() {
  const [mode, setMode] = useState<"menu"|"types"|"linkedlist"|"hashmap">("menu");
  if(mode==="menu")return(
    <div style={{maxWidth:700,margin:"0 auto",padding:"2rem 1rem",fontFamily:"'Segoe UI',system-ui,sans-serif",color:"#E2E8F0"}}>
      <div style={{textAlign:"center" as const,marginBottom:"2rem"}}>
        <div style={{fontSize:14,color:"#F97316",fontWeight:600,letterSpacing:2,textTransform:"uppercase" as const}}>Monde 3 — Chapitre 8</div>
        <h1 style={{fontSize:28,fontWeight:700,color:"white",margin:"0.5rem 0"}}>LinkedList + HashMap</h1>
        <p style={{color:"#94A3B8",fontSize:14}}>Critère P4a — Structures complexes</p>
      </div>
      <div style={{display:"grid",gap:12}}>
        <button onClick={()=>setMode("types")} style={{padding:"1.2rem",border:"1px solid #1E3A5F",borderRadius:10,background:"#111827",cursor:"pointer",textAlign:"left" as const}}>
          <div style={{fontSize:18,fontWeight:600,color:"#F97316"}}>🔗 Types de LinkedList</div>
          <div style={{fontSize:13,color:"#94A3B8",marginTop:4}}>Simple, doublement chaînée, circulaire — visualisation SVG</div>
        </button>
        <button onClick={()=>setMode("linkedlist")} style={{padding:"1.2rem",border:"1px solid #1E3A5F",borderRadius:10,background:"#111827",cursor:"pointer",textAlign:"left" as const}}>
          <div style={{fontSize:18,fontWeight:600,color:"#D85A30"}}>📝 Simulateur LinkedList</div>
          <div style={{fontSize:13,color:"#94A3B8",marginTop:4}}>addFirst, addLast, remove — manipulez en temps réel</div>
        </button>
        <button onClick={()=>setMode("hashmap")} style={{padding:"1.2rem",border:"1px solid #1E3A5F",borderRadius:10,background:"#111827",cursor:"pointer",textAlign:"left" as const}}>
          <div style={{fontSize:18,fontWeight:600,color:"#0891B2"}}>🗃️ Simulateur HashMap</div>
          <div style={{fontSize:13,color:"#94A3B8",marginTop:4}}>Hash function visible + buckets — voyez le hachage en action</div>
        </button>
      </div>
    </div>
  );
  return(
    <div style={{maxWidth:700,margin:"0 auto",padding:"1.5rem 1rem",fontFamily:"'Segoe UI',system-ui,sans-serif",color:"#E2E8F0"}}>
      <button onClick={()=>setMode("menu")} style={{fontSize:13,color:"#64748B",background:"none",border:"none",cursor:"pointer",marginBottom:12}}>← Retour</button>
      <h2 style={{fontSize:20,fontWeight:700,color:mode==="types"?"#F97316":mode==="linkedlist"?"#D85A30":"#0891B2",marginBottom:12}}>
        {mode==="types"?"🔗 Types de LinkedList":mode==="linkedlist"?"📝 Simulateur LinkedList":"🗃️ Simulateur HashMap"}
      </h2>
      {mode==="types"&&<LinkedListTypes/>}
      {mode==="linkedlist"&&<LinkedListSim/>}
      {mode==="hashmap"&&<HashMapSim/>}
    </div>
  );
}
