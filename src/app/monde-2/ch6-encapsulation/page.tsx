"use client";
import { useState } from "react";

const BG="#0B1120",CARD="#111827",BORDER="#1E3A5F",TEXT="#E2E8F0",MUTED="#94A3B8",GREEN="#16A34A",TEAL="#0891B2",PURPLE="#7C3AED",RED="#DC2626",ORANGE="#F97316";

// ─── GAME 1: Visual Encapsulation Simulator ───
const ENCAP_STEPS=[
  {title:"1. Classe sans encapsulation",code:"public class CompteBancaire {\n    public String titulaire;\n    public double solde;\n    public String motDePasse;\n}",problem:" DANGER : tout est public ! N'importe qui peut modifier le solde directement.",fix:""},
  {title:"2. Attributs privés (Information Hiding)",code:"public class CompteBancaire {\n    private String titulaire;\n    private double solde;\n    private String motDePasse;\n}",problem:"",fix:" Les données sont cachées. Mais comment y accéder ?"},
  {title:"3. Getters (accès contrôlé)",code:"    // Getter — lecture seule\n    public String getTitulaire() {\n        return this.titulaire;\n    }\n    public double getSolde() {\n        return this.solde;\n    }\n    // PAS de getMotDePasse() !",problem:"",fix:" On expose le titulaire et solde, mais PAS le mot de passe."},
  {title:"4. Setters avec validation",code:"    public void deposer(double montant) {\n        if (montant > 0) {\n            this.solde += montant;\n        }\n    }\n    public boolean retirer(double montant) {\n        if (montant > 0 && montant <= solde) {\n            this.solde -= montant;\n            return true;\n        }\n        return false;\n    }",problem:"",fix:" Validation intégrée : impossible de déposer négatif ou retirer plus que le solde."},
  {title:"5. Changement d'implémentation transparent",code:"// Version 1 : double solde\nprivate double solde;\n\n// Version 2 : BigDecimal (plus précis)\nprivate BigDecimal solde;\n\n// L'interface publique NE CHANGE PAS !\n// deposer() et retirer() fonctionnent pareil",problem:"",fix:" Puissance de l'encapsulation : changer l'interne sans casser le code client !"},
];

// ─── GAME 2: Information Hiding Deep Dive ───
const HIDING_QS=[
  {q:"Qu'est-ce que l'Information Hiding ?",o:["Chiffrer les données","Cacher les détails d'implémentation derrière une interface publique","Supprimer les commentaires","Rendre tout private sans getter"],c:1,e:"Information Hiding = exposer UNIQUEMENT ce qui est nécessaire (interface publique) et cacher le COMMENT (implémentation interne)."},
  {q:"Principe de Masquer les Détails Internes : que cache-t-on ?",o:["Le nom de la classe","La structure interne des données (tableau, liste, arbre...)","Les méthodes publiques","Le package"],c:1,e:"On cache la représentation interne : l'utilisateur ne sait pas si c'est un tableau, une liste chaînée, etc."},
  {q:"Visibilité et Accès Contrôlé : quel modificateur pour les attributs ?",o:["public (accès libre)","protected (héritage)","private (classe seule)","default (package)"],c:2,e:"Les attributs doivent être private. L'accès se fait via des getters/setters qui peuvent valider."},
  {q:"Minimiser les Dépendances : pourquoi ?",o:["Pour écrire moins de code","Pour pouvoir changer l'implémentation sans affecter les autres classes","Pour la performance","Par convention"],c:1,e:"Moins de dépendances = plus facile de modifier une classe sans casser les autres. C'est le principe de couplage faible."},
  {q:"Quelle différence entre Encapsulation et Information Hiding ?",o:["C'est la même chose","Encapsulation = regrouper données+méthodes. Info Hiding = cacher l'implémentation","Info Hiding est en C, Encapsulation en Java","Aucun rapport"],c:1,e:"Encapsulation = REGROUPER. Information Hiding = CACHER. L'encapsulation facilite l'information hiding."},
  {q:"En Java, les 4 niveaux de visibilité dans l'ordre du plus ouvert au plus fermé :",o:["public > package > protected > private","public > protected > package > private","private > protected > package > public","public > private > protected > package"],c:1,e:"public (tout le monde) > protected (package + sous-classes) > package/default (même package) > private (classe seule)."},
];

// ─── GAME 3: Interfaces quiz ───
const INTERFACE_QS=[
  {q:"Qu'est-ce qu'une interface en Java ?",o:["Une classe avec des attributs","Un contrat définissant les méthodes sans implémentation","Un fichier de configuration","Une classe abstraite"],c:1,e:"Une interface définit le QUOI (les signatures) sans le COMMENT (pas d'implémentation)."},
  {q:"Différence entre classe abstraite et interface ?",o:["Aucune différence","Interface = contrat pur. Classe abstraite = peut avoir du code + attributs","Interface est plus rapide","Classe abstraite ne peut pas avoir de méthodes"],c:1,e:"Interface = 100% abstrait (Java 8+ : default methods). Classe abstraite = peut mixer code concret et abstrait."},
  {q:"Avantage principal des interfaces ?",o:["Performance","Permettre le polymorphisme et le multi-héritage de contrats","Obligatoire en Java","Simplicité du code"],c:1,e:"Avec les interfaces, une classe peut implémenter PLUSIEURS contrats. Et on peut traiter différentes implémentations de la même façon (polymorphisme)."},
  {q:"Quel lien entre interface Java et ADT ?",o:["Aucun","L'interface = la partie publique d'un ADT (spécification sans implémentation)","L'ADT est un type d'interface","L'interface remplace l'ADT"],c:1,e:"L'interface Java EST la traduction directe d'un ADT : elle définit les opérations possibles sans dire comment."},
];

// ─── GAME 4: Encapsulation + Héritage ───
const HERITAGE_ITEMS=[
  {title:"Encapsulation et Héritage",desc:"Une sous-classe hérite des méthodes publiques mais PAS de l'accès direct aux attributs private.",code:"class Vehicule {\n    private int vitesse;\n    public int getVitesse() { return vitesse; }\n    protected void setVitesse(int v) {\n        if (v >= 0) vitesse = v;\n    }\n}\nclass Voiture extends Vehicule {\n    // Accès via setVitesse(), pas vitesse directement\n    public void accelerer() {\n        setVitesse(getVitesse() + 10);\n    }\n}"},
  {title:"Encapsulation et Modularité",desc:"Chaque module (classe) a une responsabilité unique. L'encapsulation garantit que les modules sont indépendants.",code:"// Module Authentification\nclass AuthService {\n    private Map<String,String> users;\n    public boolean login(String user, String pwd) {...}\n}\n\n// Module Commandes — ne connaît PAS les détails d'auth\nclass OrderService {\n    private AuthService auth;\n    public void passerCommande(String user) {\n        if (auth.login(user, \"...\")) {...}\n    }\n}"},
  {title:"Encapsulation et Modularité (cohérence)",desc:"On peut modifier l'intérieur d'un module sans affecter les autres, tant que l'interface publique reste la même.",code:"// AVANT : AuthService utilise HashMap\nprivate HashMap<String,String> users;\n\n// APRÈS : AuthService utilise une base de données\nprivate DatabaseConnection db;\n\n// login() fonctionne toujours pareil pour OrderService !"},
];

type Phase="menu"|"simulator"|"hiding"|"interfaces"|"heritage";

export default function Ch6Game(){
  const[phase,setPhase]=useState<Phase>("menu");
  const[simStep,setSimStep]=useState(0);
  const[hIdx,setHIdx]=useState(0);const[hScore,setHScore]=useState(0);
  const[hSel,setHSel]=useState<number|null>(null);const[hShow,setHShow]=useState(false);
  const[iIdx,setIIdx]=useState(0);const[iScore,setIScore]=useState(0);
  const[iSel,setISel]=useState<number|null>(null);const[iShow,setIShow]=useState(false);
  const[herExp,setHerExp]=useState<number|null>(null);

  const back=<button onClick={()=>setPhase("menu")} style={{fontSize:13,color:MUTED,background:"none",border:"none",cursor:"pointer",marginBottom:12}}>← Retour</button>;

  if(phase==="menu")return(
    <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"2rem 1rem"}}>
      <div style={{maxWidth:700,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:"2rem"}}>
          <div style={{fontSize:13,color:TEAL,fontWeight:600,letterSpacing:2,textTransform:"uppercase"}}>Monde 2 — Chapitre 6</div>
          <h1 style={{fontSize:28,fontWeight:700,margin:"0.5rem 0"}}>Encapsulation, Info Hiding & Interfaces</h1>
          <p style={{color:MUTED,fontSize:15}}>Critère M3 — Issues in software development</p>
          <a href="/fiches/Ch6_Fiche_Memo_Encapsulation.pdf" target="_blank" rel="noopener" style={{display:"inline-block",marginTop:8,padding:"6px 14px",background:"#1E293B",border:"1px solid #1E3A5F",borderRadius:8,fontSize:12,color:"#94A3B8",textDecoration:"none"}}>Fiche memo PDF</a>
        </div>
        <div style={{display:"grid",gap:14}}>
          {[
            {p:"simulator" as Phase,emoji:"",t:"Simulateur d'Encapsulation",d:"Construisez une classe encapsulée étape par étape",c:TEAL},
            {p:"hiding" as Phase,emoji:"",t:"Information Hiding — Quiz",d:"6 questions sur les principes du masquage d'information",c:PURPLE},
            {p:"interfaces" as Phase,emoji:"",t:"Interfaces Java",d:"4 questions : contrats, polymorphisme, lien avec ADT",c:GREEN},
            {p:"heritage" as Phase,emoji:"",t:"Encapsulation + Héritage & Modularité",d:"Explorez comment l'encapsulation interagit avec l'héritage",c:ORANGE},
          ].map(g=>(
            <button key={g.p} onClick={()=>{setPhase(g.p);if(g.p==="simulator")setSimStep(0);if(g.p==="hiding"){setHIdx(0);setHScore(0);setHSel(null);setHShow(false)}if(g.p==="interfaces"){setIIdx(0);setIScore(0);setISel(null);setIShow(false)}if(g.p==="heritage")setHerExp(null)}}
              style={{padding:"1.2rem",border:`2px solid ${BORDER}`,borderRadius:12,background:CARD,cursor:"pointer",textAlign:"left"}}>
              <div style={{fontSize:18,fontWeight:600,color:g.c}}>{g.emoji} {g.t}</div>
              <div style={{fontSize:13,color:MUTED,marginTop:4}}>{g.d}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // SIMULATOR
  if(phase==="simulator"){
    const step=ENCAP_STEPS[simStep];
    return(
      <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          {back}
          <h2 style={{fontSize:22,fontWeight:700,color:TEAL,marginBottom:4}}>Simulateur d'Encapsulation</h2>
          <div style={{display:"flex",gap:6,marginBottom:16}}>
            {ENCAP_STEPS.map((_,i)=>(<div key={i} style={{flex:1,height:4,borderRadius:2,background:i<=simStep?TEAL:BORDER}}/>))}
          </div>
          <div style={{fontSize:16,fontWeight:600,color:TEAL,marginBottom:8}}>{step.title}</div>
          <div style={{background:"#0D1117",borderRadius:10,padding:"1rem",marginBottom:12}}>
            <pre style={{fontSize:13,color:"#A5F3FC",fontFamily:"Consolas,monospace",margin:0,whiteSpace:"pre-wrap"}}>{step.code}</pre>
          </div>
          {step.problem&&<div style={{padding:"10px 14px",background:RED+"15",borderRadius:8,fontSize:13,color:"#FCA5A5",marginBottom:8}}>{step.problem}</div>}
          {step.fix&&<div style={{padding:"10px 14px",background:GREEN+"15",borderRadius:8,fontSize:13,color:GREEN,marginBottom:8}}>{step.fix}</div>}
          <div style={{display:"flex",gap:10,marginTop:12}}>
            {simStep>0&&<button onClick={()=>setSimStep(s=>s-1)} style={{flex:1,padding:"10px",background:CARD,color:TEXT,border:`1px solid ${BORDER}`,borderRadius:8,cursor:"pointer",fontWeight:600}}>← Précédent</button>}
            {simStep<ENCAP_STEPS.length-1?<button onClick={()=>setSimStep(s=>s+1)} style={{flex:1,padding:"10px",background:TEAL,color:"white",border:"none",borderRadius:8,cursor:"pointer",fontWeight:600}}>Suivant →</button>
            :<div style={{flex:1,padding:"10px",background:GREEN+"20",borderRadius:8,textAlign:"center",fontSize:14,fontWeight:600,color:GREEN}}> Classe parfaitement encapsulée !</div>}
          </div>
        </div>
      </div>
    );
  }

  // HIDING QUIZ
  if(phase==="hiding"){
    if(hIdx>=HIDING_QS.length){const p=Math.round(hScore/HIDING_QS.length*100);return(<div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"3rem 1rem"}}><div style={{maxWidth:500,margin:"0 auto",textAlign:"center"}}><div style={{fontSize:64,fontWeight:800,color:p>=70?GREEN:ORANGE}}>{hScore}/{HIDING_QS.length}</div><div style={{fontSize:20,fontWeight:600}}>{p}%</div><button onClick={()=>setPhase("menu")} style={{marginTop:16,padding:"10px 24px",background:TEAL,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Retour</button></div></div>)}
    const q=HIDING_QS[hIdx];
    return(
      <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
        <div style={{maxWidth:650,margin:"0 auto"}}>
          {back}
          <div style={{fontSize:13,color:MUTED,marginBottom:8}}>{hIdx+1}/{HIDING_QS.length} | Score: {hScore}</div>
          <div style={{height:4,background:BORDER,borderRadius:2,marginBottom:16}}><div style={{height:4,background:PURPLE,borderRadius:2,width:`${(hIdx+1)/HIDING_QS.length*100}%`}}/></div>
          <p style={{fontSize:16,fontWeight:600,marginBottom:12}}>{q.q}</p>
          <div style={{display:"grid",gap:8}}>{q.o.map((o,i)=>{let bg=CARD,bd=BORDER;if(hShow){if(i===q.c){bg=GREEN+"20";bd=GREEN}else if(i===hSel){bg=RED+"20";bd=RED}}return(<button key={i} onClick={()=>{if(hShow)return;setHSel(i);setHShow(true);if(i===q.c)setHScore(s=>s+1)}} disabled={hShow} style={{padding:"10px 14px",border:`2px solid ${bd}`,borderRadius:8,background:bg,cursor:hShow?"default":"pointer",textAlign:"left",fontSize:14,color:TEXT}}>{o}</button>)})}</div>
          {hShow&&<><div style={{marginTop:10,padding:"10px 14px",background:GREEN+"15",borderRadius:8,fontSize:13,color:GREEN}}>{q.e}</div><button onClick={()=>{setHIdx(i=>i+1);setHSel(null);setHShow(false)}} style={{marginTop:10,width:"100%",padding:"10px",background:PURPLE,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Suivant →</button></>}
        </div>
      </div>
    );
  }

  // INTERFACES QUIZ
  if(phase==="interfaces"){
    if(iIdx>=INTERFACE_QS.length){const p=Math.round(iScore/INTERFACE_QS.length*100);return(<div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"3rem 1rem"}}><div style={{maxWidth:500,margin:"0 auto",textAlign:"center"}}><div style={{fontSize:64,fontWeight:800,color:p>=70?GREEN:ORANGE}}>{iScore}/{INTERFACE_QS.length}</div><div style={{fontSize:20,fontWeight:600}}>{p}%</div><button onClick={()=>setPhase("menu")} style={{marginTop:16,padding:"10px 24px",background:TEAL,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Retour</button></div></div>)}
    const q=INTERFACE_QS[iIdx];
    return(
      <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
        <div style={{maxWidth:650,margin:"0 auto"}}>
          {back}
          <div style={{fontSize:13,color:MUTED,marginBottom:8}}>{iIdx+1}/{INTERFACE_QS.length} | Score: {iScore}</div>
          <div style={{height:4,background:BORDER,borderRadius:2,marginBottom:16}}><div style={{height:4,background:GREEN,borderRadius:2,width:`${(iIdx+1)/INTERFACE_QS.length*100}%`}}/></div>
          <p style={{fontSize:16,fontWeight:600,marginBottom:12}}>{q.q}</p>
          <div style={{display:"grid",gap:8}}>{q.o.map((o,i)=>{let bg=CARD,bd=BORDER;if(iShow){if(i===q.c){bg=GREEN+"20";bd=GREEN}else if(i===iSel){bg=RED+"20";bd=RED}}return(<button key={i} onClick={()=>{if(iShow)return;setISel(i);setIShow(true);if(i===q.c)setIScore(s=>s+1)}} disabled={iShow} style={{padding:"10px 14px",border:`2px solid ${bd}`,borderRadius:8,background:bg,cursor:iShow?"default":"pointer",textAlign:"left",fontSize:14,color:TEXT}}>{o}</button>)})}</div>
          {iShow&&<><div style={{marginTop:10,padding:"10px 14px",background:GREEN+"15",borderRadius:8,fontSize:13,color:GREEN}}>{q.e}</div><button onClick={()=>{setIIdx(i=>i+1);setISel(null);setIShow(false)}} style={{marginTop:10,width:"100%",padding:"10px",background:GREEN,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Suivant →</button></>}
        </div>
      </div>
    );
  }

  // HERITAGE EXPLORER
  return(
    <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
      <div style={{maxWidth:700,margin:"0 auto"}}>
        {back}
        <h2 style={{fontSize:22,fontWeight:700,color:ORANGE,marginBottom:16}}>Encapsulation + Héritage & Modularité</h2>
        <div style={{display:"grid",gap:10}}>
          {HERITAGE_ITEMS.map((item,i)=>(
            <div key={i} style={{border:`1px solid ${herExp===i?ORANGE:BORDER}`,borderRadius:10,overflow:"hidden"}}>
              <button onClick={()=>setHerExp(herExp===i?null:i)} style={{width:"100%",padding:"12px 16px",background:herExp===i?ORANGE+"15":CARD,border:"none",cursor:"pointer",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontWeight:600,color:TEXT,fontSize:15}}>{item.title}</span>
                <span style={{color:MUTED}}>{herExp===i?"▲":"▼"}</span>
              </button>
              {herExp===i&&(
                <div style={{padding:"0 16px 16px"}}>
                  <p style={{fontSize:13,color:MUTED,margin:"8px 0"}}>{item.desc}</p>
                  <div style={{background:"#0D1117",borderRadius:8,padding:"10px 12px"}}>
                    <pre style={{fontSize:12,color:"#A5F3FC",fontFamily:"Consolas,monospace",margin:0,whiteSpace:"pre-wrap"}}>{item.code}</pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
