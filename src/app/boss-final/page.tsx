"use client";
import { useState, useCallback } from "react";

interface Q { q: string; c?: string; o: string[]; ci: number; e: string; lo: string; }

const QS: Q[] = [
  {lo:"LO1",q:"Un ADT définit :",o:["Le code Java","Les opérations possibles SANS l'implémentation","Le langage de programmation","La base de données"],ci:1,e:"ADT = QUOI (opérations) sans COMMENT (implémentation)."},
  {lo:"LO1",q:"LIFO signifie :",o:["Last In, First Out","List In, File Out","Linked In, First Out","Last Index, Find Object"],ci:0,e:"LIFO = dernier entré, premier sorti. C'est le principe du Stack."},
  {lo:"LO1",q:"Dijkstra utilise quelle structure ?",o:["Stack","Queue FIFO","Priority Queue","ArrayList"],ci:2,e:"Dijkstra choisit toujours le sommet le plus proche → Priority Queue."},
  {lo:"LO1",q:"BFS explore un graphe :",o:["En profondeur d'abord","En largeur (niveau par niveau)","Aléatoirement","Du plus lourd au plus léger"],ci:1,e:"Breadth-First = largeur. Utilise une Queue FIFO."},
  {lo:"LO1",q:"Bubble Sort vs Quick Sort pour n=10000 :",o:["Identiques","Bubble ~770x plus lent","Quick ~770x plus lent","Dépend des données"],ci:1,e:"O(n²) vs O(n log n) → ~100M vs ~130K comparaisons."},
  {lo:"LO2",q:"En notation impérative, INVARIANT signifie :",o:["Variable constante","Propriété TOUJOURS vraie","Type de boucle","Exception"],ci:1,e:"Invariant = propriété qui reste vraie entre chaque opération."},
  {lo:"LO2",q:"L'encapsulation permet de :",o:["Accélérer le code","Changer l'implémentation sans affecter le code client","Supprimer les bugs","Compiler plus vite"],ci:1,e:"C'est l'avantage principal : changement transparent."},
  {lo:"LO2",q:"En Java, interface correspond à :",o:["Une classe","Un ADT (spécification)","Un package","Un test"],ci:1,e:"Interface = ADT : définit les opérations sans implémentation."},
  {lo:"LO3",q:"HashMap.get(key) a quelle complexité ?",o:["O(n)","O(log n)","O(1) en moyenne","O(n²)"],ci:2,e:"Hash function → accès direct O(1) en moyenne."},
  {lo:"LO3",q:"@BeforeEach en JUnit 5 :",o:["Exécuté une seule fois","Exécuté avant CHAQUE test","Exécuté après chaque test","Ignore le test"],ci:1,e:"@BeforeEach = setup avant chaque méthode @Test."},
  {lo:"LO3",q:"assertThrows sert à :",o:["Lancer une exception","Vérifier qu'une exception EST lancée","Ignorer les erreurs","Remplacer try-catch"],ci:1,e:"assertThrows(Class, lambda) vérifie que le code lance cette exception."},
  {lo:"LO3",c:"for(int i=0;i<n;i++)\n  for(int j=0;j<n;j++)\n    sum += i+j;",q:"Complexité ?",o:["O(n)","O(n log n)","O(n²)","O(2n)"],ci:2,e:"Deux boucles imbriquées de 0 à n → n × n = O(n²)."},
  {lo:"LO3",q:"Inorder sur un BST donne :",o:["Éléments aléatoires","Éléments TRIÉS","La racine d'abord","Les feuilles d'abord"],ci:1,e:"Inorder (Gauche-Racine-Droite) sur BST = éléments triés."},
  {lo:"LO3",q:"finally s'exécute :",o:["Seulement si exception","Seulement si pas d'exception","TOUJOURS","Jamais"],ci:2,e:"finally s'exécute toujours — idéal pour fermer des ressources."},
  {lo:"LO4",q:"O(n log n) pour n=1M ≈",o:["1 million","20 millions","1 milliard","Impossible"],ci:1,e:"10⁶ × log₂(10⁶) ≈ 10⁶ × 20 = 20 millions."},
  {lo:"LO4",q:"Si un algo O(n²) prend 1s pour n=1000, pour n=2000 ?",o:["2 secondes","4 secondes","8 secondes","16 secondes"],ci:1,e:"O(n²) : si n×2, temps ×4. (2000/1000)² = 4."},
  {lo:"LO4",q:"Deux façons de mesurer l'efficacité :",o:["Lignes de code + commentaires","Analyse Big O + benchmark empirique","CPU + RAM","Vitesse internet + disque dur"],ci:1,e:"Théorique (Big O) + pratique (System.nanoTime())."},
  {lo:"LO4",q:"Trade-off ArrayList vs LinkedList :",o:["Pas de différence","ArrayList: accès O(1)/insert O(n) — LinkedList: inverse","ArrayList est obsolète","LinkedList est plus rapide"],ci:1,e:"Le trade-off classique : accès rapide vs insertion rapide."},
  {lo:"LO4",q:"L'indépendance d'implémentation signifie :",o:["Coder sans IDE","Le code client fonctionne avec n'importe quelle implémentation de l'interface","Ne pas utiliser de librairies","Coder seul"],ci:1,e:"Programmer contre l'interface → changer ArrayList↔LinkedList sans casser le code."},
  {lo:"LO4",q:"Quel principe Java incarne l'indépendance ?",o:["class","interface","abstract","enum"],ci:1,e:"'Program to an interface, not an implementation' — le fondement."},
];

function shuffle<T>(a:T[]):T[]{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b}

export default function BossFinal(){
  const[started,setStarted]=useState(false);
  const[questions]=useState(()=>shuffle(QS).slice(0,15));
  const[idx,setIdx]=useState(0);
  const[score,setScore]=useState(0);
  const[sel,setSel]=useState<number|null>(null);
  const[show,setShow]=useState(false);
  const[streak,setStreak]=useState(0);
  const[maxStreak,setMaxStreak]=useState(0);
  const[timeLeft,setTimeLeft]=useState(0);
  const[timerId,setTimerId]=useState<ReturnType<typeof setInterval>|null>(null);

  const start=useCallback(()=>{
    setStarted(true);setIdx(0);setScore(0);setSel(null);setShow(false);setStreak(0);setMaxStreak(0);setTimeLeft(240);
    const id=setInterval(()=>{setTimeLeft(t=>{if(t<=1){clearInterval(id);return 0}return t-1})},1000);
    setTimerId(id);
  },[]);

  if(!started)return(
    <div style={{maxWidth:600,margin:"0 auto",padding:"3rem 1rem",fontFamily:"'Segoe UI',system-ui,sans-serif",textAlign:"center" as const}}>
      <div style={{fontSize:80,lineHeight:1}}>&#x1F451;</div>
      <div style={{fontSize:14,color:"#DC2626",fontWeight:600,letterSpacing:3,textTransform:"uppercase" as const,marginTop:8}}>Boss final</div>
      <h1 style={{fontSize:36,fontWeight:800,color:"#1B2A4A",margin:"0.5rem 0"}}>Unit 19 complet</h1>
      <p style={{color:"#64748B",fontSize:16,marginBottom:8}}>15 questions couvrant LO1 à LO4</p>
      <p style={{color:"#F97316",fontSize:14,fontWeight:600,marginBottom:24}}>4 minutes — bonus streak — toutes les notions</p>
      <button onClick={start} style={{padding:"14px 40px",background:"linear-gradient(135deg,#DC2626,#F97316)",color:"white",border:"none",borderRadius:12,fontSize:20,fontWeight:700,cursor:"pointer"}}>Affronter le boss</button>
    </div>
  );

  if(timeLeft<=0||idx>=questions.length){
    const pct=questions.length>0?Math.round(score/(questions.length*10)*100):0;
    const grade=pct>=90?"S":pct>=75?"A":pct>=60?"B":pct>=40?"C":"D";
    const gc=pct>=75?"#16A34A":pct>=50?"#F97316":"#DC2626";
    if(timerId)clearInterval(timerId);
    return(
      <div style={{maxWidth:500,margin:"0 auto",padding:"3rem 1rem",fontFamily:"'Segoe UI',system-ui,sans-serif",textAlign:"center" as const}}>
        <div style={{fontSize:100,fontWeight:800,color:gc,lineHeight:1}}>{grade}</div>
        <div style={{fontSize:28,fontWeight:600,color:"#1B2A4A",margin:"0.5rem 0"}}>{score} points</div>
        <div style={{fontSize:14,color:"#64748B"}}>Série max : {maxStreak} | Temps restant : {timeLeft}s</div>
        <div style={{marginTop:24,display:"flex",gap:12,justifyContent:"center"}}>
          <button onClick={()=>setStarted(false)} style={{padding:"10px 20px",border:"1px solid #DC2626",borderRadius:8,background:"white",color:"#DC2626",fontWeight:600,cursor:"pointer"}}>Menu</button>
          <button onClick={start} style={{padding:"10px 20px",background:"#DC2626",color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Rejouer</button>
        </div>
      </div>
    );
  }

  const q=questions[idx];
  const min=Math.floor(timeLeft/60);const sec=timeLeft%60;

  return(
    <div style={{maxWidth:650,margin:"0 auto",padding:"1.5rem 1rem",fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
        <span style={{fontSize:12,color:"#64748B"}}>{idx+1}/{questions.length}</span>
        <span style={{fontSize:12,background:q.lo==="LO1"?"#EEEDFE":q.lo==="LO2"?"#E1F5EE":q.lo==="LO3"?"#FAECE7":"#FAEEDA",color:q.lo==="LO1"?"#534AB7":q.lo==="LO2"?"#0F6E56":q.lo==="LO3"?"#993C1D":"#854F0B",padding:"2px 8px",borderRadius:4,fontWeight:600}}>{q.lo}</span>
        <span style={{fontSize:12,fontWeight:600,color:timeLeft<30?"#DC2626":"#64748B"}}>{min}:{sec.toString().padStart(2,"0")}</span>
        <span style={{fontSize:12,color:"#DC2626",fontWeight:600}}>{score}pts {streak>=3?`x${streak}`:""}</span>
      </div>
      <div style={{height:4,background:"#E2E8F0",borderRadius:2,marginBottom:16}}><div style={{height:4,background:"linear-gradient(90deg,#DC2626,#F97316)",borderRadius:2,width:`${(idx+1)/questions.length*100}%`}}/></div>
      {q.c&&<div style={{background:"#1E293B",borderRadius:8,padding:"10px 14px",marginBottom:12}}><pre style={{fontSize:13,color:"#E2E8F0",fontFamily:"Consolas,monospace",margin:0,whiteSpace:"pre-wrap" as const}}>{q.c}</pre></div>}
      <p style={{fontSize:16,fontWeight:600,color:"#1B2A4A",marginBottom:12}}>{q.q}</p>
      <div style={{display:"grid",gap:8}}>
        {q.o.map((o,i)=>{let bg="white",bd="#E2E8F0";if(show){if(i===q.ci){bg="#F0FDF4";bd="#16A34A"}else if(i===sel){bg="#FEF2F2";bd="#DC2626"}}return<button key={i} onClick={()=>{if(show)return;setSel(i);setShow(true);if(i===q.ci){const bonus=streak>=2?15:10;setScore(s=>s+bonus);setStreak(s=>{const n=s+1;setMaxStreak(m=>Math.max(m,n));return n})}else{setStreak(0)}}} disabled={show} style={{padding:"10px 14px",border:`2px solid ${bd}`,borderRadius:8,background:bg,cursor:show?"default":"pointer",textAlign:"left" as const,fontSize:14}}>{o}</button>})}
      </div>
      {show&&<><div style={{marginTop:10,padding:"8px 12px",background:"#F0FDF4",borderRadius:8,fontSize:13,color:"#166534",border:"1px solid #86EFAC"}}>{q.e}</div><button onClick={()=>{setIdx(i=>i+1);setSel(null);setShow(false)}} style={{marginTop:10,width:"100%",padding:"10px",background:"linear-gradient(135deg,#DC2626,#F97316)",color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>{idx+1<questions.length?"Suivant →":"Résultats"}</button></>}
    </div>
  );
}
