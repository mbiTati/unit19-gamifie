"use client";
import { useAuth } from "@/components/AuthProvider";
import { useState } from "react";
import TopBar from "@/components/TopBar";

const BG="#0B1120",CARD="#111827",BORDER="#1E3A5F",TEXT="#E2E8F0",MUTED="#94A3B8",GREEN="#16A34A",RED="#DC2626",ORANGE="#F97316",TEAL="#0891B2";

interface Node { value: number; id: number; }

export default function LinkedListLab() {

  const [nodes, setNodes] = useState<Node[]>([{value:10,id:1},{value:20,id:2},{value:30,id:3}]);
  const [nextId, setNextId] = useState(4);
  const [inputVal, setInputVal] = useState("");
  const [message, setMessage] = useState("");
  const [highlight, setHighlight] = useState<number|null>(null);

  const addHead = () => {
    const v = parseInt(inputVal); if (isNaN(v)) { setMessage("Entrez un nombre"); return; }
    const n = { value: v, id: nextId }; setNextId(i=>i+1);
    setNodes([n, ...nodes]); setHighlight(n.id); setInputVal(""); setMessage(`${v} insere en TETE (O(1))`);
    setTimeout(()=>setHighlight(null),1500);
  };

  const addTail = () => {
    const v = parseInt(inputVal); if (isNaN(v)) { setMessage("Entrez un nombre"); return; }
    const n = { value: v, id: nextId }; setNextId(i=>i+1);
    setNodes([...nodes, n]); setHighlight(n.id); setInputVal(""); setMessage(`${v} insere en QUEUE (O(1) si reference tail)`);
    setTimeout(()=>setHighlight(null),1500);
  };

  const removeHead = () => {
    if (nodes.length === 0) { setMessage("Liste vide !"); return; }
    const removed = nodes[0];
    setHighlight(removed.id);
    setTimeout(() => { setNodes(n => n.slice(1)); setHighlight(null); setMessage(`${removed.value} supprime de la TETE (O(1))`); }, 500);
  };

  const removeByValue = () => {
    const v = parseInt(inputVal); if (isNaN(v)) { setMessage("Entrez un nombre"); return; }
    const idx = nodes.findIndex(n => n.value === v);
    if (idx < 0) { setMessage(`${v} non trouve`); return; }
    setHighlight(nodes[idx].id);
    setTimeout(() => { setNodes(n => n.filter((_,i)=>i!==idx)); setHighlight(null); setMessage(`${v} supprime (parcours O(n))`); setInputVal(""); }, 500);
  };

  const search = () => {
    const v = parseInt(inputVal); if (isNaN(v)) { setMessage("Entrez un nombre"); return; }
    const idx = nodes.findIndex(n => n.value === v);
    if (idx < 0) { setMessage(`${v} non trouve apres ${nodes.length} comparaisons`); }
    else { setHighlight(nodes[idx].id); setMessage(`${v} trouve a l'index ${idx} (${idx+1} comparaison${idx>0?"s":""})`); setTimeout(()=>setHighlight(null),2000); }
  };

  return (
    <div style={{minHeight:"100vh",background:BG,color:TEXT}}>
      <TopBar/>
      <div style={{maxWidth:700,margin:"0 auto",padding:"1.5rem"}}>
        <div style={{textAlign:"center",marginBottom:"1.5rem"}}>
          <div style={{fontSize:13,color:TEAL,fontWeight:600,letterSpacing:2,textTransform:"uppercase"}}>Jeu interactif</div>
          <h1 style={{fontSize:28,fontWeight:800}}>Linked List Lab</h1>
          <p style={{color:MUTED,fontSize:14}}>Inserez, supprimez, recherchez dans une LinkedList</p>
        </div>

        {/* Visual LinkedList */}
        <div style={{background:CARD,borderRadius:12,padding:"20px",border:"1px solid "+BORDER,marginBottom:16,overflowX:"auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:0,minHeight:60}}>
            <div style={{padding:"6px 10px",background:TEAL+"20",border:"1px solid "+TEAL,borderRadius:6,fontSize:11,color:TEAL,fontWeight:600,marginRight:8}}>HEAD</div>
            {nodes.map((n,i)=>(
              <div key={n.id} style={{display:"flex",alignItems:"center"}}>
                <div style={{
                  padding:"12px 16px",borderRadius:8,fontSize:16,fontWeight:700,
                  background:highlight===n.id?GREEN+"30":BORDER,
                  border:`2px solid ${highlight===n.id?GREEN:BORDER}`,
                  color:highlight===n.id?GREEN:TEXT,
                  transition:"all 0.3s",
                  transform:highlight===n.id?"scale(1.1)":"scale(1)",
                }}>
                  {n.value}
                </div>
                {i<nodes.length-1&&(
                  <svg width="30" height="20" viewBox="0 0 30 20"><line x1="2" y1="10" x2="22" y2="10" stroke={TEAL} strokeWidth="2"/><polygon points="22,6 30,10 22,14" fill={TEAL}/></svg>
                )}
              </div>
            ))}
            {nodes.length>0&&<>
              <svg width="30" height="20" viewBox="0 0 30 20"><line x1="2" y1="10" x2="22" y2="10" stroke={RED} strokeWidth="2"/><polygon points="22,6 30,10 22,14" fill={RED}/></svg>
              <div style={{padding:"6px 10px",background:RED+"20",border:"1px solid "+RED,borderRadius:6,fontSize:11,color:RED,fontWeight:600}}>NULL</div>
            </>}
            {nodes.length===0&&<div style={{padding:"10px 20px",color:MUTED,fontStyle:"italic"}}>Liste vide</div>}
          </div>
          <div style={{fontSize:11,color:MUTED,marginTop:8}}>Taille : {nodes.length} elements</div>
        </div>

        {/* Controls */}
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          <input value={inputVal} onChange={e=>setInputVal(e.target.value)} placeholder="Valeur..."
            onKeyDown={e=>e.key==="Enter"&&addTail()}
            style={{flex:1,padding:"10px 12px",background:CARD,border:"1px solid "+BORDER,borderRadius:8,color:TEXT,fontSize:14,outline:"none"}}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gap:6,marginBottom:12}}>
          <button onClick={addHead} style={{padding:"8px",background:GREEN+"20",border:"1px solid "+GREEN+"40",borderRadius:6,color:GREEN,fontWeight:600,fontSize:11,cursor:"pointer"}}>+ Tete</button>
          <button onClick={addTail} style={{padding:"8px",background:GREEN+"20",border:"1px solid "+GREEN+"40",borderRadius:6,color:GREEN,fontWeight:600,fontSize:11,cursor:"pointer"}}>+ Queue</button>
          <button onClick={removeHead} style={{padding:"8px",background:RED+"20",border:"1px solid "+RED+"40",borderRadius:6,color:RED,fontWeight:600,fontSize:11,cursor:"pointer"}}>- Tete</button>
          <button onClick={removeByValue} style={{padding:"8px",background:RED+"20",border:"1px solid "+RED+"40",borderRadius:6,color:RED,fontWeight:600,fontSize:11,cursor:"pointer"}}>- Valeur</button>
          <button onClick={search} style={{padding:"8px",background:TEAL+"20",border:"1px solid "+TEAL+"40",borderRadius:6,color:TEAL,fontWeight:600,fontSize:11,cursor:"pointer"}}>Chercher</button>
        </div>

        {/* Message */}
        {message&&<div style={{padding:"10px 14px",background:CARD,borderRadius:8,border:"1px solid "+BORDER,fontSize:13,color:ORANGE,marginBottom:12}}>{message}</div>}

        {/* Complexity reminder */}
        <div style={{padding:"12px",background:CARD,borderRadius:10,border:"1px solid "+BORDER}}>
          <div style={{fontSize:12,fontWeight:600,color:TEXT,marginBottom:6}}>Complexite LinkedList</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,fontSize:11,color:MUTED}}>
            <div>Ajout tete : <span style={{color:GREEN}}>O(1)</span></div>
            <div>Ajout queue : <span style={{color:GREEN}}>O(1)</span> si tail</div>
            <div>Recherche : <span style={{color:ORANGE}}>O(n)</span></div>
            <div>Suppression : <span style={{color:ORANGE}}>O(n)</span></div>
            <div>Acces index : <span style={{color:RED}}>O(n)</span></div>
            <div>Taille : <span style={{color:GREEN}}>O(1)</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
