"use client";
import { useState } from "react";

const BG="#0B1120",CARD="#111827",BORDER="#1E3A5F",TEXT="#E2E8F0",MUTED="#94A3B8",GREEN="#16A34A",TEAL="#0891B2",PURPLE="#7C3AED",RED="#DC2626",ORANGE="#F97316",BLUE="#3B82F6";

const PATTERNS=[
  {name:"Singleton",cat:"Création",desc:"Garantit qu'une classe n'a qu'UNE seule instance et fournit un point d'accès global.",code:"public class DatabaseConnection {\n    private static DatabaseConnection instance;\n    private DatabaseConnection() {} // constructeur privé !\n    public static DatabaseConnection getInstance() {\n        if (instance == null)\n            instance = new DatabaseConnection();\n        return instance;\n    }\n}",usage:"Base de données, configuration, logger"},
  {name:"Factory Method",cat:"Création",desc:"Définit une méthode de création dans une interface. La sous-classe décide quel objet créer.",code:"interface Animal { void parler(); }\nclass Chien implements Animal {\n    public void parler() { System.out.println(\"Woof!\"); }\n}\nclass AnimalFactory {\n    public static Animal creer(String type) {\n        if (type.equals(\"chien\")) return new Chien();\n        if (type.equals(\"chat\")) return new Chat();\n        throw new IllegalArgumentException(\"Type inconnu\");\n    }\n}",usage:"Quand on ne sait pas à l'avance quel type créer"},
  {name:"Builder",cat:"Création",desc:"Construit un objet complexe étape par étape, séparant la construction de la représentation.",code:"Pizza pizza = new Pizza.Builder(\"margherita\")\n    .taille(\"grande\")\n    .supplement(\"champignons\")\n    .supplement(\"olives\")\n    .build();",usage:"Objets avec beaucoup de paramètres optionnels"},
  {name:"Adapter",cat:"Structure",desc:"Permet à deux interfaces incompatibles de travailler ensemble (convertisseur).",code:"interface MediaPlayer { void play(String file); }\ninterface AdvancedPlayer { void playMp4(String f); }\n// L'Adapter fait le pont :\nclass MediaAdapter implements MediaPlayer {\n    AdvancedPlayer advanced;\n    public void play(String file) {\n        advanced.playMp4(file); // convertit l'appel\n    }\n}",usage:"Intégration de bibliothèques externes"},
  {name:"Composite",cat:"Structure",desc:"Compose des objets en structure d'arbre. Client traite objets simples et composites uniformément.",code:"interface Employe { void afficher(); }\nclass Developpeur implements Employe {\n    public void afficher() { /* ... */ }\n}\nclass GroupeEmployes implements Employe {\n    private List<Employe> employes = new ArrayList<>();\n    public void afficher() {\n        for (Employe e : employes) e.afficher();\n    }\n}",usage:"Arbres hiérarchiques, systèmes de fichiers, menus"},
  {name:"Observer",cat:"Comportement",desc:"Quand un objet change d'état, tous ses \"abonnés\" sont notifiés automatiquement.",code:"interface Observer { void update(String msg); }\nclass Canal {\n    List<Observer> abonnes = new ArrayList<>();\n    public void publier(String msg) {\n        for (Observer o : abonnes) o.update(msg);\n    }\n}",usage:"Notifications, événements UI, pub/sub"},
  {name:"Strategy",cat:"Comportement",desc:"Définit une famille d'algorithmes et permet d'en changer dynamiquement.",code:"interface TriStrategy { void trier(int[] arr); }\nclass BubbleSort implements TriStrategy { ... }\nclass QuickSort implements TriStrategy { ... }\nclass Trieur {\n    private TriStrategy strategy;\n    public void setStrategy(TriStrategy s) {\n        this.strategy = s;\n    }\n    public void executer(int[] arr) {\n        strategy.trier(arr);\n    }\n}",usage:"Algorithmes interchangeables, calcul de prix"},
];

const QUIZ=[
  {q:"Quel pattern garantit une seule instance d'une classe ?",o:["Factory","Singleton","Builder","Observer"],c:1,e:"Singleton = constructeur privé + méthode statique getInstance(). UNE seule instance."},
  {q:"Factory Method est utile quand :",o:["On veut une seule instance","On ne sait pas à l'avance quel type d'objet créer","On veut notifier des observateurs","On veut trier"],c:1,e:"Factory = la sous-classe décide quel objet créer. Utile pour le pseudo-polymorphisme à l'instanciation."},
  {q:"Quel pattern compose des objets en arbre ?",o:["Adapter","Observer","Composite","Singleton"],c:2,e:"Composite = arbre d'objets. Le client traite feuilles et composites de la même façon via l'interface commune."},
  {q:"Observer pattern permet de :",o:["Créer un seul objet","Notifier automatiquement les abonnés quand l'état change","Adapter des interfaces","Construire étape par étape"],c:1,e:"Observer = pub/sub. Quand l'objet observé change, tous les observers sont notifiés."},
  {q:"Strategy pattern permet de :",o:["Créer des objets","Observer des changements","Changer d'algorithme dynamiquement","Adapter des interfaces"],c:2,e:"Strategy = famille d'algorithmes interchangeables. On peut changer l'algorithme à runtime."},
  {q:"Les 3 catégories de Design Patterns (GoF) sont :",o:["Input, Output, Process","Création, Structure, Comportement","Simple, Moyen, Complexe","Java, Python, C++"],c:1,e:"GoF (Gang of Four) : Création (comment créer), Structure (comment composer), Comportement (comment interagir)."},
  {q:"Quel pattern fait le pont entre deux interfaces incompatibles ?",o:["Composite","Observer","Adapter","Builder"],c:2,e:"Adapter = convertisseur. Il fait le pont entre deux interfaces qui ne sont pas directement compatibles."},
  {q:"Builder est préféré quand :",o:["Il n'y a qu'un paramètre","L'objet a beaucoup de paramètres optionnels","On veut notifier des observateurs","On veut une seule instance"],c:1,e:"Builder sépare la construction d'un objet complexe, étape par étape, avec des paramètres optionnels."},
];

const MATCH_ITEMS=[
  {pattern:"Singleton",scenario:"Logger : une seule instance pour toute l'application"},
  {pattern:"Factory Method",scenario:"Jeu vidéo : créer Guerrier, Mage ou Archer selon le choix du joueur"},
  {pattern:"Observer",scenario:"Newsletter : envoyer un email à tous les abonnés quand un article est publié"},
  {pattern:"Strategy",scenario:"E-commerce : choisir entre livraison standard, express ou point relais"},
  {pattern:"Adapter",scenario:"Intégrer une ancienne API de paiement avec une nouvelle interface"},
  {pattern:"Composite",scenario:"Système de fichiers : dossiers contenant fichiers et sous-dossiers"},
  {pattern:"Builder",scenario:"Constructeur de pizza : taille + base + garnitures optionnelles"},
];

type Phase="menu"|"explorer"|"quiz"|"match";

export default function Ch8Game(){
  const[phase,setPhase]=useState<Phase>("menu");
  const[expanded,setExpanded]=useState<string|null>(null);
  const[catFilter,setCatFilter]=useState<"all"|"Création"|"Structure"|"Comportement">("all");
  const[qIdx,setQIdx]=useState(0);const[qScore,setQScore]=useState(0);
  const[sel,setSel]=useState<number|null>(null);const[show,setShow]=useState(false);
  const[mIdx,setMIdx]=useState(0);const[mScore,setMScore]=useState(0);
  const[mSel,setMSel]=useState<string|null>(null);const[mShow,setMShow]=useState(false);
  const[shuffledMatch]=useState(()=>[...MATCH_ITEMS].sort(()=>Math.random()-0.5));

  const back=<button onClick={()=>setPhase("menu")} style={{fontSize:13,color:MUTED,background:"none",border:"none",cursor:"pointer",marginBottom:12}}>← Retour</button>;

  if(phase==="menu")return(
    <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"2rem 1rem"}}>
      <div style={{maxWidth:700,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:"2rem"}}>
          <div style={{fontSize:13,color:TEAL,fontWeight:600,letterSpacing:2,textTransform:"uppercase"}}>Monde 2 — Chapitre 8</div>
          <h1 style={{fontSize:28,fontWeight:700,margin:"0.5rem 0"}}>Design Patterns & Parallélisme</h1>
          <p style={{color:MUTED,fontSize:15}}>GoF Patterns — Création, Structure, Comportement</p>
          <a href="/fiches/Ch8_Fiche_Memo_Design_Patterns.pdf" target="_blank" rel="noopener" style={{display:"inline-block",marginTop:8,padding:"6px 14px",background:"#1E293B",border:"1px solid #1E3A5F",borderRadius:8,fontSize:12,color:"#94A3B8",textDecoration:"none"}}>Fiche memo PDF</a>
        </div>
        <div style={{display:"grid",gap:14}}>
          {[
            {p:"explorer" as Phase,t:"Explorer les 7 Patterns",d:"Singleton, Factory, Builder, Adapter, Composite, Observer, Strategy",c:BLUE},
            {p:"match" as Phase,t:"Pattern → Scénario",d:"Associez chaque pattern à son cas d'usage réel",c:ORANGE},
            {p:"quiz" as Phase,t:"Quiz Design Patterns",d:"8 questions pour maîtriser les patterns",c:GREEN},
          ].map(g=>(
            <button key={g.p} onClick={()=>{setPhase(g.p);if(g.p==="quiz"){setQIdx(0);setQScore(0);setSel(null);setShow(false)}if(g.p==="match"){setMIdx(0);setMScore(0);setMSel(null);setMShow(false)}if(g.p==="explorer"){setExpanded(null);setCatFilter("all")}}}
              style={{padding:"1.2rem",border:`2px solid ${BORDER}`,borderRadius:12,background:CARD,cursor:"pointer",textAlign:"left"}}>
              <div style={{fontSize:18,fontWeight:600,color:g.c}}>{g.t}</div>
              <div style={{fontSize:13,color:MUTED,marginTop:4}}>{g.d}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // EXPLORER
  if(phase==="explorer"){
    const catCol:Record<string,string>={Création:PURPLE,Structure:BLUE,Comportement:ORANGE};
    const filtered=catFilter==="all"?PATTERNS:PATTERNS.filter(p=>p.cat===catFilter);
    return(
      <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
        <div style={{maxWidth:750,margin:"0 auto"}}>
          {back}
          <h2 style={{fontSize:22,fontWeight:700,color:BLUE,marginBottom:8}}>Design Patterns GoF</h2>
          <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
            {(["all","Création","Structure","Comportement"] as const).map(f=>(
              <button key={f} onClick={()=>setCatFilter(f)} style={{padding:"6px 14px",borderRadius:20,fontSize:13,fontWeight:600,cursor:"pointer",background:catFilter===f?(f==="all"?BLUE:catCol[f]):"transparent",color:catFilter===f?"white":MUTED,border:`1px solid ${catFilter===f?"transparent":BORDER}`}}>{f==="all"?"Tous":f}</button>
            ))}
          </div>
          <div style={{display:"grid",gap:10}}>
            {filtered.map(p=>(
              <div key={p.name} style={{border:`1px solid ${expanded===p.name?catCol[p.cat]:BORDER}`,borderRadius:10,overflow:"hidden"}}>
                <button onClick={()=>setExpanded(expanded===p.name?null:p.name)} style={{width:"100%",padding:"12px 16px",background:expanded===p.name?catCol[p.cat]+"15":CARD,border:"none",cursor:"pointer",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div><span style={{fontWeight:600,fontSize:15}}>{p.name}</span><span style={{marginLeft:8,fontSize:11,padding:"2px 8px",borderRadius:10,background:catCol[p.cat]+"30",color:catCol[p.cat],fontWeight:600}}>{p.cat}</span></div>
                  <span style={{color:MUTED}}>{expanded===p.name?"▲":"▼"}</span>
                </button>
                {expanded===p.name&&(
                  <div style={{padding:"0 16px 16px"}}>
                    <p style={{fontSize:14,color:TEXT,margin:"8px 0"}}>{p.desc}</p>
                    <div style={{background:"#0D1117",borderRadius:8,padding:"10px 12px",marginBottom:8}}>
                      <pre style={{fontSize:12,color:"#A5F3FC",fontFamily:"Consolas,monospace",margin:0,whiteSpace:"pre-wrap"}}>{p.code}</pre>
                    </div>
                    <div style={{fontSize:12,color:MUTED}}>Usage : {p.usage}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // MATCH GAME
  if(phase==="match"){
    if(mIdx>=shuffledMatch.length){const p=Math.round(mScore/shuffledMatch.length*100);return(<div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"3rem 1rem"}}><div style={{maxWidth:500,margin:"0 auto",textAlign:"center"}}><div style={{fontSize:64,fontWeight:800,color:p>=70?GREEN:ORANGE}}>{mScore}/{shuffledMatch.length}</div><div style={{fontSize:20,fontWeight:600}}>{p}%</div><button onClick={()=>setPhase("menu")} style={{marginTop:16,padding:"10px 24px",background:TEAL,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Retour</button></div></div>)}
    const item=shuffledMatch[mIdx];
    const patternNames=["Singleton","Factory Method","Builder","Adapter","Composite","Observer","Strategy"];
    return(
      <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
        <div style={{maxWidth:600,margin:"0 auto"}}>
          {back}
          <div style={{fontSize:13,color:MUTED,marginBottom:8}}>{mIdx+1}/{shuffledMatch.length} | Score: {mScore}</div>
          <div style={{height:4,background:BORDER,borderRadius:2,marginBottom:16}}><div style={{height:4,background:ORANGE,borderRadius:2,width:`${(mIdx+1)/shuffledMatch.length*100}%`}}/></div>
          <div style={{padding:"1rem",background:ORANGE+"15",borderRadius:10,marginBottom:16,textAlign:"center"}}>
            <div style={{fontSize:13,color:ORANGE,fontWeight:600,marginBottom:4}}>SCÉNARIO</div>
            <div style={{fontSize:15,fontWeight:600}}>{item.scenario}</div>
          </div>
          <p style={{fontSize:15,fontWeight:600,marginBottom:12,textAlign:"center"}}>Quel Design Pattern ?</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {patternNames.map(pn=>{let bg=CARD,bd=BORDER;if(mShow){if(pn===item.pattern){bg=GREEN+"20";bd=GREEN}else if(pn===mSel){bg=RED+"20";bd=RED}}
              return(<button key={pn} onClick={()=>{if(mShow)return;setMSel(pn);setMShow(true);if(pn===item.pattern)setMScore(s=>s+1)}} disabled={mShow} style={{padding:"10px",border:`2px solid ${bd}`,borderRadius:8,background:bg,cursor:mShow?"default":"pointer",fontSize:13,fontWeight:600,color:TEXT}}>{pn}</button>)})}
          </div>
          {mShow&&<button onClick={()=>{setMIdx(i=>i+1);setMSel(null);setMShow(false)}} style={{marginTop:12,width:"100%",padding:"10px",background:ORANGE,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Suivant →</button>}
        </div>
      </div>
    );
  }

  // QUIZ
  if(qIdx>=QUIZ.length){const p=Math.round(qScore/QUIZ.length*100);return(<div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"3rem 1rem"}}><div style={{maxWidth:500,margin:"0 auto",textAlign:"center"}}><div style={{fontSize:64,fontWeight:800,color:p>=70?GREEN:ORANGE}}>{qScore}/{QUIZ.length}</div><div style={{fontSize:20,fontWeight:600}}>{p}%</div><button onClick={()=>setPhase("menu")} style={{marginTop:16,padding:"10px 24px",background:TEAL,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Retour</button></div></div>)}
  const q=QUIZ[qIdx];
  return(
    <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
      <div style={{maxWidth:650,margin:"0 auto"}}>
        {back}
        <div style={{fontSize:13,color:MUTED,marginBottom:8}}>{qIdx+1}/{QUIZ.length} | Score: {qScore}</div>
        <div style={{height:4,background:BORDER,borderRadius:2,marginBottom:16}}><div style={{height:4,background:GREEN,borderRadius:2,width:`${(qIdx+1)/QUIZ.length*100}%`}}/></div>
        <p style={{fontSize:16,fontWeight:600,marginBottom:12}}>{q.q}</p>
        <div style={{display:"grid",gap:8}}>{q.o.map((o,i)=>{let bg=CARD,bd=BORDER;if(show){if(i===q.c){bg=GREEN+"20";bd=GREEN}else if(i===sel){bg=RED+"20";bd=RED}}return(<button key={i} onClick={()=>{if(show)return;setSel(i);setShow(true);if(i===q.c)setQScore(s=>s+1)}} disabled={show} style={{padding:"10px 14px",border:`2px solid ${bd}`,borderRadius:8,background:bg,cursor:show?"default":"pointer",textAlign:"left",fontSize:14,color:TEXT}}>{o}</button>)})}</div>
        {show&&<><div style={{marginTop:10,padding:"10px 14px",background:GREEN+"15",borderRadius:8,fontSize:13,color:GREEN}}>{q.e}</div><button onClick={()=>{setQIdx(i=>i+1);setSel(null);setShow(false)}} style={{marginTop:10,width:"100%",padding:"10px",background:GREEN,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Suivant →</button></>}
      </div>
    </div>
  );
}
