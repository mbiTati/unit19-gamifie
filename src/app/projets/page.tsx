"use client";
import React from "react";
import { loadLocks, isLocked, setTeacher } from "@/lib/lockManager";
import { useAuth } from "@/components/AuthProvider";
import NavBar from "@/components/NavBar";
import { useState } from "react";
import Link from "next/link";
import TopBar from "@/components/TopBar";

const BG="#0B1120",CARD="#111827",BORDER="#1E3A5F",TEXT="#E2E8F0",MUTED="#94A3B8",GREEN="#16A34A",RED="#DC2626",ORANGE="#F97316",PURPLE="#7C3AED",TEAL="#0891B2",AMBER="#D97706",BLUE="#3B82F6";

const PROJECTS=[
  {
    id:"lo1",
    lo:"LO1",
    color:PURPLE,
    title:"CityNav — Systeme de Navigation Urbaine",
    tagline:"Examiner les types abstraits de donnees, les structures concretes et les algorithmes",
    hero:"linear-gradient(135deg, #7C3AED20, #3B82F620, #7C3AED10)",
    context:"Vous etes developpeur chez CityNav, une startup qui developpe un systeme de navigation pour une ville intelligente. L'application doit gerer des itineraires, des files d'attente aux arrets de bus, et optimiser les trajets. Vous devez concevoir les structures de donnees appropriees et implementer les algorithmes de routage.",
    deliverables:[
      {level:"Pass",criteria:"P1",title:"Specification ADT du systeme",desc:"Rediger la specification formelle (design specification) de 3 ADT utilises dans le systeme : Graph (sommets + aretes), Queue (file d'attente aux arrets), Stack (historique de navigation). Pour chaque ADT, decrire les operations valides, les preconditions et postconditions.",what:"Document de specification + code des interfaces Java"},
      {level:"Pass",criteria:"P2",title:"Memory Stack et appels de fonctions",desc:"Expliquer comment le memory stack gere les appels de fonctions dans votre algorithme de navigation. Tracer le call stack pour un appel recursif de calcul de chemin (ex: Dijkstra recursif ou BFS). Montrer les stack frames empiles/depiles a chaque etape.",what:"Schema annote du call stack + explication ecrite"},
      {level:"Merit",criteria:"M1",title:"Implementation Queue FIFO — File d'attente aux arrets",desc:"Implementer une structure concrete de Queue FIFO pour gerer la file d'attente des passagers aux arrets de bus. Les passagers arrivent et sont servis dans l'ordre d'arrivee (FIFO). Montrer le fonctionnement avec un exemple concret.",what:"Code Java fonctionnel : classe Passager + classe FileAttente (ArrayDeque ou LinkedList) + Menu interactif"},
      {level:"Merit",criteria:"M2",title:"Comparaison de 2 algorithmes de tri",desc:"Implementer Bubble Sort et Quick Sort pour trier les arrets de bus par distance. Comparer les performances des deux algorithmes sur des donnees de taille croissante (n=100, 1000, 10000). Mesurer les temps d'execution et le nombre de comparaisons.",what:"Code Java des 2 tris + tableau comparatif + analyse ecrite"},
      {level:"Distinction",criteria:"D1",title:"2 algorithmes de plus court chemin",desc:"Implementer BFS (graphe non pondere) et Dijkstra (graphe pondere) pour trouver le chemin optimal entre 2 arrets. Illustrer chaque algorithme avec un exemple concret sur un graphe de 8+ sommets. Comparer les deux approches.",what:"Code Java des 2 algorithmes + graphes illustres + analyse comparative"},
    ],
    tags:["ADT","Stack","Queue FIFO","Bubble Sort","Quick Sort","BFS","Dijkstra","Graph","Memory Stack"],
    chapters:[1,2,3,4],
    duration:"8-10 heures",
  },
  {
    id:"lo2",
    lo:"LO2",
    color:TEAL,
    title:"SecureVault — Coffre-fort Numerique",
    tagline:"Specifier les ADT en notation formelle et appliquer les principes de conception",
    hero:"linear-gradient(135deg, #0891B220, #16A34A20, #0891B210)",
    context:"Vous concevez SecureVault, un systeme de coffre-fort numerique pour une banque. Le systeme doit etre formellement specifie avant l'implementation, utiliser l'encapsulation pour proteger les donnees sensibles, et appliquer des design patterns pour garantir la maintenabilite. La specification formelle est obligatoire avant tout codage.",
    deliverables:[
      {level:"Pass",criteria:"P3",title:"Specification formelle du Stack securise",desc:"Specifier l'ADT SecureStack en notation imperative : OPERATION, PRE, POST, INVARIANT, AXIOME. Le SecureStack stocke des documents chiffres (LIFO). Definir formellement push(), pop(), peek(), isEmpty(), size() avec toutes les preconditions et postconditions.",what:"Specification imperative complete + traduction en interface Java"},
      {level:"Merit",criteria:"M3",title:"Encapsulation et Information Hiding",desc:"Examiner les avantages de l'encapsulation et de l'information hiding dans le coffre-fort. Implementer les classes avec attributs private, getters/setters avec validation, et montrer comment le changement d'implementation interne (ex: ArrayList vers LinkedList) n'affecte pas le code client.",what:"Code Java encapsule + refactoring demonstre + paragraphe d'analyse (avantages)"},
      {level:"Distinction",criteria:"D2",title:"Discussion : les ADT imperatifs, base de la POO",desc:"Rediger une discussion argumentee expliquant pourquoi les ADT imperatifs sont a la base de la programmation orientee objet. Donner au minimum 3 arguments avec exemples Java : encapsulation, abstraction, contrats (PRE/POST), reutilisabilite, modification d'etat.",what:"Discussion ecrite (500-800 mots) + exemples de code Java illustratifs"},
    ],
    tags:["Notation imperative","VDM","SDL","ASN.1","Encapsulation","Information Hiding","Interfaces","Design Patterns","POO"],
    chapters:[5,6,7,8],
    duration:"6-8 heures",
  },
  {
    id:"lo3",
    lo:"LO3",
    color:ORANGE,
    title:"HelpDesk Pro — Support IT d'Entreprise",
    tagline:"Implementer des structures de donnees complexes avec gestion d'erreurs et tests",
    hero:"linear-gradient(135deg, #F9731620, #DC262620, #F9731610)",
    context:"Vous developpez HelpDesk Pro, une application complete de gestion de tickets de support IT et de stock de materiel informatique pour une entreprise de 500 employes. L'application doit etre robuste (gestion d'erreurs), testee (JUnit 5), et les choix de structures de donnees doivent etre justifies et evalues.",
    deliverables:[
      {level:"Pass",criteria:"P4",title:"Implementation ADT complexes",desc:"Implementer 2 modules : (1) GestionTickets avec HashMap<Integer, Ticket> pour les tickets de support (id auto-increment, priorite CRITIQUE/NORMAL/FAIBLE, resolution) et (2) GestionStock avec LinkedList<Medicament> pour le stock de materiel (ajout, recherche, stocks faibles, tri par nom avec tri a bulles).",what:"Code Java complet : classes metier + classes gestion + menus interactifs"},
      {level:"Pass",criteria:"P5",title:"Error handling + Tests JUnit 5",desc:"Implementer la gestion d'erreurs complete : throw (validation donnees), throws (methodes risquees), try/catch (saisie utilisateur), try/catch/finally (liberation ressources). Ecrire 5 tests JUnit 5 par module (10 tests total) avec @BeforeEach, assertEquals, assertThrows.",what:"Code avec exceptions + 10 tests JUnit 5 + rapport des resultats de tests"},
      {level:"Merit",criteria:"M4",title:"Demonstration de la solution",desc:"Demontrer comment l'implementation des ADT/algorithmes resout les problemes definis. Pour chaque module, expliquer en commentaires : POURQUOI cette structure (HashMap vs LinkedList), COMMENT l'algorithme resout le probleme, QUEL avantage concret pour l'entreprise.",what:"Code commente avec blocs explicatifs M4"},
      {level:"Distinction",criteria:"D3",title:"Evaluation critique de la complexite",desc:"Analyser la complexite Big O de CHAQUE methode des 2 modules. Comparer avec des structures alternatives (HashMap vs ArrayList vs LinkedList). Proposer des ameliorations (ex: HashMap<String, List<Ticket>> pour recherche par demandeur). Tableau comparatif.",what:"Commentaires D3 dans le code + tableau comparatif + ameliorations proposees"},
    ],
    tags:["LinkedList","HashMap","JUnit 5","throw","throws","try/catch","finally","Big O","Auto-increment","Tri a bulles"],
    chapters:[9,10,11,12],
    duration:"10-12 heures",
  },
  {
    id:"lo4",
    lo:"LO4",
    color:AMBER,
    title:"AlgoLab — Laboratoire de Performance",
    tagline:"Evaluer l'efficacite des structures de donnees et des algorithmes",
    hero:"linear-gradient(135deg, #D9770620, #F9731620, #D9770610)",
    context:"Vous etes ingenieur performance chez AlgoLab, un cabinet de conseil specialise en optimisation logicielle. Un client vous demande d'auditer les performances de son application Java. Vous devez analyser la complexite asymptotique, mesurer l'efficacite par benchmark, identifier les trade-offs, et recommander des structures de donnees independantes de l'implementation.",
    deliverables:[
      {level:"Pass",criteria:"P6",title:"Analyse asymptotique",desc:"Analyser la complexite asymptotique de 10 extraits de code Java du client. Pour chaque extrait, calculer T(n) ligne par ligne, determiner la complexite Big O, et classer de O(1) a O(n^2). Expliquer les regles : terme dominant, constantes ignorees, O vs Omega vs Theta.",what:"10 analyses detaillees avec calcul T(n) + classification Big O"},
      {level:"Pass",criteria:"P7",title:"Mesure d'efficacite par benchmark",desc:"Mesurer l'efficacite de 2 algorithmes de 2 facons differentes : (1) Analyse theorique Big O et (2) Benchmark empirique avec System.nanoTime(). Comparer ArrayList.get() vs LinkedList.get() et HashMap.containsKey() vs ArrayList.contains() pour n=1000, 10000, 100000.",what:"Code Java de benchmark + resultats + analyse theorique vs empirique"},
      {level:"Merit",criteria:"M5",title:"Trade-off avec exemple",desc:"Interpreter ce qu'est un trade-off en specifiant un ADT. Donner un exemple concret : choisir entre HashMap (O(1) acces, plus de memoire) et TreeMap (O(log n), cles triees) pour un annuaire telephonique. Argumenter le choix selon les contraintes du client.",what:"Analyse ecrite du trade-off + code Java des 2 solutions + recommandation argumentee"},
      {level:"Distinction",criteria:"D4",title:"3 benefices de l'implementation independence",desc:"Evaluer 3 benefices concrets de l'utilisation de structures de donnees independantes de l'implementation : (1) Flexibilite — changer ArrayList/LinkedList sans modifier le client, (2) Testabilite — tester via l'interface, (3) Reutilisabilite — meme code, implementations differentes. Chaque benefice illustre par un exemple Java.",what:"Document ecrit (500-800 mots) + 3 exemples de code Java + conclusion"},
    ],
    tags:["Big O","Omega","Theta","Benchmark","System.nanoTime()","Trade-off","ArrayList vs LinkedList","HashMap vs TreeMap","Implementation Independence"],
    chapters:[13,14,15],
    duration:"8-10 heures",
  },
];

export default function ProjetsPage(){
  const { user: authUser, loading: authLoading } = useAuth();
  if (authLoading) return <div style={{ minHeight: "100vh", background: "#0a0f1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>Chargement...</div>;
  if (!authUser) { if (typeof window !== "undefined") window.location.href = "/login"; return null; }

  // Check locks
  const [lockChecked, setLockChecked] = React.useState(false);
  const [sectionLocked, setSectionLocked] = React.useState(false);
  React.useEffect(() => {
    loadLocks().then(locks => { setSectionLocked(locks["projets"] === true); setLockChecked(true); });
  }, []);
  if (!lockChecked) return <div style={{ minHeight: "100vh", background: "#0a0f1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>Chargement...</div>;
  if (sectionLocked) return <div style={{ minHeight: "100vh", background: "#0a0f1a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#e2e8f0", gap: 12 }}><div style={{ fontSize: 48 }}>🔒</div><div style={{ fontSize: 20, fontWeight: 700 }}>Acces bloque</div><div style={{ fontSize: 13, color: "#94a3b8" }}>Cette section est verrouillee par le professeur</div><a href="/" style={{ color: "#32E0C4", marginTop: 8 }}>Retour au Hub</a></div>;

  const[selected,setSelected]=useState(null as string|null);

  const proj=selected?PROJECTS.find(p=>p.id===selected):null;

  if(proj)return(
    <div style={{minHeight:"100vh",background:BG,color:TEXT}}>
      <NavBar/>
      {/* Hero banner Steam-style */}
      <div style={{padding:"2.5rem 1.5rem",background:proj.hero,borderBottom:"1px solid "+BORDER}}>
        <div style={{maxWidth:800,margin:"0 auto"}}>
          <button onClick={()=>setSelected(null)} style={{fontSize:12,color:MUTED,background:"none",border:"none",cursor:"pointer",marginBottom:12}}>Tous les projets</button>
          <div style={{display:"flex",gap:8,marginBottom:8,flexWrap:"wrap"}}>
            <span style={{padding:"3px 10px",background:proj.color+"30",color:proj.color,borderRadius:6,fontSize:11,fontWeight:700}}>{proj.lo}</span>
            <span style={{padding:"3px 10px",background:BORDER,color:MUTED,borderRadius:6,fontSize:11}}>{proj.duration}</span>
          </div>
          <h1 style={{fontSize:32,fontWeight:800,margin:"0.3rem 0",color:"white"}}>{proj.title}</h1>
          <p style={{fontSize:15,color:MUTED,maxWidth:600}}>{proj.tagline}</p>
        </div>
      </div>

      <div style={{maxWidth:800,margin:"0 auto",padding:"1.5rem"}}>
        {/* Context */}
        <div style={{padding:"16px",background:CARD,borderRadius:12,border:"1px solid "+BORDER,marginBottom:20}}>
          <div style={{fontSize:13,fontWeight:600,color:proj.color,marginBottom:6}}>Contexte du projet</div>
          <div style={{fontSize:14,color:TEXT,lineHeight:1.6}}>{proj.context}</div>
        </div>

        {/* Deliverables - Steam feature list style */}
        <div style={{marginBottom:20}}>
          <div style={{fontSize:18,fontWeight:700,color:TEXT,marginBottom:12}}>Livrables par niveau</div>
          <div style={{display:"grid",gap:12}}>
            {proj.deliverables.map((d,i)=>{
              const levelColor=d.level==="Pass"?GREEN:d.level==="Merit"?BLUE:PURPLE;
              return(
                <div key={i} style={{padding:"14px 16px",background:CARD,borderRadius:10,border:"1px solid "+BORDER,borderLeft:"4px solid "+levelColor}}>
                  <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
                    <span style={{padding:"2px 8px",background:levelColor+"20",color:levelColor,borderRadius:4,fontSize:11,fontWeight:700}}>{d.level}</span>
                    <span style={{padding:"2px 6px",background:BORDER,color:MUTED,borderRadius:4,fontSize:11}}>{d.criteria}</span>
                    <span style={{fontSize:14,fontWeight:600,color:TEXT}}>{d.title}</span>
                  </div>
                  <div style={{fontSize:13,color:MUTED,lineHeight:1.5,marginBottom:8}}>{d.desc}</div>
                  <div style={{fontSize:12,color:proj.color,background:proj.color+"10",padding:"6px 10px",borderRadius:6}}>Livrable : {d.what}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tags */}
        <div style={{marginBottom:20}}>
          <div style={{fontSize:13,fontWeight:600,color:MUTED,marginBottom:8}}>Technologies et concepts</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {proj.tags.map((t,i)=>(<span key={i} style={{padding:"4px 10px",background:BORDER,borderRadius:6,fontSize:11,color:MUTED}}>{t}</span>))}
          </div>
        </div>

        {/* Related chapters */}
        <div style={{padding:"14px",background:CARD,borderRadius:10,border:"1px solid "+BORDER}}>
          <div style={{fontSize:13,fontWeight:600,color:TEXT,marginBottom:8}}>Chapitres associes</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {proj.chapters.map(ch=>(
              <Link key={ch} href={"/exercice/ch"+ch} style={{padding:"6px 12px",background:proj.color+"15",border:"1px solid "+proj.color+"30",borderRadius:6,fontSize:12,color:proj.color,textDecoration:"none",fontWeight:600}}>Ch.{ch}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Project list - Steam store style
  return(
    <div style={{minHeight:"100vh",background:BG,color:TEXT}}>
      <NavBar/>
      <div style={{maxWidth:900,margin:"0 auto",padding:"2rem 1.5rem"}}>
        <div style={{textAlign:"center",marginBottom:"2rem"}}>
          <div style={{fontSize:13,color:RED,fontWeight:600,letterSpacing:2,textTransform:"uppercase"}}>Projets integrateurs</div>
          <h1 style={{fontSize:30,fontWeight:800,margin:"0.4rem 0"}}>Un projet par Learning Outcome</h1>
          <p style={{color:MUTED,fontSize:14}}>Chaque projet couvre TOUS les criteres (Pass, Merit, Distinction) d'un LO</p>
        </div>

        <div style={{display:"grid",gap:16}}>
          {PROJECTS.map(p=>(
            <button key={p.id} onClick={()=>setSelected(p.id)}
              style={{padding:0,border:"1px solid "+BORDER,borderRadius:14,overflow:"hidden",background:"none",cursor:"pointer",textAlign:"left",transition:"border-color 0.2s"}}>
              {/* Hero banner */}
              <div style={{padding:"20px 20px 16px",background:p.hero,borderBottom:"1px solid "+BORDER}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div>
                    <div style={{display:"flex",gap:6,marginBottom:6}}>
                      <span style={{padding:"3px 10px",background:p.color+"30",color:p.color,borderRadius:6,fontSize:11,fontWeight:700}}>{p.lo}</span>
                      <span style={{padding:"3px 10px",background:BORDER,color:MUTED,borderRadius:6,fontSize:11}}>{p.duration}</span>
                      <span style={{padding:"3px 10px",background:BORDER,color:MUTED,borderRadius:6,fontSize:11}}>{p.deliverables.length} livrables</span>
                    </div>
                    <div style={{fontSize:22,fontWeight:800,color:"white"}}>{p.title}</div>
                    <div style={{fontSize:13,color:MUTED,marginTop:4}}>{p.tagline}</div>
                  </div>
                </div>
              </div>
              {/* Tags footer */}
              <div style={{padding:"10px 20px",background:CARD,display:"flex",gap:6,flexWrap:"wrap"}}>
                {p.tags.slice(0,6).map((t,i)=>(<span key={i} style={{padding:"2px 8px",background:BORDER,borderRadius:4,fontSize:10,color:MUTED}}>{t}</span>))}
                {p.tags.length>6&&<span style={{fontSize:10,color:MUTED}}>+{p.tags.length-6}</span>}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
