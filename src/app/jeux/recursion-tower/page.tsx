"use client";
import { useState } from "react";
import GameShell from "@/components/GameShell";
import { C } from "@/lib/theme";

const DISC_COLORS = ["#DC2626","#F97316","#FBBF24","#16A34A","#0891B2","#3B82F6","#7C3AED","#EC4899"];

export default function RecursionTower() {
  const [numDiscs, setNumDiscs] = useState(3);
  const [pegs, setPegs] = useState<number[][]>([[3,2,1],[],[]]);
  const [moves, setMoves] = useState(0);
  const [selected, setSelected] = useState<number|null>(null);
  const [message, setMessage] = useState("Deplacez tous les disques de A vers C");
  const [callStack, setCallStack] = useState<string[]>([]);
  const [showSolution, setShowSolution] = useState(false);
  const [solutionSteps, setSolutionSteps] = useState<string[]>([]);

  const reset = (n: number) => {
    setNumDiscs(n);
    setPegs([Array.from({length:n},(_,i)=>n-i),[],[]]);
    setMoves(0); setSelected(null); setMessage("Deplacez tous les disques de A vers C");
    setCallStack([]); setShowSolution(false); setSolutionSteps([]);
  };

  const clickPeg = (pegIdx: number) => {
    if (selected === null) {
      if (pegs[pegIdx].length === 0) return;
      setSelected(pegIdx);
      setMessage(`Disque ${pegs[pegIdx][pegs[pegIdx].length-1]} selectionne — cliquez la destination`);
    } else {
      if (selected === pegIdx) { setSelected(null); setMessage("Selection annulee"); return; }
      const disc = pegs[selected][pegs[selected].length-1];
      const topDest = pegs[pegIdx].length > 0 ? pegs[pegIdx][pegs[pegIdx].length-1] : Infinity;
      if (disc > topDest) {
        setMessage("Interdit : un grand disque ne peut pas aller sur un petit !");
        setSelected(null); return;
      }
      const newPegs = pegs.map(p=>[...p]);
      newPegs[selected].pop();
      newPegs[pegIdx].push(disc);
      setPegs(newPegs);
      setMoves(m=>m+1);
      setSelected(null);

      // Check win
      if (newPegs[2].length === numDiscs) {
        const optimal = Math.pow(2, numDiscs) - 1;
        setMessage(`Bravo ! ${moves+1} coups (optimal: ${optimal})`);
      } else {
        setMessage(`Coup ${moves+1} : Disque ${disc} de ${["A","B","C"][selected]} vers ${["A","B","C"][pegIdx]}`);
      }
    }
  };

  const generateSolution = () => {
    const steps: string[] = [];
    const stack: string[] = [];
    function hanoi(n: number, from: string, to: string, aux: string) {
      stack.push(`hanoi(${n}, ${from}, ${to}, ${aux})`);
      if (n === 1) {
        steps.push(`Disque 1 : ${from} → ${to}`);
        stack.pop();
        return;
      }
      hanoi(n-1, from, aux, to);
      steps.push(`Disque ${n} : ${from} → ${to}`);
      hanoi(n-1, aux, to, from);
      stack.pop();
    }
    hanoi(numDiscs, "A", "C", "B");
    setSolutionSteps(steps);
    setShowSolution(true);
    // Show call stack animation
    const finalStack = [`hanoi(${numDiscs}, A, C, B)`];
    setCallStack(finalStack);
  };

  const won = pegs[2].length === numDiscs;

  return (
    <GameShell title="Recursion Tower" color={C.gold} score={moves}>
      <div style={{maxWidth:600,margin:"0 auto"}}>
        <p style={{color:C.muted,fontSize:13,marginBottom:8}}>Tour de Hanoi — deplacez tous les disques de A vers C</p>

        {/* Disc count selector */}
        <div style={{display:"flex",gap:6,marginBottom:12,justifyContent:"center"}}>
          {[3,4,5,6].map(n=>(
            <button key={n} onClick={()=>reset(n)} style={{padding:"6px 14px",background:numDiscs===n?C.primary:C.card,color:numDiscs===n?"white":C.muted,border:"1px solid "+C.border,borderRadius:6,fontSize:12,cursor:"pointer"}}>{n} disques</button>
          ))}
        </div>

        {/* Pegs visualization */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
          {pegs.map((peg,pi)=>(
            <div key={pi} onClick={()=>clickPeg(pi)}
              style={{background:selected===pi?C.gold+"15":C.card,border:`2px solid ${selected===pi?C.gold:won&&pi===2?C.success:C.border}`,borderRadius:10,padding:"10px",minHeight:160,display:"flex",flexDirection:"column",justifyContent:"flex-end",alignItems:"center",cursor:"pointer",transition:"all 0.2s"}}>
              <div style={{fontSize:11,color:C.muted,marginBottom:8}}>{["A (source)","B (auxiliaire)","C (destination)"][pi]}</div>
              {/* Pole */}
              <div style={{width:4,height:80,background:C.border,borderRadius:2,position:"relative"}}>
                <div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column-reverse",alignItems:"center",gap:2}}>
                  {peg.map((disc,di)=>{
                    const w = 20 + disc * 14;
                    return <div key={di} style={{width:w,height:14,borderRadius:4,background:DISC_COLORS[disc-1],border:"1px solid "+DISC_COLORS[disc-1]+"80",boxShadow:"0 2px 4px #00000040",transition:"all 0.2s"}}/>
                  })}
                </div>
              </div>
              {/* Base */}
              <div style={{width:"90%",height:4,background:C.border,borderRadius:2,marginTop:4}}/>
            </div>
          ))}
        </div>

        {/* Message */}
        <div style={{padding:"8px 12px",background:won?C.success+"15":C.card,borderRadius:8,fontSize:13,color:won?C.success:C.gold,textAlign:"center",marginBottom:8}}>{message}</div>

        {/* Controls */}
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>reset(numDiscs)} style={{flex:1,padding:"8px",background:C.danger+"15",border:"1px solid "+C.danger+"30",borderRadius:6,color:C.danger,fontWeight:600,fontSize:12,cursor:"pointer"}}>Reset</button>
          <button onClick={generateSolution} style={{flex:1,padding:"8px",background:C.accent+"15",border:"1px solid "+C.accent+"30",borderRadius:6,color:C.accent,fontWeight:600,fontSize:12,cursor:"pointer"}}>Solution recursive</button>
        </div>

        {/* Solution */}
        {showSolution&&(
          <div style={{marginTop:12,padding:"12px",background:C.card,borderRadius:10,border:"1px solid "+C.border}}>
            <div style={{fontSize:12,fontWeight:600,color:C.accent,marginBottom:6}}>Solution en {solutionSteps.length} coups (2^{numDiscs}-1 = {Math.pow(2,numDiscs)-1})</div>
            <div style={{maxHeight:150,overflowY:"auto"}}>
              {solutionSteps.map((s,i)=><div key={i} style={{fontSize:11,color:C.text,padding:"2px 0"}}>{i+1}. {s}</div>)}
            </div>
            <div style={{marginTop:8,fontSize:11,color:C.muted}}>Complexite : O(2^n) — exponentielle. Pour n={numDiscs} : {Math.pow(2,numDiscs)-1} coups minimum.</div>
          </div>
        )}
      </div>
    </GameShell>
  );
}
