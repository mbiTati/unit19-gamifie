"use client";
import Link from "next/link";
import { useState } from "react";

const BG = "#0B1120";
const CARD = "#111827";
const CARD2 = "#1E293B";
const BORDER = "#1E3A5F";
const TEXT = "#E2E8F0";
const MUTED = "#94A3B8";
const DIM = "#64748B";
const ACCENT = "#00A896";
const ORANGE = "#F97316";
const PURPLE = "#7C3AED";
const RED = "#DC2626";
const BLUE = "#3B82F6";
const GREEN = "#16A34A";
const TEAL = "#0891B2";

interface Ch { id: string; num: number; name: string; criteria: string; pptx?: string; supplement?: string; game: string; exGuide?: string; exComplet?: string; fiche?: string; }
interface W { id: number; name: string; title: string; lo: string; emoji: string; color: string; glow: string; weeks: string; chapters: Ch[]; boss: { route: string; name: string }; }

const WORLDS: W[] = [
  { id:1, name:"Monde 1", title:"Explorer les ADT", lo:"LO1", emoji:"🗺️", color:PURPLE, glow:"#7C3AED30", weeks:"Sem. 1-6",
    chapters:[
      { id:"ch1",num:1,name:"Design Specification",criteria:"P1",pptx:"/docs/pptx/Ch1_P1_Design_Specification_ADT.pptx",game:"/monde-1/ch1-design-spec",exGuide:"/exercices/ch1/exercice-guide/StudentDirectory.java",exComplet:"/exercices/ch1/exercice-complet/ExerciceBibliotheque.java",fiche:"/fiches/Ch1_Fiche_Memo_ADT.pdf" },
      { id:"ch2",num:2,name:"Memory Stack & Calls",criteria:"P2",pptx:"/docs/pptx/Ch2_P2_Memory_Stack_Function_Calls.pptx",game:"/monde-1/ch2-memory-stack",exGuide:"/exercices/ch2/exercice-guide/TraceCallStack.java",exComplet:"/exercices/ch2/exercice-complet/ExerciceRecursion.java",fiche:"/fiches/Ch2_Fiche_Memo_Memory_Stack.pdf" },
      { id:"ch3",num:3,name:"FIFO Queue + Sorting",criteria:"M1/M2",pptx:"/docs/pptx/Ch3_M1M2_FIFO_Queue_Sorting.pptx",game:"/monde-1/ch3-fifo-sorting",exGuide:"/exercices/ch3/exercice-guide/QueueCinema.java",exComplet:"/exercices/ch3/exercice-complet/ComparaisonTri.java",fiche:"/fiches/Ch3_Fiche_Memo_FIFO_Sorting.pdf" },
      { id:"ch4",num:4,name:"Shortest Path",criteria:"D1",pptx:"/docs/pptx/Ch4_D1_Shortest_Path_BFS_Dijkstra.pptx",game:"/monde-1/ch4-shortest-path",exGuide:"/exercices/ch4/exercice-guide/TraceDijkstra.java",fiche:"/fiches/Ch4_Fiche_Memo_Shortest_Path.pdf" },
    ], boss:{route:"/monde-1/boss-lo1",name:"Boss LO1"} },
  { id:2, name:"Monde 2", title:"Notation formelle", lo:"LO2", emoji:"📜", color:TEAL, glow:"#0891B230", weeks:"Sem. 7-10",
    chapters:[
      { id:"ch5",num:5,name:"Stack impératif",criteria:"P3",pptx:"/docs/pptx/Ch5_P3_Formal_Spec_Stack.pptx",supplement:"/docs/pptx/Ch5_SUPPLEMENT.pptx",game:"/monde-2/ch5-formal-spec",exGuide:"/exercices/ch5/exercice-guide/SpecQueue.java",fiche:"/fiches/Ch5_Fiche_Memo_Notation_Formelle.pdf" },
      { id:"ch6",num:6,name:"Encapsulation",criteria:"M3",pptx:"/docs/pptx/Ch6_M3_Encapsulation_Information_Hiding.pptx",supplement:"/docs/pptx/Ch6_SUPPLEMENT.pptx",game:"/monde-2/ch6-encapsulation",exGuide:"/exercices/ch6/exercice-guide/EncapsulationGuide.java",exComplet:"/exercices/ch6/exercice-complet/CompteEnBanque.java",fiche:"/fiches/Ch6_Fiche_Memo_Encapsulation.pdf" },
      { id:"ch7",num:7,name:"ADT et POO",criteria:"D2",pptx:"/docs/pptx/Ch7_D2_ADT_Base_POO.pptx",supplement:"/docs/pptx/Ch7_SUPPLEMENT.pptx",game:"/monde-2/ch7-adt-oop",exGuide:"/exercices/ch7/exercice-guide/ArgumentationADT.java",exComplet:"/exercices/ch7/exercice-complet/RedactionD2.java",fiche:"/fiches/Ch7_Fiche_Memo_ADT_POO.pdf" },
    ], boss:{route:"/monde-2/boss-lo2",name:"Boss LO2"} },
  { id:3, name:"Monde 3", title:"Implémenter", lo:"LO3", emoji:"⚙️", color:ORANGE, glow:"#F9731630", weeks:"Sem. 11-18",
    chapters:[
      { id:"ch8",num:8,name:"LinkedList + HashMap",criteria:"P4a",pptx:"/docs/pptx/Ch8_P4a_LinkedList_HashMap.pptx",supplement:"/docs/pptx/Ch8_SUPPLEMENT.pptx",game:"/monde-3/ch8-linkedlist-hashmap",exGuide:"/exercices/ch8/exercice-guide/GestionEmployes.java",exComplet:"/exercices/ch8/exercice-complet/GestionPharmacie.java",fiche:"/fiches/Ch8_Fiche_Memo_LinkedList_HashMap.pdf" },
      { id:"ch9",num:9,name:"Tree + Sorting",criteria:"P4b",pptx:"/docs/pptx/Ch9_P4b_Tree_Sorting.pptx",supplement:"/docs/pptx/Ch9_SUPPLEMENT.pptx",game:"/monde-3/ch9-queue-tree-sort",exGuide:"/exercices/ch9/exercice-guide/BSTreeGuide.java",fiche:"/fiches/Ch9_Fiche_Memo_Tree_Sorting.pdf" },
      { id:"ch10",num:10,name:"Exceptions + JUnit",criteria:"P5",pptx:"/docs/pptx/Ch10_P5_Exceptions_JUnit5.pptx",supplement:"/docs/pptx/Ch10_SUPPLEMENT.pptx",game:"/monde-3/ch10-exceptions-junit",exGuide:"/exercices/ch10/exercice-guide/ExceptionsGuide.java",exComplet:"/exercices/ch10/exercice-complet/GestionTicketsTests.java",fiche:"/fiches/Ch10_Fiche_Memo_Exceptions_JUnit.pdf" },
      { id:"ch11",num:11,name:"ADT + Big O",criteria:"M4/D3",pptx:"/docs/pptx/Ch11_M4D3_ADT_BigO.pptx",supplement:"/docs/pptx/Ch11_SUPPLEMENT.pptx",game:"/monde-3/ch11-adt-bigo",exGuide:"/exercices/ch11/exercice-guide/AnalyseComplexite.java",fiche:"/fiches/Ch11_Fiche_Memo_ADT_BigO.pdf" },
    ], boss:{route:"/monde-3/boss-lo3",name:"Boss LO3"} },
  { id:4, name:"Monde 4", title:"Évaluer l'efficacité", lo:"LO4", emoji:"📊", color:GREEN, glow:"#16A34A30", weeks:"Sem. 19-22",
    chapters:[
      { id:"ch12",num:12,name:"Analyse asymptotique",criteria:"P6",pptx:"/docs/pptx/Ch12_P6_Asymptotic_Analysis.pptx",supplement:"/docs/pptx/Ch12_SUPPLEMENT.pptx",game:"/monde-4/ch12-asymptotic",exGuide:"/exercices/ch12/exercice-guide/BigOAnalyse.java",fiche:"/fiches/Ch12_Fiche_Memo_Asymptotic.pdf" },
      { id:"ch13",num:13,name:"Mesurer l'efficacité",criteria:"P7",pptx:"/docs/pptx/Ch13_P7_Measuring_Efficiency.pptx",supplement:"/docs/pptx/Ch13_SUPPLEMENT.pptx",game:"/monde-4/ch13-efficiency",exGuide:"/exercices/ch13/exercice-guide/BenchmarkJava.java",fiche:"/fiches/Ch13_Fiche_Memo_Efficiency.pdf" },
      { id:"ch14",num:14,name:"Trade-offs",criteria:"M5/D4",pptx:"/docs/pptx/Ch14_M5D4_Tradeoffs_Independence.pptx",supplement:"/docs/pptx/Ch14_SUPPLEMENT.pptx",game:"/monde-4/ch14-tradeoffs",exGuide:"/exercices/ch14/exercice-guide/TradeoffAnalyse.java",fiche:"/fiches/Ch14_Fiche_Memo_Tradeoffs.pdf" },
    ], boss:{route:"/monde-4/boss-lo4",name:"Boss LO4"} },
];

function Pill({text,color,bg}:{text:string;color:string;bg:string}) {
  return <span style={{fontSize:11,fontWeight:600,color,background:bg,padding:"2px 8px",borderRadius:4,whiteSpace:"nowrap" as const}}>{text}</span>;
}

function ResBtn({href,label,icon,color}:{href:string;label:string;icon:string;color:string}) {
  return <a href={href} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,fontWeight:600,color,padding:"5px 10px",borderRadius:6,border:`1px solid ${color}40`,background:`${color}15`,textDecoration:"none",whiteSpace:"nowrap" as const,transition:"background 0.2s"}}><span style={{fontSize:13}}>{icon}</span>{label}</a>;
}

function ChapterRow({ch,wColor}:{ch:Ch;wColor:string}) {
  const [open,setOpen]=useState(false);
  return (
    <div style={{borderBottom:`1px solid ${BORDER}`,background:open?`${wColor}08`:"transparent"}}>
      <button onClick={()=>setOpen(!open)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:"transparent",border:"none",cursor:"pointer",color:TEXT,textAlign:"left" as const}}>
        <span style={{width:28,height:28,borderRadius:"50%",background:`${wColor}25`,color:wColor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,flexShrink:0}}>{ch.num}</span>
        <span style={{flex:1,fontSize:14,fontWeight:500}}>{ch.name}</span>
        <Pill text={ch.criteria} color={wColor} bg={`${wColor}20`} />
        <span style={{color:DIM,fontSize:16,transition:"transform 0.2s",transform:open?"rotate(180deg)":"rotate(0)"}}>▾</span>
      </button>
      {open && (
        <div style={{padding:"4px 12px 12px 50px",display:"flex",flexWrap:"wrap" as const,gap:6}}>
          {ch.pptx && <ResBtn href={ch.pptx} label="Cours PPTX" icon="📊" color={BLUE} />}
          {ch.supplement && <ResBtn href={ch.supplement} label="Supplément" icon="📋" color={DIM} />}
          <Link href={ch.game} style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,fontWeight:600,color:ORANGE,padding:"5px 10px",borderRadius:6,border:`1px solid ${ORANGE}40`,background:`${ORANGE}15`,textDecoration:"none",whiteSpace:"nowrap" as const}}>
            <span style={{fontSize:13}}>🎮</span>Mini-jeu
          </Link>
          {ch.fiche && <ResBtn href={ch.fiche} label="Fiche mémo" icon="📄" color={PURPLE} />}
          {ch.exGuide && <ResBtn href={ch.exGuide} label="Exercice guidé" icon="✏️" color={TEAL} />}
          {ch.exComplet && <ResBtn href={ch.exComplet} label="Exercice complet" icon="💻" color={GREEN} />}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <div style={{maxWidth:900,margin:"0 auto",padding:"1.5rem 1rem",fontFamily:"'Segoe UI',system-ui,sans-serif",color:TEXT}}>
      {/* HERO */}
      <div style={{textAlign:"center" as const,padding:"2.5rem 1rem 2rem",marginBottom:"1.5rem",borderRadius:16,background:`linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)`,border:`1px solid ${BORDER}`}}>
        <div style={{fontSize:48,lineHeight:1,marginBottom:8}}>🏰</div>
        <div style={{fontSize:12,fontWeight:600,letterSpacing:3,textTransform:"uppercase" as const,color:ACCENT}}>Unit 19 — Data Structures & Algorithms</div>
        <h1 style={{fontSize:34,fontWeight:800,margin:"0.5rem 0",color:"white"}}>Aventure Gamifiée</h1>
        <p style={{color:MUTED,fontSize:14,maxWidth:500,margin:"0.5rem auto 1rem"}}>4 mondes, 14 chapitres — Cours, mini-jeux, exercices Java et fiches mémo</p>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap" as const}}>
          <Pill text="📊 24 PPTX" color={BLUE} bg={`${BLUE}20`} />
          <Pill text="🎮 15 jeux" color={ORANGE} bg={`${ORANGE}20`} />
          <Pill text="📄 14 fiches" color={PURPLE} bg={`${PURPLE}20`} />
          <Pill text="💻 42 Java" color={GREEN} bg={`${GREEN}20`} />
          <Pill text="👾 5 boss" color={RED} bg={`${RED}20`} />
        </div>
      </div>

      {/* PIPELINE */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4,marginBottom:"1.5rem",flexWrap:"wrap" as const,fontSize:12,color:MUTED}}>
        <span style={{color:PURPLE,fontWeight:600}}>LO1</span><span>→</span>
        <span style={{color:TEAL,fontWeight:600}}>LO2</span><span>→</span>
        <span style={{color:ORANGE,fontWeight:600}}>LO3</span><span>→</span>
        <span style={{color:GREEN,fontWeight:600}}>LO4</span><span>→</span>
        <span style={{color:RED,fontWeight:600}}>Boss Final</span>
      </div>

      {/* WORLDS */}
      <div style={{display:"grid",gap:16}}>
        {WORLDS.map(w=>(
          <div key={w.id} style={{background:CARD,borderRadius:14,border:`1px solid ${BORDER}`,overflow:"hidden",boxShadow:`0 0 20px ${w.glow}`}}>
            <div style={{padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${BORDER}`,background:`${w.color}08`}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:24}}>{w.emoji}</span>
                <div>
                  <div style={{fontSize:15,fontWeight:700,color:w.color}}>{w.name} — {w.lo}</div>
                  <div style={{fontSize:12,color:MUTED}}>{w.title}</div>
                </div>
              </div>
              <span style={{fontSize:11,color:DIM}}>{w.weeks}</span>
            </div>
            <div>
              {w.chapters.map(ch=> <ChapterRow key={ch.id} ch={ch} wColor={w.color} />)}
            </div>
            <Link href={w.boss.route} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"10px",margin:"8px 12px 12px",borderRadius:8,background:`${w.color}12`,border:`1px dashed ${w.color}40`,textDecoration:"none",color:w.color,fontWeight:600,fontSize:13}}>
              <span style={{fontSize:16}}>👾</span>{w.boss.name} — Quiz transversal
            </Link>
          </div>
        ))}
      </div>

      {/* BOSS FINAL */}
      <Link href="/boss-final" style={{display:"block",marginTop:16,borderRadius:14,overflow:"hidden",border:`1px solid ${RED}`,textDecoration:"none",textAlign:"center" as const,padding:"1.5rem",background:`linear-gradient(135deg, ${RED}20, ${ORANGE}20)`,boxShadow:`0 0 30px ${RED}30`}}>
        <div style={{fontSize:40}}>👑</div>
        <div style={{fontSize:20,fontWeight:700,color:"white",marginTop:4}}>Boss Final — Unit 19</div>
        <div style={{fontSize:13,color:MUTED,marginTop:4}}>20 questions LO1→LO4 — 4 min — Prouvez votre maîtrise</div>
        <div style={{display:"inline-block",marginTop:12,padding:"8px 24px",background:RED,color:"white",borderRadius:8,fontWeight:700,fontSize:14}}>Affronter le boss</div>
      </Link>

      {/* FOOTER */}
      <div style={{textAlign:"center" as const,marginTop:"2rem",padding:"1rem",borderTop:`1px solid ${BORDER}`}}>
        <div style={{fontSize:12,color:DIM}}>Mme MBI — Bachelor 2 — Programmation Java</div>
        <div style={{fontSize:11,color:`${DIM}80`,marginTop:4}}>Unit 19 : Data Structures & Algorithms — 22 semaines, 90 périodes</div>
      </div>
    </div>
  );
}
