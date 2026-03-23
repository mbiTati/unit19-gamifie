"use client";
import Link from "next/link";
import { useState } from "react";

const BG="#0B1120",CARD="#111827",BORDER="#1E3A5F",TEXT="#E2E8F0",MUTED="#94A3B8",GREEN="#16A34A",RED="#DC2626",ORANGE="#F97316",PURPLE="#7C3AED",TEAL="#0891B2",AMBER="#D97706",BLUE="#3B82F6";

// ─── GAME 1: Trade-off Balance ───
const TRADEOFFS=[
  {name:"ArrayList vs LinkedList",left:{label:"ArrayList",pros:["Accès O(1)","Cache-friendly","Moins de mémoire"],cons:["Insertion milieu O(n)","Resize coûteux"]},
    right:{label:"LinkedList",pros:["Insertion O(1) (avec ref)","Pas de resize"],cons:["Accès O(n)","Plus de mémoire (pointeurs)"]},
    question:"Pour un système avec beaucoup de LECTURES par index :",answer:"left",explain:"ArrayList : O(1) pour get(index). LinkedList doit parcourir → O(n)."},
  {name:"HashMap vs TreeMap",left:{label:"HashMap",pros:["get/put O(1) moyen","Plus rapide"],cons:["Pas d'ordre","Pire cas O(n) (collisions)"]},
    right:{label:"TreeMap",pros:["Clés triées","O(log n) garanti"],cons:["Plus lent que HashMap","Plus de mémoire"]},
    question:"Pour afficher les étudiants triés par nom :",answer:"right",explain:"TreeMap maintient les clés triées automatiquement. HashMap nécessiterait un tri séparé."},
  {name:"Temps vs Espace",left:{label:"Plus de mémoire",pros:["Cache/mémoisation","Accès rapide","Pré-calcul"],cons:["RAM limitée","Coût mémoire"]},
    right:{label:"Plus de calcul",pros:["Peu de mémoire","Scalable"],cons:["Plus lent","CPU intensif"]},
    question:"Pour un calcul de Fibonacci(50) appelé 1000 fois :",answer:"left",explain:"Mémoisation : stocker les résultats en mémoire pour éviter les recalculs exponentiels."},
  {name:"Récursion vs Itération",left:{label:"Récursif",pros:["Code élégant","Naturel pour arbres/graphes"],cons:["Stack overflow","O(n) mémoire pile"]},
    right:{label:"Itératif",pros:["O(1) mémoire pile","Pas de stack overflow"],cons:["Code parfois complexe","Moins intuitif pour arbres"]},
    question:"Pour parcourir une liste de 1 million d'éléments :",answer:"right",explain:"Itératif évite le stack overflow. 1M d'appels récursifs dépasserait la taille de la pile."},
];

// ─── GAME 2: Benchmark Simulator ───
const BENCHMARKS=[
  {name:"Recherche dans 10 000 éléments",algos:[
    {name:"Recherche linéaire",bigO:"O(n)",time:5000,color:RED},
    {name:"Recherche binaire (trié)",bigO:"O(log n)",time:14,color:GREEN},
    {name:"HashMap.get()",bigO:"O(1)",time:1,color:BLUE},
  ]},
  {name:"Tri de 100 000 éléments",algos:[
    {name:"Bubble Sort",bigO:"O(n²)",time:10000000,color:RED},
    {name:"Quick Sort",bigO:"O(n log n)",time:1700000,color:GREEN},
    {name:"Merge Sort",bigO:"O(n log n)",time:1700000,color:BLUE},
  ]},
  {name:"Insertion de 50 000 éléments",algos:[
    {name:"ArrayList (fin)",bigO:"O(1) amorti",time:50000,color:GREEN},
    {name:"ArrayList (début)",bigO:"O(n)",time:1250000000,color:RED},
    {name:"LinkedList (début)",bigO:"O(1)",time:50000,color:BLUE},
  ]},
];

// ─── GAME 3: Quiz ───
const QUIZ=[
  {q:"Trade-off temps-espace signifie :",o:["On peut optimiser les deux à la fois","Gagner en temps coûte souvent de l'espace (et vice versa)","Temps et espace sont indépendants","Le trade-off n'existe pas en Java"],c:1,e:"C'est un compromis : plus de mémoire = plus rapide, ou moins de mémoire = plus lent."},
  {q:"HashMap sacrifie ___ pour gagner en ___ :",o:["Temps pour espace","Espace pour temps d'accès O(1)","Ordre pour vitesse","Rien"],c:1,e:"HashMap utilise plus de mémoire (tableau + buckets) pour obtenir un accès O(1)."},
  {q:"Mémoisation = :",o:["Compression de données","Stocker les résultats pour éviter les recalculs","Paralléliser le code","Trier les données"],c:1,e:"Sacrifier de la mémoire pour éviter de recalculer. Trade-off classique espace → temps."},
  {q:"Pourquoi ArrayList est plus cache-friendly que LinkedList ?",o:["ArrayList est plus rapide","Les éléments sont contigus en mémoire (accès séquentiel rapide)","ArrayList utilise moins de mémoire","LinkedList est déprécié"],c:1,e:"Éléments contigus = le CPU précharge les voisins dans le cache. LinkedList a des nœuds éparpillés en mémoire."},
  {q:"Pour des données qui changent rarement mais sont lues souvent :",o:["LinkedList","ArrayList ou HashMap","TreeMap","Stack"],c:1,e:"Lecture fréquente = accès rapide prioritaire. ArrayList O(1) en lecture, HashMap O(1) par clé."},
  {q:"Le parallélisme améliore :",o:["La complexité Big O","Le temps réel sur multi-cœur","La correction du code","La mémoire"],c:1,e:"Le parallélisme divise le travail entre cœurs. Big O reste le même, mais le temps réel diminue."},
];

type Phase="menu"|"balance"|"benchmark"|"quiz";

export default function Ch14Game(){
  const[phase,setPhase]=useState<Phase>("menu");
  // Balance
  const[balIdx,setBalIdx]=useState(0);const[balChoice,setBalChoice]=useState<"left"|"right"|null>(null);const[balShow,setBalShow]=useState(false);const[balScore,setBalScore]=useState(0);
  // Benchmark
  const[benchIdx,setBenchIdx]=useState(0);const[benchRunning,setBenchRunning]=useState(false);const[benchProgress,setBenchProgress]=useState<number[]>([]);
  // Quiz
  const[qIdx,setQIdx]=useState(0);const[qScore,setQScore]=useState(0);const[sel,setSel]=useState<number|null>(null);const[show,setShow]=useState(false);

  const back=<button onClick={()=>setPhase("menu")} style={{fontSize:13,color:MUTED,background:"none",border:"none",cursor:"pointer",marginBottom:12}}>← Retour</button>;

  if(phase==="menu")return(
    <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"2rem 1rem"}}>
      <div style={{padding:"8px 16px",borderBottom:"1px solid #1E3A5F"}}><Link href="/" style={{fontSize:12,color:"#94A3B8",textDecoration:"none"}}>Retour accueil</Link></div>
            <div style={{maxWidth:700,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:"2rem"}}>
          <div style={{fontSize:13,color:AMBER,fontWeight:600,letterSpacing:2,textTransform:"uppercase"}}>Monde 4 — Chapitre 14</div>
          <h1 style={{fontSize:28,fontWeight:700,margin:"0.5rem 0"}}>Trade-offs & Benchmarks</h1>
          <p style={{color:MUTED,fontSize:15}}>Critère M5/D4 — Compromis et mesure d'efficacité</p>
          <a href="/fiches/Ch14_Fiche_Memo_Tradeoffs.pdf" target="_blank" rel="noopener" style={{display:"inline-block",marginTop:8,padding:"6px 14px",background:"#1E293B",border:"1px solid #1E3A5F",borderRadius:8,fontSize:12,color:"#94A3B8",textDecoration:"none"}}>Fiche memo PDF</a>
        </div>
        <div style={{display:"grid",gap:14}}>
          {[
            {p:"balance" as Phase,t:"Trade-off Balance",d:"4 scénarios : choisissez la bonne structure pour chaque cas",c:AMBER},
            {p:"benchmark" as Phase,t:"Benchmark Simulé",d:"Comparez les performances de 3 algorithmes visuellement",c:BLUE},
            {p:"quiz" as Phase,t:"Quiz Trade-offs",d:"6 questions sur les compromis temps/espace",c:GREEN},
          ].map(g=>(
            <button key={g.p} onClick={()=>{setPhase(g.p);if(g.p==="balance"){setBalIdx(0);setBalChoice(null);setBalShow(false);setBalScore(0)}if(g.p==="benchmark"){setBenchIdx(0);setBenchRunning(false);setBenchProgress([])}if(g.p==="quiz"){setQIdx(0);setQScore(0);setSel(null);setShow(false)}}}
              style={{padding:"1.2rem",border:`2px solid ${BORDER}`,borderRadius:12,background:CARD,cursor:"pointer",textAlign:"left"}}>
              <div style={{fontSize:18,fontWeight:600,color:g.c}}>{g.t}</div>
              <div style={{fontSize:13,color:MUTED,marginTop:4}}>{g.d}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── BALANCE ───
  if(phase==="balance"){
    if(balIdx>=TRADEOFFS.length){const p=Math.round(balScore/TRADEOFFS.length*100);return(<div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"3rem 1rem"}}><div style={{maxWidth:500,margin:"0 auto",textAlign:"center"}}><div style={{fontSize:64,fontWeight:800,color:p>=70?GREEN:ORANGE}}>{balScore}/{TRADEOFFS.length}</div><button onClick={()=>setPhase("menu")} style={{marginTop:16,padding:"10px 24px",background:AMBER,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Retour</button></div></div>)}
    const t=TRADEOFFS[balIdx];
    return(
      <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          {back}
          <div style={{fontSize:13,color:MUTED,marginBottom:8}}>Scénario {balIdx+1}/{TRADEOFFS.length}</div>
          <h3 style={{fontSize:18,fontWeight:700,color:AMBER,marginBottom:12}}>{t.name}</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
            {(["left","right"] as const).map(side=>{const s=t[side];const chosen=balChoice===side;const correct=balShow&&t.answer===side;const wrong=balShow&&balChoice===side&&t.answer!==side;
              return(
                <div key={side} onClick={()=>{if(balShow)return;setBalChoice(side);setBalShow(true);if(side===t.answer)setBalScore(s2=>s2+1)}}
                  style={{padding:"14px",border:`2px solid ${correct?GREEN:wrong?RED:chosen?AMBER:BORDER}`,borderRadius:10,background:correct?GREEN+"15":wrong?RED+"15":CARD,cursor:balShow?"default":"pointer"}}>
                  <div style={{textAlign:"center",marginBottom:8}}><div style={{fontWeight:700,fontSize:15}}>{s.label}</div></div>
                  <div style={{fontSize:12}}><div style={{color:GREEN,marginBottom:4}}> {s.pros.join(" • ")}</div><div style={{color:RED}}>Incorrect — {s.cons.join(" • ")}</div></div>
                </div>
              );
            })}
          </div>
          <div style={{padding:"12px",background:AMBER+"15",borderRadius:8,textAlign:"center",marginBottom:12}}>
            <div style={{fontSize:14,fontWeight:600,color:AMBER}}> {t.question}</div>
          </div>
          {balShow&&(
            <>
              <div style={{padding:"10px 14px",background:balChoice===t.answer?GREEN+"15":RED+"15",borderRadius:8,fontSize:13,color:balChoice===t.answer?GREEN:RED}}>
                {balChoice===t.answer?"Correct !":"Incorrect — "+t.explain}
                {balChoice===t.answer&&<span> {t.explain}</span>}
              </div>
              <button onClick={()=>{setBalIdx(i=>i+1);setBalChoice(null);setBalShow(false)}} style={{marginTop:10,width:"100%",padding:"10px",background:AMBER,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Suivant →</button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ─── BENCHMARK ───
  if(phase==="benchmark"){
    const bench=BENCHMARKS[benchIdx];
    const maxTime=Math.max(...bench.algos.map(a=>a.time));
    const runBench=async()=>{
      setBenchRunning(true);setBenchProgress(bench.algos.map(()=>0));
      for(let step=0;step<=50;step++){
        setBenchProgress(bench.algos.map(a=>Math.min((step/50)*(maxTime/a.time)*100,100)));
        await new Promise(r=>setTimeout(r,60));
      }
      setBenchProgress(bench.algos.map(()=>100));setBenchRunning(false);
    };
    const fmt=(n:number)=>{if(n>=1e9)return(n/1e9).toFixed(1)+"B";if(n>=1e6)return(n/1e6).toFixed(1)+"M";if(n>=1e3)return(n/1e3).toFixed(0)+"K";return n.toString()};
    return(
      <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          {back}
          <div style={{display:"flex",gap:8,marginBottom:16}}>
            {BENCHMARKS.map((_,i)=>(
              <button key={i} onClick={()=>{setBenchIdx(i);setBenchProgress([]);setBenchRunning(false)}}
                style={{padding:"6px 14px",borderRadius:20,fontSize:12,fontWeight:600,cursor:"pointer",background:benchIdx===i?BLUE:"transparent",color:benchIdx===i?"white":MUTED,border:`1px solid ${benchIdx===i?"transparent":BORDER}`}}>Test {i+1}</button>
            ))}
          </div>
          <h3 style={{fontSize:18,fontWeight:700,color:BLUE,marginBottom:12}}>{bench.name}</h3>
          <div style={{display:"grid",gap:12,marginBottom:16}}>
            {bench.algos.map((algo,i)=>(
              <div key={i}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}>
                  <span style={{color:algo.color,fontWeight:600}}>{algo.name} ({algo.bigO})</span>
                  <span style={{color:MUTED,fontFamily:"Consolas,monospace",fontSize:11}}>{fmt(algo.time)} ops</span>
                </div>
                <div style={{height:20,background:BORDER,borderRadius:6,overflow:"hidden"}}>
                  <div style={{height:20,background:algo.color,borderRadius:6,width:`${benchProgress[i]||0}%`,transition:"width 0.1s"}}/>
                </div>
              </div>
            ))}
          </div>
          <button onClick={runBench} disabled={benchRunning}
            style={{width:"100%",padding:"10px",background:benchRunning?BORDER:BLUE,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:benchRunning?"default":"pointer"}}>{benchRunning?"En cours...":"▶ Lancer le benchmark"}</button>
        </div>
      </div>
    );
  }

  // ─── QUIZ ───
  if(qIdx>=QUIZ.length){const p=Math.round(qScore/QUIZ.length*100);return(<div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"3rem 1rem"}}><div style={{maxWidth:500,margin:"0 auto",textAlign:"center"}}><div style={{fontSize:64,fontWeight:800,color:p>=70?GREEN:ORANGE}}>{qScore}/{QUIZ.length}</div><button onClick={()=>setPhase("menu")} style={{marginTop:16,padding:"10px 24px",background:AMBER,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Retour</button></div></div>)}
  const q=QUIZ[qIdx];
  return(
    <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
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
