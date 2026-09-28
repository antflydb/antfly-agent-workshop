import {BookOpen,Sparkles,FolderOpen,Headphones} from 'lucide-react';
export type AgentUrls={knowledge?:string;fieldnotes?:string;handoff?:string;support?:string};
const agents=[{id:'knowledge',label:'Knowledge',Icon:BookOpen},{id:'fieldnotes',label:'Fieldnotes',Icon:Sparkles},{id:'handoff',label:'Project Handoff',Icon:FolderOpen},{id:'support',label:'Support Desk',Icon:Headphones}] as const;
function safeUrl(value?:string){if(!value)return null;try{const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password?url.href:null;}catch{return null;}}
export default function WorkshopNav({current,urls={}}:{current:keyof AgentUrls;urls?:AgentUrls}){
 return <nav className="workshop-links" aria-label="Workshop agents">{agents.map(({id,label,Icon})=>{const url=safeUrl(urls[id]);return id===current?<span key={id} aria-current="page"><Icon size={15}/>{label}</span>:url?<a key={id} href={url}><Icon size={15}/>{label}</a>:null;})}</nav>;
}
