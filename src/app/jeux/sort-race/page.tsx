"use client";
import { useAuth } from "@/components/AuthProvider";
import { useState, useEffect, useRef } from "react";
import TopBar from "@/components/TopBar";

const BG="#0B1120",CARD="#111827",BORDER="#1E3A5F",TEXT="#E2E8F0",MUTED="#94A3B8",GREEN="#16A34A",RED="#DC2626",ORANGE="#F97316",PURPLE="#7C3AED",TEAL="#0891B2";

function genArr(n:number){return Array.from({length:n},()=>Math.floor(Math.random()*90)+10)}

function bubbleSteps(arr:number[]){const s:any[]=[];const a=[...arr];for(let i=0;i<a.length-1;i++)for(let j=0;j<a.length-i-1;j++){if(a[j]>a[j+1]){[a[j],a[j+1]]=[a[j+1],a[j]]}s.push({arr:[...a],hi:j})}s.push({arr:[...a],done:true});return s}
function insertSteps(arr:number[]){const s:any[]=[];const a=[...arr];for(let i=1;i<a.length;i++){let j=i;while(j>0&&a[j]<a[j-1]){[a[j],a[j-1]]=[a[j-1],a[j]];s.push({arr:[...a],hi:j});j--}}s.push({arr:[...a],done:true});return s}
function mergeSteps(arr:number[]){const s:any[]=[];const a=[...arr];function ms(lo:number,hi:number){if(lo>=hi)return;const m=Math.floor((lo+hi)/2);ms(lo,m);ms(m+1,hi);const t=[];let i=lo,j=m+1;while(i<=m&&j<=hi){if(a[i]<=a[j])t.push(a[i++]);else t.push(a[j++])}while(i<=m)t.push(a[i++]);while(j<=hi)t.push(a[j++]);for(let k=0;k<t.length;k++)a[lo+k]=t[k];s.push({arr:[...a],hi:lo})}ms(0,a.length-1);s.push({arr:[...a],done:true});return s}
function quickSteps(arr:number[]){const s:any[]=[];const a=[...arr];function qs(lo:number,hi:number){if(lo>=hi)return;const p=a[hi];let i=lo;for(let j=lo;j<hi;j++){if(a[j]<p){[a[i],a[j]]=[a[j],a[i]];s.push({arr:[...a],hi:i});i++}}[a[i],a[hi]]=[a[hi],a[i]];s.push({arr:[...a],hi:i});qs(lo,i-1);qs(i+1,hi)}qs(0,a.length-1);s.push({arr:[...a],done:true});return s}

const ALGOS=[
  {name:"Bubble Sort",color:RED,complexity:"O(n²)",fn:bubbleSteps},
  {name:"Insertion Sort",color:ORANGE,complexity:"O(n²)",fn:insertSteps},
  {name:"Merge Sort",color:TEAL,complexity:"O(n log n)",fn:mergeSteps},
  {name:"Quick Sort",color:PURPLE,complexity:"O(n log n)",fn:quickSteps},
];

function Bars({arr,hi,color}:{arr:number[];hi?:number;color:string}){
  const w=100/arr.length;
  return <svg viewBox="0 0 100 60" width="100%" style={{display:"block"}}>
    {arr.map((v,i)=><rect key={i} x={i*w+w*0.1} y={60-v*0.55} width={w*0.8} height={v*0.55} fill={i===hi?"#FBBF24":color} rx={0.4} style={{transition:"all 0.08s"}}/>)}
  </svg>;
}

export default function SortRace(){

  const[mode,setMode]=useState<"menu"|"race">("menu");
  const[size,setSize]=useState(20);
  const[states,setStates]=useState<{steps:any[];idx:number}[]>([]);
  const[running,setRunning]=useState(false);
  const ref=useRef<any>(null);

  const start=()=>{
    const arr=genArr(size);
    setStates(ALGOS.map(a=>({steps:a.fn([...arr]),idx:0})));
    setMode("race");setRunning(true);
  };

  useEffect(()=>{
    if(!running){if(ref.current)clearInterval(ref.current);return}
    ref.current=setInterval(()=>{
      setStates(prev=>{
        const next=prev.map(s=>s.idx>=s.steps.length-1?s:{...s,idx:s.idx+1});
        if(next.every(s=>s.idx>=s.steps.length-1))setRunning(false);
        return next;
      });
    },40);
    return()=>clearInterval(ref.current);
  },[running]);

  if(mode==="menu")return(
    <div style={{minHeight:"100vh",background:BG,color:TEXT}}>
      <TopBar/>
      <div style={{maxWidth:600,margin:"0 auto",padding:"1.5rem",textAlign:"center"}}>
        <div style={{fontSize:13,color:RED,fontWeight:600,letterSpacing:2,textTransform:"uppercase"}}>Jeu interactif</div>
        <h1 style={{fontSize:28,fontWeight:800}}>Sort Race</h1>
        <p style={{color:MUTED,fontSize:14,marginBottom:16}}>4 algorithmes de tri en course</p>
        <div style={{marginBottom:16}}>
          {[10,20,40,60].map(n=><button key={n} onClick={()=>setSize(n)} style={{padding:"6px 14px",margin:"0 4px",background:size===n?TEAL:CARD,color:size===n?"white":MUTED,border:"1px solid "+BORDER,borderRadius:6,fontSize:12,cursor:"pointer"}}>{n} elements</button>)}
        </div>
        <button onClick={start} style={{padding:"14px 40px",background:`linear-gradient(135deg,${RED},${PURPLE})`,color:"white",border:"none",borderRadius:10,fontWeight:700,fontSize:16,cursor:"pointer"}}>Lancer la course</button>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:16}}>
          {ALGOS.map((a,i)=><div key={i} style={{padding:"10px",background:CARD,borderRadius:8,border:"1px solid "+a.color+"30"}}><div style={{fontSize:13,fontWeight:600,color:a.color}}>{a.name}</div><div style={{fontSize:11,color:MUTED}}>{a.complexity}</div></div>)}
        </div>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:BG,color:TEXT}}>
      <TopBar/>
      <div style={{maxWidth:900,margin:"0 auto",padding:"1rem"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
          <button onClick={()=>{setRunning(false);setMode("menu")}} style={{fontSize:12,color:MUTED,background:"none",border:"none",cursor:"pointer"}}>Retour</button>
          <span style={{fontSize:12,color:MUTED}}>n={size}</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {ALGOS.map((a,i)=>{
            const st=states[i];if(!st)return null;
            const step=st.steps[Math.min(st.idx,st.steps.length-1)];
            const done=st.idx>=st.steps.length-1;
            return <div key={i} style={{padding:"10px",background:CARD,borderRadius:10,border:`2px solid ${done?GREEN:a.color}40`}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:13,fontWeight:600,color:a.color}}>{a.name}</span>
                <span style={{fontSize:11,color:done?GREEN:MUTED}}>{done?`Fini ! (${st.steps.length} etapes)`:st.idx+"/"+st.steps.length}</span>
              </div>
              <Bars arr={step.arr} hi={step.hi} color={a.color}/>
            </div>;
          })}
        </div>
        {!running&&<div style={{textAlign:"center",marginTop:12}}><button onClick={start} style={{padding:"10px 24px",background:TEAL,color:"white",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Rejouer</button></div>}
      </div>
    </div>
  );
}
