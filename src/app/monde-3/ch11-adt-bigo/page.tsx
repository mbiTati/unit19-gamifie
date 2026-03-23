"use client";
import { useState } from "react";

const BG="#0B1120",CARD="#111827",BORDER="#1E3A5F",TEXT="#E2E8F0",MUTED="#94A3B8",GREEN="#16A34A",RED="#DC2626",ORANGE="#F97316",PURPLE="#7C3AED",TEAL="#0891B2";

// ─── GAME 1: ADT Problem Solver (M4) ───
const SCENARIOS=[
  {problem:"Un cinéma veut gérer la file d'attente des clients",context:"Les clients arrivent et sont servis dans l'ordre d'arrivée. Premier arrivé = premier servi.",correct:"Queue",options:["Stack","Queue","HashMap","ArrayList"],explain:"File d'attente = FIFO. Le premier client arrivé est le premier servi. Queue est l'ADT naturel.",ops:"enqueue(client), dequeue(), front(), isEmpty()"},
  {problem:"Une pharmacie doit rechercher des médicaments par nom",context:"Les pharmaciens tapent le nom du médicament et doivent trouver immédiatement le stock et le prix.",correct:"HashMap",options:["LinkedList","ArrayList","HashMap","Stack"],explain:"Recherche par clé (nom) → HashMap donne un accès O(1). ArrayList nécessiterait un parcours O(n).",ops:"get(nomMedicament), put(nom, infos), containsKey(nom)"},
  {problem:"Un IT support traite les tickets par priorité",context:"Les tickets urgents doivent être traités avant les tickets normaux, quelle que soit l'heure d'arrivée.",correct:"PriorityQueue",options:["Queue","PriorityQueue","Stack","ArrayList"],explain:"PriorityQueue trie automatiquement par priorité. Un simple Queue traiterait dans l'ordre d'arrivée (pas adapté).",ops:"add(ticket), poll(), peek(), compareTo()"},
  {problem:"Un navigateur web gère l'historique (bouton retour)",context:"Quand on clique 'Retour', on revient à la page PRÉCÉDENTE. La dernière page visitée est la première à revenir.",correct:"Stack",options:["Queue","Stack","HashMap","TreeMap"],explain:"Historique = LIFO (Last In, First Out). La dernière page visitée est au sommet du Stack.",ops:"push(page), pop(), peek()"},
  {problem:"Un système de réservation doit vérifier les doublons",context:"Un employé ne peut pas réserver deux fois la même salle au même créneau. Il faut vérifier rapidement si une réservation existe déjà.",correct:"HashSet",options:["ArrayList","LinkedList","HashSet","Queue"],explain:"HashSet vérifie l'existence en O(1) et refuse les doublons automatiquement. ArrayList.contains() serait O(n).",ops:"add(reservation), contains(reservation), remove()"},
];

// ─── GAME 2: Complexity Analyzer (D3) ───
const CODE_ANALYSIS=[
  {title:"Recherche linéaire",code:"for (int i = 0; i < list.size(); i++) {\n    if (list.get(i).equals(target))\n        return i;\n}\nreturn -1;",correct:"O(n)",options:["O(1)","O(n)","O(n²)","O(log n)"],explain:"Parcourt la liste élément par élément. Pire cas = n éléments → O(n)."},
  {title:"HashMap.get(key)",code:"String value = map.get(\"clé123\");",correct:"O(1)",options:["O(1)","O(n)","O(log n)","O(n²)"],explain:"Hash function → index direct → O(1) en moyenne. Pire cas O(n) si beaucoup de collisions."},
  {title:"Tri d'un ArrayList",code:"Collections.sort(listeEtudiants);\n// TimSort (Merge + Insertion)",correct:"O(n log n)",options:["O(n)","O(n log n)","O(n²)","O(log n)"],explain:"Collections.sort() utilise TimSort = O(n log n). C'est le tri optimal par comparaison."},
  {title:"Recherche dans un BST équilibré",code:"TreeMap<String, Integer> map = ...;\nInteger val = map.get(\"Alice\");",correct:"O(log n)",options:["O(1)","O(n)","O(log n)","O(n²)"],explain:"TreeMap utilise un arbre rouge-noir (BST équilibré). Chaque comparaison élimine la moitié → O(log n)."},
  {title:"Double boucle imbriquée",code:"for (int i = 0; i < n; i++)\n    for (int j = 0; j < n; j++)\n        if (arr[i] == arr[j] && i != j)\n            return true;",correct:"O(n²)",options:["O(n)","O(n log n)","O(n²)","O(2n)"],explain:"Deux boucles imbriquées de 0 à n → n × n = O(n²)."},
  {title:"LinkedList.get(index)",code:"LinkedList<String> list = ...;\nString element = list.get(500);",correct:"O(n)",options:["O(1)","O(n)","O(log n)","O(n²)"],explain:"LinkedList parcourt depuis le début (ou la fin) → O(n). Contrairement à ArrayList.get() qui est O(1)."},
  {title:"ArrayList.add(element) en fin",code:"ArrayList<String> list = ...;\nlist.add(\"nouveau\");",correct:"O(1) amorti",options:["O(1) amorti","O(n)","O(log n)","O(n²)"],explain:"Normalement O(1). Mais quand le tableau interne est plein → copie en O(n). En moyenne (amorti) = O(1)."},
  {title:"Queue.poll()",code:"Queue<String> queue = new LinkedList<>();\nString first = queue.poll();",correct:"O(1)",options:["O(1)","O(n)","O(log n)","O(n²)"],explain:"poll() retire le premier élément. LinkedList stocke une référence au head → O(1)."},
];

// ─── GAME 3: Quick Quiz ───
const QUIZ=[
  {q:"M4 : Quel ADT pour un système 'Undo' dans un éditeur de texte ?",o:["Queue","Stack","HashMap","Set"],c:1,e:"Undo = revenir à l'action précédente = LIFO. Stack est parfait."},
  {q:"M4 : Quel ADT pour un cache de pages web (clé=URL, valeur=contenu) ?",o:["ArrayList","Stack","HashMap","Queue"],c:2,e:"Accès rapide par clé (URL) → HashMap O(1)."},
  {q:"D3 : Si on remplace ArrayList par LinkedList, quelle opération RALENTIT ?",o:["add(element) en fin","get(index)","size()","isEmpty()"],c:1,e:"get(index) passe de O(1) avec ArrayList à O(n) avec LinkedList."},
  {q:"D3 : Si on remplace ArrayList par HashMap, quelle opération ACCÉLÈRE ?",o:["get(index)","contains(element)","add en fin","iterator()"],c:1,e:"contains() passe de O(n) avec ArrayList à O(1) avec HashMap (via containsKey)."},
];

type Phase="menu"|"solver"|"analyzer"|"quiz";

export default function Ch11Game(){
  const[phase,setPhase]=useState<Phase>("menu");
  const[sIdx,setSIdx]=useState(0);const[sSel,setSSel]=useState<string|null>(null);const[sShow,setSShow]=useState(false);const[sScore,setSScore]=useState(0);
  const[aIdx,setAIdx]=useState(0);const[aSel,setASel]=useState<number|null>(null);const[aShow,setAShow]=useState(false);const[aScore,setAScore]=useState(0);
  const[qIdx,setQIdx]=useState(0);const[qScore,setQScore]=useState(0);const[sel,setSel]=useState<number|null>(null);const[show,setShow]=useState(false);

  const back=<button onClick={()=>setPhase("menu")} style={{fontSize:13,color:MUTED,background:"none",border:"none",cursor:"pointer",marginBottom:12}}>← Retour</button>;

  if(phase==="menu")return(
    <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"2rem 1rem"}}>
      <div style={{maxWidth:700,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:"2rem"}}>
          <div style={{fontSize:13,color:ORANGE,fontWeight:600,letterSpacing:2,textTransform:"uppercase"}}>Monde 3 — Chapitre 11</div>
          <h1 style={{fontSize:28,fontWeight:700,margin:"0.5rem 0"}}>ADT résout un problème & Big O</h1>
          <p style={{color:MUTED,fontSize:15}}>Critère M4 + D3</p>
          <a href="/fiches/Ch11_Fiche_Memo_ADT_BigO.pdf" target="_blank" rel="noopener" style={{display:"inline-block",marginTop:8,padding:"6px 14px",background:"#1E293B",border:"1px solid #1E3A5F",borderRadius:8,fontSize:12,color:"#94A3B8",textDecoration:"none"}}>Fiche memo PDF</a>
        </div>
        <div style={{display:"grid",gap:14}}>
          {[
            {p:"solver" as Phase,emoji:"",t:"M4 — ADT Problem Solver",d:"5 scénarios d'entreprise : choisissez le bon ADT",c:TEAL},
            {p:"analyzer" as Phase,emoji:"",t:"D3 — Complexity Analyzer",d:"8 snippets de code Java : évaluez la complexité Big O",c:PURPLE},
            {p:"quiz" as Phase,emoji:"",t:"Quiz M4 + D3",d:"4 questions de synthèse",c:GREEN},
          ].map(g=>(
            <button key={g.p} onClick={()=>{setPhase(g.p);if(g.p==="solver"){setSIdx(0);setSSel(null);setSShow(false);setSScore(0)}if(g.p==="analyzer"){setAIdx(0);setASel(null);setAShow(false);setAScore(0)}if(g.p==="quiz"){setQIdx(0);setQScore(0);setSel(null);setShow(false)}}}
              style={{padding:"1.2rem",border:`2px solid ${BORDER}`,borderRadius:12,background:CARD,cursor:"pointer",textAlign:"left"}}>
              <div style={{fontSize:18,fontWeight:600,color:g.c}}>{g.emoji} {g.t}</div>
              <div style={{fontSize:13,color:MUTED,marginTop:4}}>{g.d}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── SOLVER (M4) ───
  if(phase==="solver"){
    if(sIdx>=SCENARIOS.length){const p=Math.round(sScore/SCENARIOS.length*100);return(<div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"3rem 1rem"}}><div style={{maxWidth:500,margin:"0 auto",textAlign:"center"}}><div style={{fontSize:64,fontWeight:800,color:p>=70?GREEN:ORANGE}}>{sScore}/{SCENARIOS.length}</div><div style={{fontSize:20,fontWeight:600}}>{p}%</div><button onClick={()=>setPhase("menu")} style={{marginTop:16,padding:"10px 24px",background:TEAL,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Retour</button></div></div>)}
    const sc=SCENARIOS[sIdx];
    return(
      <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
        <div style={{maxWidth:650,margin:"0 auto"}}>
          {back}
          <div style={{fontSize:13,color:MUTED,marginBottom:8}}>Scénario {sIdx+1}/{SCENARIOS.length} | Score: {sScore}</div>
          <div style={{padding:"14px",background:TEAL+"15",borderRadius:10,marginBottom:12}}>
            <div style={{fontSize:16,fontWeight:700,color:TEAL,marginBottom:4}}>{sc.problem}</div>
            <div style={{fontSize:13,color:MUTED}}>{sc.context}</div>
          </div>
          <p style={{fontSize:15,fontWeight:600,marginBottom:12}}>Quel ADT choisir ?</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {sc.options.map(opt=>{let bg=CARD,bd=BORDER;if(sShow){if(opt===sc.correct){bg=GREEN+"20";bd=GREEN}else if(opt===sSel){bg=RED+"20";bd=RED}}
              return(<button key={opt} onClick={()=>{if(sShow)return;setSSel(opt);setSShow(true);if(opt===sc.correct)setSScore(s=>s+1)}} disabled={sShow}
                style={{padding:"12px",border:`2px solid ${bd}`,borderRadius:8,background:bg,cursor:sShow?"default":"pointer",fontSize:14,fontWeight:600,color:TEXT,textAlign:"center"}}>{opt}</button>)})}
          </div>
          {sShow&&(
            <>
              <div style={{marginTop:10,padding:"10px 14px",background:sSel===sc.correct?GREEN+"15":RED+"15",borderRadius:8,fontSize:13,color:sSel===sc.correct?GREEN:RED}}>
                {sSel===sc.correct?" ":"Incorrect — "}{sc.explain}
              </div>
              <div style={{marginTop:6,padding:"8px 12px",background:"#0D1117",borderRadius:6,fontSize:12,color:"#A5F3FC",fontFamily:"Consolas,monospace"}}>Opérations : {sc.ops}</div>
              <button onClick={()=>{setSIdx(i=>i+1);setSSel(null);setSShow(false)}} style={{marginTop:10,width:"100%",padding:"10px",background:TEAL,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Suivant →</button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ─── ANALYZER (D3) ───
  if(phase==="analyzer"){
    if(aIdx>=CODE_ANALYSIS.length){const p=Math.round(aScore/CODE_ANALYSIS.length*100);return(<div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"3rem 1rem"}}><div style={{maxWidth:500,margin:"0 auto",textAlign:"center"}}><div style={{fontSize:64,fontWeight:800,color:p>=70?GREEN:ORANGE}}>{aScore}/{CODE_ANALYSIS.length}</div><div style={{fontSize:20,fontWeight:600}}>{p}%</div><button onClick={()=>setPhase("menu")} style={{marginTop:16,padding:"10px 24px",background:PURPLE,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Retour</button></div></div>)}
    const ca=CODE_ANALYSIS[aIdx];
    return(
      <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
        <div style={{maxWidth:650,margin:"0 auto"}}>
          {back}
          <div style={{fontSize:13,color:MUTED,marginBottom:8}}>{aIdx+1}/{CODE_ANALYSIS.length} | Score: {aScore}</div>
          <div style={{height:4,background:BORDER,borderRadius:2,marginBottom:12}}><div style={{height:4,background:PURPLE,borderRadius:2,width:`${(aIdx+1)/CODE_ANALYSIS.length*100}%`}}/></div>
          <div style={{fontSize:14,fontWeight:600,color:PURPLE,marginBottom:6}}>{ca.title}</div>
          <div style={{background:"#0D1117",borderRadius:10,padding:"12px",marginBottom:12}}>
            <pre style={{fontSize:12,color:"#A5F3FC",fontFamily:"Consolas,monospace",margin:0,whiteSpace:"pre-wrap"}}>{ca.code}</pre>
          </div>
          <p style={{fontSize:15,fontWeight:600,marginBottom:12}}>Complexité ?</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {ca.options.map((o,i)=>{let bg=CARD,bd=BORDER;if(aShow){const ci=ca.options.indexOf(ca.correct);if(i===ci){bg=GREEN+"20";bd=GREEN}else if(i===aSel){bg=RED+"20";bd=RED}}
              return(<button key={i} onClick={()=>{if(aShow)return;setASel(i);setAShow(true);if(ca.options[i]===ca.correct)setAScore(s=>s+1)}} disabled={aShow}
                style={{padding:"12px",border:`2px solid ${bd}`,borderRadius:8,background:bg,cursor:aShow?"default":"pointer",fontSize:15,fontWeight:600,color:TEXT,textAlign:"center"}}>{o}</button>)})}
          </div>
          {aShow&&<><div style={{marginTop:10,padding:"10px 14px",background:GREEN+"15",borderRadius:8,fontSize:13,color:GREEN}}>{ca.explain}</div>
            <button onClick={()=>{setAIdx(i=>i+1);setASel(null);setAShow(false)}} style={{marginTop:10,width:"100%",padding:"10px",background:PURPLE,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Suivant →</button></>}
        </div>
      </div>
    );
  }

  // ─── QUIZ ───
  if(qIdx>=QUIZ.length){const p=Math.round(qScore/QUIZ.length*100);return(<div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"3rem 1rem"}}><div style={{maxWidth:500,margin:"0 auto",textAlign:"center"}}><div style={{fontSize:64,fontWeight:800,color:p>=70?GREEN:ORANGE}}>{qScore}/{QUIZ.length}</div><button onClick={()=>setPhase("menu")} style={{marginTop:16,padding:"10px 24px",background:GREEN,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Retour</button></div></div>)}
  const q=QUIZ[qIdx];
  return(
    <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
      <div style={{maxWidth:650,margin:"0 auto"}}>
        {back}
        <div style={{fontSize:13,color:MUTED,marginBottom:8}}>{qIdx+1}/{QUIZ.length} | Score: {qScore}</div>
        <p style={{fontSize:16,fontWeight:600,marginBottom:12}}>{q.q}</p>
        <div style={{display:"grid",gap:8}}>{q.o.map((o,i)=>{let bg=CARD,bd=BORDER;if(show){if(i===q.c){bg=GREEN+"20";bd=GREEN}else if(i===sel){bg=RED+"20";bd=RED}}return(<button key={i} onClick={()=>{if(show)return;setSel(i);setShow(true);if(i===q.c)setQScore(s=>s+1)}} disabled={show} style={{padding:"10px 14px",border:`2px solid ${bd}`,borderRadius:8,background:bg,cursor:show?"default":"pointer",textAlign:"left",fontSize:14,color:TEXT}}>{o}</button>)})}</div>
        {show&&<><div style={{marginTop:10,padding:"10px 14px",background:GREEN+"15",borderRadius:8,fontSize:13,color:GREEN}}>{q.e}</div><button onClick={()=>{setQIdx(i=>i+1);setSel(null);setShow(false)}} style={{marginTop:10,width:"100%",padding:"10px",background:GREEN,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Suivant →</button></>}
      </div>
    </div>
  );
}
