"use client";
import { useAuth } from "@/components/AuthProvider";
import { useState } from "react";
import GameShell from "@/components/GameShell";
import { C } from "@/lib/theme";

const BLOCK_COLORS=["#DC2626","#F97316","#FBBF24","#16A34A","#0891B2","#3B82F6","#7C3AED","#EC4899"];

export default function StackQueueRunner(){
  const { user: authUser, loading: authLoading } = useAuth();
  if (authLoading) return <div style={{ minHeight: "100vh", background: "#0a0f1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>Chargement...</div>;
  if (!authUser) { if (typeof window !== "undefined") window.location.href = "/login"; return null; }

  const[mode,setMode]=useState<"menu"|"stack"|"queue"|"challenge">("menu");
  const[stack,setStack]=useState<number[]>([]);
  const[queue,setQueue]=useState<number[]>([]);
  const[nextVal,setNextVal]=useState(1);
  const[msg,setMsg]=useState("");
  const[challenge,setChallenge]=useState<{target:string[];current:string[];ops:string[];score:number;step:number}>({target:[],current:[],ops:[],score:0,step:0});

  // Stack ops
  const push=()=>{setStack(s=>[...s,nextVal]);setMsg(`push(${nextVal}) — LIFO : ajout au sommet O(1)`);setNextVal(v=>v+1)};
  const pop=()=>{if(stack.length===0){setMsg("Stack vide !");return}const v=stack[stack.length-1];setStack(s=>s.slice(0,-1));setMsg(`pop() → ${v} — LIFO : retire le DERNIER ajoute O(1)`)};
  const peek=()=>{if(stack.length===0){setMsg("Stack vide !");return}setMsg(`peek() → ${stack[stack.length-1]} — regarde le sommet sans retirer`)};

  // Queue ops
  const enqueue=()=>{setQueue(q=>[...q,nextVal]);setMsg(`enqueue(${nextVal}) — FIFO : ajout a la fin O(1)`);setNextVal(v=>v+1)};
  const dequeue=()=>{if(queue.length===0){setMsg("Queue vide !");return}const v=queue[0];setQueue(q=>q.slice(1));setMsg(`dequeue() → ${v} — FIFO : retire le PREMIER ajoute O(1)`)};
  const front=()=>{if(queue.length===0){setMsg("Queue vide !");return}setMsg(`front() → ${queue[0]} — regarde le premier sans retirer`)};

  // Challenge: predict output
  const CHALLENGES=[
    {ops:["push(1)","push(2)","push(3)","pop()","pop()"],type:"stack",question:"Quel est l'ordre de sortie ?",answer:"3, 2",explain:"LIFO : 3 sort en premier (dernier entre), puis 2"},
    {ops:["enqueue(A)","enqueue(B)","enqueue(C)","dequeue()","dequeue()"],type:"queue",question:"Quel est l'ordre de sortie ?",answer:"A, B",explain:"FIFO : A sort en premier (premier entre), puis B"},
    {ops:["push(10)","push(20)","pop()","push(30)","pop()","pop()"],type:"stack",question:"Ordre de sortie ?",answer:"20, 30, 10",explain:"LIFO : pop()→20, push(30), pop()→30, pop()→10"},
    {ops:["enqueue(X)","enqueue(Y)","dequeue()","enqueue(Z)","dequeue()"],type:"queue",question:"Ordre de sortie ?",answer:"X, Y",explain:"FIFO : dequeue()→X, enqueue(Z), dequeue()→Y"},
  ];
  const[chIdx,setChIdx]=useState(0);const[chAnswer,setChAnswer]=useState("");const[chShow,setChShow]=useState(false);const[chScore,setChScore]=useState(0);

  const checkChallenge=()=>{
    setChShow(true);
    if(chAnswer.trim().replace(/\s/g,"")===CHALLENGES[chIdx].answer.replace(/\s/g,""))setChScore(s=>s+1);
  };
  const nextChallenge=()=>{setChIdx(i=>i+1);setChAnswer("");setChShow(false)};

  if(mode==="menu")return(
    <GameShell title="Stack & Queue Runner" color={C.accent}>
      <div style={{maxWidth:500,margin:"0 auto",textAlign:"center"}}>
        <p style={{color:C.muted,fontSize:14,marginBottom:20}}>LIFO vs FIFO — manipulez et comparez</p>
        <div style={{display:"grid",gap:12}}>
          <button onClick={()=>{setMode("stack");setStack([]);setNextVal(1);setMsg("")}} style={{padding:"16px",background:C.danger+"15",border:"2px solid "+C.danger+"30",borderRadius:12,cursor:"pointer"}}>
            <div style={{fontSize:18,fontWeight:700,color:C.danger}}>Stack (LIFO)</div>
            <div style={{fontSize:12,color:C.muted,marginTop:4}}>Last In, First Out — push/pop</div>
          </button>
          <button onClick={()=>{setMode("queue");setQueue([]);setNextVal(1);setMsg("")}} style={{padding:"16px",background:C.accent+"15",border:"2px solid "+C.accent+"30",borderRadius:12,cursor:"pointer"}}>
            <div style={{fontSize:18,fontWeight:700,color:C.accent}}>Queue (FIFO)</div>
            <div style={{fontSize:12,color:C.muted,marginTop:4}}>First In, First Out — enqueue/dequeue</div>
          </button>
          <button onClick={()=>{setMode("challenge");setChIdx(0);setChScore(0);setChAnswer("");setChShow(false)}} style={{padding:"16px",background:C.gold+"15",border:"2px solid "+C.gold+"30",borderRadius:12,cursor:"pointer"}}>
            <div style={{fontSize:18,fontWeight:700,color:C.gold}}>Challenge</div>
            <div style={{fontSize:12,color:C.muted,marginTop:4}}>Predire la sortie — 4 defis</div>
          </button>
        </div>
      </div>
    </GameShell>
  );

  // Stack view
  if(mode==="stack")return(
    <GameShell title="Stack (LIFO)" color={C.danger}>
      <div style={{maxWidth:400,margin:"0 auto"}}>
        <button onClick={()=>setMode("menu")} style={{fontSize:11,color:C.muted,background:"none",border:"none",cursor:"pointer",marginBottom:8}}>Retour</button>
        <div style={{background:C.card,borderRadius:12,padding:"16px",border:"1px solid "+C.border,marginBottom:12,minHeight:200}}>
          <div style={{fontSize:10,color:C.muted,marginBottom:8,textAlign:"center"}}>SOMMET (top)</div>
          <div style={{display:"flex",flexDirection:"column-reverse",alignItems:"center",gap:4}}>
            {stack.length===0&&<div style={{color:C.dimmed,fontStyle:"italic",padding:"20px"}}>Pile vide</div>}
            {stack.map((v,i)=>(
              <div key={i} style={{width:120,padding:"10px",borderRadius:8,background:BLOCK_COLORS[(v-1)%BLOCK_COLORS.length],textAlign:"center",fontWeight:700,color:"white",fontSize:16,boxShadow:"0 3px 6px #00000040",transition:"all 0.2s"}}>
                {v}{i===stack.length-1?" ← top":""}
              </div>
            ))}
          </div>
          <div style={{fontSize:10,color:C.muted,marginTop:8,textAlign:"center"}}>BASE</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:8}}>
          <button onClick={push} style={{padding:"10px",background:C.success+"20",border:"1px solid "+C.success+"40",borderRadius:8,color:C.success,fontWeight:600,fontSize:13,cursor:"pointer"}}>push({nextVal})</button>
          <button onClick={pop} style={{padding:"10px",background:C.danger+"20",border:"1px solid "+C.danger+"40",borderRadius:8,color:C.danger,fontWeight:600,fontSize:13,cursor:"pointer"}}>pop()</button>
          <button onClick={peek} style={{padding:"10px",background:C.gold+"20",border:"1px solid "+C.gold+"40",borderRadius:8,color:C.gold,fontWeight:600,fontSize:13,cursor:"pointer"}}>peek()</button>
        </div>
        {msg&&<div style={{padding:"8px 12px",background:C.card,borderRadius:8,fontSize:12,color:C.gold}}>{msg}</div>}
        <div style={{marginTop:8,fontSize:11,color:C.dimmed}}>Taille : {stack.length} | LIFO : le dernier entre sort en premier</div>
      </div>
    </GameShell>
  );

  // Queue view
  if(mode==="queue")return(
    <GameShell title="Queue (FIFO)" color={C.accent}>
      <div style={{maxWidth:500,margin:"0 auto"}}>
        <button onClick={()=>setMode("menu")} style={{fontSize:11,color:C.muted,background:"none",border:"none",cursor:"pointer",marginBottom:8}}>Retour</button>
        <div style={{background:C.card,borderRadius:12,padding:"16px",border:"1px solid "+C.border,marginBottom:12,minHeight:100}}>
          <div style={{display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}}>
            <div style={{fontSize:10,color:C.accent,fontWeight:600,padding:"4px 8px",background:C.accent+"15",borderRadius:4}}>FRONT</div>
            {queue.length===0&&<div style={{color:C.dimmed,fontStyle:"italic",padding:"10px 20px"}}>File vide</div>}
            {queue.map((v,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center"}}>
                <div style={{padding:"8px 14px",borderRadius:8,background:BLOCK_COLORS[(v-1)%BLOCK_COLORS.length],fontWeight:700,color:"white",fontSize:14,boxShadow:"0 3px 6px #00000040"}}>{v}</div>
                {i<queue.length-1&&<svg width="20" height="16" viewBox="0 0 20 16"><polygon points="14,4 20,8 14,12" fill={C.accent}/><line x1="0" y1="8" x2="14" y2="8" stroke={C.accent} strokeWidth="2"/></svg>}
              </div>
            ))}
            <div style={{fontSize:10,color:C.danger,fontWeight:600,padding:"4px 8px",background:C.danger+"15",borderRadius:4}}>REAR</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:8}}>
          <button onClick={enqueue} style={{padding:"10px",background:C.success+"20",border:"1px solid "+C.success+"40",borderRadius:8,color:C.success,fontWeight:600,fontSize:12,cursor:"pointer"}}>enqueue({nextVal})</button>
          <button onClick={dequeue} style={{padding:"10px",background:C.danger+"20",border:"1px solid "+C.danger+"40",borderRadius:8,color:C.danger,fontWeight:600,fontSize:12,cursor:"pointer"}}>dequeue()</button>
          <button onClick={front} style={{padding:"10px",background:C.gold+"20",border:"1px solid "+C.gold+"40",borderRadius:8,color:C.gold,fontWeight:600,fontSize:12,cursor:"pointer"}}>front()</button>
        </div>
        {msg&&<div style={{padding:"8px 12px",background:C.card,borderRadius:8,fontSize:12,color:C.gold}}>{msg}</div>}
        <div style={{marginTop:8,fontSize:11,color:C.dimmed}}>Taille : {queue.length} | FIFO : le premier entre sort en premier</div>
      </div>
    </GameShell>
  );

  // Challenge mode
  if(chIdx>=CHALLENGES.length)return(
    <GameShell title="Challenge" color={C.gold} score={chScore}>
      <div style={{maxWidth:400,margin:"0 auto",textAlign:"center"}}>
        <div style={{fontSize:48,fontWeight:800,color:chScore>=3?C.success:C.gold}}>{chScore}/{CHALLENGES.length}</div>
        <button onClick={()=>setMode("menu")} style={{marginTop:16,padding:"10px 24px",background:C.gold,color:C.bg,border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Retour</button>
      </div>
    </GameShell>
  );

  const ch=CHALLENGES[chIdx];
  return(
    <GameShell title="Challenge" color={C.gold} current={chIdx+1} total={CHALLENGES.length} score={chScore}>
      <div style={{maxWidth:500,margin:"0 auto"}}>
        <div style={{padding:"12px",background:C.card,borderRadius:10,border:"1px solid "+C.border,marginBottom:12}}>
          <div style={{fontSize:12,fontWeight:600,color:ch.type==="stack"?C.danger:C.accent,marginBottom:6}}>{ch.type==="stack"?"Stack (LIFO)":"Queue (FIFO)"}</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
            {ch.ops.map((op,i)=><span key={i} style={{padding:"4px 8px",background:C.code,borderRadius:4,fontSize:11,color:C.codeText,fontFamily:"monospace"}}>{op}</span>)}
          </div>
          <div style={{fontSize:14,fontWeight:600,color:C.text}}>{ch.question}</div>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:8}}>
          <input value={chAnswer} onChange={e=>setChAnswer(e.target.value)} placeholder="Ex: 3, 2, 1" onKeyDown={e=>e.key==="Enter"&&!chShow&&checkChallenge()}
            style={{flex:1,padding:"10px",background:C.card,border:"1px solid "+C.border,borderRadius:8,color:C.text,fontSize:14,outline:"none"}} disabled={chShow}/>
          {!chShow&&<button onClick={checkChallenge} style={{padding:"10px 16px",background:C.gold,color:C.bg,border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Verifier</button>}
        </div>
        {chShow&&(<>
          <div style={{padding:"10px",background:chAnswer.trim().replace(/\s/g,"")===ch.answer.replace(/\s/g,"")?C.success+"15":C.danger+"15",borderRadius:8,marginBottom:8}}>
            <div style={{fontSize:13,fontWeight:600,color:chAnswer.trim().replace(/\s/g,"")===ch.answer.replace(/\s/g,"")?C.success:C.danger}}>{chAnswer.trim().replace(/\s/g,"")===ch.answer.replace(/\s/g,"")?"Correct !":"Incorrect — reponse : "+ch.answer}</div>
            <div style={{fontSize:12,color:C.muted,marginTop:4}}>{ch.explain}</div>
          </div>
          <button onClick={nextChallenge} style={{width:"100%",padding:"10px",background:C.gold,color:C.bg,border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Suivant</button>
        </>)}
      </div>
    </GameShell>
  );
}
