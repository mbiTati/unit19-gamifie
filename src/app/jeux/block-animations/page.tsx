"use client";
import { useAuth } from "@/components/AuthProvider";
import { useState, useEffect, useRef } from "react";
import GameShell from "@/components/GameShell";
import { C } from "@/lib/theme";

const BLOCK_COLORS=["#DC2626","#F97316","#FBBF24","#16A34A","#0891B2","#3B82F6","#7C3AED","#EC4899"];

type AnimMode = "menu"|"callstack"|"swap"|"linkedlist";

export default function BlockAnimations() {
  const { user: authUser, loading: authLoading } = useAuth();
  if (authLoading) return <div style={{ minHeight: "100vh", background: "#0a0f1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>Chargement...</div>;
  if (!authUser) { if (typeof window !== "undefined") window.location.href = "/login"; return null; }

  const [mode, setMode] = useState<AnimMode>("menu");

  // Call stack animation
  const [callStack, setCallStack] = useState<{name:string;color:string}[]>([]);
  const [csStep, setCsStep] = useState(0);
  const [csRunning, setCsRunning] = useState(false);

  const CALL_STEPS = [
    {action:"push",frame:{name:"main()",color:"#7C3AED"},msg:"main() demarre — 1er frame empile"},
    {action:"push",frame:{name:"calculer(5,3)",color:"#3B82F6"},msg:"main() appelle calculer(5,3) — empile"},
    {action:"push",frame:{name:"additionner(5,3)",color:"#16A34A"},msg:"calculer() appelle additionner() — empile"},
    {action:"pop",msg:"additionner() retourne 8 — depile"},
    {action:"pop",msg:"calculer() retourne 16 — depile"},
    {action:"pop",msg:"main() termine — depile — pile vide"},
  ];

  const runCallStack = () => {
    setCsRunning(true); setCallStack([]); setCsStep(0);
    CALL_STEPS.forEach((step, i) => {
      setTimeout(() => {
        setCsStep(i);
        if (step.action === "push" && step.frame) {
          setCallStack(prev => [...prev, step.frame!]);
        } else {
          setCallStack(prev => prev.slice(0, -1));
        }
        if (i === CALL_STEPS.length - 1) setCsRunning(false);
      }, i * 1200);
    });
  };

  // Swap animation
  const [swapArr, setSwapArr] = useState([64,34,25,12,22,11,90]);
  const [swapHL, setSwapHL] = useState<number[]>([]);
  const [swapMsg, setSwapMsg] = useState("");
  const [swapRunning, setSwapRunning] = useState(false);

  const runBubbleAnim = () => {
    setSwapRunning(true);
    const arr = [64,34,25,12,22,11,90];
    setSwapArr([...arr]);
    const steps: {arr:number[];hl:number[];msg:string}[] = [];
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j+1]) {
          [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
          steps.push({arr:[...arr], hl:[j,j+1], msg:`Swap ${arr[j+1]} et ${arr[j]}`});
        } else {
          steps.push({arr:[...arr], hl:[j,j+1], msg:`${arr[j]} <= ${arr[j+1]} — pas de swap`});
        }
      }
    }
    steps.forEach((step, i) => {
      setTimeout(() => {
        setSwapArr(step.arr); setSwapHL(step.hl); setSwapMsg(step.msg);
        if (i === steps.length - 1) setSwapRunning(false);
      }, i * 500);
    });
  };

  // LinkedList animation
  const [llNodes, setLlNodes] = useState([10,20,30,40]);
  const [llHL, setLlHL] = useState<number>(-1);
  const [llMsg, setLlMsg] = useState("");

  const llInsertHead = () => {
    const val = Math.floor(Math.random()*90)+1;
    setLlHL(-1);
    setLlMsg(`Insertion en tete : ${val} — O(1)`);
    setTimeout(() => { setLlNodes(prev => [val, ...prev]); setLlHL(0); }, 300);
    setTimeout(() => setLlHL(-1), 1500);
  };

  const llRemoveHead = () => {
    if (llNodes.length === 0) return;
    setLlHL(0); setLlMsg(`Suppression tete : ${llNodes[0]} — O(1)`);
    setTimeout(() => { setLlNodes(prev => prev.slice(1)); setLlHL(-1); }, 800);
  };

  if (mode === "menu") return (
    <GameShell title="Block Animations" color={C.accent}>
      <div style={{maxWidth:500,margin:"0 auto"}}>
        <p style={{color:C.muted,fontSize:13,marginBottom:16,textAlign:"center"}}>Visualisations animees pour le cours — projetez en classe</p>
        <div style={{display:"grid",gap:12}}>
          {[
            {m:"callstack" as AnimMode,t:"Call Stack",d:"Visualiser la pile d'appels (push/pop)",c:C.secondary},
            {m:"swap" as AnimMode,t:"Tri a bulles anime",d:"Voir les swaps en temps reel",c:C.danger},
            {m:"linkedlist" as AnimMode,t:"LinkedList animee",d:"Insertion/suppression avec fleches",c:C.success},
          ].map(b=>(
            <button key={b.m} onClick={()=>setMode(b.m)} style={{padding:"14px",background:C.card,border:`2px solid ${b.c}30`,borderRadius:10,cursor:"pointer",textAlign:"left"}}>
              <div style={{fontSize:16,fontWeight:700,color:b.c}}>{b.t}</div>
              <div style={{fontSize:12,color:C.muted,marginTop:2}}>{b.d}</div>
            </button>
          ))}
        </div>
      </div>
    </GameShell>
  );

  if (mode === "callstack") return (
    <GameShell title="Call Stack" color={C.secondary}>
      <div style={{maxWidth:400,margin:"0 auto"}}>
        <button onClick={()=>setMode("menu")} style={{fontSize:11,color:C.muted,background:"none",border:"none",cursor:"pointer",marginBottom:8}}>Retour</button>
        <div style={{background:C.card,borderRadius:12,padding:"16px",border:"1px solid "+C.border,marginBottom:12,minHeight:250}}>
          <div style={{fontSize:10,color:C.muted,textAlign:"center",marginBottom:8}}>TOP (sommet)</div>
          <div style={{display:"flex",flexDirection:"column-reverse",alignItems:"center",gap:6}}>
            {callStack.length===0&&<div style={{color:C.dimmed,padding:"30px",fontStyle:"italic"}}>Pile vide</div>}
            {callStack.map((frame,i)=>(
              <div key={i} style={{width:"80%",padding:"12px",borderRadius:8,background:frame.color+"25",border:`2px solid ${frame.color}`,textAlign:"center",fontWeight:700,color:frame.color,fontSize:14,fontFamily:"monospace",transition:"all 0.3s",animation:"slideIn 0.3s ease-out"}}>
                {frame.name}
              </div>
            ))}
          </div>
          <div style={{fontSize:10,color:C.muted,textAlign:"center",marginTop:8}}>BASE</div>
        </div>
        {csStep < CALL_STEPS.length && csRunning && (
          <div style={{padding:"8px 12px",background:C.gold+"15",borderRadius:8,fontSize:12,color:C.gold,marginBottom:8}}>{CALL_STEPS[csStep].msg}</div>
        )}
        <button onClick={runCallStack} disabled={csRunning}
          style={{width:"100%",padding:"12px",background:csRunning?C.border:C.secondary,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:csRunning?"wait":"pointer"}}>
          {csRunning?"Animation en cours...":"Lancer l'animation"}
        </button>
        <style>{`@keyframes slideIn{from{transform:translateY(-20px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
      </div>
    </GameShell>
  );

  if (mode === "swap") return (
    <GameShell title="Tri a bulles" color={C.danger}>
      <div style={{maxWidth:500,margin:"0 auto"}}>
        <button onClick={()=>setMode("menu")} style={{fontSize:11,color:C.muted,background:"none",border:"none",cursor:"pointer",marginBottom:8}}>Retour</button>
        <div style={{background:C.card,borderRadius:12,padding:"16px",border:"1px solid "+C.border,marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"center",alignItems:"flex-end",gap:8,height:200}}>
            {swapArr.map((v,i)=>{
              const h = (v/100)*180;
              const isHL = swapHL.includes(i);
              return(
                <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <div style={{fontSize:11,fontWeight:700,color:isHL?C.gold:C.text}}>{v}</div>
                  <div style={{width:40,height:h,borderRadius:"6px 6px 0 0",background:isHL?C.gold:BLOCK_COLORS[i%BLOCK_COLORS.length],transition:"all 0.3s",boxShadow:isHL?"0 0 12px "+C.gold+"60":"none"}}/>
                </div>
              );
            })}
          </div>
        </div>
        {swapMsg&&<div style={{padding:"8px 12px",background:C.card,borderRadius:8,fontSize:12,color:C.gold,marginBottom:8}}>{swapMsg}</div>}
        <button onClick={runBubbleAnim} disabled={swapRunning}
          style={{width:"100%",padding:"12px",background:swapRunning?C.border:C.danger,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:swapRunning?"wait":"pointer"}}>
          {swapRunning?"Animation en cours...":"Lancer le tri a bulles"}
        </button>
      </div>
    </GameShell>
  );

  // LinkedList
  return (
    <GameShell title="LinkedList animee" color={C.success}>
      <div style={{maxWidth:600,margin:"0 auto"}}>
        <button onClick={()=>setMode("menu")} style={{fontSize:11,color:C.muted,background:"none",border:"none",cursor:"pointer",marginBottom:8}}>Retour</button>
        <div style={{background:C.card,borderRadius:12,padding:"16px",border:"1px solid "+C.border,marginBottom:12,overflowX:"auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:0}}>
            <div style={{padding:"4px 8px",background:C.accent+"20",border:"1px solid "+C.accent,borderRadius:4,fontSize:10,color:C.accent,fontWeight:600,marginRight:6}}>HEAD</div>
            {llNodes.map((v,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center"}}>
                <div style={{padding:"10px 16px",borderRadius:8,background:llHL===i?C.gold+"30":BLOCK_COLORS[i%BLOCK_COLORS.length]+"25",border:`2px solid ${llHL===i?C.gold:BLOCK_COLORS[i%BLOCK_COLORS.length]}`,fontWeight:700,color:C.text,fontSize:16,transition:"all 0.3s"}}>{v}</div>
                {i<llNodes.length-1&&<svg width="28" height="16" viewBox="0 0 28 16"><line x1="2" y1="8" x2="20" y2="8" stroke={C.accent} strokeWidth="2"/><polygon points="20,4 28,8 20,12" fill={C.accent}/></svg>}
              </div>
            ))}
            {llNodes.length>0&&<><svg width="28" height="16" viewBox="0 0 28 16"><line x1="2" y1="8" x2="20" y2="8" stroke={C.danger} strokeWidth="2"/><polygon points="20,4 28,8 20,12" fill={C.danger}/></svg><div style={{padding:"4px 8px",background:C.danger+"20",border:"1px solid "+C.danger,borderRadius:4,fontSize:10,color:C.danger,fontWeight:600}}>NULL</div></>}
          </div>
        </div>
        {llMsg&&<div style={{padding:"8px 12px",background:C.card,borderRadius:8,fontSize:12,color:C.gold,marginBottom:8}}>{llMsg}</div>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <button onClick={llInsertHead} style={{padding:"10px",background:C.success+"20",border:"1px solid "+C.success+"40",borderRadius:8,color:C.success,fontWeight:600,cursor:"pointer"}}>+ Inserer en tete</button>
          <button onClick={llRemoveHead} style={{padding:"10px",background:C.danger+"20",border:"1px solid "+C.danger+"40",borderRadius:8,color:C.danger,fontWeight:600,cursor:"pointer"}}>- Supprimer tete</button>
        </div>
      </div>
    </GameShell>
  );
}
