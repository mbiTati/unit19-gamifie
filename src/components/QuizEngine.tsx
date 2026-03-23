"use client";
import { useState, useRef } from "react";
import { TargetHit, FlameStreak, XPBar } from "@/components/GameAnimations";

const CARD="#111827",BORDER="#1E3A5F",TEXT="#E2E8F0",MUTED="#94A3B8",GREEN="#16A34A",RED="#DC2626";

interface QuizQ { q: string; o: string[]; c: number; e: string; }

export default function QuizEngine({ questions, color="#16A34A", title="Quiz" }: { questions: QuizQ[]; color?: string; title?: string }) {
  const[idx,setIdx]=useState(0);
  const[score,setScore]=useState(0);
  const[sel,setSel]=useState(null as number|null);
  const[show,setShow]=useState(false);
  const[streak,setStreak]=useState(0);
  const[qStart]=useState(()=>Date.now());
  const qStartRef=useRef(Date.now());
  const[respTime,setRespTime]=useState(0);
  const[showTarget,setShowTarget]=useState(false);

  const answer=(i:number)=>{
    if(show)return;
    const elapsed=Date.now()-qStartRef.current;
    setRespTime(elapsed);
    setSel(i);setShow(true);setShowTarget(true);
    if(i===questions[idx].c){
      setScore(s=>s+1);
      setStreak(s=>s+1);
    }else{setStreak(0)}
  };

  const next=()=>{
    setIdx(i=>i+1);setSel(null);setShow(false);setShowTarget(false);
    qStartRef.current=Date.now();
  };

  // Finished
  if(idx>=questions.length){
    const pct=Math.round(score/questions.length*100);
    return(
      <div>
        <XPBar current={score} max={questions.length} color={pct>=70?GREEN:color}/>
        <div style={{textAlign:"center",marginTop:16}}>
          <div style={{fontSize:56,fontWeight:800,color:pct>=70?GREEN:color}}>{score}/{questions.length}</div>
          <div style={{fontSize:14,color:MUTED}}>{pct}%{pct===100?" — Parfait !":pct>=80?" — Excellent":pct>=60?" — Bien":""}</div>
        </div>
      </div>
    );
  }

  const q=questions[idx];
  return(
    <div>
      {/* Header: progress + streak */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <span style={{fontSize:13,color:MUTED}}>{idx+1}/{questions.length}</span>
        <FlameStreak streak={streak}/>
        <span style={{fontSize:14,fontWeight:700,color}}>{score} pts</span>
      </div>
      <XPBar current={idx} max={questions.length} color={color}/>

      {/* Question */}
      <p style={{fontSize:16,fontWeight:600,marginTop:12,marginBottom:12,whiteSpace:"pre-wrap"}}>{q.q}</p>

      {/* Options */}
      <div style={{display:"grid",gap:8}}>
        {q.o.map((o,i)=>{
          let bg=CARD,bd=BORDER;
          if(show){if(i===q.c){bg=GREEN+"20";bd=GREEN}else if(i===sel){bg=RED+"20";bd=RED}}
          return(
            <button key={i} onClick={()=>answer(i)} disabled={show}
              style={{padding:"10px 14px",border:"2px solid "+bd,borderRadius:8,background:bg,cursor:show?"default":"pointer",textAlign:"left",fontSize:14,color:TEXT,transition:"all 0.15s"}}>
              {o}
            </button>
          );
        })}
      </div>

      {/* Feedback + Target */}
      {show&&(
        <div style={{marginTop:10}}>
          <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
            <div style={{flex:1,padding:"8px 12px",background:(sel===q.c?GREEN:RED)+"15",borderRadius:8,fontSize:13,color:sel===q.c?GREEN:RED}}>
              {q.e}
            </div>
            <TargetHit timeMs={respTime} show={showTarget}/>
          </div>
          <button onClick={next} style={{marginTop:10,width:"100%",padding:"10px",background:color,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>
            {idx+1<questions.length?"Suivant":"Resultats"}
          </button>
        </div>
      )}
    </div>
  );
}
