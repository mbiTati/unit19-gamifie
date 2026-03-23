"use client";
import { SpinningWheel, Buzzer } from "@/components/GameAnimations";
import { useState } from "react";
import Link from "next/link";

const BG="#0B1120",CARD="#111827",BORDER="#1E3A5F",TEXT="#E2E8F0",MUTED="#94A3B8",GREEN="#16A34A",RED="#DC2626",ORANGE="#F97316",PURPLE="#7C3AED",TEAL="#0891B2",AMBER="#D97706",BLUE="#3B82F6";

const LO_COLORS:any={"LO1":"#7C3AED","LO2":"#0891B2","LO3":"#F97316","LO4":"#D97706"};

const CHAPTERS=[
  {ch:1,name:"Design Specification ADT",lo:"LO1",criteria:"P1",game:"/monde-1/ch1-design-spec",ex:"/exercice/ch1",color:PURPLE,duree:"2h",obj:"ADT, 5 types fondamentaux",eval:"Drag ADT + fill-in-the-blank"},
  {ch:2,name:"Memory Stack",lo:"LO1",criteria:"P2",game:"/monde-1/ch2-memory-stack",ex:"/exercice/ch2",color:PURPLE,duree:"1h30",obj:"Stack/Heap, call stack, recursion",eval:"Simulateur call stack"},
  {ch:3,name:"Queue FIFO + Tri",lo:"LO1",criteria:"M1/M2",game:"/monde-1/ch3-fifo-sorting",ex:"/exercice/ch3",color:PURPLE,duree:"2h",obj:"FIFO, Bubble/Quick/Merge Sort",eval:"Tri anime + Course algos + FIFO sim"},
  {ch:4,name:"Shortest Path",lo:"LO1",criteria:"D1",game:"/monde-1/ch4-shortest-path",ex:"/exercice/ch4",color:PURPLE,duree:"2h",obj:"Graphes, BFS, Dijkstra",eval:"Graphe interactif"},
  {ch:5,name:"Spec Formelle",lo:"LO2",criteria:"P3",game:"/monde-2/ch5-formal-spec",ex:"/exercice/ch5",color:TEAL,duree:"2h",obj:"Notation imperative, VDM, SDL, ASN.1",eval:"Builder + VDM/SDL + Classifier"},
  {ch:6,name:"Encapsulation",lo:"LO2",criteria:"M3",game:"/monde-2/ch6-encapsulation",ex:"/exercice/ch6",color:TEAL,duree:"2h",obj:"Encapsulation, info hiding, interfaces",eval:"Simulateur encap + quiz"},
  {ch:7,name:"ADT > POO",lo:"LO2",criteria:"D2",game:"/monde-2/ch7-adt-oop",ex:"/exercice/ch7",color:TEAL,duree:"1h30",obj:"5 arguments, conditions, traduction Java",eval:"Arguments + Conditions quiz"},
  {ch:8,name:"Design Patterns",lo:"LO2",criteria:"M3",game:"/monde-2/ch8-design-patterns",ex:"/exercice/ch8",color:TEAL,duree:"2h",obj:"Singleton, Factory, Observer, Strategy",eval:"Explorer + Match + Quiz"},
  {ch:9,name:"LinkedList/HashMap",lo:"LO3",criteria:"P4a",game:"/monde-3/ch8-linkedlist-hashmap",ex:"/exercice/ch8",color:ORANGE,duree:"2h",obj:"LinkedList 3 types, HashMap hash+buckets",eval:"SVG interactive + quiz"},
  {ch:10,name:"Tree BST + Tri",lo:"LO3",criteria:"P4b",game:"/monde-3/ch9-queue-tree-sort",ex:"/exercice/ch9",color:ORANGE,duree:"2h",obj:"BST, inorder/preorder/postorder, tri",eval:"BST visuel + quiz"},
  {ch:11,name:"Exceptions + JUnit",lo:"LO3",criteria:"P5",game:"/monde-3/ch10-exceptions-junit",ex:"/exercice/ch10",color:ORANGE,duree:"2h",obj:"try-catch, throw/throws, JUnit 5, AAA",eval:"Debug puzzle + Code Builder + Quiz"},
  {ch:12,name:"ADT + Big O",lo:"LO3",criteria:"M4/D3",game:"/monde-3/ch11-adt-bigo",ex:"/exercice/ch11",color:ORANGE,duree:"1h30",obj:"Choisir ADT, evaluer complexite",eval:"Problem Solver + Analyzer"},
  {ch:13,name:"Asymptotique",lo:"LO4",criteria:"P6",game:"/monde-4/ch12-asymptotic",ex:"/exercice/ch12",color:AMBER,duree:"2h",obj:"Big O, Omega, Theta, calcul",eval:"Rank + Code>O() + Calculateur"},
  {ch:14,name:"Efficacite",lo:"LO4",criteria:"P7",game:"/monde-4/ch13-efficiency",ex:"/exercice/ch13",color:AMBER,duree:"1h30",obj:"Benchmark Java, nanoTime, JMH",eval:"Benchmark simule + Quiz"},
  {ch:15,name:"Trade-offs",lo:"LO4",criteria:"M5/D4",game:"/monde-4/ch14-tradeoffs",ex:"/exercice/ch14",color:AMBER,duree:"2h",obj:"Temps vs espace, 3 benefices",eval:"Balance + Benchmark + Quiz"},
];

export default function ProfPage(){
  const[filter,setFilter]=useState("all");
  const[expanded,setExpanded]=useState(-1);
  const[view,setView]=useState("planning");

  const filtered=filter==="all"?CHAPTERS:CHAPTERS.filter(function(c){return c.lo===filter});

  return(
    <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"2rem 1rem"}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem"}}>
          <div>
            <div style={{fontSize:11,color:RED,fontWeight:600,letterSpacing:2,textTransform:"uppercase"}}>Page cachee</div>
            <h1 style={{fontSize:26,fontWeight:700,margin:"0.3rem 0"}}>Tableau de bord Enseignant</h1>
            <p style={{color:MUTED,fontSize:13}}>Mme MBI - Unit 19</p>
          </div>
          <Link href="/" style={{padding:"8px 16px",background:CARD,border:"1px solid "+BORDER,borderRadius:8,color:MUTED,textDecoration:"none",fontSize:13}}>Retour site</Link>
        </div>

        <div style={{display:"flex",gap:6,marginBottom:16}}>
          {["planning","resources","criteria","tools"].map(function(v){return(
            <button key={v} onClick={function(){setView(v)}} style={{padding:"8px 16px",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",background:view===v?BLUE:"transparent",color:view===v?"white":MUTED,border:"1px solid "+(view===v?"transparent":BORDER)}}>
              {v==="planning"?"Planning":v==="resources"?"Ressources":v==="criteria"?"Criteres":"Outils classe"}
            </button>
          )})}
        </div>

        <div style={{display:"flex",gap:6,marginBottom:16}}>
          {["all","LO1","LO2","LO3","LO4"].map(function(f){return(
            <button key={f} onClick={function(){setFilter(f)}} style={{padding:"6px 14px",borderRadius:20,fontSize:12,fontWeight:600,cursor:"pointer",background:filter===f?(f==="all"?BLUE:(LO_COLORS[f]||BLUE)):"transparent",color:filter===f?"white":MUTED,border:"1px solid "+(filter===f?"transparent":BORDER)}}>
              {f==="all"?"Tous":f}
            </button>
          )})}
        </div>

        {view==="planning"&&(
          <div style={{display:"grid",gap:8}}>
            {filtered.map(function(ch){return(
              <div key={ch.ch} style={{border:"1px solid "+(expanded===ch.ch?ch.color:BORDER),borderRadius:10,overflow:"hidden"}}>
                <button onClick={function(){setExpanded(expanded===ch.ch?-1:ch.ch)}} style={{width:"100%",padding:"12px 16px",background:expanded===ch.ch?ch.color+"15":CARD,border:"none",cursor:"pointer",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:11,padding:"2px 8px",borderRadius:10,background:(LO_COLORS[ch.lo]||BLUE)+"30",color:LO_COLORS[ch.lo]||BLUE,fontWeight:600}}>{ch.lo}</span>
                    <span style={{fontSize:11,padding:"2px 6px",borderRadius:6,background:BORDER,color:MUTED}}>{ch.criteria}</span>
                    <span style={{fontWeight:600,fontSize:14,color:TEXT}}>{ch.name}</span>
                  </div>
                  <span style={{fontSize:11,color:MUTED}}>{ch.duree}</span>
                </button>
                {expanded===ch.ch&&(
                  <div style={{padding:"0 16px 16px"}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10}}>
                      <div style={{padding:"10px",background:"#0D1117",borderRadius:8}}>
                        <div style={{fontSize:11,fontWeight:600,color:GREEN,marginBottom:4}}>OBJECTIFS</div>
                        <div style={{fontSize:12,color:TEXT}}>{ch.obj}</div>
                      </div>
                      <div style={{padding:"10px",background:"#0D1117",borderRadius:8}}>
                        <div style={{fontSize:11,fontWeight:600,color:PURPLE,marginBottom:4}}>EVALUATION (site)</div>
                        <div style={{fontSize:12,color:TEXT}}>{ch.eval}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:6,marginTop:10}}>
                      <Link href={ch.game} style={{padding:"6px 12px",background:ch.color+"20",border:"1px solid "+ch.color,borderRadius:6,fontSize:11,color:ch.color,textDecoration:"none",fontWeight:600}}>Jeu</Link>
                      <Link href={ch.ex} style={{padding:"6px 12px",background:GREEN+"20",border:"1px solid "+GREEN,borderRadius:6,fontSize:11,color:GREEN,textDecoration:"none",fontWeight:600}}>Exercice</Link>
                    </div>
                  </div>
                )}
              </div>
            )})}
          </div>
        )}

        {view==="resources"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20}}>
              <div style={{padding:"14px",background:CARD,borderRadius:10,border:"1px solid "+BORDER,textAlign:"center"}}>
                <div style={{fontSize:32}}></div>
                <div style={{fontSize:20,fontWeight:700,color:TEXT}}>25</div>
                <div style={{fontSize:12,color:MUTED}}>PPTX (principaux + supplements)</div>
              </div>
              <div style={{padding:"14px",background:CARD,borderRadius:10,border:"1px solid "+BORDER,textAlign:"center"}}>
                <div style={{fontSize:32}}></div>
                <div style={{fontSize:20,fontWeight:700,color:TEXT}}>15</div>
                <div style={{fontSize:12,color:MUTED}}>Fiches memo PDF</div>
              </div>
              <div style={{padding:"14px",background:CARD,borderRadius:10,border:"1px solid "+BORDER,textAlign:"center"}}>
                <div style={{fontSize:32}}></div>
                <div style={{fontSize:20,fontWeight:700,color:TEXT}}>33+</div>
                <div style={{fontSize:12,color:MUTED}}>Mini-jeux interactifs</div>
              </div>
            </div>
            <div style={{padding:"14px",background:CARD,borderRadius:10,border:"1px solid "+BORDER}}>
              <div style={{fontSize:14,fontWeight:600,color:TEXT,marginBottom:8}}>Exercices Entreprise</div>
              <div style={{fontSize:12,color:MUTED}}>
                <div>Exercice 1 - Gestion emprunts velos (LinkedList, P4+P5+M4)</div>
                <div>Exercice 2 - Suivi interventions IT (HashMap, P4+P5+M4+D3)</div>
                <div>Exercice 3 - Reservation salles (HashMap+Queue, P4+P5+M4+D3)</div>
              </div>
            </div>
          </div>
        )}

        {view==="criteria"&&(
          <div>
            {["LO1","LO2","LO3","LO4"].map(function(lo){return(
              <div key={lo} style={{marginBottom:20}}>
                <div style={{fontSize:16,fontWeight:700,color:LO_COLORS[lo]||BLUE,marginBottom:8}}>{lo}</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:6}}>
                  {["Pass","Merit","Distinction"].map(function(level){
                    var chs=CHAPTERS.filter(function(c){return c.lo===lo});
                    var levelCh=level==="Pass"?chs.filter(function(c){return c.criteria.startsWith("P")}):level==="Merit"?chs.filter(function(c){return c.criteria.startsWith("M")}):chs.filter(function(c){return c.criteria.startsWith("D")});
                    return(
                      <div key={level} style={{padding:"10px",background:CARD,borderRadius:8,border:"1px solid "+BORDER}}>
                        <div style={{fontSize:12,fontWeight:600,color:level==="Pass"?GREEN:level==="Merit"?BLUE:PURPLE,marginBottom:6}}>{level}</div>
                        {levelCh.map(function(c){return <div key={c.ch} style={{fontSize:11,color:MUTED,padding:"2px 0"}}>{c.criteria}: {c.name}</div>})}
                      </div>
                    );
                  })}
                </div>
              </div>
            )})}
          </div>
        )}

        
        {view==="tools"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
            <div style={{padding:"16px",background:"#111827",borderRadius:12,border:"1px solid #1E3A5F"}}>
              <div style={{fontSize:16,fontWeight:700,color:"#F97316",marginBottom:12}}>Roue du hasard</div>
              <div style={{fontSize:12,color:"#94A3B8",marginBottom:12}}>Tirage au sort du theme en classe</div>
              <SpinningWheel segments={[{label:"ADT",color:"#7C3AED"},{label:"HashMap",color:"#0891B2"},{label:"LinkedList",color:"#16A34A"},{label:"Exceptions",color:"#DC2626"},{label:"JUnit",color:"#F97316"},{label:"Big O",color:"#D97706"},{label:"Tri",color:"#3B82F6"},{label:"Patterns",color:"#7C3AED"}]} onResult={function(){}}/>
            </div>
            <div style={{padding:"16px",background:"#111827",borderRadius:12,border:"1px solid #1E3A5F",textAlign:"center"}}>
              <div style={{fontSize:16,fontWeight:700,color:"#16A34A",marginBottom:12}}>Buzzer</div>
              <div style={{fontSize:12,color:"#94A3B8",marginBottom:20}}>Pour quiz en classe</div>
              <div style={{display:"flex",justifyContent:"center"}}><Buzzer onBuzz={function(){}} color="#DC2626"/></div>
            </div>
          </div>
        )}

<div style={{textAlign:"center",marginTop:"2rem",fontSize:11,color:BORDER}}>Page accessible via /prof</div>
      </div>
    </div>
  );
}
