"use client";
import Link from "next/link";
import { useState } from "react";
import TopBar from "@/components/TopBar";

const BG="#0B1120",CARD="#111827",BORDER="#1E3A5F",TEXT="#E2E8F0",MUTED="#94A3B8",GREEN="#16A34A",RED="#DC2626",ORANGE="#F97316",AMBER="#D97706",BLUE="#3B82F6";

// ─── GAME 1: Benchmark Simulator ───
const BENCH_SCENARIOS=[
  {name:"ArrayList.get(i) vs LinkedList.get(i)",n:100000,
    algos:[{name:"ArrayList.get()",time:1,color:GREEN,bigO:"O(1)"},{name:"LinkedList.get()",time:50000,color:RED,bigO:"O(n)"}],
    explain:"ArrayList accède directement par index. LinkedList parcourt du début."},
  {name:"HashMap.get(key) vs ArrayList.contains()",n:100000,
    algos:[{name:"HashMap.get()",time:1,color:GREEN,bigO:"O(1)"},{name:"ArrayList.contains()",time:50000,color:RED,bigO:"O(n)"}],
    explain:"HashMap utilise le hash pour accéder directement. ArrayList parcourt tout."},
  {name:"Arrays.sort() vs Bubble Sort",n:10000,
    algos:[{name:"Arrays.sort() (TimSort)",time:130000,color:GREEN,bigO:"O(n log n)"},{name:"Bubble Sort",time:100000000,color:RED,bigO:"O(n²)"}],
    explain:"TimSort = O(n log n). Bubble Sort = O(n²). Pour n=10000, la différence est ÉNORME."},
];

// ─── GAME 2: Quiz ───
const QUIZ=[
  {q:"Deux façons de mesurer l'efficacité :",o:["Big O et Benchmark","Java et Python","Temps et compilateur","CPU et RAM"],c:0,e:"Big O = analyse théorique. Benchmark = mesure pratique en ms."},
  {q:"System.nanoTime() en Java sert à :",o:["Mesurer la mémoire","Mesurer le temps d'exécution précis","Compter les opérations","Optimiser le code"],c:1,e:"nanoTime() donne le temps en nanosecondes. Parfait pour benchmarker."},
  {q:"Pourquoi faire un warm-up avant un benchmark Java ?",o:["Pour chauffer le CPU","Le JIT compiler optimise le code après quelques exécutions","Convention","Pour vider la mémoire"],c:1,e:"Le JIT (Just-In-Time) compiler de la JVM optimise le bytecode après plusieurs passages."},
  {q:"Le facteur le PLUS impactant sur l'efficacité :",o:["Le matériel","Le langage","La complexité algorithmique","Le compilateur"],c:2,e:"L'algorithme est le facteur principal. Un O(n²) sera lent même sur un super-ordinateur."},
  {q:"Le Garbage Collector en Java peut :",o:["Accélérer le programme","Causer des pauses imprévisibles","Optimiser l'algorithme","Réduire la complexité"],c:1,e:"Le GC libère la mémoire mais provoque des pauses. Impact sur les benchmarks."},
  {q:"Pour benchmarker correctement, il faut :",o:["Exécuter 1 seule fois","Exécuter PLUSIEURS fois et faire la MOYENNE","Utiliser System.out.println","Compter les lignes de code"],c:1,e:"Une seule exécution n'est pas fiable (cache, GC, etc.). La moyenne lisse les variations."},
];

type Phase="menu"|"bench"|"quiz";

export default function Ch13Game(){
  const[phase,setPhase]=useState<Phase>("menu");
  const[benchIdx,setBenchIdx]=useState(0);const[benchRunning,setBenchRunning]=useState(false);const[benchProgress,setBenchProgress]=useState<number[]>([]);const[benchDone,setBenchDone]=useState(false);
  const[qIdx,setQIdx]=useState(0);const[qScore,setQScore]=useState(0);const[sel,setSel]=useState<number|null>(null);const[show,setShow]=useState(false);

  const back=<button onClick={()=>setPhase("menu")} style={{fontSize:13,color:MUTED,background:"none",border:"none",cursor:"pointer",marginBottom:12}}>← Retour</button>;

  const runBench=async()=>{
    setBenchRunning(true);setBenchDone(false);const b=BENCH_SCENARIOS[benchIdx];
    const maxT=Math.max(...b.algos.map(a=>a.time));
    setBenchProgress(b.algos.map(()=>0));
    for(let step=0;step<=60;step++){
      setBenchProgress(b.algos.map(a=>Math.min((step/60)*(maxT/a.time)*100,100)));
      await new Promise(r=>setTimeout(r,40));
    }
    setBenchProgress(b.algos.map(()=>100));setBenchRunning(false);setBenchDone(true);
  };

  if(phase==="menu")return(
    <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"2rem 1rem"}}>
      <TopBar/>
      <div style={{maxWidth:700,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:"2rem"}}>
          <div style={{fontSize:13,color:AMBER,fontWeight:600,letterSpacing:2,textTransform:"uppercase"}}>Monde 4 — Chapitre 13</div>
          <h1 style={{fontSize:28,fontWeight:700,margin:"0.5rem 0"}}>Mesurer l'Efficacité</h1>
          <p style={{color:MUTED,fontSize:15}}>Critère P7 — Benchmark, runtime, resources</p>
          <a href="/fiches/Ch13_Fiche_Memo_Efficiency.pdf" target="_blank" rel="noopener" style={{display:"inline-block",marginTop:8,padding:"6px 14px",background:"#1E293B",border:"1px solid #1E3A5F",borderRadius:8,fontSize:12,color:"#94A3B8",textDecoration:"none"}}>Fiche memo PDF</a>
        </div>
        <div style={{display:"grid",gap:14}}>
          <button onClick={()=>{setPhase("bench");setBenchIdx(0);setBenchProgress([]);setBenchDone(false);setBenchRunning(false)}}
            style={{padding:"1.2rem",border:`2px solid ${BORDER}`,borderRadius:12,background:CARD,cursor:"pointer",textAlign:"left"}}>
            <div style={{fontSize:18,fontWeight:600,color:BLUE}}>Benchmark Simulé</div>
            <div style={{fontSize:13,color:MUTED,marginTop:4}}>3 scénarios : comparez les performances visuellement</div>
          </button>
          <button onClick={()=>{setPhase("quiz");setQIdx(0);setQScore(0);setSel(null);setShow(false)}}
            style={{padding:"1.2rem",border:`2px solid ${BORDER}`,borderRadius:12,background:CARD,cursor:"pointer",textAlign:"left"}}>
            <div style={{fontSize:18,fontWeight:600,color:GREEN}}>Quiz Efficacité</div>
            <div style={{fontSize:13,color:MUTED,marginTop:4}}>6 questions : benchmark, JIT, GC, System.nanoTime()</div>
          </button>
        </div>
      </div>
    </div>
  );

  if(phase==="bench"){
    const b=BENCH_SCENARIOS[benchIdx];
    return(
      <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
      <TopBar/>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          {back}
          <div style={{display:"flex",gap:8,marginBottom:16}}>
            {BENCH_SCENARIOS.map((_,i)=>(<button key={i} onClick={()=>{setBenchIdx(i);setBenchProgress([]);setBenchDone(false);setBenchRunning(false)}} style={{padding:"6px 14px",borderRadius:20,fontSize:12,fontWeight:600,cursor:"pointer",background:benchIdx===i?BLUE:"transparent",color:benchIdx===i?"white":MUTED,border:`1px solid ${benchIdx===i?"transparent":BORDER}`}}>Test {i+1}</button>))}
          </div>
          <h3 style={{fontSize:18,fontWeight:700,color:BLUE,marginBottom:4}}>{b.name}</h3>
          <p style={{fontSize:12,color:MUTED,marginBottom:12}}>n = {b.n.toLocaleString()} éléments</p>
          <div style={{display:"grid",gap:12,marginBottom:16}}>
            {b.algos.map((a,i)=>(<div key={i}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}>
                <span style={{color:a.color,fontWeight:600}}>{a.name} ({a.bigO})</span>
              </div>
              <div style={{height:24,background:BORDER,borderRadius:6,overflow:"hidden"}}>
                <div style={{height:24,background:a.color,borderRadius:6,width:`${benchProgress[i]||0}%`,transition:"width 0.1s"}}/>
              </div>
            </div>))}
          </div>
          {benchDone&&<div style={{padding:"10px 14px",background:GREEN+"15",borderRadius:8,fontSize:13,color:GREEN,marginBottom:12}}>{b.explain}</div>}
          <button onClick={runBench} disabled={benchRunning} style={{width:"100%",padding:"10px",background:benchRunning?BORDER:BLUE,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:benchRunning?"default":"pointer"}}>{benchRunning?"En cours...":"▶ Lancer le benchmark"}</button>
        </div>
      </div>
    );
  }

  // Quiz
  if(qIdx>=QUIZ.length){const p=Math.round(qScore/QUIZ.length*100);return(<div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"3rem 1rem"}}><div style={{maxWidth:500,margin:"0 auto",textAlign:"center"}}><div style={{fontSize:64,fontWeight:800,color:p>=70?GREEN:ORANGE}}>{qScore}/{QUIZ.length}</div><button onClick={()=>setPhase("menu")} style={{marginTop:16,padding:"10px 24px",background:AMBER,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Retour</button></div></div>)}
  const q=QUIZ[qIdx];
  return(
    <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
      <TopBar/>
      <div style={{maxWidth:650,margin:"0 auto"}}>
        {back}
        <div style={{fontSize:13,color:MUTED,marginBottom:8}}>{qIdx+1}/{QUIZ.length} | Score: {qScore}</div>
        <div style={{height:4,background:BORDER,borderRadius:2,marginBottom:16}}><div style={{height:4,background:GREEN,borderRadius:2,width:`${(qIdx+1)/QUIZ.length*100}%`}}/></div>
        <p style={{fontSize:16,fontWeight:600,marginBottom:12}}>{q.q}</p>
        <div style={{display:"grid",gap:8}}>{q.o.map((o,i)=>{let bg=CARD,bd=BORDER;if(show){if(i===q.c){bg=GREEN+"20";bd=GREEN}else if(i===sel){bg=RED+"20";bd=RED}}return(<button key={i} onClick={()=>{if(show)return;setSel(i);setShow(true);if(i===q.c)setQScore(s=>s+1)}} disabled={show} style={{padding:"10px 14px",border:`2px solid ${bd}`,borderRadius:8,background:bg,cursor:show?"default":"pointer",textAlign:"left",fontSize:14,color:TEXT}}>{o}</button>)})}</div>
        {show&&<><div style={{marginTop:10,padding:"10px 14px",background:GREEN+"15",borderRadius:8,fontSize:13,color:GREEN}}>{q.e}</div><button onClick={()=>{setQIdx(i=>i+1);setSel(null);setShow(false)}} style={{marginTop:10,width:"100%",padding:"10px",background:GREEN,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Suivant →</button></>}
      </div>
    </div>
  );
}
