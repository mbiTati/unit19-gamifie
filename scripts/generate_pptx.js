const pptxgen = require("pptxgenjs");
const path = require("path");
const OUT = path.join(__dirname, "..", "public", "docs", "pptx");

const BG="0A0F1A",CARD="111827",ACCENT="32E0C4",GOLD="F59E0B",TEXT="E2E8F0",MUTED="94A3B8",CODE_BG="1E293B",RED="DC2626",GREEN="10B981",BLUE="3B82F6",PURPLE="7C3AED";

function T(p,title,sub,c=ACCENT){const s=p.addSlide();s.background={color:BG};s.addText("Unit 19 : Data Structures & Algorithms",{x:0.5,y:0.3,w:9,h:0.4,fontSize:10,color:MUTED,fontFace:"Arial"});s.addText(title,{x:0.5,y:1.5,w:9,h:1.5,fontSize:36,color:c,fontFace:"Arial",bold:true});s.addText(sub,{x:0.5,y:3.2,w:9,h:0.5,fontSize:14,color:MUTED,fontFace:"Arial"});s.addText("Ecole Schulz — Mme MBI",{x:0.5,y:5,w:9,h:0.4,fontSize:10,color:MUTED,fontFace:"Arial"});}
function C(p,title,bullets,notes=""){const s=p.addSlide();s.background={color:BG};s.addText(title,{x:0.5,y:0.3,w:9,h:0.6,fontSize:22,color:ACCENT,fontFace:"Arial",bold:true});s.addShape(p.shapes||pptxgen.shapes||"line",{});const items=bullets.map((b,i)=>({text:b,options:{bullet:true,breakLine:i<bullets.length-1,fontSize:14,color:TEXT}}));s.addText(items,{x:0.6,y:1.1,w:8.8,h:4,fontFace:"Arial",paraSpaceAfter:6});if(notes)s.addNotes(notes);}
function CD(p,title,code){const s=p.addSlide();s.background={color:BG};s.addText(title,{x:0.5,y:0.3,w:9,h:0.5,fontSize:20,color:GOLD,fontFace:"Arial",bold:true});s.addShape(pptxgen.ShapeType?pptxgen.ShapeType.rect:"rect",{x:0.4,y:0.9,w:9.2,h:4.2,fill:{color:CODE_BG}});s.addText(code,{x:0.6,y:1.1,w:8.8,h:3.8,fontSize:11,color:ACCENT,fontFace:"Consolas",valign:"top"});}

