"use client";
import { useState } from "react";

const BG="#0B1120",CARD="#111827",BORDER="#1E3A5F",TEXT="#E2E8F0",MUTED="#94A3B8",GREEN="#16A34A",RED="#DC2626",ORANGE="#F97316",PURPLE="#7C3AED",TEAL="#0891B2",BLUE="#3B82F6";

const EXERCISES=[
  {id:1,title:"Gestion des emprunts de vélos",emoji:"",color:TEAL,context:"Entreprise proposant un service de prêt de vélos à ses employés.",
    tasks:["Ajouter un nouvel emprunt (nom employé, type de vélo, date début)","Terminer un emprunt (date de retour)","Afficher les emprunts en cours"],
    structure:"LinkedList",structureWhy:"Les emprunts sont ajoutés/retirés fréquemment → LinkedList excelle en insertion/suppression.",
    classes:["Emprunt (nom, typeVelo, dateDebut, dateRetour)","GestionVelos (LinkedList<Emprunt>, ajouter, terminer, afficherEnCours)","Menu (Scanner, switch/case)"],
    code:"public class Emprunt {\n    private String nomEmploye;\n    private String typeVelo;\n    private LocalDate dateDebut;\n    private LocalDate dateRetour;\n    // constructeur + getters + setters\n}\n\npublic class GestionVelos {\n    private LinkedList<Emprunt> emprunts;\n    \n    public void ajouterEmprunt(Emprunt e) {\n        emprunts.add(e);\n    }\n    \n    public void terminerEmprunt(String nom) {\n        for (Emprunt e : emprunts) {\n            if (e.getNomEmploye().equals(nom)\n                && e.getDateRetour() == null) {\n                e.setDateRetour(LocalDate.now());\n                return;\n            }\n        }\n        throw new IllegalArgumentException(\n            \"Emprunt non trouvé\");\n    }\n}",
    criteria:"P4 (implémentation), P5 (exceptions), M4 (résout un problème)"},
  {id:2,title:"Suivi des interventions techniques",emoji:"",color:ORANGE,context:"Société d'infogérance enregistrant les interventions chez ses clients.",
    tasks:["Ajouter une intervention (nom client, problème, technicien)","Rechercher les interventions d'un client donné","Afficher toutes les interventions"],
    structure:"HashMap<String, ArrayList<Intervention>>",structureWhy:"Recherche par client = recherche par clé → HashMap O(1). Chaque client peut avoir plusieurs interventions → ArrayList comme valeur.",
    classes:["Intervention (nomClient, probleme, technicien, date)","GestionInterventions (HashMap, ajouter, rechercherParClient, afficherTout)","Menu (Scanner + try/catch)"],
    code:"public class GestionInterventions {\n    private HashMap<String, ArrayList<Intervention>>\n        interventions;\n    \n    public void ajouter(Intervention i) {\n        String client = i.getNomClient();\n        if (!interventions.containsKey(client))\n            interventions.put(client,\n                new ArrayList<>());\n        interventions.get(client).add(i);\n    }\n    \n    public ArrayList<Intervention>\n        rechercherParClient(String nom) {\n        if (!interventions.containsKey(nom))\n            throw new IllegalArgumentException(\n                \"Client inconnu : \" + nom);\n        return interventions.get(nom);\n    }\n}",
    criteria:"P4, P5 (try/catch saisie), M4, D3 (complexité HashMap vs ArrayList)"},
  {id:3,title:"Réservation de salles de réunion",emoji:"",color:PURPLE,context:"Application interne permettant aux employés de réserver des salles.",
    tasks:["Réserver une salle (nom employé, date, heure, salle)","Annuler une réservation","Vérifier les disponibilités d'une salle pour un jour"],
    structure:"HashMap<String, Queue<Reservation>>",structureWhy:"Recherche par salle = HashMap O(1). Les créneaux sont en ordre chronologique = Queue FIFO.",
    classes:["Reservation (nomEmploye, date, heure, salle)","GestionSalles (HashMap, reserver, annuler, verifierDisponibilite)","Menu (Scanner + validation doublons)"],
    code:"public class GestionSalles {\n    private HashMap<String, Queue<Reservation>>\n        salles;\n    \n    public void reserver(Reservation r) {\n        String salle = r.getSalle();\n        if (!salles.containsKey(salle))\n            salles.put(salle, new LinkedList<>());\n        \n        // Vérifier doublon\n        for (Reservation exist :\n            salles.get(salle)) {\n            if (exist.getDate().equals(r.getDate())\n                && exist.getHeure()\n                    .equals(r.getHeure()))\n                throw new IllegalStateException(\n                    \"Salle déjà réservée !\");\n        }\n        salles.get(salle).add(r);\n    }\n}",
    criteria:"P4, P5, M4, D3 (Queue+HashMap combinés)"},
];

export default function ExercicesEntreprise(){
  const[expanded,setExpanded]=useState<number|null>(null);
  const[showCode,setShowCode]=useState<Set<number>>(new Set());

  const toggleCode=(id:number)=>{const s=new Set(showCode);s.has(id)?s.delete(id):s.add(id);setShowCode(s)};

  return(
    <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"2rem 1rem"}}>
      <div style={{maxWidth:750,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:"2rem"}}>
          <div style={{fontSize:13,color:ORANGE,fontWeight:600,letterSpacing:2,textTransform:"uppercase"}}>Exercices pratiques</div>
          <h1 style={{fontSize:28,fontWeight:700,margin:"0.5rem 0"}}>Cas d'entreprise Java</h1>
          <p style={{color:MUTED,fontSize:15}}>3 exercices avec classes, objets et structures de données</p>
        </div>
        <div style={{display:"grid",gap:16}}>
          {EXERCISES.map(ex=>(
            <div key={ex.id} style={{border:`1px solid ${expanded===ex.id?ex.color:BORDER}`,borderRadius:12,overflow:"hidden"}}>
              <button onClick={()=>setExpanded(expanded===ex.id?null:ex.id)}
                style={{width:"100%",padding:"16px",background:expanded===ex.id?ex.color+"15":CARD,border:"none",cursor:"pointer",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <span style={{fontSize:24,marginRight:10}}>{ex.emoji}</span>
                  <span style={{fontSize:18,fontWeight:700,color:TEXT}}>Exercice {ex.id} — {ex.title}</span>
                </div>
                <span style={{color:MUTED,fontSize:18}}>{expanded===ex.id?"▲":"▼"}</span>
              </button>
              {expanded===ex.id&&(
                <div style={{padding:"0 16px 16px"}}>
                  <div style={{padding:"10px 14px",background:ex.color+"10",borderRadius:8,marginBottom:12,marginTop:8}}>
                    <div style={{fontSize:13,fontWeight:600,color:ex.color,marginBottom:4}}>Contexte :</div>
                    <div style={{fontSize:14,color:TEXT}}>{ex.context}</div>
                  </div>
                  <div style={{marginBottom:12}}>
                    <div style={{fontSize:13,fontWeight:600,color:TEXT,marginBottom:6}}>Fonctionnalités demandées :</div>
                    {ex.tasks.map((t,i)=>(<div key={i} style={{fontSize:13,color:MUTED,padding:"3px 0"}}>• {t}</div>))}
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                    <div style={{padding:"10px",background:CARD,borderRadius:8,border:`1px solid ${BORDER}`}}>
                      <div style={{fontSize:11,fontWeight:600,color:TEAL,textTransform:"uppercase",marginBottom:4}}>Structure de données</div>
                      <div style={{fontSize:14,fontWeight:600,color:TEXT}}>{ex.structure}</div>
                      <div style={{fontSize:11,color:MUTED,marginTop:4}}>{ex.structureWhy}</div>
                    </div>
                    <div style={{padding:"10px",background:CARD,borderRadius:8,border:`1px solid ${BORDER}`}}>
                      <div style={{fontSize:11,fontWeight:600,color:PURPLE,textTransform:"uppercase",marginBottom:4}}>Classes à créer</div>
                      {ex.classes.map((c,i)=>(<div key={i} style={{fontSize:12,color:TEXT,padding:"2px 0"}}>{i+1}. {c}</div>))}
                    </div>
                  </div>
                  <div style={{marginBottom:12}}>
                    <div style={{fontSize:11,fontWeight:600,color:ORANGE,marginBottom:4}}>Critères couverts : {ex.criteria}</div>
                  </div>
                  <button onClick={()=>toggleCode(ex.id)}
                    style={{padding:"8px 16px",background:showCode.has(ex.id)?RED+"20":GREEN+"20",border:`1px solid ${showCode.has(ex.id)?RED:GREEN}`,borderRadius:8,fontSize:12,fontWeight:600,color:showCode.has(ex.id)?RED:GREEN,cursor:"pointer"}}>
                    {showCode.has(ex.id)?"Cacher la correction":"Voir la correction"}
                  </button>
                  {showCode.has(ex.id)&&(
                    <div style={{marginTop:10,background:"#0D1117",borderRadius:10,padding:"12px"}}>
                      <pre style={{fontSize:11,color:"#A5F3FC",fontFamily:"Consolas,monospace",margin:0,whiteSpace:"pre-wrap"}}>{ex.code}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
