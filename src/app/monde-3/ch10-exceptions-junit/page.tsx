"use client";
import { useState } from "react";

const BG="#0B1120",CARD="#111827",BORDER="#1E3A5F",TEXT="#E2E8F0",MUTED="#94A3B8",GREEN="#16A34A",RED="#DC2626",ORANGE="#F97316",PURPLE="#7C3AED",TEAL="#0891B2";

// ─── GAME 1: Debug Puzzle with progressive hints ───
const PUZZLES=[
  {title:"NullPointerException",code:["String nom = null;","int len = nom.length();","System.out.println(len);"],bugLine:1,hints:["La variable est utilisée avant d'être initialisée...","Que vaut 'nom' à la ligne 1 ?","nom est null ! On ne peut pas appeler .length() sur null"],fix:"if (nom != null) {\n    int len = nom.length();\n}",concept:"Toujours vérifier null"},
  {title:"ArrayIndexOutOfBounds",code:["int[] notes = {15, 12, 18};","for (int i = 0; i <= notes.length; i++) {","    System.out.println(notes[i]);","}"],bugLine:1,hints:["Le problème est dans la condition de la boucle...","notes.length = 3, mais les index valides sont 0, 1, 2","<= devrait être < ! notes[3] n'existe pas."],fix:"for (int i = 0; i < notes.length; i++) {\n    System.out.println(notes[i]);\n}",concept:"Index max = length - 1"},
  {title:"Division par zéro",code:["Scanner sc = new Scanner(System.in);","int diviseur = sc.nextInt();","int resultat = 100 / diviseur;","System.out.println(resultat);"],bugLine:2,hints:["Que se passe-t-il si l'utilisateur entre 0 ?","100 / 0 lance ArithmeticException !","Il faut vérifier avant de diviser"],fix:"if (diviseur != 0) {\n    int resultat = 100 / diviseur;\n} else {\n    System.out.println(\"Division impossible !\");\n}",concept:"Valider l'entrée utilisateur"},
  {title:"try-catch manquant",code:["FileReader fr = new FileReader(\"data.txt\");","BufferedReader br = new BufferedReader(fr);","String ligne = br.readLine();"],bugLine:0,hints:["FileReader est un appel risqué...","C'est une Checked Exception","Le compilateur REFUSE ce code sans try-catch ou throws"],fix:"try {\n    FileReader fr = new FileReader(\"data.txt\");\n    BufferedReader br = new BufferedReader(fr);\n    String ligne = br.readLine();\n} catch (IOException e) {\n    System.out.println(\"Erreur : \" + e.getMessage());\n} finally {\n    // Fermer les ressources\n}",concept:"Checked exception = obligé de gérer"},
  {title:"throw vs throws",code:["public void retirer(double montant) {","    if (montant > solde)","        System.out.println(\"Pas assez\");","    solde -= montant;","}"],bugLine:2,hints:["Le message s'affiche mais le code continue...","Le retrait se fait quand même ! Pas de return ni throw","Il faut lancer une exception pour ARRÊTER l'exécution"],fix:"public void retirer(double montant) {\n    if (montant > solde)\n        throw new IllegalArgumentException(\"Solde insuffisant\");\n    solde -= montant;\n}",concept:"throw pour arrêter l'exécution"},
];

// ─── GAME 2: JUnit Code Builder ───
const JUNIT_BLOCKS=[
  {id:"import",code:"import org.junit.jupiter.api.*;",order:0,group:"setup"},
  {id:"import2",code:"import static org.junit.jupiter.api.Assertions.*;",order:1,group:"setup"},
  {id:"class",code:"class GestionStockTest {",order:2,group:"setup"},
  {id:"field",code:"    private GestionStock gs;",order:3,group:"setup"},
  {id:"before",code:"    @BeforeEach",order:4,group:"setup"},
  {id:"setup",code:"    void setUp() { gs = new GestionStock(); }",order:5,group:"setup"},
  {id:"test1a",code:"    @Test",order:6,group:"test1"},
  {id:"test1b",code:"    void testAjouter() {",order:7,group:"test1"},
  {id:"test1c",code:'        gs.ajouter(new Produit("P1", 10));',order:8,group:"test1"},
  {id:"test1d",code:"        assertEquals(1, gs.getTaille());",order:9,group:"test1"},
  {id:"test1e",code:"    }",order:10,group:"test1"},
  {id:"test2a",code:"    @Test",order:11,group:"test2"},
  {id:"test2b",code:"    void testSupprimerVide() {",order:12,group:"test2"},
  {id:"test2c",code:"        assertThrows(IllegalStateException.class,",order:13,group:"test2"},
  {id:"test2d",code:'            () -> gs.supprimer("P1"));',order:14,group:"test2"},
  {id:"test2e",code:"    }",order:15,group:"test2"},
  {id:"close",code:"}",order:16,group:"close"},
];

// ─── GAME 3: JUnit Quiz ───
const JUNIT_QS=[
  {q:"Quelle annotation JUnit 5 marque un test ?",o:["@Test","@JUnit","@RunWith","@Testing"],c:0,e:"@Test de org.junit.jupiter.api.Test (JUnit 5 Jupiter, pas JUnit 4)."},
  {q:"assertThrows vérifie :",o:["Qu'il n'y a pas d'exception","Qu'une exception EST lancée","Le type de retour","La performance"],c:1,e:"assertThrows(Exception.class, () -> code()) vérifie que le code lance bien l'exception."},
  {q:"@BeforeEach s'exécute :",o:["Une seule fois","Avant CHAQUE méthode @Test","Après chaque test","Jamais"],c:1,e:"Avant CHAQUE test = setup frais à chaque fois. Utile pour réinitialiser l'état."},
  {q:"throw vs throws :",o:["Identiques","throw LANCE, throws DÉCLARE","throw déclare, throws lance","throw = JUnit 4"],c:1,e:"throw new X() LANCE. throws X DÉCLARE dans la signature."},
  {q:"finally s'exécute :",o:["Seulement si exception","Seulement sans exception","TOUJOURS","Jamais"],c:2,e:"TOUJOURS exécuté. Parfait pour fermer fichiers/connexions."},
  {q:"Checked exception en Java :",o:["RuntimeException","Doit être catch ou throws (compilateur l'exige)","Optionnelle","N'existe pas en Java"],c:1,e:"IOException, FileNotFoundException = checked. Le compilateur REFUSE si non gérée."},
  {q:"assertEquals(expected, actual) compare avec :",o:["==","equals()","compareTo()","hashCode()"],c:1,e:"assertEquals utilise equals() pour les objets, == pour les primitifs."},
  {q:"Quelle est la bonne structure d'un test ?",o:["Test → Assert","Arrange → Act → Assert","Assert → Act → Arrange","Act → Assert → Arrange"],c:1,e:"AAA : Arrange (préparer), Act (exécuter), Assert (vérifier). Pattern standard."},
];

type Phase="menu"|"debug"|"builder"|"quiz";

export default function Ch10Game(){
  const[phase,setPhase]=useState<Phase>("menu");
  // Debug
  const[puzzIdx,setPuzzIdx]=useState(0);const[hintLevel,setHintLevel]=useState(0);
  const[clickedLine,setClickedLine]=useState<number|null>(null);const[showFix,setShowFix]=useState(false);
  // Builder
  const[placed,setPlaced]=useState<string[]>([]);const[available,setAvailable]=useState<typeof JUNIT_BLOCKS>([]);
  const[builderDone,setBuilderDone]=useState(false);
  // Quiz
  const[qIdx,setQIdx]=useState(0);const[qScore,setQScore]=useState(0);
  const[sel,setSel]=useState<number|null>(null);const[show,setShow]=useState(false);

  const back=<button onClick={()=>setPhase("menu")} style={{fontSize:13,color:MUTED,background:"none",border:"none",cursor:"pointer",marginBottom:12}}>← Retour</button>;

  const initBuilder=()=>{setPlaced([]);setAvailable([...JUNIT_BLOCKS].sort(()=>Math.random()-0.5));setBuilderDone(false)};

  if(phase==="menu")return(
    <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"2rem 1rem"}}>
      <div style={{maxWidth:700,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:"2rem"}}>
          <div style={{fontSize:13,color:ORANGE,fontWeight:600,letterSpacing:2,textTransform:"uppercase"}}>Monde 3 — Chapitre 10</div>
          <h1 style={{fontSize:28,fontWeight:700,margin:"0.5rem 0"}}>Exceptions + JUnit 5</h1>
          <p style={{color:MUTED,fontSize:15}}>Critère P5 — Error handling et tests</p>
          <a href="/fiches/Ch10_Fiche_Memo_Exceptions_JUnit.pdf" target="_blank" rel="noopener" style={{display:"inline-block",marginTop:8,padding:"6px 14px",background:"#1E293B",border:"1px solid #1E3A5F",borderRadius:8,fontSize:12,color:"#94A3B8",textDecoration:"none"}}>Fiche memo PDF</a>
        </div>
        <div style={{display:"grid",gap:14}}>
          {[
            {p:"debug" as Phase,emoji:"🧩",t:"Puzzle de Débogage",d:"5 bugs Java — trouvez la ligne, avec indices progressifs",c:RED},
            {p:"builder" as Phase,emoji:"🏗️",t:"Code Builder JUnit",d:"Reconstituez un test JUnit 5 complet en ordonnant les blocs",c:PURPLE},
            {p:"quiz" as Phase,emoji:"🧠",t:"Quiz JUnit 5 & Exceptions",d:"8 questions : @Test, assertThrows, throw/throws, try-catch-finally",c:GREEN},
          ].map(g=>(
            <button key={g.p} onClick={()=>{setPhase(g.p);if(g.p==="debug"){setPuzzIdx(0);setHintLevel(0);setClickedLine(null);setShowFix(false)}if(g.p==="builder")initBuilder();if(g.p==="quiz"){setQIdx(0);setQScore(0);setSel(null);setShow(false)}}}
              style={{padding:"1.2rem",border:`2px solid ${BORDER}`,borderRadius:12,background:CARD,cursor:"pointer",textAlign:"left"}}>
              <div style={{fontSize:18,fontWeight:600,color:g.c}}>{g.emoji} {g.t}</div>
              <div style={{fontSize:13,color:MUTED,marginTop:4}}>{g.d}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── DEBUG PUZZLE ───
  if(phase==="debug"){
    if(puzzIdx>=PUZZLES.length)return(<div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"3rem 1rem"}}><div style={{maxWidth:500,margin:"0 auto",textAlign:"center"}}><div style={{fontSize:48}}>🎉</div><div style={{fontSize:22,fontWeight:700,margin:"0.5rem 0"}}>Tous les bugs trouvés !</div><button onClick={()=>setPhase("menu")} style={{marginTop:16,padding:"10px 24px",background:ORANGE,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Retour</button></div></div>);
    const puzz=PUZZLES[puzzIdx];
    return(
      <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          {back}
          <div style={{fontSize:13,color:MUTED,marginBottom:8}}>Bug {puzzIdx+1}/{PUZZLES.length}</div>
          <h2 style={{fontSize:20,fontWeight:700,color:RED,marginBottom:4}}>🧩 {puzz.title}</h2>
          <p style={{fontSize:13,color:MUTED,marginBottom:12}}>Cliquez sur la ligne qui contient le bug :</p>
          <div style={{background:"#0D1117",borderRadius:10,padding:"12px",marginBottom:12}}>
            {puzz.code.map((line,i)=>(
              <div key={i} onClick={()=>{if(showFix)return;setClickedLine(i);if(i===puzz.bugLine)setShowFix(true);else setHintLevel(h=>Math.min(h+1,puzz.hints.length-1))}}
                style={{padding:"6px 10px",borderRadius:6,cursor:showFix?"default":"pointer",display:"flex",gap:10,
                  background:showFix&&i===puzz.bugLine?RED+"20":clickedLine===i&&i!==puzz.bugLine?ORANGE+"15":"transparent",
                  border:`1px solid ${showFix&&i===puzz.bugLine?RED:clickedLine===i&&i!==puzz.bugLine?ORANGE:"transparent"}`,
                  transition:"all 0.2s"}}>
                <span style={{color:MUTED,fontSize:11,minWidth:20,textAlign:"right"}}>{i+1}</span>
                <code style={{fontSize:13,color:showFix&&i===puzz.bugLine?"#FCA5A5":"#A5F3FC",fontFamily:"Consolas,monospace"}}>{line}</code>
              </div>
            ))}
          </div>
          {!showFix&&hintLevel>0&&(
            <div style={{padding:"10px 14px",background:ORANGE+"15",borderRadius:8,marginBottom:8,fontSize:13,color:ORANGE}}>
              💡 Indice {hintLevel}/{puzz.hints.length} : {puzz.hints[hintLevel-1]}
            </div>
          )}
          {!showFix&&<button onClick={()=>setHintLevel(h=>Math.min(h+1,puzz.hints.length))} style={{padding:"8px 16px",background:CARD,color:ORANGE,border:`1px solid ${ORANGE}`,borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer"}}>💡 Indice suivant ({hintLevel}/{puzz.hints.length})</button>}
          {showFix&&(
            <div style={{marginTop:8}}>
              <div style={{padding:"10px 14px",background:GREEN+"15",borderRadius:8,marginBottom:8}}>
                <div style={{fontSize:13,fontWeight:600,color:GREEN,marginBottom:4}}>✅ Bug trouvé ! Concept : {puzz.concept}</div>
              </div>
              <div style={{padding:"10px",background:"#0D1117",borderRadius:8,marginBottom:8}}>
                <div style={{fontSize:11,color:GREEN,fontWeight:600,marginBottom:4}}>FIX :</div>
                <pre style={{fontSize:12,color:"#A5F3FC",fontFamily:"Consolas,monospace",margin:0,whiteSpace:"pre-wrap"}}>{puzz.fix}</pre>
              </div>
              <button onClick={()=>{setPuzzIdx(i=>i+1);setHintLevel(0);setClickedLine(null);setShowFix(false)}}
                style={{width:"100%",padding:"10px",background:ORANGE,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Bug suivant →</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── CODE BUILDER ───
  if(phase==="builder"){
    const addBlock=(id:string)=>{setPlaced(p=>[...p,id]);setAvailable(a=>a.filter(b=>b.id!==id));};
    const removeBlock=(id:string)=>{setPlaced(p=>p.filter(x=>x!==id));const block=JUNIT_BLOCKS.find(b=>b.id===id);if(block)setAvailable(a=>[...a,block])};
    const checkOrder=()=>{const correct=placed.every((id,i)=>{const block=JUNIT_BLOCKS.find(b=>b.id===id);return block&&block.order===i});setBuilderDone(true);return correct};
    const isCorrect=builderDone&&placed.every((id,i)=>{const block=JUNIT_BLOCKS.find(b=>b.id===id);return block&&block.order===i});

    return(
      <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          {back}
          <h2 style={{fontSize:20,fontWeight:700,color:PURPLE,marginBottom:4}}>🏗️ Code Builder — Test JUnit 5</h2>
          <p style={{fontSize:13,color:MUTED,marginBottom:12}}>Cliquez les blocs dans le bon ordre pour reconstituer un test complet :</p>
          
          <div style={{marginBottom:16}}>
            <div style={{fontSize:12,color:MUTED,marginBottom:6}}>Blocs disponibles :</div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
              {available.map(block=>(
                <button key={block.id} onClick={()=>addBlock(block.id)}
                  style={{padding:"4px 10px",background:CARD,border:`1px solid ${BORDER}`,borderRadius:6,fontSize:11,color:"#A5F3FC",fontFamily:"Consolas,monospace",cursor:"pointer",whiteSpace:"nowrap"}}>
                  {block.code.trim().substring(0,40)}{block.code.length>40?"...":""}
                </button>
              ))}
            </div>
          </div>

          <div style={{background:"#0D1117",borderRadius:10,padding:"12px",minHeight:150,marginBottom:12}}>
            <div style={{fontSize:12,color:MUTED,marginBottom:6}}>Votre code :</div>
            {placed.length===0?<div style={{color:MUTED,fontStyle:"italic",fontSize:13}}>Cliquez les blocs ci-dessus...</div>:
              placed.map((id,i)=>{const block=JUNIT_BLOCKS.find(b=>b.id===id);if(!block)return null;
                const isRight=builderDone&&block.order===i;const isWrong=builderDone&&block.order!==i;
                return(
                  <div key={id} onClick={()=>{if(!builderDone)removeBlock(id)}}
                    style={{padding:"3px 8px",cursor:builderDone?"default":"pointer",borderRadius:4,
                      background:isRight?GREEN+"15":isWrong?RED+"15":"transparent",
                      borderLeft:`2px solid ${isRight?GREEN:isWrong?RED:"transparent"}`}}>
                    <code style={{fontSize:12,color:isRight?"#86EFAC":isWrong?"#FCA5A5":"#A5F3FC",fontFamily:"Consolas,monospace"}}>{block.code}</code>
                  </div>
                );
              })
            }
          </div>
          {!builderDone&&placed.length===JUNIT_BLOCKS.length&&(
            <button onClick={checkOrder} style={{width:"100%",padding:"10px",background:PURPLE,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>✓ Vérifier l'ordre</button>
          )}
          {builderDone&&(
            <div style={{padding:"12px",background:isCorrect?GREEN+"15":RED+"15",borderRadius:8,textAlign:"center"}}>
              <div style={{fontSize:16,fontWeight:700,color:isCorrect?GREEN:RED}}>{isCorrect?"✅ Parfait ! Test JUnit 5 complet !":"❌ L'ordre n'est pas correct. Réessayez !"}</div>
              {!isCorrect&&<button onClick={initBuilder} style={{marginTop:8,padding:"8px 16px",background:PURPLE,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Réessayer</button>}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── QUIZ ───
  if(qIdx>=JUNIT_QS.length){const p=Math.round(qScore/JUNIT_QS.length*100);return(<div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"3rem 1rem"}}><div style={{maxWidth:500,margin:"0 auto",textAlign:"center"}}><div style={{fontSize:64,fontWeight:800,color:p>=70?GREEN:ORANGE}}>{qScore}/{JUNIT_QS.length}</div><button onClick={()=>setPhase("menu")} style={{marginTop:16,padding:"10px 24px",background:GREEN,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Retour</button></div></div>)}
  const q=JUNIT_QS[qIdx];
  return(
    <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
      <div style={{maxWidth:650,margin:"0 auto"}}>
        {back}
        <div style={{fontSize:13,color:MUTED,marginBottom:8}}>{qIdx+1}/{JUNIT_QS.length} | Score: {qScore}</div>
        <div style={{height:4,background:BORDER,borderRadius:2,marginBottom:16}}><div style={{height:4,background:GREEN,borderRadius:2,width:`${(qIdx+1)/JUNIT_QS.length*100}%`}}/></div>
        <p style={{fontSize:16,fontWeight:600,marginBottom:12}}>{q.q}</p>
        <div style={{display:"grid",gap:8}}>{q.o.map((o,i)=>{let bg=CARD,bd=BORDER;if(show){if(i===q.c){bg=GREEN+"20";bd=GREEN}else if(i===sel){bg=RED+"20";bd=RED}}return(<button key={i} onClick={()=>{if(show)return;setSel(i);setShow(true);if(i===q.c)setQScore(s=>s+1)}} disabled={show} style={{padding:"10px 14px",border:`2px solid ${bd}`,borderRadius:8,background:bg,cursor:show?"default":"pointer",textAlign:"left",fontSize:14,color:TEXT}}>{o}</button>)})}</div>
        {show&&<><div style={{marginTop:10,padding:"10px 14px",background:GREEN+"15",borderRadius:8,fontSize:13,color:GREEN}}>{q.e}</div><button onClick={()=>{setQIdx(i=>i+1);setSel(null);setShow(false)}} style={{marginTop:10,width:"100%",padding:"10px",background:GREEN,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Suivant →</button></>}
      </div>
    </div>
  );
}
