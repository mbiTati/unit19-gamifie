"use client";
import { useState } from "react";
import Link from "next/link";
import { FlashcardDeck, SpinningWheel, DigiLock, Buzzer } from "@/components/GameAnimations";

const BG="#0B1120",CARD="#111827",BORDER="#1E3A5F",TEXT="#E2E8F0",MUTED="#94A3B8",GREEN="#16A34A",ORANGE="#F97316",PURPLE="#7C3AED",TEAL="#0891B2",RED="#DC2626";

const FLASHCARDS=[
  {front:"Qu'est-ce qu'un ADT ?",back:"Abstract Data Type : definit les OPERATIONS possibles sans specifier l'implementation. Le QUOI sans le COMMENT.",category:"LO1"},
  {front:"LIFO vs FIFO",back:"LIFO (Stack) : dernier entre, premier sorti.\nFIFO (Queue) : premier entre, premier sorti.",category:"LO1"},
  {front:"O(1) vs O(n) vs O(n^2)",back:"O(1) constant (HashMap.get)\nO(n) lineaire (boucle simple)\nO(n^2) quadratique (2 boucles imbriquees)",category:"LO4"},
  {front:"throw vs throws",back:"throw : LANCE une exception dans le corps de la methode.\nthrows : DECLARE dans la signature que la methode peut echouer.",category:"LO3"},
  {front:"finally en Java",back:"Bloc qui s'execute TOUJOURS, meme avec return ou exception. Ideal pour fermer Scanner, fichiers, connexions.",category:"LO3"},
  {front:"@BeforeEach en JUnit 5",back:"Execute AVANT chaque methode @Test. Sert a reinitialiser l'etat (setup frais).",category:"LO3"},
  {front:"assertThrows",back:"assertThrows(Exception.class, () -> code()) verifie que le code lance bien l'exception attendue.",category:"LO3"},
  {front:"Encapsulation",back:"Regrouper donnees (private) + methodes (public) dans une classe. Controler l'acces avec getters/setters.",category:"LO2"},
  {front:"HashMap : complexite get()",back:"O(1) en moyenne grace a la hash function. Pire cas O(n) si beaucoup de collisions.",category:"LO3"},
  {front:"LinkedList vs ArrayList",back:"LinkedList : insertion O(1), acces O(n).\nArrayList : acces O(1), insertion O(n).\nTrade-off classique.",category:"LO4"},
  {front:"Singleton Pattern",back:"UNE seule instance. Constructeur private + methode static getInstance(). Ex: Logger, Config.",category:"LO2"},
  {front:"Auto-increment en Java",back:"private int compteur = 1;\nUtiliser compteur comme id, puis compteur++.\nDans la classe GESTION, pas dans l'entite.",category:"LO3"},
  {front:"Tri a bulles : complexite",back:"O(n^2) : deux boucles imbriquees. Compare voisins et echange. Simple mais PAS optimal. MergeSort = O(n log n).",category:"LO4"},
  {front:"PRE / POST / INVARIANT",back:"PRE : vrai AVANT l'appel.\nPOST : garanti APRES l'appel.\nINVARIANT : toujours vrai entre les operations.",category:"LO2"},
  {front:"Checked vs Unchecked Exception",back:"Checked (IOException) : compilateur OBLIGE try/catch.\nUnchecked (NullPointer) : pas oblige, bug de programmation.",category:"LO3"},
];

const WHEEL_SEGMENTS=[
  {label:"ADT",color:"#7C3AED"},
  {label:"HashMap",color:"#0891B2"},
  {label:"LinkedList",color:"#16A34A"},
  {label:"Exceptions",color:"#DC2626"},
  {label:"JUnit 5",color:"#F97316"},
  {label:"Big O",color:"#D97706"},
  {label:"Tri",color:"#3B82F6"},
  {label:"Patterns",color:"#7C3AED"},
];

const LOCKS=[
  {code:"LIFO",hint:"Principe du Stack : dernier entre, premier sorti",reward:"Stack deverrouille ! push() et pop() sont a vous."},
  {code:"FIFO",hint:"Principe de la Queue : premier entre, premier sorti",reward:"Queue deverrouille ! enqueue() et dequeue() accessibles."},
  {code:"O1",hint:"Complexite de HashMap.get(key)",reward:"HashMap deverrouille ! Acces direct par cle."},
  {code:"JUNIT",hint:"Framework de test en Java 5",reward:"Tests deverrouilles ! @Test et assertEquals prets."},
];

type Phase="menu"|"flashcards"|"wheel"|"escape"|"buzzer";

export default function OutilsPage(){
  const[phase,setPhase]=useState("menu" as Phase);
  const[wheelResult,setWheelResult]=useState(null as string|null);
  const[lockIdx,setLockIdx]=useState(0);
  const[locksOpen,setLocksOpen]=useState(0);
  const[buzzCount,setBuzzCount]=useState(0);
  const[buzzTime,setBuzzTime]=useState(null as number|null);

  const back=<button onClick={()=>setPhase("menu")} style={{fontSize:13,color:MUTED,background:"none",border:"none",cursor:"pointer",marginBottom:12}}>Retour</button>;

  if(phase==="menu")return(
    <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"2rem 1rem"}}>
      <div style={{padding:"8px 16px",borderBottom:"1px solid "+BORDER}}><Link href="/" style={{fontSize:12,color:MUTED,textDecoration:"none"}}>Retour accueil</Link></div>
      <div style={{maxWidth:700,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:"2rem",marginTop:"1rem"}}>
          <div style={{fontSize:13,color:PURPLE,fontWeight:600,letterSpacing:2,textTransform:"uppercase"}}>Outils interactifs</div>
          <h1 style={{fontSize:28,fontWeight:700,margin:"0.5rem 0"}}>Boite a outils</h1>
          <p style={{color:MUTED,fontSize:14}}>Flashcards, roue, escape game, buzzer</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <button onClick={()=>setPhase("flashcards")} style={{padding:"1.2rem",border:"2px solid "+BORDER,borderRadius:12,background:CARD,cursor:"pointer",textAlign:"left"}}>
            <div style={{fontSize:17,fontWeight:600,color:TEAL}}>Flashcards</div>
            <div style={{fontSize:12,color:MUTED,marginTop:4}}>{FLASHCARDS.length} cartes recto/verso — vocabulaire cle Unit 19</div>
          </button>
          <button onClick={()=>{setPhase("wheel");setWheelResult(null)}} style={{padding:"1.2rem",border:"2px solid "+BORDER,borderRadius:12,background:CARD,cursor:"pointer",textAlign:"left"}}>
            <div style={{fontSize:17,fontWeight:600,color:ORANGE}}>Roue du hasard</div>
            <div style={{fontSize:12,color:MUTED,marginTop:4}}>Tirage au sort du theme — ideal en classe</div>
          </button>
          <button onClick={()=>{setPhase("escape");setLockIdx(0);setLocksOpen(0)}} style={{padding:"1.2rem",border:"2px solid "+BORDER,borderRadius:12,background:CARD,cursor:"pointer",textAlign:"left"}}>
            <div style={{fontSize:17,fontWeight:600,color:RED}}>Escape Game</div>
            <div style={{fontSize:12,color:MUTED,marginTop:4}}>{LOCKS.length} cadenas a deverrouiller avec vos connaissances</div>
          </button>
          <button onClick={()=>{setPhase("buzzer");setBuzzCount(0);setBuzzTime(null)}} style={{padding:"1.2rem",border:"2px solid "+BORDER,borderRadius:12,background:CARD,cursor:"pointer",textAlign:"left"}}>
            <div style={{fontSize:17,fontWeight:600,color:"#16A34A"}}>Buzzer</div>
            <div style={{fontSize:12,color:MUTED,marginTop:4}}>Buzzer virtuel pour quiz en classe</div>
          </button>
        </div>
      </div>
    </div>
  );

  if(phase==="flashcards")return(
    <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
      <div style={{maxWidth:500,margin:"0 auto"}}>
        {back}
        <h2 style={{fontSize:20,fontWeight:700,color:TEAL,marginBottom:12}}>Flashcards — Unit 19</h2>
        <FlashcardDeck cards={FLASHCARDS}/>
      </div>
    </div>
  );

  if(phase==="wheel")return(
    <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
      <div style={{maxWidth:500,margin:"0 auto",textAlign:"center"}}>
        {back}
        <h2 style={{fontSize:20,fontWeight:700,color:ORANGE,marginBottom:16}}>Roue du hasard</h2>
        <SpinningWheel segments={WHEEL_SEGMENTS} onResult={(i)=>setWheelResult(WHEEL_SEGMENTS[i].label)}/>
        {wheelResult&&<div style={{marginTop:16,padding:"12px",background:CARD,borderRadius:8,border:"1px solid "+BORDER}}><div style={{fontSize:13,color:MUTED}}>Le theme est :</div><div style={{fontSize:20,fontWeight:700,color:ORANGE}}>{wheelResult}</div></div>}
      </div>
    </div>
  );

  if(phase==="escape"){
    const allOpen=locksOpen>=LOCKS.length;
    return(
      <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
        <div style={{maxWidth:500,margin:"0 auto"}}>
          {back}
          <h2 style={{fontSize:20,fontWeight:700,color:RED,marginBottom:4}}>Escape Game — Unit 19</h2>
          <p style={{fontSize:13,color:MUTED,marginBottom:16}}>Deverrouillez {LOCKS.length} cadenas pour vous echapper</p>
          <div style={{display:"flex",gap:8,marginBottom:16,justifyContent:"center"}}>
            {LOCKS.map((_,i)=>(
              <div key={i} style={{width:24,height:24,borderRadius:4,background:i<locksOpen?GREEN:i===lockIdx?RED+"40":BORDER,border:"1px solid "+(i<locksOpen?GREEN:i===lockIdx?RED:BORDER),display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:i<locksOpen?GREEN:MUTED}}>{i<locksOpen?"V":i+1}</div>
            ))}
          </div>
          {allOpen?(
            <div style={{textAlign:"center",padding:"2rem"}}>
              <div style={{fontSize:24,fontWeight:800,color:GREEN}}>Tous les cadenas ouverts !</div>
              <div style={{fontSize:14,color:MUTED,marginTop:4}}>Vous vous etes echappe</div>
              <button onClick={()=>setPhase("menu")} style={{marginTop:16,padding:"10px 24px",background:GREEN,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Retour</button>
            </div>
          ):(
            <div style={{padding:"20px",background:CARD,borderRadius:12,border:"1px solid "+BORDER}}>
              <div style={{fontSize:13,color:MUTED,marginBottom:8}}>Cadenas {lockIdx+1}/{LOCKS.length}</div>
              <DigiLock code={LOCKS[lockIdx].code} hint={LOCKS[lockIdx].hint} onUnlock={()=>{setLocksOpen(l=>l+1);setTimeout(()=>setLockIdx(i=>Math.min(i+1,LOCKS.length-1)),800)}}/>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Buzzer
  return(
    <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
      <div style={{maxWidth:400,margin:"0 auto",textAlign:"center"}}>
        {back}
        <h2 style={{fontSize:20,fontWeight:700,color:GREEN,marginBottom:20}}>Buzzer</h2>
        <p style={{fontSize:13,color:MUTED,marginBottom:20}}>Le premier a buzzer gagne ! Appuyez le plus vite possible.</p>
        <div style={{display:"flex",justifyContent:"center",marginBottom:20}}>
          <Buzzer onBuzz={()=>{setBuzzCount(c=>c+1);if(!buzzTime)setBuzzTime(Date.now())}} color={RED}/>
        </div>
        <div style={{fontSize:14,color:MUTED}}>Buzzs : {buzzCount}</div>
        <button onClick={()=>{setBuzzCount(0);setBuzzTime(null)}} style={{marginTop:12,padding:"8px 16px",background:CARD,color:MUTED,border:"1px solid "+BORDER,borderRadius:8,fontSize:12,cursor:"pointer"}}>Reset</button>
      </div>
    </div>
  );
}
