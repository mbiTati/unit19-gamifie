"use client";
import { useState } from "react";

const BG="#0B1120",CARD="#111827",BORDER="#1E3A5F",TEXT="#E2E8F0",MUTED="#94A3B8",GREEN="#16A34A",TEAL="#0891B2",PURPLE="#7C3AED",RED="#DC2626",ORANGE="#F97316";

const ARGS=[
  {id:"a1",title:"Encapsulation des données",adt:"L'ADT regroupe données + opérations en une seule unité",oop:"En POO, c'est la CLASSE : attributs (données) + méthodes (opérations)",ex:"ADT Stack → class Stack { private int[] data; public void push(int e); }"},
  {id:"a2",title:"Abstraction et interface",adt:"L'ADT définit une interface publique (QUOI) sans montrer l'implémentation (COMMENT)",oop:"En POO, c'est l'INTERFACE Java : List<E> définit add(), get()... sans dire comment",ex:"ADT List → interface List<E> → class ArrayList implements List<E>"},
  {id:"a3",title:"Modification d'état",adt:"Les opérations de l'ADT impératif MODIFIENT l'état interne (push modifie la pile)",oop:"En POO, les méthodes modifient les attributs de l'objet (mutabilité)",ex:"push(e) modifie top → this.data[++top] = e modifie l'objet"},
  {id:"a4",title:"Réutilisabilité",adt:"Un ADT est défini une fois et réutilisé dans différents contextes",oop:"En POO, les classes sont réutilisables, extensibles (héritage), composables",ex:"ADT Stack réutilisé pour : navigation web, undo/redo, parsing"},
  {id:"a5",title:"Typage et contrats",adt:"L'ADT définit des signatures, préconditions, postconditions = un CONTRAT",oop:"En POO, les interfaces définissent des contrats que les classes doivent respecter",ex:"PRE: !isEmpty() → en Java: if (isEmpty()) throw new EmptyStackException()"},
];

const CONDITIONS_QUIZ=[
  {q:"Qu'est-ce qu'une pré-condition ?",o:["Ce qui se passe après l'appel","Ce qui doit être vrai AVANT d'appeler l'opération","Le type de retour","Le nom de la méthode"],c:1,e:"PRE-condition = ce qui doit être vrai AVANT l'appel. Ex : pile non vide avant pop()."},
  {q:"Qu'est-ce qu'une post-condition ?",o:["Ce qui est garanti APRÈS l'exécution de l'opération","L'état initial","Le type de paramètre","Une exception"],c:0,e:"POST-condition = garanti APRÈS l'appel. Ex : après push(e), l'élément est au sommet."},
  {q:"Qu'est-ce qu'une error-condition ?",o:["Un bug dans le code","Ce qui se passe quand les pré-conditions ne sont PAS respectées","Un warning du compilateur","Un test unitaire"],c:1,e:"Error-condition = comportement quand les pré-conditions sont violées. Ex : pop() sur pile vide → EmptyStackException."},
  {q:"Lien entre conditions et exceptions Java ?",o:["Aucun","Les error-conditions se traduisent en exceptions (throw/catch)","Les exceptions remplacent les conditions","Les conditions remplacent les exceptions"],c:1,e:"La violation d'une pré-condition → throw une exception. La gestion → try/catch. C'est la traduction Java des error-conditions."},
];

const DISCUSSION_QUIZ=[
  {q:"Pourquoi dit-on que les ADT impératifs sont la BASE de la POO ?",o:["Java inventé après les ADT","Encapsulation+abstraction+contrats viennent des ADT","ADT et POO identiques","Abus de langage"],c:1,e:"Les ADT ont formalisé encapsulation, abstraction et contrats AVANT la POO. La POO a hérité et étendu ces concepts."},
  {q:"Quelle différence principale entre ADT impératif et classe POO ?",o:["Aucune","L'ADT n'a pas d'héritage ni de polymorphisme","La classe est plus lente","L'ADT est en pseudo-code"],c:1,e:"ADT = encapsulation + contrats. POO AJOUTE héritage, polymorphisme et relations entre objets."},
  {q:"En quoi l'interface Java hérite directement de l'ADT ?",o:["Bytecode","Elle définit opérations sans implémentation, comme un ADT","Plus rapide qu'une classe","Aucun rapport"],c:1,e:"Interface Java = spécification pure = exactement un ADT : le QUOI sans le COMMENT."},
  {q:"Qu'apporte la POO PAR RAPPORT aux ADT ?",o:["Rien de plus","Héritage et polymorphisme","Vitesse","La compilation"],c:1,e:"POO étend ADT avec héritage (extends) et polymorphisme (List = ArrayList ou LinkedList)."},
];

type Phase="menu"|"args"|"conditions"|"discussion";

export default function Ch7Game(){
  const[phase,setPhase]=useState<Phase>("menu");
  const[expanded,setExpanded]=useState<string|null>(null);
  const[cIdx,setCIdx]=useState(0);const[cScore,setCScore]=useState(0);
  const[cSel,setCSel]=useState<number|null>(null);const[cShow,setCShow]=useState(false);
  const[dIdx,setDIdx]=useState(0);const[dScore,setDScore]=useState(0);
  const[dSel,setDSel]=useState<number|null>(null);const[dShow,setDShow]=useState(false);

  const back=<button onClick={()=>setPhase("menu")} style={{fontSize:13,color:MUTED,background:"none",border:"none",cursor:"pointer",marginBottom:12}}>← Retour</button>;

  const renderQuiz=(qs:typeof CONDITIONS_QUIZ,idx:number,score:number,sel:number|null,show:boolean,setSel:(n:number|null)=>void,setShow:(b:boolean)=>void,setIdx:(f:(n:number)=>number)=>void,setScore:(f:(n:number)=>number)=>void,color:string)=>{
    if(idx>=qs.length){const p=Math.round(score/qs.length*100);return(<div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"3rem 1rem"}}><div style={{maxWidth:500,margin:"0 auto",textAlign:"center"}}><div style={{fontSize:64,fontWeight:800,color:p>=70?GREEN:ORANGE}}>{score}/{qs.length}</div><div style={{fontSize:20,fontWeight:600}}>{p}%</div><button onClick={()=>setPhase("menu")} style={{marginTop:16,padding:"10px 24px",background:TEAL,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Retour</button></div></div>)}
    const q=qs[idx];
    return(
      <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
        <div style={{maxWidth:650,margin:"0 auto"}}>
          {back}
          <div style={{fontSize:13,color:MUTED,marginBottom:8}}>{idx+1}/{qs.length} | Score: {score}</div>
          <div style={{height:4,background:BORDER,borderRadius:2,marginBottom:16}}><div style={{height:4,background:color,borderRadius:2,width:`${(idx+1)/qs.length*100}%`}}/></div>
          <p style={{fontSize:16,fontWeight:600,marginBottom:12}}>{q.q}</p>
          <div style={{display:"grid",gap:8}}>{q.o.map((o,i)=>{let bg=CARD,bd=BORDER;if(show){if(i===q.c){bg=GREEN+"20";bd=GREEN}else if(i===sel){bg=RED+"20";bd=RED}}return(<button key={i} onClick={()=>{if(show)return;setSel(i);setShow(true);if(i===q.c)setScore(s=>s+1)}} disabled={show} style={{padding:"10px 14px",border:`2px solid ${bd}`,borderRadius:8,background:bg,cursor:show?"default":"pointer",textAlign:"left",fontSize:14,color:TEXT}}>{o}</button>)})}</div>
          {show&&<><div style={{marginTop:10,padding:"10px 14px",background:GREEN+"15",borderRadius:8,fontSize:13,color:GREEN}}>{q.e}</div><button onClick={()=>{setIdx(i=>i+1);setSel(null);setShow(false)}} style={{marginTop:10,width:"100%",padding:"10px",background:color,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Suivant →</button></>}
        </div>
      </div>
    );
  };

  if(phase==="menu")return(
    <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"2rem 1rem"}}>
      <div style={{maxWidth:700,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:"2rem"}}>
          <div style={{fontSize:13,color:TEAL,fontWeight:600,letterSpacing:2,textTransform:"uppercase"}}>Monde 2 — Chapitre 7</div>
          <h1 style={{fontSize:28,fontWeight:700,margin:"0.5rem 0"}}>ADT → POO & Conditions de Création</h1>
          <p style={{color:MUTED,fontSize:15}}>Critère D2 — Discussion argumentée + Conditions</p>
          <a href="/fiches/Ch7_Fiche_Memo_ADT_POO.pdf" target="_blank" rel="noopener" style={{display:"inline-block",marginTop:8,padding:"6px 14px",background:"#1E293B",border:"1px solid #1E3A5F",borderRadius:8,fontSize:12,color:"#94A3B8",textDecoration:"none"}}>Fiche memo PDF</a>
        </div>
        <div style={{display:"grid",gap:14}}>
          {[
            {p:"args" as Phase,t:"Les 5 arguments ADT → POO",d:"Explorez chaque argument avec exemples Java",c:TEAL},
            {p:"conditions" as Phase,t:"Pré/Post/Error Conditions",d:"4 questions sur les conditions de création",c:ORANGE},
            {p:"discussion" as Phase,t:"Quiz Discussion D2",d:"4 questions pour préparer votre argumentation écrite",c:PURPLE},
          ].map(g=>(
            <button key={g.p} onClick={()=>{setPhase(g.p);if(g.p==="conditions"){setCIdx(0);setCScore(0);setCSel(null);setCShow(false)}if(g.p==="discussion"){setDIdx(0);setDScore(0);setDSel(null);setDShow(false)}if(g.p==="args")setExpanded(null)}}
              style={{padding:"1.2rem",border:`2px solid ${BORDER}`,borderRadius:12,background:CARD,cursor:"pointer",textAlign:"left"}}>
              <div style={{fontSize:18,fontWeight:600,color:g.c}}>{g.t}</div>
              <div style={{fontSize:13,color:MUTED,marginTop:4}}>{g.d}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if(phase==="args")return(
    <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
      <div style={{maxWidth:700,margin:"0 auto"}}>
        {back}
        <h2 style={{fontSize:22,fontWeight:700,color:TEAL,marginBottom:16}}>5 arguments : ADT → POO</h2>
        <div style={{display:"grid",gap:10}}>
          {ARGS.map(arg=>(
            <div key={arg.id} style={{border:`1px solid ${expanded===arg.id?TEAL:BORDER}`,borderRadius:10,overflow:"hidden"}}>
              <button onClick={()=>setExpanded(expanded===arg.id?null:arg.id)} style={{width:"100%",padding:"12px 16px",background:expanded===arg.id?TEAL+"15":CARD,border:"none",cursor:"pointer",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontWeight:600,color:TEXT,fontSize:15}}>{arg.title}</span>
                <span style={{color:MUTED}}>{expanded===arg.id?"▲":"▼"}</span>
              </button>
              {expanded===arg.id&&(
                <div style={{padding:"0 16px 16px"}}>
                  <div style={{display:"grid",gap:8,marginTop:8}}>
                    <div style={{padding:"10px 12px",background:PURPLE+"15",borderRadius:8}}>
                      <div style={{fontSize:11,fontWeight:600,color:PURPLE,textTransform:"uppercase"}}>Concept ADT</div>
                      <div style={{fontSize:14,color:TEXT,marginTop:2}}>{arg.adt}</div>
                    </div>
                    <div style={{textAlign:"center",color:MUTED,fontSize:18}}>↓</div>
                    <div style={{padding:"10px 12px",background:TEAL+"15",borderRadius:8}}>
                      <div style={{fontSize:11,fontWeight:600,color:TEAL,textTransform:"uppercase"}}>Évolution POO</div>
                      <div style={{fontSize:14,color:TEXT,marginTop:2}}>{arg.oop}</div>
                    </div>
                    <div style={{padding:"8px 12px",background:"#0D1117",borderRadius:6}}>
                      <code style={{fontSize:12,color:"#A5F3FC",fontFamily:"Consolas,monospace"}}>{arg.ex}</code>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if(phase==="conditions")return renderQuiz(CONDITIONS_QUIZ,cIdx,cScore,cSel,cShow,setCSel,setCShow,setCIdx,setCScore,ORANGE);
  if(phase==="discussion")return renderQuiz(DISCUSSION_QUIZ,dIdx,dScore,dSel,dShow,setDSel,setDShow,setDIdx,setDScore,PURPLE);
  return null;
}
