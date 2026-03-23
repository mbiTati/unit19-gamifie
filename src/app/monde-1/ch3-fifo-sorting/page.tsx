"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const BG="#0B1120",CARD="#111827",BORDER="#1E3A5F",TEXT="#E2E8F0",MUTED="#94A3B8",GREEN="#16A34A",RED="#DC2626",ORANGE="#F97316",PURPLE="#7C3AED",TEAL="#0891B2",BLUE="#3B82F6";

// ─── SORTING VISUALIZER ───
function genArr(n:number){const a:number[]=[];for(let i=0;i<n;i++)a.push(Math.floor(Math.random()*90)+10);return a}

function SortVisualizer(){
  const[arr,setArr]=useState<number[]>(genArr(30));
  const[sorting,setSorting]=useState(false);
  const[algo,setAlgo]=useState<"bubble"|"quick"|"merge">("bubble");
  const[highlighted,setHighlighted]=useState<number[]>([]);
  const[sorted,setSorted]=useState<number[]>([]);
  const[speed,setSpeed]=useState(50);
  const[comparisons,setComparisons]=useState(0);
  const[swaps,setSwaps]=useState(0);
  const cancelRef=useRef(false);

  const sleep=(ms:number)=>new Promise(r=>{const t=setTimeout(r,ms);if(cancelRef.current)clearTimeout(t)});

  const reset=()=>{cancelRef.current=true;setTimeout(()=>{cancelRef.current=false;setArr(genArr(30));setHighlighted([]);setSorted([]);setSorting(false);setComparisons(0);setSwaps(0)},100)};

  const bubbleSort=async()=>{
    const a=[...arr];let c=0,s=0;
    for(let i=0;i<a.length;i++){
      for(let j=0;j<a.length-i-1;j++){
        if(cancelRef.current)return;
        setHighlighted([j,j+1]);c++;setComparisons(c);
        if(a[j]>a[j+1]){[a[j],a[j+1]]=[a[j+1],a[j]];s++;setSwaps(s);setArr([...a])}
        await sleep(speed);
      }
      setSorted(prev=>[...prev,a.length-1-i]);
    }
    setSorted(a.map((_,i)=>i));setHighlighted([]);
  };

  const quickSort=async()=>{
    const a=[...arr];let c=0,s=0;
    const partition=async(low:number,high:number):Promise<number>=>{
      const pivot=a[high];let i=low-1;
      for(let j=low;j<high;j++){
        if(cancelRef.current)return-1;
        setHighlighted([j,high]);c++;setComparisons(c);
        if(a[j]<pivot){i++;[a[i],a[j]]=[a[j],a[i]];s++;setSwaps(s);setArr([...a])}
        await sleep(speed);
      }
      [a[i+1],a[high]]=[a[high],a[i+1]];s++;setSwaps(s);setArr([...a]);
      setSorted(prev=>[...prev,i+1]);return i+1;
    };
    const qs=async(low:number,high:number)=>{
      if(low<high&&!cancelRef.current){
        const pi=await partition(low,high);if(pi<0)return;
        await qs(low,pi-1);await qs(pi+1,high);
      }
    };
    await qs(0,a.length-1);
    setSorted(a.map((_,i)=>i));setHighlighted([]);
  };

  const mergeSort=async()=>{
    const a=[...arr];let c=0,s=0;
    const merge=async(l:number,m:number,r:number)=>{
      const left=a.slice(l,m+1),right=a.slice(m+1,r+1);
      let i=0,j=0,k=l;
      while(i<left.length&&j<right.length){
        if(cancelRef.current)return;
        setHighlighted([k]);c++;setComparisons(c);
        if(left[i]<=right[j]){a[k]=left[i];i++}else{a[k]=right[j];j++}
        s++;setSwaps(s);k++;setArr([...a]);await sleep(speed);
      }
      while(i<left.length){if(cancelRef.current)return;a[k]=left[i];i++;k++;setArr([...a]);await sleep(speed/2)}
      while(j<right.length){if(cancelRef.current)return;a[k]=right[j];j++;k++;setArr([...a]);await sleep(speed/2)}
    };
    const ms=async(l:number,r:number)=>{
      if(l<r&&!cancelRef.current){const m=Math.floor((l+r)/2);await ms(l,m);await ms(m+1,r);await merge(l,m,r)}
    };
    await ms(0,a.length-1);
    setSorted(a.map((_,i)=>i));setHighlighted([]);
  };

  const start=async()=>{
    setSorting(true);setSorted([]);setComparisons(0);setSwaps(0);cancelRef.current=false;
    if(algo==="bubble")await bubbleSort();else if(algo==="quick")await quickSort();else await mergeSort();
    setSorting(false);
  };

  const maxVal=Math.max(...arr);
  const algoInfo:{[k:string]:{name:string;bigO:string;color:string}}={
    bubble:{name:"Bubble Sort",bigO:"O(n²)",color:RED},
    quick:{name:"Quick Sort",bigO:"O(n log n) moy",color:GREEN},
    merge:{name:"Merge Sort",bigO:"O(n log n)",color:BLUE},
  };

  return(
    <div>
      <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
        {(["bubble","quick","merge"] as const).map(a=>(
          <button key={a} onClick={()=>{if(!sorting){setAlgo(a);reset()}}} disabled={sorting}
            style={{padding:"6px 14px",borderRadius:20,fontSize:13,fontWeight:600,cursor:sorting?"default":"pointer",
              background:algo===a?algoInfo[a].color:"transparent",color:algo===a?"white":MUTED,
              border:`1px solid ${algo===a?"transparent":BORDER}`,opacity:sorting&&algo!==a?0.4:1}}>
            {algoInfo[a].name} ({algoInfo[a].bigO})
          </button>
        ))}
      </div>
      <div style={{display:"flex",gap:1,alignItems:"flex-end",height:200,background:"#0D1117",borderRadius:10,padding:"10px 4px",marginBottom:12}}>
        {arr.map((val,i)=>{
          const h=(val/maxVal)*170;
          const isHl=highlighted.includes(i);
          const isSorted=sorted.includes(i);
          return(<div key={i} style={{flex:1,height:h,background:isHl?ORANGE:isSorted?GREEN:algoInfo[algo].color+"80",borderRadius:"2px 2px 0 0",transition:"height 0.05s"}}/>);
        })}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{display:"flex",gap:16,fontSize:12,color:MUTED}}>
          <span>Comparaisons: <strong style={{color:TEXT}}>{comparisons}</strong></span>
          <span>Swaps: <strong style={{color:TEXT}}>{swaps}</strong></span>
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center",fontSize:12,color:MUTED}}>
          <span>Vitesse:</span>
          <input type="range" min={5} max={200} value={200-speed} onChange={e=>setSpeed(200-parseInt(e.target.value))} disabled={sorting} style={{width:80}}/>
        </div>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={start} disabled={sorting} style={{flex:1,padding:"10px",background:sorting?BORDER:algoInfo[algo].color,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:sorting?"default":"pointer"}}>{sorting?"En cours...":"▶ Lancer "+algoInfo[algo].name}</button>
        <button onClick={reset} style={{padding:"10px 16px",background:CARD,color:TEXT,border:`1px solid ${BORDER}`,borderRadius:8,fontWeight:600,cursor:"pointer"}}>↻ Reset</button>
      </div>
    </div>
  );
}

// ─── RACE MODE ───
function AlgoRace(){
  const[racing,setRacing]=useState(false);
  const[done,setDone]=useState(false);
  const[data]=useState(()=>genArr(25));
  const[progressA,setProgressA]=useState(0);
  const[progressB,setProgressB]=useState(0);
  const[winner,setWinner]=useState<"A"|"B"|null>(null);
  const[algoA]=useState<"bubble">("bubble");
  const[algoB]=useState<"quick">("quick");
  const cancelRef=useRef(false);

  const startRace=async()=>{
    setRacing(true);setDone(false);setProgressA(0);setProgressB(0);setWinner(null);cancelRef.current=false;
    const n=data.length;
    const stepsA=n*n;// bubble ~n²
    const stepsB=Math.round(n*Math.log2(n));// quick ~n log n
    const totalSteps=Math.max(stepsA,stepsB);
    for(let step=0;step<=totalSteps;step+=Math.max(1,Math.floor(totalSteps/100))){
      if(cancelRef.current)return;
      const pA=Math.min(step/stepsA*100,100);
      const pB=Math.min(step/stepsB*100,100);
      setProgressA(pA);setProgressB(pB);
      if(pB>=100&&!winner){setWinner("B")}
      if(pA>=100&&pB>=100)break;
      await new Promise(r=>setTimeout(r,30));
    }
    setProgressA(100);setProgressB(100);setDone(true);setRacing(false);
    if(!winner)setWinner("B");
  };

  return(
    <div>
      <p style={{fontSize:14,fontWeight:600,marginBottom:12}}>🏎️ Bubble Sort O(n²) vs Quick Sort O(n log n) — n={data.length}</p>
      <div style={{display:"grid",gap:12,marginBottom:16}}>
        <div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}>
            <span style={{color:RED,fontWeight:600}}>🐢 Bubble Sort</span>
            <span style={{color:MUTED}}>{Math.round(progressA)}%</span>
          </div>
          <div style={{height:24,background:BORDER,borderRadius:6,overflow:"hidden"}}>
            <div style={{height:24,background:RED,borderRadius:6,width:`${progressA}%`,transition:"width 0.1s",display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:4}}>
              {progressA>15&&<span style={{fontSize:10,color:"white"}}>O(n²)</span>}
            </div>
          </div>
        </div>
        <div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}>
            <span style={{color:GREEN,fontWeight:600}}>🐇 Quick Sort</span>
            <span style={{color:MUTED}}>{Math.round(progressB)}%</span>
          </div>
          <div style={{height:24,background:BORDER,borderRadius:6,overflow:"hidden"}}>
            <div style={{height:24,background:GREEN,borderRadius:6,width:`${progressB}%`,transition:"width 0.1s",display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:4}}>
              {progressB>15&&<span style={{fontSize:10,color:"white"}}>O(n log n)</span>}
            </div>
          </div>
        </div>
      </div>
      {done&&winner&&(
        <div style={{padding:"12px",background:winner==="B"?GREEN+"15":RED+"15",borderRadius:8,textAlign:"center",marginBottom:12}}>
          <div style={{fontSize:16,fontWeight:700,color:winner==="B"?GREEN:RED}}>🏆 {winner==="B"?"Quick Sort":"Bubble Sort"} gagne !</div>
          <div style={{fontSize:12,color:MUTED,marginTop:4}}>Pour n={data.length}: Bubble fait ~{data.length*data.length} opérations vs Quick ~{Math.round(data.length*Math.log2(data.length))} opérations</div>
        </div>
      )}
      <button onClick={()=>{if(racing){cancelRef.current=true;setRacing(false)}else startRace()}}
        style={{width:"100%",padding:"10px",background:racing?ORANGE:PURPLE,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>
        {racing?"⏸ Arrêter":"🏁 Lancer la course !"}
      </button>
    </div>
  );
}

// ─── FIFO SIMULATOR ───
function FIFOSim(){
  const[queue,setQueue]=useState<string[]>(["Client A","Client B"]);
  const[input,setInput]=useState("");
  const[log,setLog]=useState<string[]>(["File initialisée avec Client A, Client B"]);
  const enqueue=()=>{if(!input.trim())return;setQueue(q=>[...q,input.trim()]);setLog(l=>[`+ enqueue("${input.trim()}") → fin de file`,...l]);setInput("")};
  const dequeue=()=>{if(!queue.length)return;const el=queue[0];setQueue(q=>q.slice(1));setLog(l=>[`- dequeue() → "${el}" retiré du début`,...l])};
  return(
    <div>
      <div style={{display:"flex",gap:4,alignItems:"center",padding:"12px",background:"#0D1117",borderRadius:10,marginBottom:12,minHeight:60,overflowX:"auto"}}>
        {queue.length===0?<span style={{color:MUTED,fontStyle:"italic",fontSize:13}}>(file vide)</span>:
          queue.map((el,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:4}}>
              <div style={{padding:"8px 14px",background:i===0?GREEN+"30":CARD,border:`1px solid ${i===0?GREEN:BORDER}`,borderRadius:8,fontSize:13,fontWeight:600,color:i===0?GREEN:TEXT,whiteSpace:"nowrap"}}>
                {i===0&&<span style={{fontSize:10,display:"block",color:GREEN}}>FRONT →</span>}{el}
              </div>
              {i<queue.length-1&&<span style={{color:MUTED}}>→</span>}
            </div>
          ))
        }
      </div>
      <div style={{display:"flex",gap:6,marginBottom:12}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&enqueue()} placeholder="Nom du client..." style={{flex:1,padding:"8px 12px",background:CARD,border:`1px solid ${BORDER}`,borderRadius:8,color:TEXT,fontSize:14,outline:"none"}}/>
        <button onClick={enqueue} style={{padding:"8px 16px",background:TEAL,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Enqueue</button>
        <button onClick={dequeue} disabled={!queue.length} style={{padding:"8px 16px",background:queue.length?ORANGE:BORDER,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:queue.length?"pointer":"default"}}>Dequeue</button>
      </div>
      <div style={{maxHeight:100,overflowY:"auto",fontSize:11,color:MUTED}}>
        {log.map((l,i)=><div key={i} style={{padding:"2px 0"}}>{l}</div>)}
      </div>
    </div>
  );
}

// ─── QUIZ ───
const QUIZ=[
  {q:"FIFO signifie :",o:["First In, First Out","First In, Last Out","File In, File Out","Fast Input Fast Output"],c:0,e:"FIFO = le premier entré est le premier sorti. Comme une file d'attente !"},
  {q:"Bubble Sort a une complexité de :",o:["O(n)","O(n log n)","O(n²)","O(log n)"],c:2,e:"Deux boucles imbriquées → O(n²). Simple mais lent pour de grands tableaux."},
  {q:"Quick Sort partitionne autour d'un :",o:["Minimum","Maximum","Pivot","Médiane"],c:2,e:"Le pivot divise le tableau : éléments < pivot à gauche, > pivot à droite."},
  {q:"Merge Sort fusionne des :",o:["Piles","Sous-tableaux triés","Arbres","Queues"],c:1,e:"Merge Sort divise en sous-tableaux, les trie récursivement, puis les fusionne."},
  {q:"Quel tri est stable (préserve l'ordre relatif) ?",o:["Quick Sort","Merge Sort","Les deux","Aucun"],c:1,e:"Merge Sort est stable. Quick Sort ne l'est pas (le pivot peut inverser des éléments égaux)."},
  {q:"Meilleur tri pour presque trié ?",o:["Quick Sort","Insertion Sort","Bubble Sort","Merge Sort"],c:1,e:"Insertion Sort est O(n) sur données presque triées ! Bien meilleur que Quick Sort."},
];

type Phase="menu"|"sort"|"race"|"fifo"|"quiz";

export default function Ch3Game(){
  const[phase,setPhase]=useState<Phase>("menu");
  const[qIdx,setQIdx]=useState(0);const[qScore,setQScore]=useState(0);
  const[sel,setSel]=useState<number|null>(null);const[show,setShow]=useState(false);

  const back=<button onClick={()=>setPhase("menu")} style={{fontSize:13,color:MUTED,background:"none",border:"none",cursor:"pointer",marginBottom:12}}>← Retour</button>;

  if(phase==="menu")return(
    <div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"2rem 1rem"}}>
      <div style={{maxWidth:700,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:"2rem"}}>
          <div style={{fontSize:13,color:PURPLE,fontWeight:600,letterSpacing:2,textTransform:"uppercase"}}>Monde 1 — Chapitre 3</div>
          <h1 style={{fontSize:28,fontWeight:700,margin:"0.5rem 0"}}>Queue FIFO + Algorithmes de Tri</h1>
          <p style={{color:MUTED,fontSize:15}}>Critère M1/M2 — Files d'attente et tri</p>
          <a href="/fiches/Ch3_Fiche_Memo_FIFO_Sorting.pdf" target="_blank" rel="noopener" style={{display:"inline-block",marginTop:8,padding:"6px 14px",background:"#1E293B",border:"1px solid #1E3A5F",borderRadius:8,fontSize:12,color:"#94A3B8",textDecoration:"none"}}>Fiche memo PDF</a>
        </div>
        <div style={{display:"grid",gap:14}}>
          {[
            {p:"sort" as Phase,emoji:"⚡",t:"Simulateur de tri visuel",d:"Regardez Bubble/Quick/Merge trier en temps réel avec barres animées",c:RED},
            {p:"race" as Phase,emoji:"🏎️",t:"Course d'algorithmes",d:"Bubble Sort vs Quick Sort — qui gagne ?",c:PURPLE},
            {p:"fifo" as Phase,emoji:"🚶",t:"Simulateur FIFO",d:"Enqueue, dequeue, visualisez la file d'attente",c:TEAL},
            {p:"quiz" as Phase,emoji:"🧠",t:"Quiz Tri & FIFO",d:"6 questions sur les algorithmes de tri et les files",c:GREEN},
          ].map(g=>(
            <button key={g.p} onClick={()=>{setPhase(g.p);if(g.p==="quiz"){setQIdx(0);setQScore(0);setSel(null);setShow(false)}}}
              style={{padding:"1.2rem",border:`2px solid ${BORDER}`,borderRadius:12,background:CARD,cursor:"pointer",textAlign:"left"}}>
              <div style={{fontSize:18,fontWeight:600,color:g.c}}>{g.emoji} {g.t}</div>
              <div style={{fontSize:13,color:MUTED,marginTop:4}}>{g.d}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if(phase==="sort")return(<div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}><div style={{maxWidth:700,margin:"0 auto"}}>{back}<h2 style={{fontSize:22,fontWeight:700,color:RED,marginBottom:16}}>⚡ Simulateur de tri visuel</h2><SortVisualizer/></div></div>);
  if(phase==="race")return(<div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}><div style={{maxWidth:700,margin:"0 auto"}}>{back}<h2 style={{fontSize:22,fontWeight:700,color:PURPLE,marginBottom:16}}>🏎️ Course d'algorithmes</h2><AlgoRace/></div></div>);
  if(phase==="fifo")return(<div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"1.5rem 1rem"}}><div style={{maxWidth:700,margin:"0 auto"}}>{back}<h2 style={{fontSize:22,fontWeight:700,color:TEAL,marginBottom:16}}>🚶 Simulateur FIFO</h2><FIFOSim/></div></div>);

  // QUIZ
  if(qIdx>=QUIZ.length){const p=Math.round(qScore/QUIZ.length*100);return(<div style={{minHeight:"100vh",background:BG,color:TEXT,padding:"3rem 1rem"}}><div style={{maxWidth:500,margin:"0 auto",textAlign:"center"}}><div style={{fontSize:64,fontWeight:800,color:p>=70?GREEN:ORANGE}}>{qScore}/{QUIZ.length}</div><button onClick={()=>setPhase("menu")} style={{marginTop:16,padding:"10px 24px",background:PURPLE,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Retour</button></div></div>)}
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
