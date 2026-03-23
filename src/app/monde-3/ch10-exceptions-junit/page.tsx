"use client";
import QuizEngine from "@/components/QuizEngine";
import { useState } from "react";
import Link from "next/link";
import TopBar from "@/components/TopBar";

const BG="#0B1120",CARD="#111827",BORDER="#1E3A5F",TEXT="#E2E8F0",MUTED="#94A3B8",GREEN="#16A34A",RED="#DC2626",ORANGE="#F97316",PURPLE="#7C3AED",TEAL="#0891B2";

// ─── GAME 1: Trace try/catch/finally ───
const TRACES=[
  {title:"try/catch simple (pas d'exception)",
    code:['System.out.println("A");','try {','    System.out.println("B");','    int x = 10 / 2;','    System.out.println("C");','} catch (ArithmeticException e) {','    System.out.println("D");','}','System.out.println("E");'],
    correctOrder:["A","B","C","E"],
    explain:"Pas d'exception : le try s'execute normalement (A, B, C), le catch est IGNORE, puis E."},
  {title:"try/catch avec exception",
    code:['System.out.println("A");','try {','    System.out.println("B");','    int x = 10 / 0; // ArithmeticException !','    System.out.println("C");','} catch (ArithmeticException e) {','    System.out.println("D");','}','System.out.println("E");'],
    correctOrder:["A","B","D","E"],
    explain:"Exception a la ligne 4 : B s'affiche, C est SAUTE, on passe au catch (D), puis E."},
  {title:"try/catch/finally SANS exception",
    code:['try {','    System.out.println("A");','    int x = 10 / 2;','    System.out.println("B");','} catch (Exception e) {','    System.out.println("C");','} finally {','    System.out.println("D");','}','System.out.println("E");'],
    correctOrder:["A","B","D","E"],
    explain:"Pas d'exception : try execute (A,B), catch ignore, finally TOUJOURS (D), puis E."},
  {title:"try/catch/finally AVEC exception",
    code:['try {','    System.out.println("A");','    int[] arr = new int[2];','    arr[5] = 10; // ArrayIndexOutOfBounds !','    System.out.println("B");','} catch (ArrayIndexOutOfBoundsException e) {','    System.out.println("C");','} finally {','    System.out.println("D");','}','System.out.println("E");'],
    correctOrder:["A","C","D","E"],
    explain:"Exception ligne 4 : A s'affiche, B SAUTE, catch (C), finally TOUJOURS (D), puis E."},
  {title:"finally avec Scanner (cas pratique)",
    code:['Scanner sc = new Scanner(System.in);','try {','    System.out.println("A");','    int age = Integer.parseInt("abc");','    System.out.println("B");','} catch (NumberFormatException e) {','    System.out.println("C");','} finally {','    sc.close();','    System.out.println("D");','}'],
    correctOrder:["A","C","D"],
    explain:'"abc" cause NumberFormatException : A, puis C (catch), puis D (finally ferme le Scanner). B jamais execute.'},
  {title:"throw + try/catch/finally",
    code:['public void setAge(int age) {','    try {','        if (age < 0)','            throw new IllegalArgumentException("Negatif!");','        System.out.println("A");','    } catch (IllegalArgumentException e) {','        System.out.println("B");','    } finally {','        System.out.println("C");','    }','}','// Appel: setAge(-5)'],
    correctOrder:["B","C"],
    explain:"age=-5 : throw a la ligne 4, A SAUTE, catch (B), finally TOUJOURS (C)."},
];

// ─── GAME 2: throws vs throw compile checker ───
const COMPILE_CHECKS=[
  {code:'public void retirer(double montant) {\n    if (montant > solde)\n        System.out.println("Pas assez");\n    solde -= montant;\n}',
    compiles:true,problem:true,
    explain:"Compile MAIS bug : le retrait se fait quand meme ! println ne stoppe pas. Il faut throw new IllegalArgumentException()."},
  {code:'public void retirer(double montant) {\n    if (montant > solde)\n        throw new IllegalArgumentException("Solde insuffisant");\n    solde -= montant;\n}',
    compiles:true,problem:false,
    explain:"Correct : throw arrete l'execution. solde -= montant ne sera PAS execute si montant > solde."},
  {code:'public Medicament rechercher(String nom) {\n    for (Medicament m : liste)\n        if (m.getNom().equals(nom)) return m;\n    throw new Exception("Non trouve");\n}',
    compiles:false,problem:true,
    explain:"NE compile PAS : Exception est checked. Il faut ajouter throws Exception dans la signature."},
  {code:'public Medicament rechercher(String nom) throws Exception {\n    for (Medicament m : liste)\n        if (m.getNom().equals(nom)) return m;\n    throw new Exception("Non trouve");\n}',
    compiles:true,problem:false,
    explain:"Compile : throws Exception dans la signature previent l'appelant. L'appelant devra try/catch."},
  {code:'public void resoudreTicket(int id) {\n    if (!tickets.containsKey(id))\n        throw new RuntimeException("Inexistant");\n    tickets.get(id).setResolu(true);\n}',
    compiles:true,problem:false,
    explain:"Compile : RuntimeException est unchecked, pas besoin de throws dans la signature. Mais throws Exception serait plus propre."},
  {code:'try {\n    gestion.resoudreTicket(id);\n} catch (Exception e) {\n    System.out.println("Erreur");\n}',
    compiles:true,problem:false,
    explain:"Compile : try/catch gere l'exception. Le programme continue normalement apres le catch."},
  {code:'try {\n    reader = new FileReader("data.txt");\n} catch (IOException e) {\n    System.out.println("Erreur");\n}',
    compiles:false,problem:true,
    explain:"NE compile PAS si reader est utilise apres : le compilateur ne sait pas s'il a ete initialise. Utiliser finally pour fermer."},
  {code:'public void lire() throws IOException {\n    BufferedReader r = new BufferedReader(\n        new FileReader("f.txt"));\n    String ligne = r.readLine();\n}',
    compiles:true,problem:true,
    explain:"Compile MAIS probleme : le fichier n'est jamais ferme ! Il manque finally { r.close(); }."},
  {code:'public class GestionTickets {\n    private int compteurId = 1;\n    public Ticket creerTicket(String desc) {\n        Ticket t = new Ticket(compteurId, desc);\n        compteurId++;\n        return t;\n    }\n}',
    compiles:true,problem:false,
    explain:"Compile et fonctionne : auto-increment correct. compteurId commence a 1, chaque appel cree un ticket avec l'id courant puis incremente. Les ids sont 1, 2, 3..."},
];

// ─── GAME 3: Debug Puzzle ───
const PUZZLES=[
  {title:"NullPointerException",code:["String nom = null;","int len = nom.length();","System.out.println(len);"],bugLine:1,hints:["La variable est utilisee avant d'etre initialisee...","Que vaut 'nom' a la ligne 1 ?","nom est null ! On ne peut pas appeler .length() sur null"],fix:"if (nom != null) {\n    int len = nom.length();\n}",concept:"Toujours verifier null"},
  {title:"ArrayIndexOutOfBounds",code:["int[] notes = {15, 12, 18};","for (int i = 0; i <= notes.length; i++) {","    System.out.println(notes[i]);","}"],bugLine:1,hints:["Le probleme est dans la condition de la boucle...","notes.length = 3, mais les index valides sont 0, 1, 2","<= devrait etre < ! notes[3] n'existe pas."],fix:"for (int i = 0; i < notes.length; i++) {\n    System.out.println(notes[i]);\n}",concept:"Index max = length - 1"},
  {title:"Division par zero",code:["Scanner sc = new Scanner(System.in);","int diviseur = sc.nextInt();","int resultat = 100 / diviseur;","System.out.println(resultat);"],bugLine:2,hints:["Que se passe-t-il si l'utilisateur entre 0 ?","100 / 0 lance ArithmeticException !","Il faut verifier avant de diviser"],fix:"if (diviseur != 0) {\n    int resultat = 100 / diviseur;\n} else {\n    System.out.println(\"Division impossible !\");\n}",concept:"Valider l'entree utilisateur"},
  {title:"try-catch manquant",code:["FileReader fr = new FileReader(\"data.txt\");","BufferedReader br = new BufferedReader(fr);","String ligne = br.readLine();"],bugLine:0,hints:["FileReader est un appel risque...","C'est une Checked Exception","Le compilateur REFUSE ce code sans try-catch ou throws"],fix:"try {\n    FileReader fr = new FileReader(\"data.txt\");\n    BufferedReader br = new BufferedReader(fr);\n    String ligne = br.readLine();\n} catch (IOException e) {\n    System.out.println(\"Erreur : \" + e.getMessage());\n} finally {\n    // Fermer les ressources\n}",concept:"Checked exception = oblige de gerer"},
  {title:"throw vs println",code:["public void retirer(double montant) {","    if (montant > solde)","        System.out.println(\"Pas assez\");","    solde -= montant;","}"],bugLine:2,hints:["Le message s'affiche mais le code continue...","Le retrait se fait quand meme ! Pas de return ni throw","Il faut lancer une exception pour ARRETER l'execution"],fix:"public void retirer(double montant) {\n    if (montant > solde)\n        throw new IllegalArgumentException(\"Solde insuffisant\");\n    solde -= montant;\n}",concept:"throw pour arreter l'execution"},
];

// ─── GAME 4: JUnit Code Builder ───
const JUNIT_BLOCKS=[
  {id:"import",code:"import org.junit.jupiter.api.*;",order:0},
  {id:"import2",code:"import static org.junit.jupiter.api.Assertions.*;",order:1},
  {id:"class",code:"class GestionStockTest {",order:2},
  {id:"field",code:"    private GestionStock gs;",order:3},
  {id:"before",code:"    @BeforeEach",order:4},
  {id:"setup",code:"    void setUp() { gs = new GestionStock(); }",order:5},
  {id:"test1a",code:"    @Test",order:6},
  {id:"test1b",code:"    void testAjouter() {",order:7},
  {id:"test1c",code:'        gs.ajouter(new Medicament("P1", 10, 5, "31/12/2025"));',order:8},
  {id:"test1d",code:"        assertEquals(1, gs.getTaille());",order:9},
  {id:"test1e",code:"    }",order:10},
  {id:"test2a",code:"    @Test",order:11},
  {id:"test2b",code:"    void testRechercherInexistant() {",order:12},
  {id:"test2c",code:"        assertThrows(Exception.class,",order:13},
  {id:"test2d",code:'            () -> gs.rechercher("Inexistant"));',order:14},
  {id:"test2e",code:"    }",order:15},
  {id:"close",code:"}",order:16},
];

// ─── GAME 5: Quiz enrichi ───
const QUIZ=[
  {q:"throw vs throws :",o:["Identiques","throw LANCE, throws DECLARE","throw declare, throws lance","Les deux lancent"],c:1,e:"throw new X() LANCE l'exception dans le corps. throws X DECLARE dans la signature que la methode peut echouer."},
  {q:"finally s'execute :",o:["Seulement si exception","Seulement sans exception","TOUJOURS (meme avec return)","Jamais"],c:2,e:"TOUJOURS execute. Meme si try contient un return ! Ideal pour fermer fichiers/Scanner."},
  {q:"Checked exception en Java :",o:["RuntimeException","Le compilateur OBLIGE le catch/throws","Optionnelle","N'existe pas"],c:1,e:"IOException, FileNotFoundException, Exception = checked. Le compilateur REFUSE si non geree."},
  {q:"assertEquals(expected, actual) compare avec :",o:["==","equals()","compareTo()","hashCode()"],c:1,e:"assertEquals utilise equals() pour les objets, == pour les primitifs."},
  {q:"assertThrows verifie :",o:["Qu'il n'y a pas d'exception","Qu'une exception EST lancee","Le type de retour","La performance"],c:1,e:"assertThrows(Exception.class, () -> code()) verifie que le code lance bien l'exception attendue."},
  {q:"@BeforeEach s'execute :",o:["Une seule fois","Avant CHAQUE methode @Test","Apres chaque test","Jamais"],c:1,e:"Avant CHAQUE test = setup frais. Chaque test commence avec un etat propre."},
  {q:"Pattern des tests :",o:["Test > Assert","Arrange > Act > Assert","Assert > Act > Arrange","Run > Check"],c:1,e:"AAA : Arrange (preparer), Act (executer), Assert (verifier). Structure de TOUT bon test."},
  {q:"Que fait ce code ?\ntry { return 1; }\nfinally { System.out.println(\"X\"); }",o:["Affiche X puis retourne 1","Retourne 1 sans afficher","Erreur de compilation","Affiche X mais ne retourne rien"],c:0,e:"finally s'execute MEME avec un return ! X est affiche, puis la methode retourne 1."},
];

type Phase="menu"|"trace"|"compile"|"debug"|"builder"|"quiz";

export default function Ch10Game(){
  const[phase,setPhase]=useState("menu" as Phase);
  // Trace
  const[trIdx,setTrIdx]=useState(0);const[trSel,setTrSel]=useState([] as string[]);const[trShow,setTrShow]=useState(false);const[trScore,setTrScore]=useState(0);
  // Compile
  const[compIdx,setCompIdx]=useState(0);const[compSel,setCompSel]=useState(null as string|null);const[compShow,setCompShow]=useState(false);const[compScore,setCompScore]=useState(0);
  // Debug
  const[puzzIdx,setPuzzIdx]=useState(0);const[hintLevel,setHintLevel]=useState(0);const[clickedLine,setClickedLine]=useState(null as number|null);const[showFix,setShowFix]=useState(false);
  // Builder
  const[placed,setPlaced]=useState([] as string[]);const[available,setAvailable]=useState([] as typeof JUNIT_BLOCKS);const[builderDone,setBuilderDone]=useState(false);
  // Quiz
  const[qIdx,setQIdx]=useState(0);const[qScore,setQScore]=useState(0);const[sel,setSel]=useState(null as number|null);const[show,setShow]=useState(false);

  const back=<button onClick={()=>setPhase("menu")} style={{fontSize:13,color:MUTED,background:"none",border:"none",cursor:"pointer",marginBottom:12}}>Retour</button>;
  const initBuilder=()=>{setPlaced([]);setAvailable([...JUNIT_BLOCKS].sort(()=>Math.random()-0.5));setBuilderDone(false)};

  const letters=["A","B","C","D","E","F"];
  const toggleLetter=(l:string)=>{if(trShow)return;setTrSel(prev=>prev.includes(l)?prev.filter(x=>x!==l):[...prev,l])};

  if(phase==="menu")return(
    <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"2rem 1rem"}}>
      <TopBar/>
      <div style={{padding:"8px 16px",borderBottom:"1px solid "+BORDER}}><Link href="/" style={{fontSize:12,color:MUTED,textDecoration:"none"}}>Retour accueil</Link></div>
      <div style={{maxWidth:700,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:"2rem"}}>
          <div style={{fontSize:13,color:ORANGE,fontWeight:600,letterSpacing:2,textTransform:"uppercase"}}>Monde 3 — Chapitre 10</div>
          <h1 style={{fontSize:28,fontWeight:700,margin:"0.5rem 0"}}>Exceptions + JUnit 5</h1>
          <p style={{color:MUTED,fontSize:15}}>P5 — throw, throws, try/catch/finally, JUnit</p>
          <a href="/fiches/Ch10_Fiche_Memo_Exceptions_JUnit.pdf" target="_blank" rel="noopener" style={{display:"inline-block",marginTop:8,padding:"6px 14px",background:"#1E293B",border:"1px solid #1E3A5F",borderRadius:8,fontSize:12,color:"#94A3B8",textDecoration:"none"}}>Fiche memo PDF</a>
        </div>
        <div style={{display:"grid",gap:14}}>
          {[
            {p:"trace" as Phase,t:"Trace try/catch/finally",d:"6 programmes — dans quel ordre les println s'executent ?",c:TEAL},
            {p:"compile" as Phase,t:"Compile ou pas ?",d:"8 extraits — ce code compile-t-il ? Quel probleme ?",c:PURPLE},
            {p:"debug" as Phase,t:"Puzzle de Debogage",d:"5 bugs Java — trouvez la ligne, avec indices progressifs",c:RED},
            {p:"builder" as Phase,t:"Code Builder JUnit",d:"Reconstituez un test JUnit 5 complet en ordonnant les blocs",c:ORANGE},
            {p:"quiz" as Phase,t:"Quiz Exceptions + JUnit",d:"8 questions : throw/throws, finally, checked/unchecked, AAA",c:GREEN},
          ].map(g=>(
            <button key={g.p} onClick={()=>{setPhase(g.p);if(g.p==="trace"){setTrIdx(0);setTrSel([]);setTrShow(false);setTrScore(0)}if(g.p==="compile"){setCompIdx(0);setCompSel(null);setCompShow(false);setCompScore(0)}if(g.p==="debug"){setPuzzIdx(0);setHintLevel(0);setClickedLine(null);setShowFix(false)}if(g.p==="builder")initBuilder();if(g.p==="quiz"){setQIdx(0);setQScore(0);setSel(null);setShow(false)}}}
              style={{padding:"1.2rem",border:"2px solid "+BORDER,borderRadius:12,background:CARD,cursor:"pointer",textAlign:"left"}}>
              <div style={{fontSize:17,fontWeight:600,color:g.c}}>{g.t}</div>
              <div style={{fontSize:13,color:MUTED,marginTop:4}}>{g.d}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── TRACE GAME ───
  if(phase==="trace"){
    if(trIdx>=TRACES.length){const p=Math.round(trScore/TRACES.length*100);return(<div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"3rem 1rem"}}><div style={{maxWidth:500,margin:"0 auto",textAlign:"center"}}><div style={{fontSize:64,fontWeight:800,color:p>=70?GREEN:ORANGE}}>{trScore}/{TRACES.length}</div><p style={{color:MUTED}}>Trace try/catch/finally</p><button onClick={()=>setPhase("menu")} style={{marginTop:16,padding:"10px 24px",background:TEAL,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Retour</button></div></div>)}
    const tr=TRACES[trIdx];
    const checkTrace=()=>{setTrShow(true);if(JSON.stringify(trSel)===JSON.stringify(tr.correctOrder))setTrScore(s=>s+1)};
    const isCorrect=trShow&&JSON.stringify(trSel)===JSON.stringify(tr.correctOrder);
    return(
      <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
      <TopBar/>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          {back}
          <div style={{fontSize:13,color:MUTED,marginBottom:8}}>{trIdx+1}/{TRACES.length} | Score: {trScore}</div>
          <h2 style={{fontSize:18,fontWeight:700,color:TEAL,marginBottom:8}}>{tr.title}</h2>
          <p style={{fontSize:13,color:MUTED,marginBottom:8}}>Cliquez les lettres dans l'ordre d'affichage :</p>
          <div style={{background:"#0D1117",borderRadius:10,padding:"12px",marginBottom:12}}>
            {tr.code.map((line,i)=>(
              <div key={i} style={{padding:"2px 8px",display:"flex",gap:8}}>
                <span style={{color:MUTED,fontSize:11,minWidth:16,textAlign:"right"}}>{i+1}</span>
                <code style={{fontSize:12,color:line.includes("//")?ORANGE:"#A5F3FC",fontFamily:"Consolas,monospace"}}>{line}</code>
              </div>
            ))}
          </div>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:12,color:MUTED,marginBottom:6}}>Votre reponse (cliquez dans l'ordre) :</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",minHeight:36}}>
              {trSel.map((l,i)=>(
                <span key={i} onClick={()=>{if(!trShow)setTrSel(s=>s.filter((_,idx)=>idx!==i))}} style={{padding:"4px 12px",background:trShow?(isCorrect?GREEN+"30":RED+"30"):TEAL+"30",border:"1px solid "+(trShow?(isCorrect?GREEN:RED):TEAL),borderRadius:6,fontSize:14,fontWeight:700,color:trShow?(isCorrect?GREEN:RED):TEAL,cursor:trShow?"default":"pointer"}}>{l}</span>
              ))}
              {trSel.length===0&&<span style={{color:BORDER,fontStyle:"italic",fontSize:13}}>Cliquez les lettres ci-dessous...</span>}
            </div>
          </div>
          <div style={{display:"flex",gap:6,marginBottom:12}}>
            {letters.slice(0,tr.correctOrder.length+2).map(l=>(
              <button key={l} onClick={()=>toggleLetter(l)} disabled={trShow||trSel.includes(l)}
                style={{padding:"8px 16px",borderRadius:8,fontSize:16,fontWeight:700,cursor:trShow||trSel.includes(l)?"default":"pointer",background:trSel.includes(l)?TEAL+"30":CARD,color:trSel.includes(l)?TEAL:TEXT,border:"1px solid "+(trSel.includes(l)?TEAL:BORDER),opacity:trSel.includes(l)?0.5:1}}>{l}</button>
            ))}
          </div>
          {!trShow&&trSel.length>0&&<button onClick={checkTrace} style={{width:"100%",padding:"10px",background:TEAL,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Verifier</button>}
          {trShow&&(
            <>
              <div style={{padding:"10px 14px",background:isCorrect?GREEN+"15":RED+"15",borderRadius:8,fontSize:13,color:isCorrect?GREEN:RED,marginBottom:8}}>
                {isCorrect?"Correct ! ":"Incorrect. Reponse : "+tr.correctOrder.join(", ")+". "}{tr.explain}
              </div>
              <button onClick={()=>{setTrIdx(i=>i+1);setTrSel([]);setTrShow(false)}} style={{width:"100%",padding:"10px",background:TEAL,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Suivant</button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ─── COMPILE CHECKER ───
  if(phase==="compile"){
    if(compIdx>=COMPILE_CHECKS.length){const p=Math.round(compScore/COMPILE_CHECKS.length*100);return(<div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"3rem 1rem"}}><div style={{maxWidth:500,margin:"0 auto",textAlign:"center"}}><div style={{fontSize:64,fontWeight:800,color:p>=70?GREEN:ORANGE}}>{compScore}/{COMPILE_CHECKS.length}</div><p style={{color:MUTED}}>Compile ou pas ?</p><button onClick={()=>setPhase("menu")} style={{marginTop:16,padding:"10px 24px",background:PURPLE,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Retour</button></div></div>)}
    const cc=COMPILE_CHECKS[compIdx];
    const answers=[
      {label:"Compile et fonctionne",value:"ok"},
      {label:"Compile MAIS probleme",value:"compiles_bug"},
      {label:"NE compile PAS",value:"no_compile"},
    ];
    const correctAnswer=!cc.compiles?"no_compile":cc.problem?"compiles_bug":"ok";
    const check=(v:string)=>{if(compShow)return;setCompSel(v);setCompShow(true);if(v===correctAnswer)setCompScore(s=>s+1)};
    return(
      <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
      <TopBar/>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          {back}
          <div style={{fontSize:13,color:MUTED,marginBottom:8}}>{compIdx+1}/{COMPILE_CHECKS.length} | Score: {compScore}</div>
          <h2 style={{fontSize:18,fontWeight:700,color:PURPLE,marginBottom:8}}>Ce code compile-t-il ?</h2>
          <div style={{background:"#0D1117",borderRadius:10,padding:"12px",marginBottom:12}}>
            <pre style={{fontSize:12,color:"#A5F3FC",fontFamily:"Consolas,monospace",margin:0,whiteSpace:"pre-wrap"}}>{cc.code}</pre>
          </div>
          <div style={{display:"grid",gap:8}}>
            {answers.map(a=>{let bg=CARD,bd=BORDER;if(compShow){if(a.value===correctAnswer){bg=GREEN+"20";bd=GREEN}else if(a.value===compSel){bg=RED+"20";bd=RED}}return(
              <button key={a.value} onClick={()=>check(a.value)} disabled={compShow}
                style={{padding:"10px 14px",border:"2px solid "+bd,borderRadius:8,background:bg,cursor:compShow?"default":"pointer",textAlign:"left",fontSize:14,color:TEXT}}>{a.label}</button>
            )})}
          </div>
          {compShow&&<><div style={{marginTop:10,padding:"10px 14px",background:compSel===correctAnswer?GREEN+"15":RED+"15",borderRadius:8,fontSize:13,color:compSel===correctAnswer?GREEN:RED}}>{cc.explain}</div>
            <button onClick={()=>{setCompIdx(i=>i+1);setCompSel(null);setCompShow(false)}} style={{marginTop:10,width:"100%",padding:"10px",background:PURPLE,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Suivant</button></>}
        </div>
      </div>
    );
  }

  // ─── DEBUG PUZZLE ───
  if(phase==="debug"){
    if(puzzIdx>=PUZZLES.length)return(<div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"3rem 1rem"}}><div style={{maxWidth:500,margin:"0 auto",textAlign:"center"}}><div style={{fontSize:22,fontWeight:700}}>Tous les bugs trouves !</div><button onClick={()=>setPhase("menu")} style={{marginTop:16,padding:"10px 24px",background:ORANGE,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Retour</button></div></div>);
    const puzz=PUZZLES[puzzIdx];
    return(
      <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
      <TopBar/>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          {back}
          <div style={{fontSize:13,color:MUTED,marginBottom:8}}>Bug {puzzIdx+1}/{PUZZLES.length}</div>
          <h2 style={{fontSize:18,fontWeight:700,color:RED,marginBottom:4}}>{puzz.title}</h2>
          <p style={{fontSize:13,color:MUTED,marginBottom:12}}>Cliquez sur la ligne qui contient le bug :</p>
          <div style={{background:"#0D1117",borderRadius:10,padding:"12px",marginBottom:12}}>
            {puzz.code.map((line,i)=>(
              <div key={i} onClick={()=>{if(showFix)return;setClickedLine(i);if(i===puzz.bugLine)setShowFix(true);else setHintLevel(h=>Math.min(h+1,puzz.hints.length-1))}}
                style={{padding:"6px 10px",borderRadius:6,cursor:showFix?"default":"pointer",display:"flex",gap:10,
                  background:showFix&&i===puzz.bugLine?RED+"20":clickedLine===i&&i!==puzz.bugLine?ORANGE+"15":"transparent",
                  border:"1px solid "+(showFix&&i===puzz.bugLine?RED:clickedLine===i&&i!==puzz.bugLine?ORANGE:"transparent")}}>
                <span style={{color:MUTED,fontSize:11,minWidth:20,textAlign:"right"}}>{i+1}</span>
                <code style={{fontSize:13,color:showFix&&i===puzz.bugLine?"#FCA5A5":"#A5F3FC",fontFamily:"Consolas,monospace"}}>{line}</code>
              </div>
            ))}
          </div>
          {!showFix&&hintLevel>0&&<div style={{padding:"10px 14px",background:ORANGE+"15",borderRadius:8,marginBottom:8,fontSize:13,color:ORANGE}}>Indice {hintLevel}/{puzz.hints.length} : {puzz.hints[hintLevel-1]}</div>}
          {!showFix&&<button onClick={()=>setHintLevel(h=>Math.min(h+1,puzz.hints.length))} style={{padding:"8px 16px",background:CARD,color:ORANGE,border:"1px solid "+ORANGE,borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer"}}>Indice suivant ({hintLevel}/{puzz.hints.length})</button>}
          {showFix&&(<div style={{marginTop:8}}><div style={{padding:"10px 14px",background:GREEN+"15",borderRadius:8,marginBottom:8}}><div style={{fontSize:13,fontWeight:600,color:GREEN}}>Bug trouve ! Concept : {puzz.concept}</div></div>
            <div style={{padding:"10px",background:"#0D1117",borderRadius:8,marginBottom:8}}><div style={{fontSize:11,color:GREEN,fontWeight:600,marginBottom:4}}>FIX :</div><pre style={{fontSize:12,color:"#A5F3FC",fontFamily:"Consolas,monospace",margin:0,whiteSpace:"pre-wrap"}}>{puzz.fix}</pre></div>
            <button onClick={()=>{setPuzzIdx(i=>i+1);setHintLevel(0);setClickedLine(null);setShowFix(false)}} style={{width:"100%",padding:"10px",background:ORANGE,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Bug suivant</button></div>)}
        </div>
      </div>
    );
  }

  // ─── CODE BUILDER ───
  if(phase==="builder"){
    const addBlock=(id:string)=>{setPlaced(p=>[...p,id]);setAvailable(a=>a.filter(b=>b.id!==id))};
    const removeBlock=(id:string)=>{setPlaced(p=>p.filter(x=>x!==id));const block=JUNIT_BLOCKS.find(b=>b.id===id);if(block)setAvailable(a=>[...a,block])};
    const checkOrder=()=>{setBuilderDone(true)};
    const isCorrect=builderDone&&placed.every((id,i)=>{const block=JUNIT_BLOCKS.find(b=>b.id===id);return block&&block.order===i});
    return(
      <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
      <TopBar/>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          {back}
          <h2 style={{fontSize:18,fontWeight:700,color:ORANGE,marginBottom:4}}>Code Builder — Test JUnit 5</h2>
          <p style={{fontSize:13,color:MUTED,marginBottom:12}}>Cliquez les blocs dans le bon ordre :</p>
          <div style={{marginBottom:16}}><div style={{fontSize:12,color:MUTED,marginBottom:6}}>Blocs disponibles :</div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{available.map(block=>(
              <button key={block.id} onClick={()=>addBlock(block.id)} style={{padding:"4px 10px",background:CARD,border:"1px solid "+BORDER,borderRadius:6,fontSize:11,color:"#A5F3FC",fontFamily:"Consolas,monospace",cursor:"pointer",whiteSpace:"nowrap"}}>{block.code.trim().substring(0,40)}{block.code.length>40?"...":""}</button>
            ))}</div></div>
          <div style={{background:"#0D1117",borderRadius:10,padding:"12px",minHeight:150,marginBottom:12}}>
            <div style={{fontSize:12,color:MUTED,marginBottom:6}}>Votre code :</div>
            {placed.length===0?<div style={{color:MUTED,fontStyle:"italic",fontSize:13}}>Cliquez les blocs ci-dessus...</div>:
              placed.map((id,i)=>{const block=JUNIT_BLOCKS.find(b=>b.id===id);if(!block)return null;
                const isRight=builderDone&&block.order===i;const isWrong=builderDone&&block.order!==i;
                return(<div key={id} onClick={()=>{if(!builderDone)removeBlock(id)}} style={{padding:"3px 8px",cursor:builderDone?"default":"pointer",borderRadius:4,background:isRight?GREEN+"15":isWrong?RED+"15":"transparent",borderLeft:"2px solid "+(isRight?GREEN:isWrong?RED:"transparent")}}><code style={{fontSize:12,color:isRight?"#86EFAC":isWrong?"#FCA5A5":"#A5F3FC",fontFamily:"Consolas,monospace"}}>{block.code}</code></div>);
              })}
          </div>
          {!builderDone&&placed.length===JUNIT_BLOCKS.length&&<button onClick={checkOrder} style={{width:"100%",padding:"10px",background:ORANGE,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Verifier l'ordre</button>}
          {builderDone&&(<div style={{padding:"12px",background:isCorrect?GREEN+"15":RED+"15",borderRadius:8,textAlign:"center"}}><div style={{fontSize:16,fontWeight:700,color:isCorrect?GREEN:RED}}>{isCorrect?"Parfait ! Test JUnit 5 complet !":"L'ordre n'est pas correct."}</div>{!isCorrect&&<button onClick={initBuilder} style={{marginTop:8,padding:"8px 16px",background:ORANGE,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Reessayer</button>}</div>)}
        </div>
      </div>
    );
  }

  // ─── QUIZ ───
    // Quiz (rendered by QuizEngine with XP bar, target, streak)
  return(
    <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}>
      <TopBar/>
      <div style={{maxWidth:650,margin:"0 auto"}}>
        {back}
        <QuizEngine questions={QUIZ} color={GREEN}/>
        <button onClick={()=>setPhase("menu")} style={{marginTop:16,padding:"10px 20px",background:CARD,color:MUTED,border:"1px solid "+BORDER,borderRadius:8,fontSize:12,cursor:"pointer"}}>Retour au menu</button>
      </div>
    </div>
  );
}
