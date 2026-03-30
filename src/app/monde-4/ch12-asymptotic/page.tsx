"use client";
import { markStepComplete } from "@/lib/progressTracker";
import { useAuth } from "@/components/AuthProvider";
import CommentWidget from "@/components/CommentWidget";
import QuizEngine from "@/components/QuizEngine";
import Link from "next/link";
import { useState, useEffect } from "react";
import TopBar from "@/components/TopBar";

const BG="#0B1120",CARD="#111827",BORDER="#1E3A5F",TEXT="#E2E8F0",MUTED="#94A3B8",GREEN="#16A34A",RED="#DC2626",ORANGE="#F97316",AMBER="#D97706",PURPLE="#7C3AED";

// ─── GAME 1: Rank Complexities ───
const RANK_ROUNDS=[
  {items:["O(n²)","O(1)","O(n)","O(log n)"],correct:["O(1)","O(log n)","O(n)","O(n²)"],hint:"Du plus rapide au plus lent"},
  {items:["O(n!)","O(n log n)","O(2ⁿ)","O(n³)"],correct:["O(n log n)","O(n³)","O(2ⁿ)","O(n!)"],hint:"Attention aux exponentielles !"},
  {items:["O(√n)","O(n)","O(1)","O(log n)"],correct:["O(1)","O(log n)","O(√n)","O(n)"],hint:"√n est entre log n et n"},
];

// ─── GAME 2: Code → Complexity ───
const CODE_QS=[
  {code:"for (int i = 0; i < n; i++) {\n  sum += arr[i];\n}",answer:"O(n)",options:["O(1)","O(n)","O(n²)","O(log n)"],c:1,e:"Une seule boucle de 0 à n → linéaire O(n)."},
  {code:"for (int i = 0; i < n; i++)\n  for (int j = 0; j < n; j++)\n    matrix[i][j] = 0;",answer:"O(n²)",options:["O(n)","O(n²)","O(2n)","O(n log n)"],c:1,e:"Deux boucles imbriquées de 0 à n → O(n × n) = O(n²)."},
  {code:"for (int i = 1; i < n; i *= 2) {\n  System.out.println(i);\n}",answer:"O(log n)",options:["O(n)","O(n²)","O(log n)","O(2ⁿ)"],c:2,e:"i est multiplié par 2 → log₂(n) itérations → O(log n)."},
  {code:"int x = arr[0];\nreturn x + 42;",answer:"O(1)",options:["O(1)","O(n)","O(log n)","O(n²)"],c:0,e:"Accès direct par index + opération constante → O(1)."},
  {code:"for (int i = 0; i < n; i++)\n  for (int j = i; j < n; j++)\n    // ...",answer:"O(n²)",options:["O(n)","O(n²)","O(n/2)","O(n log n)"],c:1,e:"Boucle interne commence à i : n + (n-1) + ... + 1 = n(n+1)/2 → O(n²)."},
  {code:"mergeSort(arr, 0, n-1);\n// divise en 2, trie, fusionne",answer:"O(n log n)",options:["O(n)","O(n²)","O(n log n)","O(log n)"],c:2,e:"Merge Sort divise en 2 (log n niveaux) et fusionne (n par niveau) → O(n log n)."},
  {code:"HashMap<String,Integer> map = ...;\nInteger val = map.get(\"key\");",answer:"O(1)",options:["O(1)","O(n)","O(log n)","O(n²)"],c:0,e:"HashMap.get() = hash + accès direct → O(1) en moyenne."},
  {code:"// Recherche binaire\nwhile (low <= high) {\n  int mid = (low+high)/2;\n  if (arr[mid]==target) return mid;\n  else if (arr[mid]<target) low=mid+1;\n  else high=mid-1;\n}",answer:"O(log n)",options:["O(n)","O(1)","O(log n)","O(n²)"],c:2,e:"Divise l'espace de recherche par 2 à chaque itération → O(log n)."},
];

// ─── GAME 3: Big O Quiz ───
const QUIZ=[
  {q:"Que signifie O(n) ?",o:["Programme prend n secondes","Temps croît proportionnellement à n","Exactement n opérations","Programme rapide"],c:1,e:"O(n) = tendance de croissance, pas temps exact. Si n double, temps double."},
  {q:"Si O(n²) prend 1s pour n=1000, combien pour n=2000 ?",o:["2 secondes","4 secondes","8 secondes","1000 secondes"],c:1,e:"n double → temps ×4 (car (2n)² = 4n²)."},
  {q:"Que signifie 'asymptotique' ?",o:["Exact pour toutes tailles","Comportement quand n → ∞","Meilleur cas","Moyenne"],c:1,e:"Asymptotique = comportement pour de très grandes valeurs de n."},
  {q:"Pourquoi O(2n) = O(n) ?",o:["Erreur mathématique","Constantes ignorées en Big O","2n = n","Simplification"],c:1,e:"Big O ignore les constantes multiplicatives : même tendance de croissance."},
  {q:"Différence entre O et Ω ?",o:["O = pire cas, Ω = meilleur cas","O = borne supérieure, Ω = borne inférieure","Identiques","O = temps, Ω = espace"],c:1,e:"O = upper bound (au pire). Ω = lower bound (au mieux). Θ = tight bound."},
  {q:"Tri optimal par comparaison ?",o:["O(n)","O(n log n)","O(n²)","O(log n)"],c:1,e:"O(n log n) est la borne inférieure théorique pour tri par comparaison."},
  {q:"O(n log n) avec n=1 million ≈",o:["1 million","20 millions","1 billion","6 milliards"],c:1,e:"10⁶ × log₂(10⁶) ≈ 10⁶ × 20 = 20 millions."},
  {q:"Algo A: O(n²) vs Algo B: O(n log n), pour n=1M ?",o:["A: ~1000s, B: ~20s","A: ~1M secondes, B: ~20s","Égalité","Impossible à dire"],c:1,e:"A: 10¹² ops (~11 jours!). B: 2×10⁷ ops (~20s). Big O COMPTE pour grands n!"},
];

// ─── GAME 4: Growth Calculator ───
const GROWTHS=[
  {name:"O(1)",fn:(n:number)=>1,color:"#16A34A"},
  {name:"O(log n)",fn:(n:number)=>Math.log2(n),color:"#0891B2"},
  {name:"O(n)",fn:(n:number)=>n,color:"#3B82F6"},
  {name:"O(n log n)",fn:(n:number)=>n*Math.log2(n),color:"#F97316"},
  {name:"O(n²)",fn:(n:number)=>n*n,color:"#DC2626"},
];

type Phase="menu"|"rank"|"code"|"quiz"|"calculator";

export default function Ch12Game(){
  const { user: authUser, loading: authLoading } = useAuth();
  if (authLoading) return <div style={{ minHeight: "100vh", background: "#0a0f1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>Chargement...</div>;
  if (!authUser) { if (typeof window !== "undefined") window.location.href = "/login"; return null; }

  // Track visit
  useEffect(() => { markStepComplete("ch12", "visited"); }, []);


  const[phase,setPhase]=useState<Phase>("menu");
  // Rank
  const[rankIdx,setRankIdx]=useState(0);const[rankScore,setRankScore]=useState(0);
  const[userRank,setUserRank]=useState<string[]>([]);const[rankShow,setRankShow]=useState(false);
  // Code
  const[codeIdx,setCodeIdx]=useState(0);const[codeScore,setCodeScore]=useState(0);
  const[codeSel,setCodeSel]=useState<number|null>(null);const[codeShow,setCodeShow]=useState(false);
  // Quiz
  const[qIdx,setQIdx]=useState(0);const[qScore,setQScore]=useState(0);
  const[sel,setSel]=useState<number|null>(null);const[show,setShow]=useState(false);
  // Calculator
  const[calcN,setCalcN]=useState(1000);

  const back=<button onClick={()=>setPhase("menu")} style={{fontSize:13,color:MUTED,background:"none",border:"none",cursor:"pointer",marginBottom:12}}>← Retour</button>;

  if(phase==="menu")return(
    <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"2rem 1rem"}}>
      <TopBar/>
      <CommentWidget chapter="ch12-asymptotic"/>
      <div style={{maxWidth:700,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:"2rem"}}>
          <div style={{fontSize:13,color:AMBER,fontWeight:600,letterSpacing:2,textTransform:"uppercase"}}>Monde 4 — Chapitre 12</div>
          <h1 style={{fontSize:28,fontWeight:700,margin:"0.5rem 0"}}>Analyse Asymptotique & Big O</h1>
          <p style={{color:MUTED,fontSize:15}}>Critère P6 — O, Ω, Θ, complexité temporelle</p>
          <a href="/fiches/Ch12_Fiche_Memo_Asymptotic.pdf" target="_blank" rel="noopener" style={{display:"inline-block",marginTop:8,padding:"6px 14px",background:"#1E293B",border:"1px solid #1E3A5F",borderRadius:8,fontSize:12,color:"#94A3B8",textDecoration:"none"}}>Fiche memo PDF</a>
        </div>
        <div style={{display:"grid",gap:14}}>
          {[
            {p:"rank" as Phase,t:"Classer les complexités",d:"Ordonnez du plus rapide au plus lent",c:AMBER},
            {p:"code" as Phase,t:"Code → Complexité",d:"8 snippets : identifiez la complexité Big O",c:PURPLE},
            {p:"calculator" as Phase,t:"Calculateur de croissance",d:"Comparez visuellement O(1), O(log n), O(n), O(n²)",c:GREEN},
            {p:"quiz" as Phase,t:"Quiz Big O",d:"8 questions théoriques sur l'analyse asymptotique",c:ORANGE},
          ].map(g=>(
            <button key={g.p} onClick={()=>{setPhase(g.p);if(g.p==="rank"){setRankIdx(0);setRankScore(0);setUserRank([]);setRankShow(false)}if(g.p==="code"){setCodeIdx(0);setCodeScore(0);setCodeSel(null);setCodeShow(false)}if(g.p==="quiz"){setQIdx(0);setQScore(0);setSel(null);setShow(false)}if(g.p==="calculator")setCalcN(1000)}}
              style={{padding:"1.2rem",border:`2px solid ${BORDER}`,borderRadius:12,background:CARD,cursor:"pointer",textAlign:"left"}}>
              <div style={{fontSize:18,fontWeight:600,color:g.c}}>{g.t}</div>
              <div style={{fontSize:13,color:MUTED,marginTop:4}}>{g.d}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── RANK GAME ───
  if(phase==="rank"){
    if(rankIdx>=RANK_ROUNDS.length){const p=Math.round(rankScore/RANK_ROUNDS.length*100);return(<div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"3rem 1rem"}}><div style={{maxWidth:500,margin:"0 auto",textAlign:"center"}}><div style={{fontSize:64,fontWeight:800,color:p>=70?GREEN:ORANGE}}>{rankScore}/{RANK_ROUNDS.length}</div><button onClick={()=>setPhase("menu")} style={{marginTop:16,padding:"10px 24px",background:AMBER,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Retour</button></div></div>)}
    const round=RANK_ROUNDS[rankIdx];
    const addToRank=(item:string)=>{if(userRank.includes(item)||rankShow)return;const nr=[...userRank,item];setUserRank(nr);if(nr.length===round.items.length){setRankShow(true);if(JSON.stringify(nr)===JSON.stringify(round.correct))setRankScore(s=>s+1)}};
    return(
      <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
      <TopBar/>
        <div style={{maxWidth:600,margin:"0 auto"}}>
          {back}
          <div style={{fontSize:13,color:MUTED,marginBottom:8}}>Round {rankIdx+1}/{RANK_ROUNDS.length}</div>
          <p style={{fontSize:16,fontWeight:600,marginBottom:4}}>Classez du plus RAPIDE au plus LENT :</p>
          <p style={{fontSize:13,color:MUTED,marginBottom:12}}>{round.hint}</p>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
            {round.items.map(item=>(<button key={item} onClick={()=>addToRank(item)} disabled={userRank.includes(item)||rankShow} style={{padding:"8px 16px",borderRadius:8,border:`2px solid ${userRank.includes(item)?MUTED:AMBER}`,background:userRank.includes(item)?BORDER:CARD,color:userRank.includes(item)?MUTED:TEXT,fontWeight:600,cursor:userRank.includes(item)||rankShow?"default":"pointer",fontSize:14}}>{item}</button>))}
          </div>
          <div style={{padding:"12px",background:CARD,borderRadius:10,border:`1px solid ${BORDER}`,minHeight:50}}>
            <div style={{fontSize:12,color:MUTED,marginBottom:6}}>Votre classement (rapide → lent) :</div>
            <div style={{display:"flex",gap:6}}>{userRank.map((item,i)=>{const isCorrect=rankShow&&item===round.correct[i];const isWrong=rankShow&&item!==round.correct[i];return(<div key={i} style={{padding:"6px 12px",borderRadius:6,background:isCorrect?GREEN+"20":isWrong?RED+"20":AMBER+"20",border:`1px solid ${isCorrect?GREEN:isWrong?RED:AMBER}`,fontSize:13,fontWeight:600,color:isCorrect?GREEN:isWrong?RED:AMBER}}>{i+1}. {item}</div>)})}</div>
          </div>
          {rankShow&&<>
            {JSON.stringify(userRank)===JSON.stringify(round.correct)?<div style={{marginTop:10,padding:"10px",background:GREEN+"15",borderRadius:8,color:GREEN,fontSize:13}}>Correct !</div>:<div style={{marginTop:10,padding:"10px",background:RED+"15",borderRadius:8,color:RED,fontSize:13}}>Incorrect — Correct : {round.correct.join(" → ")}</div>}
            <button onClick={()=>{setRankIdx(i=>i+1);setUserRank([]);setRankShow(false)}} style={{marginTop:10,width:"100%",padding:"10px",background:AMBER,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Suivant →</button>
          </>}
        </div>
      </div>
    );
  }

  // ─── CODE → COMPLEXITY ───
  if(phase==="code"){
    if(codeIdx>=CODE_QS.length){const p=Math.round(codeScore/CODE_QS.length*100);return(<div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"3rem 1rem"}}><div style={{maxWidth:500,margin:"0 auto",textAlign:"center"}}><div style={{fontSize:64,fontWeight:800,color:p>=70?GREEN:ORANGE}}>{codeScore}/{CODE_QS.length}</div><div style={{fontSize:20,fontWeight:600}}>{p}%</div><button onClick={()=>setPhase("menu")} style={{marginTop:16,padding:"10px 24px",background:AMBER,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Retour</button></div></div>)}
    const q=CODE_QS[codeIdx];
    return(
      <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
      <TopBar/>
        <div style={{maxWidth:650,margin:"0 auto"}}>
          {back}
          <div style={{fontSize:13,color:MUTED,marginBottom:8}}>{codeIdx+1}/{CODE_QS.length} | Score: {codeScore}</div>
          <div style={{height:4,background:BORDER,borderRadius:2,marginBottom:16}}><div style={{height:4,background:PURPLE,borderRadius:2,width:`${(codeIdx+1)/CODE_QS.length*100}%`}}/></div>
          <div style={{background:"#0D1117",borderRadius:10,padding:"1rem",marginBottom:12}}><pre style={{fontSize:13,color:"#A5F3FC",fontFamily:"Consolas,monospace",margin:0,whiteSpace:"pre-wrap"}}>{q.code}</pre></div>
          <p style={{fontSize:15,fontWeight:600,marginBottom:12}}>Quelle complexité ?</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{q.options.map((o,i)=>{let bg=CARD,bd=BORDER;if(codeShow){if(i===q.c){bg=GREEN+"20";bd=GREEN}else if(i===codeSel){bg=RED+"20";bd=RED}}return(<button key={i} onClick={()=>{if(codeShow)return;setCodeSel(i);setCodeShow(true);if(i===q.c)setCodeScore(s=>s+1)}} disabled={codeShow} style={{padding:"12px",border:`2px solid ${bd}`,borderRadius:8,background:bg,cursor:codeShow?"default":"pointer",fontSize:15,fontWeight:600,color:TEXT,textAlign:"center"}}>{o}</button>)})}</div>
          {codeShow&&<><div style={{marginTop:10,padding:"10px 14px",background:GREEN+"15",borderRadius:8,fontSize:13,color:GREEN}}>{q.e}</div><button onClick={()=>{setCodeIdx(i=>i+1);setCodeSel(null);setCodeShow(false)}} style={{marginTop:10,width:"100%",padding:"10px",background:PURPLE,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Suivant →</button></>}
        </div>
      </div>
    );
  }

  // ─── CALCULATOR ───
  if(phase==="calculator"){
    const ns=[10,100,1000,10000,100000,1000000];
    return(
      <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
      <TopBar/>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          {back}
          <h2 style={{fontSize:22,fontWeight:700,color:GREEN,marginBottom:4}}>Calculateur de croissance</h2>
          <p style={{color:MUTED,fontSize:13,marginBottom:16}}>Comparez le nombre d'opérations pour différentes valeurs de n :</p>
          <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
            {ns.map(n=>(<button key={n} onClick={()=>setCalcN(n)} style={{padding:"6px 14px",borderRadius:20,fontSize:13,fontWeight:600,cursor:"pointer",background:calcN===n?AMBER:"transparent",color:calcN===n?"white":MUTED,border:`1px solid ${calcN===n?"transparent":BORDER}`}}>n={n.toLocaleString()}</button>))}
          </div>
          <div style={{background:CARD,borderRadius:10,border:`1px solid ${BORDER}`,overflow:"hidden"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",padding:"10px 14px",borderBottom:`1px solid ${BORDER}`,fontSize:12,fontWeight:600,color:MUTED}}>
              <span>Complexité</span><span>Opérations</span><span>Visualisation</span>
            </div>
            {GROWTHS.map(g=>{
              const ops=Math.min(g.fn(calcN),1e12);
              const maxOps=GROWTHS[GROWTHS.length-1].fn(calcN);
              const pct=Math.min((Math.log10(ops+1)/Math.log10(maxOps+1))*100,100);
              const format=(n:number)=>{if(n>=1e9)return(n/1e9).toFixed(1)+"B";if(n>=1e6)return(n/1e6).toFixed(1)+"M";if(n>=1e3)return(n/1e3).toFixed(1)+"K";return Math.round(n).toString()};
              return(
                <div key={g.name} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",padding:"10px 14px",borderBottom:`1px solid ${BORDER}`,alignItems:"center"}}>
                  <span style={{fontWeight:600,color:g.color,fontSize:14}}>{g.name}</span>
                  <span style={{fontSize:13,fontFamily:"Consolas,monospace"}}>{format(ops)}</span>
                  <div style={{height:8,background:BORDER,borderRadius:4,overflow:"hidden"}}><div style={{height:8,background:g.color,borderRadius:4,width:`${Math.max(pct,2)}%`,transition:"width 0.3s"}}/></div>
                </div>
              );
            })}
          </div>
          <div style={{marginTop:12,padding:"10px 14px",background:CARD,borderRadius:8,fontSize:12,color:MUTED}}>
            Pour n={calcN.toLocaleString()} : O(n²) fait {GROWTHS[4].fn(calcN).toLocaleString()} opérations contre {Math.round(GROWTHS[2].fn(calcN)).toLocaleString()} pour O(n). C'est {Math.round(GROWTHS[4].fn(calcN)/GROWTHS[2].fn(calcN))}× plus !
          </div>
        </div>
      </div>
    );
  }

  // ─── QUIZ ───
    // Quiz (rendered by QuizEngine with XP bar, target, streak)
  return(
    <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
      <TopBar/>
      <div style={{maxWidth:650,margin:"0 auto"}}>
        {back}
        <QuizEngine questions={QUIZ} color={GREEN}/>
        <button onClick={()=>setPhase("menu")} style={{marginTop:16,padding:"10px 20px",background:CARD,color:MUTED,border:"1px solid "+BORDER,borderRadius:8,fontSize:12,cursor:"pointer"}}>Retour au menu</button>
      </div>
    </div>
  );
}
