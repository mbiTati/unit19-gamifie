"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import { useAuth, LEVELS, getLevel } from "@/components/AuthProvider";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { C } from "@/lib/theme";

const MOD_ORDER=["CH01","CH02","CH03","CH04","CH05","CH06","CH07","CH08","CH09","CH10","CH11","CH12","CH13","CH14"];
const MOD_NAMES:Record<string,string>={"CH01":"Design Spec","CH02":"Memory Stack","CH03":"Queue+Tri","CH04":"Shortest Path","CH05":"Spec formelle","CH06":"Encapsulation","CH07":"ADT→POO","CH08":"Design Patterns","CH09":"Tree+Sort","CH10":"Exceptions+JUnit","CH11":"ADT+Big O","CH12":"Asymptotique","CH13":"Efficacite","CH14":"Trade-offs"};

function getNextLevel(xp:number){for(const l of LEVELS)if(xp<l.minXP)return l;return null;}
function getLevelIndex(xp:number){let i=0;for(let j=0;j<LEVELS.length;j++)if(xp>=LEVELS[j].minXP)i=j;return i;}

export default function StudentHome(){

  const{student,isTeacher,loading}=useAuth();
  const[gameScores,setGameScores]=useState<any[]>([]);

  useEffect(()=>{
    if(!student||!isSupabaseConfigured)return;
    supabase.from("cq_game_scores").select("*").eq("student_id",student.id).order("created_at",{ascending:false}).limit(10).then(({data})=>{if(data)setGameScores(data)});
  },[student]);

  if(loading)return <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",color:C.muted}}>Chargement...</div>;
  if(!student)return <div style={{minHeight:"100vh",background:C.bg,color:C.text}}><NavBar/><div style={{padding:"3rem",textAlign:"center"}}><div style={{fontSize:20,fontWeight:700,marginBottom:12}}>Connectez-vous pour acceder a votre espace</div><Link href="/login" style={{padding:"12px 28px",background:C.primary,color:"white",borderRadius:8,textDecoration:"none",fontWeight:600}}>Se connecter</Link></div></div>;

  const totalXP=student.total_xp||0;
  const level=getLevel(totalXP);
  const next=getNextLevel(totalXP);
  const lvlIdx=getLevelIndex(totalXP);
  const pct=next?Math.min(100,Math.round(((totalXP-level.minXP)/(next.minXP-level.minXP))*100)):100;

  // Progress from localStorage
  const progress=MOD_ORDER.map(code=>{
    try{
      const d=typeof window!=="undefined"?JSON.parse(localStorage.getItem("u19-"+code.toLowerCase())||"null"):null;
      if(!d)return{code,started:false,done:false,xp:0};
      return{code,started:true,done:d.completed||false,xp:d.credits||0};
    }catch{return{code,started:false,done:false,xp:0}}
  });
  const done=progress.filter(m=>m.done).length;
  const started=progress.filter(m=>m.started).length;
  const nextMod=progress.find(m=>m.started&&!m.done)||progress.find(m=>!m.started);

  const JEUX=[
    {name:"Sort Race",href:"/jeux/sort-race",color:C.danger,tag:"TRI"},
    {name:"Tree Builder",href:"/jeux/tree-builder",color:C.success,tag:"BST"},
    {name:"Graph Explorer",href:"/jeux/graph-explorer",color:C.secondary,tag:"BFS"},
    {name:"LinkedList Lab",href:"/jeux/linked-list-lab",color:C.accent,tag:"LL"},
    {name:"Hash Table Hero",href:"/jeux/hash-table-hero",color:"#7C3AED",tag:"HASH"},
    {name:"Recursion Tower",href:"/jeux/recursion-tower",color:C.gold,tag:"REC"},
    {name:"Stack & Queue",href:"/jeux/stack-queue-runner",color:C.primary,tag:"LIFO"},
    {name:"Animations",href:"/jeux/block-animations",color:C.accent,tag:"ANIM"},
    {name:"Battle",href:"/battle",color:C.gold,tag:"VS"},
  ];

  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text}}>
      <NavBar/>
      <div style={{maxWidth:900,margin:"0 auto",padding:"12px 20px 0"}}>
        <style>{`
          @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
          @keyframes glow{0%,100%{box-shadow:0 0 12px ${level.color}30}50%{box-shadow:0 0 24px ${level.color}60}}
          @keyframes shimmer{0%{background-position:-200px 0}100%{background-position:200px 0}}
          .hc{animation:fadeIn .3s ease-out both}
          .lr{animation:glow 2s infinite}
          .xf{background:linear-gradient(90deg,${level.color},${level.color}cc);background-size:200px 100%;animation:shimmer 2s infinite linear}
        `}</style>

        {/* Welcome card */}
        <div className="hc" style={{background:`linear-gradient(135deg,${C.card},${level.color}12)`,borderRadius:14,padding:"14px 18px",border:"1px solid "+level.color+"25",marginBottom:12,display:"flex",alignItems:"center",gap:16}}>
          <div className="lr" style={{width:56,height:56,borderRadius:"50%",flexShrink:0,background:level.color+"18",border:"2px solid "+level.color,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{fontSize:15,fontWeight:800,color:level.color}}>{isTeacher?"PROF":("Nv"+(lvlIdx+1))}</div>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:15,fontWeight:700,color:C.text}}>{"Bonjour "+(student.first_name||"Codeur")+" !"}</div>
            <div style={{fontSize:12,fontWeight:600,color:level.color}}>{isTeacher?"Professeur":level.name}</div>
            {!isTeacher&&<div style={{marginTop:5}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:C.muted,marginBottom:2}}>
                <span>{totalXP+" XP"}</span><span>{next?next.minXP+" XP":"MAX !"}</span>
              </div>
              <div style={{height:5,background:C.border,borderRadius:3,overflow:"hidden"}}>
                <div className="xf" style={{height:"100%",width:pct+"%",borderRadius:3}}/>
              </div>
            </div>}
          </div>
          <div style={{textAlign:"center",flexShrink:0}}>
            <div style={{fontSize:20,fontWeight:800,color:C.gold}}>{totalXP}</div>
            <div style={{fontSize:8,color:C.muted}}>XP</div>
          </div>
        </div>

        {/* Stats + Continue */}
        <div className="hc" style={{display:"flex",gap:8,marginBottom:12}}>
          {[
            {v:done+"/14",l:"OK",c:C.accent},
            {v:String(started-done),l:"En cours",c:C.gold},
            {v:String(totalXP),l:"XP",c:C.primary},
          ].map((s,i)=>(
            <div key={i} style={{flex:1,background:C.card,borderRadius:8,padding:"8px 6px",border:"1px solid "+C.border,textAlign:"center"}}>
              <div style={{fontSize:16,fontWeight:700,color:s.c}}>{s.v}</div>
              <div style={{fontSize:8,color:C.muted}}>{s.l}</div>
            </div>
          ))}
          <Link href="/" style={{flex:2,background:`linear-gradient(135deg,${C.accent}12,${C.primary}12)`,borderRadius:8,padding:"8px 12px",border:"1px solid "+C.accent+"35",color:C.accent,textDecoration:"none",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div><div style={{fontSize:8,color:C.muted}}>Continuer</div><div style={{fontSize:13,fontWeight:700}}>{nextMod?MOD_NAMES[nextMod.code]||nextMod.code:"Tout complete !"}</div></div>
            <span style={{fontSize:16}}>▶</span>
          </Link>
        </div>

        {/* Jeux */}
        <div className="hc" style={{marginBottom:12}}>
          <div style={{fontSize:12,fontWeight:700,color:C.muted,letterSpacing:2,marginBottom:8}}>JEUX</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
            {JEUX.map((j,i)=>(
              <Link key={i} href={j.href} style={{padding:"10px 8px",background:C.card,border:"1px solid "+j.color+"25",borderRadius:8,textDecoration:"none",textAlign:"center"}}>
                <div style={{fontSize:10,fontWeight:700,color:j.color,padding:"2px 6px",background:j.color+"15",borderRadius:4,display:"inline-block",marginBottom:4}}>{j.tag}</div>
                <div style={{fontSize:11,fontWeight:600,color:C.text}}>{j.name}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Acces rapide */}
        <div className="hc" style={{marginBottom:12}}>
          <div style={{fontSize:12,fontWeight:700,color:C.muted,letterSpacing:2,marginBottom:8}}>ACCES RAPIDE</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
            <Link href="/exercices-entreprise" style={{padding:"10px",background:C.card,border:"1px solid "+C.border,borderRadius:8,textDecoration:"none",textAlign:"center"}}>
              <div style={{fontSize:13,fontWeight:600,color:C.text}}>Exercices Entreprise</div>
              <div style={{fontSize:10,color:C.muted}}>5 cas reels</div>
            </Link>
            <Link href="/projets" style={{padding:"10px",background:C.card,border:"1px solid "+C.border,borderRadius:8,textDecoration:"none",textAlign:"center"}}>
              <div style={{fontSize:13,fontWeight:600,color:C.text}}>Projets LO1-4</div>
              <div style={{fontSize:10,color:C.muted}}>4 projets integrateurs</div>
            </Link>
            <Link href="/boss-final" style={{padding:"10px",background:C.card,border:"1px solid "+C.danger+"30",borderRadius:8,textDecoration:"none",textAlign:"center"}}>
              <div style={{fontSize:13,fontWeight:600,color:C.danger}}>Boss Final</div>
              <div style={{fontSize:10,color:C.muted}}>15 questions</div>
            </Link>
          </div>
        </div>

        {/* Derniers scores */}
        {gameScores.length>0&&(
          <div className="hc">
            <div style={{fontSize:12,fontWeight:700,color:C.muted,letterSpacing:2,marginBottom:8}}>DERNIERS SCORES</div>
            {gameScores.slice(0,5).map((s,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 10px",background:i%2===0?C.card:"transparent",borderRadius:4,fontSize:12}}>
                <span style={{color:C.muted}}>{s.game_name||"Quiz"}</span>
                <span style={{color:C.success,fontWeight:600}}>{s.score} pts</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
