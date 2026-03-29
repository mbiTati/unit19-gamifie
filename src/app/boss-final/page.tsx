"use client";
import NavBar from "@/components/NavBar";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { TargetHit, CircleTimer, FlameStreak, XPBar, Confetti } from "@/components/GameAnimations";
import TopBar from "@/components/TopBar";

interface Q { q: string; c?: string; o: string[]; ci: number; e: string; lo: string; }

const QS: Q[] = [
  {lo:"LO1",q:"Un ADT definit :",o:["Le code Java","Les operations possibles SANS l'implementation","Le langage","La base de donnees"],ci:1,e:"ADT = QUOI (operations) sans COMMENT (implementation)."},
  {lo:"LO1",q:"LIFO signifie :",o:["Last In, First Out","List In, File Out","Linked In, First Out","Last Index, Find Object"],ci:0,e:"LIFO = dernier entre, premier sorti. Principe du Stack."},
  {lo:"LO1",q:"Dijkstra utilise quelle structure ?",o:["Stack","Queue FIFO","Priority Queue","ArrayList"],ci:2,e:"Dijkstra choisit le sommet le plus proche -> Priority Queue."},
  {lo:"LO1",q:"BFS explore un graphe :",o:["En profondeur","En largeur (niveau par niveau)","Aleatoirement","Du plus lourd"],ci:1,e:"Breadth-First = largeur. Utilise une Queue FIFO."},
  {lo:"LO1",q:"Bubble Sort vs Quick Sort pour n=10000 :",o:["Identiques","Bubble ~770x plus lent","Quick ~770x plus lent","Ca depend"],ci:1,e:"O(n^2) vs O(n log n) -> ~100M vs ~130K comparaisons."},
  {lo:"LO2",q:"INVARIANT en notation imperative signifie :",o:["Variable constante","Propriete TOUJOURS vraie","Type de boucle","Exception"],ci:1,e:"Propriete qui reste vraie entre chaque operation."},
  {lo:"LO2",q:"L'encapsulation permet de :",o:["Accelerer le code","Changer l'implementation sans affecter le client","Supprimer les bugs","Compiler plus vite"],ci:1,e:"Avantage principal : changement transparent."},
  {lo:"LO2",q:"En Java, interface correspond a :",o:["Une classe","Un ADT (specification)","Un package","Un test"],ci:1,e:"Interface = ADT : operations sans implementation."},
  {lo:"LO3",q:"HashMap.get(key) complexite ?",o:["O(n)","O(log n)","O(1) en moyenne","O(n^2)"],ci:2,e:"Hash function -> acces direct O(1) en moyenne."},
  {lo:"LO3",q:"@BeforeEach en JUnit 5 :",o:["Execute une seule fois","Execute avant CHAQUE test","Execute apres chaque test","Ignore le test"],ci:1,e:"Setup avant chaque methode @Test."},
  {lo:"LO3",q:"assertThrows sert a :",o:["Lancer une exception","Verifier qu'une exception EST lancee","Ignorer les erreurs","Remplacer try-catch"],ci:1,e:"Verifie que le code lance l'exception attendue."},
  {lo:"LO3",c:"for(int i=0;i<n;i++)\n  for(int j=0;j<n;j++)\n    sum += i+j;",q:"Complexite ?",o:["O(n)","O(n log n)","O(n^2)","O(2n)"],ci:2,e:"Deux boucles imbriquees -> n x n = O(n^2)."},
  {lo:"LO3",q:"Inorder sur un BST donne :",o:["Elements aleatoires","Elements TRIES","La racine d'abord","Les feuilles d'abord"],ci:1,e:"Inorder (G-R-D) sur BST = elements tries."},
  {lo:"LO3",q:"finally s'execute :",o:["Seulement si exception","Seulement sans exception","TOUJOURS","Jamais"],ci:2,e:"Toujours, meme avec return. Ideal pour fermer des ressources."},
  {lo:"LO4",q:"O(n log n) pour n=1M =",o:["1 million","~20 millions","1 milliard","Impossible"],ci:1,e:"10^6 x 20 = 20 millions."},
  {lo:"LO4",q:"Algo O(n^2) prend 1s pour n=1000. Pour n=2000 ?",o:["2s","4s","8s","16s"],ci:1,e:"O(n^2) : n x 2 => temps x 4."},
  {lo:"LO4",q:"Deux facons de mesurer l'efficacite :",o:["Lignes de code","Analyse Big O + benchmark","CPU + RAM","Vitesse internet"],ci:1,e:"Theorique (Big O) + pratique (System.nanoTime())."},
  {lo:"LO4",q:"Trade-off ArrayList vs LinkedList :",o:["Pas de difference","ArrayList: get O(1) / LinkedList: add O(1)","ArrayList obsolete","LinkedList plus rapide"],ci:1,e:"Trade-off classique : acces rapide vs insertion rapide."},
  {lo:"LO4",q:"Independence d'implementation =",o:["Coder sans IDE","Le client fonctionne avec toute implementation","Pas de librairies","Coder seul"],ci:1,e:"Programmer contre l'interface -> changer librement l'implementation."},
  {lo:"LO4",q:"Quel principe Java incarne ca ?",o:["class","interface","abstract","enum"],ci:1,e:"'Program to an interface, not an implementation'."},
];

function shuffle<T>(a:T[]):T[]{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b}

const BG="#0B1120",CARD="#111827",BORDER="#1E3A5F",TEXT="#E2E8F0",MUTED="#94A3B8",GREEN="#16A34A",RED="#DC2626",ORANGE="#F97316";
const LO_C:any={"LO1":"#7C3AED","LO2":"#0891B2","LO3":"#F97316","LO4":"#D97706"};

export default function BossFinal(){
  const[started,setStarted]=useState(false);
  const[questions]=useState(()=>shuffle(QS).slice(0,15));
  const[idx,setIdx]=useState(0);
  const[score,setScore]=useState(0);
  const[sel,setSel]=useState(null as number|null);
  const[show,setShow]=useState(false);
  const[streak,setStreak]=useState(0);
  const[maxStreak,setMaxStreak]=useState(0);
  const[timeLeft,setTimeLeft]=useState(240);
  const[timerId,setTimerId]=useState(null as any);
  const[qStart,setQStart]=useState(0);
  const[respTime,setRespTime]=useState(0);
  const[showTarget,setShowTarget]=useState(false);
  const[showConfetti,setShowConfetti]=useState(false);

  const start=useCallback(()=>{
    setStarted(true);setIdx(0);setScore(0);setSel(null);setShow(false);setStreak(0);setMaxStreak(0);setTimeLeft(240);setShowConfetti(false);setShowTarget(false);
    setQStart(Date.now());
    if(timerId)clearInterval(timerId);
    const id=setInterval(()=>setTimeLeft(t=>{if(t<=1){clearInterval(id);return 0}return t-1}),1000);
    setTimerId(id);
  },[timerId]);

  const answer=(i:number)=>{
    if(show)return;
    const elapsed=Date.now()-qStart;
    setRespTime(elapsed);setSel(i);setShow(true);setShowTarget(true);
    if(i===questions[idx].ci){
      const timeB=elapsed<3000?5:elapsed<6000?3:0;
      const streakB=streak>=4?10:streak>=2?5:0;
      setScore(s=>s+10+timeB+streakB);
      setStreak(s=>{const n=s+1;setMaxStreak(m=>Math.max(m,n));return n});
    }else{setStreak(0)}
  };

  const next=()=>{setIdx(i=>i+1);setSel(null);setShow(false);setShowTarget(false);setQStart(Date.now())};

  const finished=started&&(timeLeft<=0||idx>=questions.length);
  useEffect(()=>{if(finished&&timerId){clearInterval(timerId);const maxP=questions.length*25;if(score>=maxP*0.9)setShowConfetti(true)}},[finished]);

  if(!started)return(
    <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"2rem 1rem"}}>
      <NavBar/>
      <div style={{padding:"8px 16px",borderBottom:"1px solid "+BORDER}}><Link href="/" style={{fontSize:12,color:MUTED,textDecoration:"none"}}>Retour accueil</Link></div>
      <div style={{maxWidth:600,margin:"0 auto",textAlign:"center",paddingTop:"2rem"}}>
        <div style={{fontSize:14,color:RED,fontWeight:600,letterSpacing:3,textTransform:"uppercase"}}>Boss final</div>
        <h1 style={{fontSize:32,fontWeight:800,color:TEXT,margin:"0.5rem 0"}}>Unit 19</h1>
        <p style={{color:MUTED,fontSize:15,marginBottom:8}}>15 questions — LO1 a LO4</p>
        <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:24,flexWrap:"wrap"}}>
          {[{l:"4 min",c:RED},{l:"Bonus vitesse",c:ORANGE},{l:"Streak flamme",c:"#7C3AED"},{l:"Cible precision",c:"#0891B2"}].map((s,i)=>(
            <div key={i} style={{padding:"5px 12px",background:s.c+"15",border:"1px solid "+s.c+"30",borderRadius:8,fontSize:11,color:s.c,fontWeight:600}}>{s.l}</div>
          ))}
        </div>
        <button onClick={start} style={{padding:"14px 40px",background:"linear-gradient(135deg,"+RED+","+ORANGE+")",color:"white",border:"none",borderRadius:12,fontSize:20,fontWeight:700,cursor:"pointer"}}>Commencer</button>
      </div>
    </div>
  );

  if(finished){
    const maxP=questions.length*25;const pct=Math.round(score/maxP*100);
    const grade=pct>=90?"S":pct>=75?"A":pct>=60?"B":pct>=40?"C":"D";
    const gc=pct>=75?GREEN:pct>=50?ORANGE:RED;
    return(
      <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"3rem 1rem"}}>
      <NavBar/>
        <Confetti active={showConfetti}/>
        <div style={{maxWidth:500,margin:"0 auto",textAlign:"center"}}>
          <div style={{fontSize:100,fontWeight:800,color:gc,lineHeight:1}}>{grade}</div>
          <div style={{fontSize:28,fontWeight:600,color:TEXT,margin:"0.5rem 0"}}>{score} points</div>
          <XPBar current={score} max={maxP} color={gc}/>
          <div style={{fontSize:13,color:MUTED,marginTop:12}}>Serie max : {maxStreak} | Temps restant : {timeLeft}s</div>
          {pct>=90&&<div style={{marginTop:12,fontSize:16,fontWeight:700,color:"#FBBF24"}}>Score parfait !</div>}
          <div style={{marginTop:24,display:"flex",gap:12,justifyContent:"center"}}>
            <Link href="/" style={{padding:"10px 20px",border:"1px solid "+BORDER,borderRadius:8,background:CARD,color:MUTED,fontWeight:600,textDecoration:"none"}}>Accueil</Link>
            <button onClick={()=>setStarted(false)} style={{padding:"10px 20px",background:RED,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Rejouer</button>
          </div>
        </div>
      </div>
    );
  }

  const q=questions[idx];const min=Math.floor(timeLeft/60);const sec=timeLeft%60;
  return(
    <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
      <NavBar/>
      <div style={{maxWidth:650,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:13,color:MUTED}}>{idx+1}/{questions.length}</span>
            <span style={{fontSize:11,padding:"2px 8px",borderRadius:4,fontWeight:600,background:(LO_C[q.lo]||ORANGE)+"20",color:LO_C[q.lo]||ORANGE}}>{q.lo}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:14,fontWeight:700,color:timeLeft<30?RED:MUTED}}>{min}:{String(sec).padStart(2,"0")}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <FlameStreak streak={streak}/>
            <div style={{textAlign:"right"}}><div style={{fontSize:18,fontWeight:800,color:ORANGE}}>{score}</div><div style={{fontSize:9,color:MUTED}}>pts</div></div>
          </div>
        </div>
        <XPBar current={idx} max={questions.length} color={RED}/>
        <div style={{marginTop:14}}>
          {q.c&&<div style={{background:"#0D1117",borderRadius:8,padding:"10px 14px",marginBottom:10}}><pre style={{fontSize:13,color:"#A5F3FC",fontFamily:"Consolas,monospace",margin:0,whiteSpace:"pre-wrap"}}>{q.c}</pre></div>}
          <p style={{fontSize:16,fontWeight:600,marginBottom:12}}>{q.q}</p>
        </div>
        <div style={{display:"grid",gap:8}}>
          {q.o.map((o,i)=>{let bg=CARD,bd=BORDER;if(show){if(i===q.ci){bg=GREEN+"20";bd=GREEN}else if(i===sel){bg=RED+"20";bd=RED}}
            return <button key={i} onClick={()=>answer(i)} disabled={show} style={{padding:"10px 14px",border:"2px solid "+bd,borderRadius:8,background:bg,cursor:show?"default":"pointer",textAlign:"left",fontSize:14,color:TEXT,transition:"all 0.15s"}}>{o}</button>})}
        </div>
        {show&&(<div style={{marginTop:12}}>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <div style={{flex:1}}>
              <div style={{padding:"8px 12px",background:(sel===q.ci?GREEN:RED)+"15",borderRadius:8,fontSize:13,color:sel===q.ci?GREEN:RED,border:"1px solid "+(sel===q.ci?GREEN:RED)+"30"}}>{q.e}</div>
              {sel===q.ci&&streak>=3&&<div style={{marginTop:4,fontSize:11,color:ORANGE,fontWeight:600}}>Streak +{streak>=4?10:5}</div>}
              {sel===q.ci&&respTime<3000&&<div style={{fontSize:11,color:"#7C3AED",fontWeight:600}}>Speed +5</div>}
            </div>
            <div style={{flexShrink:0}}><TargetHit timeMs={respTime} show={showTarget}/></div>
          </div>
          <button onClick={next} style={{marginTop:10,width:"100%",padding:"10px",background:"linear-gradient(135deg,"+RED+","+ORANGE+")",color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>{idx+1<questions.length?"Suivant":"Resultats"}</button>
        </div>)}
      </div>
    </div>
  );
}
