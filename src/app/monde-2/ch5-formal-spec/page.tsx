"use client";
import Link from "next/link";
import { useState } from "react";

const BG="#0B1120",CARD="#111827",BORDER="#1E3A5F",TEXT="#E2E8F0",MUTED="#94A3B8",GREEN="#16A34A",TEAL="#0891B2",PURPLE="#7C3AED",RED="#DC2626",ORANGE="#F97316";

const SPEC=[
  {id:"name",label:"Nom de l'ADT",content:"Stack<E>",hint:"Type générique avec E"},
  {id:"desc",label:"Description",content:"Collection LIFO (Last In, First Out). Le dernier élément ajouté est le premier retiré.",hint:"Quel est le principe fondamental ?"},
  {id:"type",label:"Type de données",content:"E — type générique (Integer, String, Object...)",hint:"Quel type d'éléments stocke-t-on ?"},
  {id:"ops",label:"Opérations",content:"push(e: E) → void | pop() → E | peek() → E | isEmpty() → boolean | size() → int",hint:"Les 5 opérations fondamentales"},
  {id:"pre",label:"Préconditions",content:"pop() : isEmpty() == false | peek() : isEmpty() == false",hint:"Quand ne peut-on PAS appeler certaines opérations ?"},
  {id:"post",label:"Postconditions",content:"push(e) : e au sommet, size += 1 | pop() : sommet retiré, size -= 1",hint:"Garanti APRÈS l'appel ?"},
  {id:"inv",label:"Invariants",content:"size >= 0 | pop/peek impossible si vide | push puis pop retourne le même élément",hint:"TOUJOURS vrai ?"},
  {id:"axiom",label:"Axiomes",content:"AXIOM: ∀e, pop(push(S,e)) = <e, S>\nAXIOM: new().isEmpty() = true\nAXIOM: push(S,e).isEmpty() = false",hint:"Propriétés mathématiques"},
];

const VDM_ITEMS=[
  {id:"v1",term:"VDM (Vienna Development Method)",def:"Méthode formelle basée sur la logique pour spécifier et vérifier des systèmes logiciels",cat:"VDM" as const},
  {id:"v2",term:"Pré-condition VDM",def:"pre-push(e) ≜ true (pas de contrainte pour push)",cat:"VDM" as const},
  {id:"v3",term:"Post-condition VDM",def:"post-pop(s, result) ≜ result = hd(s) ∧ s' = tl(s)",cat:"VDM" as const},
  {id:"v4",term:"Invariant VDM",def:"inv-Stack(s) ≜ len(s) ≥ 0",cat:"VDM" as const},
  {id:"s1",term:"SDL (Specification and Description Language)",def:"Langage graphique pour décrire le comportement de systèmes réactifs (automates)",cat:"SDL" as const},
  {id:"s2",term:"Processus SDL",def:"Représenté par un rectangle arrondi — contient états et transitions",cat:"SDL" as const},
  {id:"s3",term:"Signal SDL",def:"Événement envoyé entre processus (flèche avec nom)",cat:"SDL" as const},
  {id:"a1",term:"ASN.1 (Abstract Syntax Notation One)",def:"Notation standard pour décrire la structure des données échangées entre systèmes",cat:"ASN.1" as const},
  {id:"a2",term:"Type ASN.1 SEQUENCE",def:"Équivalent d'un objet/struct — groupe de champs nommés et typés",cat:"ASN.1" as const},
];

const CLASSIFY=[
  {text:"isEmpty() == false avant pop()",cat:"PRE"},{text:"size() == old_size + 1 après push(e)",cat:"POST"},
  {text:"size() >= 0 toujours",cat:"INVARIANT"},{text:"pop(push(S,e)) = <e, S>",cat:"AXIOM"},
  {text:"montant > 0 avant retrait()",cat:"PRE"},{text:"solde == old_solde - montant après retrait()",cat:"POST"},
  {text:"solde >= 0 toujours",cat:"INVARIANT"},{text:"new().isEmpty() = true",cat:"AXIOM"},
  {text:"index >= 0 && index < size() avant get(index)",cat:"PRE"},{text:"get(i) après set(i, e) retourne e",cat:"AXIOM"},
];

const QUIZ=[
  {q:"En notation impérative, comment spécifier que pop() nécessite un stack non vide ?",o:["pop() requires !empty()","PRE: isEmpty() == false","if (!empty) then pop()","pop() throws EmptyException"],c:1,e:"On utilise PRE (précondition) pour exprimer les conditions requises avant l'appel."},
  {q:"Qu'est-ce qu'un langage de spécification non exécutable ?",o:["Un langage qui ne compile pas","Un outil pour décrire formellement un système sans générer de code","Un langage déprécié","Un pseudo-code"],c:1,e:"Il décrit le comportement sans générer de code. Il aide à réduire les erreurs de conception."},
  {q:"Quelle est la différence principale entre VDM et SDL ?",o:["VDM est graphique, SDL textuel","VDM basé sur la logique, SDL sur des diagrammes d'automates","Ils sont identiques","VDM est pour Java"],c:1,e:"VDM = logique formelle (pré/post). SDL = diagrammes graphiques (états/transitions)."},
  {q:"En VDM, comment exprime-t-on l'invariant d'un Stack ?",o:["inv-Stack(s) ≜ len(s) ≥ 0","Stack.invariant = positive","assert(size > 0)","RULE: size >= 0"],c:0,e:"VDM utilise inv-Type(param) ≜ expression. Le ≜ signifie 'défini comme'."},
  {q:"Quel est le rôle d'ASN.1 ?",o:["Compiler du Java","Décrire la structure des données échangées entre systèmes","Dessiner des diagrammes","Tester le code"],c:1,e:"ASN.1 décrit la structure des données indépendamment du langage."},
  {q:"Pourquoi la spécification formelle ?",o:["Plus de code","Précision, vérification automatique, éviter ambiguïtés","Obligation légale","Remplacer les tests"],c:1,e:"Précision + vérification auto + communication sans ambiguïté."},
  {q:"Comment spécifier push puis pop = identité ?",o:["push then pop = nothing","POST: pop(push(s, e)) == e","push(pop()) = identity","AXIOM: ∀e, pop(push(S,e)) = <e, S>"],c:3,e:"C'est un AXIOME : propriété fondamentale du LIFO."},
  {q:"Quelle notation correcte pour la postcondition de push(e) ?",o:["POST: e ajouté quelque part","POST: top() == e AND size() == old_size + 1","RETURN: true","POST: stack changed"],c:1,e:"Postcondition précise : élément au sommet ET taille +1."},
];

type Phase="menu"|"builder"|"vdm"|"classify"|"quiz";

export default function Ch5Game(){
  const[phase,setPhase]=useState<Phase>("menu");
  const[bRevealed,setBRevealed]=useState<boolean[]>(new Array(SPEC.length).fill(false));
  const[vRevealed,setVRevealed]=useState<Set<string>>(new Set());
  const[vFilter,setVFilter]=useState<"all"|"VDM"|"SDL"|"ASN.1">("all");
  const[cIdx,setCIdx]=useState(0);const[cScore,setCScore]=useState(0);
  const[cAns,setCAns]=useState<string|null>(null);const[cShow,setCShow]=useState(false);
  const[shuffled]=useState(()=>[...CLASSIFY].sort(()=>Math.random()-0.5));
  const[qIdx,setQIdx]=useState(0);const[qScore,setQScore]=useState(0);
  const[sel,setSel]=useState<number|null>(null);const[show,setShow]=useState(false);

  const catCol:Record<string,string>={"VDM":"#A78BFA","SDL":"#34D399","ASN.1":"#FB923C"};
  const condCol:Record<string,string>={PRE:ORANGE,POST:GREEN,INVARIANT:TEAL,AXIOM:PURPLE};
  const condEmoji:Record<string,string>={PRE:"PRE",POST:"POST",INVARIANT:"INV",AXIOM:"AX"};

  const back=<button onClick={()=>setPhase("menu")} style={{fontSize:13,color:MUTED,background:"none",border:"none",cursor:"pointer",marginBottom:12}}>← Retour</button>;

  if(phase==="menu")return(
    <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"2rem 1rem"}}>
      <div style={{padding:"8px 16px",borderBottom:"1px solid #1E3A5F"}}><Link href="/" style={{fontSize:12,color:"#94A3B8",textDecoration:"none"}}>Retour accueil</Link></div>
            <div style={{maxWidth:700,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:"2rem"}}>
          <div style={{fontSize:13,color:TEAL,fontWeight:600,letterSpacing:2,textTransform:"uppercase"}}>Monde 2 — Chapitre 5</div>
          <h1 style={{fontSize:28,fontWeight:700,margin:"0.5rem 0"}}>Spécification formelle & Notation</h1>
          <p style={{color:MUTED,fontSize:15}}>Critère P3 — ADT, VDM, SDL, ASN.1</p>
          <a href="/fiches/Ch5_Fiche_Memo_Notation_Formelle.pdf" target="_blank" rel="noopener" style={{display:"inline-block",marginTop:8,padding:"6px 14px",background:"#1E293B",border:"1px solid #1E3A5F",borderRadius:8,fontSize:12,color:"#94A3B8",textDecoration:"none"}}>Fiche memo PDF</a>
        </div>
        <div style={{display:"grid",gap:14}}>
          {[
            {p:"builder" as Phase,t:"Construire une spec ADT",d:"8 parties : opérations, conditions, axiomes",c:TEAL},
            {p:"vdm" as Phase,t:"VDM, SDL & ASN.1",d:"Langages de spécification non exécutables",c:PURPLE},
            {p:"classify" as Phase,t:"Classifier les conditions",d:"PRE, POST, INVARIANT ou AXIOME ? 10 énoncés",c:ORANGE},
            {p:"quiz" as Phase,t:"Quiz notation formelle",d:"8 questions sur VDM, SDL, ASN.1 et notation",c:GREEN},
          ].map(g=>(
            <button key={g.p} onClick={()=>{setPhase(g.p);if(g.p==="builder")setBRevealed(new Array(SPEC.length).fill(false));if(g.p==="vdm"){setVRevealed(new Set());setVFilter("all")}if(g.p==="classify"){setCIdx(0);setCScore(0);setCAns(null);setCShow(false)}if(g.p==="quiz"){setQIdx(0);setQScore(0);setSel(null);setShow(false)}}}
              style={{padding:"1.2rem",border:`2px solid ${BORDER}`,borderRadius:12,background:CARD,cursor:"pointer",textAlign:"left"}}>
              <div style={{fontSize:18,fontWeight:600,color:g.c}}>{g.t}</div>
              <div style={{fontSize:13,color:MUTED,marginTop:4}}>{g.d}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if(phase==="builder")return(
    <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
      <div style={{maxWidth:700,margin:"0 auto"}}>
        {back}
        <h2 style={{fontSize:22,fontWeight:700,color:TEAL,marginBottom:16}}>Spec complète d'un Stack</h2>
        <div style={{display:"grid",gap:10}}>
          {SPEC.map((p,i)=>(
            <div key={p.id} style={{border:`1px solid ${bRevealed[i]?TEAL:BORDER}`,borderRadius:10,padding:"12px 16px",background:bRevealed[i]?TEAL+"15":CARD}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontWeight:600,fontSize:14,color:bRevealed[i]?TEAL:TEXT}}>{p.label}</span>
                {!bRevealed[i]&&<button onClick={()=>{const r=[...bRevealed];r[i]=true;setBRevealed(r)}} style={{padding:"4px 14px",background:TEAL,color:"white",border:"none",borderRadius:6,fontSize:12,fontWeight:600,cursor:"pointer"}}>Révéler</button>}
              </div>
              {!bRevealed[i]&&<div style={{fontSize:12,color:MUTED,marginTop:4,fontStyle:"italic"}}>{p.hint}</div>}
              {bRevealed[i]&&<div style={{marginTop:6,padding:"8px 10px",background:"#0D1117",borderRadius:6}}><code style={{fontSize:13,color:"#A5F3FC",fontFamily:"Consolas,monospace",whiteSpace:"pre-wrap"}}>{p.content}</code></div>}
            </div>
          ))}
        </div>
        {bRevealed.every(Boolean)&&<div style={{marginTop:16,padding:"1rem",background:GREEN+"20",borderRadius:10,textAlign:"center"}}><div style={{fontSize:15,fontWeight:600,color:GREEN}}> Spécification complète !</div></div>}
      </div>
    </div>
  );

  if(phase==="vdm"){
    const filtered=vFilter==="all"?VDM_ITEMS:VDM_ITEMS.filter(i=>i.cat===vFilter);
    return(
      <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          {back}
          <h2 style={{fontSize:22,fontWeight:700,color:PURPLE,marginBottom:4}}>Langages de spécification</h2>
          <p style={{color:MUTED,fontSize:13,marginBottom:12}}>Langages non exécutables : décrivent le comportement sans générer de code.</p>
          <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
            {(["all","VDM","SDL","ASN.1"] as const).map(f=>(
              <button key={f} onClick={()=>setVFilter(f)} style={{padding:"6px 14px",borderRadius:20,fontSize:13,fontWeight:600,cursor:"pointer",background:vFilter===f?(f==="all"?PURPLE:catCol[f]):"transparent",color:vFilter===f?"white":MUTED,border:`1px solid ${vFilter===f?"transparent":BORDER}`}}>{f==="all"?"Tous":f}</button>
            ))}
          </div>
          <div style={{display:"grid",gap:10}}>
            {filtered.map(item=>{
              const open=vRevealed.has(item.id);
              return(<div key={item.id} onClick={()=>{const s=new Set(vRevealed);s.has(item.id)?s.delete(item.id):s.add(item.id);setVRevealed(s)}} style={{border:`1px solid ${open?catCol[item.cat]:BORDER}`,borderRadius:10,padding:"12px 16px",background:open?catCol[item.cat]+"15":CARD,cursor:"pointer"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontWeight:600,fontSize:14}}>{item.term}</span>
                  <span style={{fontSize:11,padding:"2px 8px",borderRadius:10,background:catCol[item.cat]+"30",color:catCol[item.cat],fontWeight:600}}>{item.cat}</span>
                </div>
                {open&&<div style={{marginTop:8,padding:"8px 12px",background:"#0D1117",borderRadius:6,fontSize:13,color:"#A5F3FC"}}>{item.def}</div>}
                {!open&&<div style={{fontSize:12,color:MUTED,marginTop:4}}>Cliquez pour révéler</div>}
              </div>);
            })}
          </div>
        </div>
      </div>
    );
  }

  if(phase==="classify"){
    if(cIdx>=shuffled.length){const p=Math.round(cScore/shuffled.length*100);return(<div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"3rem 1rem"}}><div style={{maxWidth:500,margin:"0 auto",textAlign:"center"}}><div style={{fontSize:64,fontWeight:800,color:p>=70?GREEN:ORANGE}}>{cScore}/{shuffled.length}</div><div style={{fontSize:20,fontWeight:600,margin:"0.5rem 0"}}>{p}%</div><button onClick={()=>setPhase("menu")} style={{marginTop:16,padding:"10px 24px",background:TEAL,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Retour</button></div></div>)}
    const it=shuffled[cIdx];const cats=["PRE","POST","INVARIANT","AXIOM"] as const;
    return(
      <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
        <div style={{maxWidth:600,margin:"0 auto"}}>
          {back}
          <div style={{fontSize:13,color:MUTED,marginBottom:8}}>{cIdx+1}/{shuffled.length} | Score: {cScore}</div>
          <div style={{height:4,background:BORDER,borderRadius:2,marginBottom:16}}><div style={{height:4,background:TEAL,borderRadius:2,width:`${(cIdx+1)/shuffled.length*100}%`}}/></div>
          <div style={{padding:"1rem",background:"#0D1117",borderRadius:10,marginBottom:16,textAlign:"center"}}><code style={{fontSize:15,color:"#A5F3FC"}}>{it.text}</code></div>
          <p style={{fontSize:15,fontWeight:600,marginBottom:12,textAlign:"center"}}>Cette condition est un(e) :</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {cats.map(cat=>{let bg=CARD,bd=BORDER;if(cShow){if(cat===it.cat){bg=GREEN+"20";bd=GREEN}else if(cat===cAns){bg=RED+"20";bd=RED}}
              return(<button key={cat} onClick={()=>{if(cShow)return;setCAns(cat);setCShow(true);if(cat===it.cat)setCScore(s=>s+1)}} disabled={cShow} style={{padding:"14px",border:`2px solid ${bd}`,borderRadius:10,background:bg,cursor:cShow?"default":"pointer",textAlign:"center"}}>
                <div style={{fontSize:11,fontWeight:700,color:condCol[cat]}}>{condEmoji[cat]}</div>
                <div style={{fontSize:14,fontWeight:600,color:condCol[cat],marginTop:4}}>{cat}</div>
              </button>)})}
          </div>
          {cShow&&<><div style={{marginTop:12,padding:"10px 14px",background:cAns===it.cat?GREEN+"20":RED+"20",borderRadius:8,fontSize:13,color:cAns===it.cat?GREEN:RED}}>{cAns===it.cat?"Correct !":"Incorrect — C'est un(e) "+it.cat}</div>
            <button onClick={()=>{setCIdx(i=>i+1);setCAns(null);setCShow(false)}} style={{marginTop:10,width:"100%",padding:"10px",background:TEAL,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Suivant →</button></>}
        </div>
      </div>
    );
  }

  // QUIZ
  if(qIdx>=QUIZ.length){const p=Math.round(qScore/QUIZ.length*100);return(<div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"3rem 1rem"}}><div style={{maxWidth:500,margin:"0 auto",textAlign:"center"}}><div style={{fontSize:64,fontWeight:800,color:p>=70?GREEN:ORANGE}}>{qScore}/{QUIZ.length}</div><div style={{fontSize:20,fontWeight:600}}>{p}%</div><button onClick={()=>setPhase("menu")} style={{marginTop:16,padding:"10px 24px",background:TEAL,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Retour</button></div></div>)}
  const qq=QUIZ[qIdx];
  return(
    <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
      <div style={{maxWidth:650,margin:"0 auto"}}>
        {back}
        <div style={{fontSize:13,color:MUTED,marginBottom:8}}>{qIdx+1}/{QUIZ.length} | Score: {qScore}</div>
        <div style={{height:4,background:BORDER,borderRadius:2,marginBottom:16}}><div style={{height:4,background:GREEN,borderRadius:2,width:`${(qIdx+1)/QUIZ.length*100}%`}}/></div>
        <p style={{fontSize:16,fontWeight:600,marginBottom:12}}>{qq.q}</p>
        <div style={{display:"grid",gap:8}}>{qq.o.map((o,i)=>{let bg=CARD,bd=BORDER;if(show){if(i===qq.c){bg=GREEN+"20";bd=GREEN}else if(i===sel){bg=RED+"20";bd=RED}}return(<button key={i} onClick={()=>{if(show)return;setSel(i);setShow(true);if(i===qq.c)setQScore(s=>s+1)}} disabled={show} style={{padding:"10px 14px",border:`2px solid ${bd}`,borderRadius:8,background:bg,cursor:show?"default":"pointer",textAlign:"left",fontSize:14,color:TEXT}}>{o}</button>)})}</div>
        {show&&<><div style={{marginTop:10,padding:"10px 14px",background:GREEN+"15",borderRadius:8,fontSize:13,color:GREEN}}>{qq.e}</div><button onClick={()=>{setQIdx(i=>i+1);setSel(null);setShow(false)}} style={{marginTop:10,width:"100%",padding:"10px",background:GREEN,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Suivant →</button></>}
      </div>
    </div>
  );
}
