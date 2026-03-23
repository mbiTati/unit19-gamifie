"use client";
import { useState } from "react";
import Link from "next/link";

const BG="#0B1120",CARD="#111827",BORDER="#1E3A5F",TEXT="#E2E8F0",MUTED="#94A3B8",GREEN="#16A34A",RED="#DC2626",ORANGE="#F97316",PURPLE="#7C3AED",TEAL="#0891B2",BLUE="#3B82F6";

// ─── GAME 1: Fill-in comparison table ───
const TABLE_CELLS=[
  {row:"get(index)",col:"ArrayList",answer:"O(1)",hint:"Acces direct par index"},
  {row:"get(index)",col:"LinkedList",answer:"O(n)",hint:"Parcours depuis le debut"},
  {row:"get(index)",col:"HashMap",answer:"N/A",hint:"Pas d'index, acces par cle"},
  {row:"add(fin)",col:"ArrayList",answer:"O(1)",hint:"Ajoute a la fin du tableau"},
  {row:"add(fin)",col:"LinkedList",answer:"O(1)",hint:"Reference au dernier noeud"},
  {row:"add(fin)",col:"HashMap",answer:"O(1)",hint:"Hash puis insertion"},
  {row:"add(debut)",col:"ArrayList",answer:"O(n)",hint:"Decaler tous les elements"},
  {row:"add(debut)",col:"LinkedList",answer:"O(1)",hint:"Changer le pointeur head"},
  {row:"add(debut)",col:"HashMap",answer:"N/A",hint:"Pas de notion d'ordre"},
  {row:"contains()",col:"ArrayList",answer:"O(n)",hint:"Parcours sequentiel"},
  {row:"contains()",col:"LinkedList",answer:"O(n)",hint:"Parcours sequentiel"},
  {row:"contains()",col:"HashMap",answer:"O(1)",hint:"containsKey par hash"},
  {row:"remove()",col:"ArrayList",answer:"O(n)",hint:"Trouver + decaler"},
  {row:"remove()",col:"LinkedList",answer:"O(n)",hint:"Trouver + supprimer noeud"},
  {row:"remove()",col:"HashMap",answer:"O(1)",hint:"Hash puis suppression"},
];
const ROWS=["get(index)","add(fin)","add(debut)","contains()","remove()"];
const COLS=["ArrayList","LinkedList","HashMap"];
const OPTIONS=["O(1)","O(n)","O(log n)","O(n^2)","N/A"];

// ─── GAME 2: Quiz ───
const QUIZ=[
  {q:"LinkedList stocke les elements dans :",o:["Un tableau contigu","Des noeuds avec pointeurs next/prev","Un arbre binaire","Une table de hachage"],c:1,e:"Chaque noeud contient la donnee + un pointeur vers le noeud suivant (et precedent en double)."},
  {q:"HashMap utilise quelle technique pour stocker ?",o:["Index sequentiel","Hash function -> index dans un tableau de buckets","Arbre binaire","File d'attente"],c:1,e:"cle.hashCode() % tableSize = index du bucket. Acces O(1) en moyenne."},
  {q:"Collision dans un HashMap :",o:["Erreur fatale","2 cles donnent le meme index -> chainage","Impossible","Le HashMap se vide"],c:1,e:"Les collisions sont gerees par chainage (LinkedList dans le bucket) ou arbre (Java 8+)."},
  {q:"Pour un repertoire telephonique (recherche par nom) :",o:["ArrayList","LinkedList","HashMap","Stack"],c:2,e:"Recherche par cle (nom) = HashMap O(1). ArrayList/LinkedList seraient O(n)."},
  {q:"Pour une file d'attente de clients :",o:["HashMap","ArrayList","LinkedList/Queue","TreeMap"],c:2,e:"FIFO : ajout en fin, retrait au debut. LinkedList/Queue = O(1) pour les deux."},
  {q:"ArrayList est plus cache-friendly que LinkedList car :",o:["ArrayList est plus rapide","Elements contigus en memoire","ArrayList a moins de methodes","LinkedList est deprecie"],c:1,e:"Elements contigus = le CPU precharge les voisins dans le cache L1. LinkedList a des noeuds eparpilles."},
];

type Phase="menu"|"table"|"quiz";

export default function Ch8Game(){
  const[phase,setPhase]=useState("menu" as Phase);
  const[answers,setAnswers]=useState({} as Record<string,string>);
  const[submitted,setSubmitted]=useState(false);
  const[qIdx,setQIdx]=useState(0);const[qScore,setQScore]=useState(0);const[sel,setSel]=useState(null as number|null);const[show,setShow]=useState(false);

  const back=<button onClick={()=>setPhase("menu")} style={{fontSize:13,color:MUTED,background:"none",border:"none",cursor:"pointer",marginBottom:12}}>Retour</button>;

  const setCell=(row:string,col:string,val:string)=>{if(submitted)return;setAnswers(a=>({...a,[row+"|"+col]:val}))};
  const getCell=(row:string,col:string)=>answers[row+"|"+col]||"";
  const getCorrect=(row:string,col:string)=>{const c=TABLE_CELLS.find(c=>c.row===row&&c.col===col);return c?c.answer:""};
  const getHint=(row:string,col:string)=>{const c=TABLE_CELLS.find(c=>c.row===row&&c.col===col);return c?c.hint:""};
  const score=TABLE_CELLS.filter(c=>answers[c.row+"|"+c.col]===c.answer).length;

  if(phase==="menu")return(
    <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"2rem 1rem"}}>
      <div style={{padding:"8px 16px",borderBottom:"1px solid "+BORDER}}><Link href="/" style={{fontSize:12,color:MUTED,textDecoration:"none"}}>Retour accueil</Link></div>
      <div style={{maxWidth:700,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:"2rem"}}>
          <div style={{fontSize:13,color:ORANGE,fontWeight:600,letterSpacing:2,textTransform:"uppercase"}}>Monde 3 — Chapitre 8</div>
          <h1 style={{fontSize:28,fontWeight:700,margin:"0.5rem 0"}}>LinkedList, ArrayList, HashMap</h1>
          <p style={{color:MUTED,fontSize:15}}>P4a — Structures de donnees concretes</p>
          <a href="/fiches/Ch8_Fiche_Memo_LinkedList_HashMap.pdf" target="_blank" rel="noopener" style={{display:"inline-block",marginTop:8,padding:"6px 14px",background:"#1E293B",border:"1px solid #1E3A5F",borderRadius:8,fontSize:12,color:"#94A3B8",textDecoration:"none"}}>Fiche memo PDF</a>
        </div>
        <div style={{display:"grid",gap:14}}>
          <button onClick={()=>{setPhase("table");setAnswers({});setSubmitted(false)}}
            style={{padding:"1.2rem",border:"2px solid "+BORDER,borderRadius:12,background:CARD,cursor:"pointer",textAlign:"left"}}>
            <div style={{fontSize:17,fontWeight:600,color:TEAL}}>Tableau comparatif interactif</div>
            <div style={{fontSize:13,color:MUTED,marginTop:4}}>Completez le tableau Big O : 15 cases a remplir (ArrayList vs LinkedList vs HashMap)</div>
          </button>
          <button onClick={()=>{setPhase("quiz");setQIdx(0);setQScore(0);setSel(null);setShow(false)}}
            style={{padding:"1.2rem",border:"2px solid "+BORDER,borderRadius:12,background:CARD,cursor:"pointer",textAlign:"left"}}>
            <div style={{fontSize:17,fontWeight:600,color:GREEN}}>Quiz Structures</div>
            <div style={{fontSize:13,color:MUTED,marginTop:4}}>6 questions : noeuds, hash function, collisions, cas d'usage</div>
          </button>
        </div>
      </div>
    </div>
  );

  // ─── COMPARISON TABLE ───
  if(phase==="table"){
    return(
      <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
        <div style={{maxWidth:750,margin:"0 auto"}}>
          {back}
          <h2 style={{fontSize:18,fontWeight:700,color:TEAL,marginBottom:12}}>Completez le tableau de complexite</h2>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead>
                <tr>
                  <th style={{padding:"8px",textAlign:"left",borderBottom:"2px solid "+BORDER,color:MUTED}}>Operation</th>
                  {COLS.map(c=>(<th key={c} style={{padding:"8px",textAlign:"center",borderBottom:"2px solid "+BORDER,color:c==="ArrayList"?PURPLE:c==="LinkedList"?TEAL:ORANGE,fontWeight:700}}>{c}</th>))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map(row=>(
                  <tr key={row}>
                    <td style={{padding:"8px",borderBottom:"1px solid "+BORDER,color:TEXT,fontFamily:"Consolas,monospace",fontWeight:600}}>{row}</td>
                    {COLS.map(col=>{
                      const val=getCell(row,col);const correct=getCorrect(row,col);const isRight=submitted&&val===correct;const isWrong=submitted&&val&&val!==correct;
                      return(
                        <td key={col} style={{padding:"4px",borderBottom:"1px solid "+BORDER,textAlign:"center"}}>
                          <select value={val} onChange={e=>setCell(row,col,e.target.value)} disabled={submitted}
                            style={{padding:"6px 8px",background:isRight?GREEN+"20":isWrong?RED+"20":CARD,color:isRight?GREEN:isWrong?RED:TEXT,border:"1px solid "+(isRight?GREEN:isWrong?RED:BORDER),borderRadius:6,fontSize:12,cursor:submitted?"default":"pointer"}}>
                            <option value="">--</option>
                            {OPTIONS.map(o=>(<option key={o} value={o}>{o}</option>))}
                          </select>
                          {submitted&&isWrong&&<div style={{fontSize:10,color:GREEN,marginTop:2}}>{correct}</div>}
                          {submitted&&isRight&&<div style={{fontSize:10,color:GREEN,marginTop:2}}>{getHint(row,col)}</div>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!submitted&&Object.keys(answers).length>=TABLE_CELLS.length&&(
            <button onClick={()=>setSubmitted(true)} style={{marginTop:16,width:"100%",padding:"10px",background:TEAL,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Verifier ({Object.keys(answers).length}/{TABLE_CELLS.length} remplis)</button>
          )}
          {!submitted&&Object.keys(answers).length<TABLE_CELLS.length&&(
            <div style={{marginTop:8,fontSize:12,color:MUTED,textAlign:"center"}}>{Object.keys(answers).length}/{TABLE_CELLS.length} cases remplies</div>
          )}
          {submitted&&(
            <div style={{marginTop:16,padding:"14px",background:score>=12?GREEN+"15":ORANGE+"15",borderRadius:8,textAlign:"center"}}>
              <div style={{fontSize:28,fontWeight:800,color:score>=12?GREEN:ORANGE}}>{score}/{TABLE_CELLS.length}</div>
              <button onClick={()=>setPhase("menu")} style={{marginTop:8,padding:"8px 20px",background:TEAL,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Retour</button>
            </div>
          )}
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
        <div style={{display:"grid",gap:8}}>{q.o.map((o,i)=>{let bg=CARD,bd=BORDER;if(show){if(i===q.c){bg=GREEN+"20";bd=GREEN}else if(i===sel){bg=RED+"20";bd=RED}}return(<button key={i} onClick={()=>{if(show)return;setSel(i);setShow(true);if(i===q.c)setQScore(s=>s+1)}} disabled={show} style={{padding:"10px 14px",border:"2px solid "+bd,borderRadius:8,background:bg,cursor:show?"default":"pointer",textAlign:"left",fontSize:14,color:TEXT}}>{o}</button>)})}</div>
        {show&&<><div style={{marginTop:10,padding:"10px 14px",background:GREEN+"15",borderRadius:8,fontSize:13,color:GREEN}}>{q.e}</div><button onClick={()=>{setQIdx(i=>i+1);setSel(null);setShow(false)}} style={{marginTop:10,width:"100%",padding:"10px",background:GREEN,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Suivant</button></>}
      </div>
    </div>
  );
}
