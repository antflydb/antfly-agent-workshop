'use client';
import WorkshopNav, {type AgentUrls} from './workshop-nav';
import {useCallback,useEffect,useRef,useState} from 'react';
import {ArrowUpRight,BookOpen,Headphones,Layers,LockKeyhole,RotateCcw,Copy} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {parseSupportInput,escalationDraft,type SupportResult,type Point} from '@/lib/support';
const examples=['Lumen Sync 2.4 shows E401 when I connect a workspace. How do I fix it?','My Lumen Sync import failed.','Can Lumen Sync restore files deleted 90 days ago?'];
type Turn={message:string;result:SupportResult};
type Tool={name:string;description:string;inputSchema:object;annotations:object;execute:(input:unknown)=>Promise<unknown>};
export default function Workspace({agentUrls}:{agentUrls?:AgentUrls}){
 const [configured,setConfigured]=useState<boolean|null>(null);
 const [issue,setIssue]=useState(''),[turns,setTurns]=useState<Turn[]>([]),[busy,setBusy]=useState(false),[error,setError]=useState(''),[copied,setCopied]=useState(false);
 useEffect(()=>{void fetch('/api/status').then(r=>r.json()).then(data=>setConfigured((data as {configured?:boolean}).configured===true)).catch(()=>setConfigured(false));},[]);
 const inFlight=useRef(false),latestTurns=useRef<Turn[]>([]);
 const submit=useCallback(async(message:string)=>{
  if(configured!==true)throw Error('The support connection is not configured yet.');
  if(inFlight.current)throw Error('A support request is already in progress.');
  const input=parseSupportInput({messages:[...latestTurns.current.map(t=>t.message),message]});
  inFlight.current=true;setBusy(true);setError('');setCopied(false);
  try{
   const response=await fetch('/api/support',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)});
   const data=await response.json() as SupportResult & {error?:string};if(!response.ok)throw Error(data.error||'The request could not be completed.');
   const next=[...latestTurns.current,{message:message.trim(),result:data as SupportResult}];latestTurns.current=next;setTurns(next);setIssue('');
   return {status:data.reply.status,citedSources:data.sources.length,turns:next.length};
  }catch(e){setError(e instanceof Error?e.message:'The request failed. Please retry.');throw e;}
  finally{inFlight.current=false;setBusy(false);}
 },[configured]);
 useEffect(()=>{
  const context=(document as Document&{modelContext?:{registerTool:(tool:Tool,options:{signal:AbortSignal})=>unknown}}).modelContext;
  if(!context?.registerTool)return;const lifecycle=new AbortController();
  const tool:Tool={name:'ask_support',description:'Submit a support issue or follow-up, retrieve approved documentation, and display a grounded response. Sends the issue and retrieved excerpts to OpenAI. Does not send a ticket.',inputSchema:{type:'object',properties:{message:{type:'string',minLength:1,maxLength:2500}},required:['message'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:true},execute:async(input)=>{if(!input||typeof input!=='object'||typeof (input as {message:unknown}).message!=='string')throw Error('A message is required.');return submit((input as {message:string}).message);}};
  try{void Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{/* Optional browser capability. */}
  return ()=>lifecycle.abort();
 },[submit]);
 const last=turns.at(-1)?.result;
 const sources=[...new Map(turns.flatMap(t=>t.result.sources).map(s=>[s.id,s])).values()];
 const points=(items:Point[],list=false)=>list?<ol>{items.map((p,i)=><li key={i}>{p.text}{p.source_ids.map(id=><a key={id} className="citation" href={`#${id}`}>{sources.findIndex(s=>s.id===id)+1}</a>)}</li>)}</ol>:items.map((p,i)=><p key={i}>{p.text}{p.source_ids.map(id=><a key={id} className="citation" href={`#${id}`}>{sources.findIndex(s=>s.id===id)+1}</a>)}</p>);
 const reset=()=>{if(inFlight.current)return;latestTurns.current=[];setTurns([]);setIssue('');setError('');setCopied(false);};
 const draft=last?escalationDraft({messages:turns.map(t=>t.message)},last):'';
 return <div className="desk"><header><div className="brand"><Layers size={26}/><b>Antfly</b><span>SUPPORT DESK</span></div><WorkshopNav current="support" urls={agentUrls}/><div><span className="private"><LockKeyhole size={14}/> Private workshop</span><small className="support-scope-label">Support documents only</small></div></header><div className="desk-grid"><aside className="left"><span className="eyebrow">AGENT 04 / SUPPORT</span><h2>Less guesswork.<br/>A clearer next step.</h2><p>Find the documented fix, ask the right question, or prepare a handoff.</p><div className="sample-label"><BookOpen size={18}/><div><b>Lumen Sync</b><small>Fictional workshop product</small></div></div><h3>TRY A SUPPORT CASE</h3>{examples.map((x,i)=><button disabled={busy} className="example" key={x} onClick={()=>{reset();setIssue(x);}}><span>0{i+1}</span>{x}<ArrowUpRight size={17}/></button>)}<p className="scope-note">Approved support documents only.<br/>SearchAF ingests. Antfly retrieves.<br/>OpenAI drafts the response.<br/>Selected excerpts leave your Mac.</p></aside><main><div className="main-heading"><div><span className="eyebrow">YOUR SUPPORT WORKSPACE</span><h1>Let’s work through it.</h1></div><Button variant="ghost" disabled={busy} onClick={reset}><RotateCcw/> Reset</Button></div>{!turns.length&&<div className="welcome"><Headphones size={30}/><h2>Start with what happened.</h2><p>Include the error message, product version, and what you’ve already tried. Every documented step will link to its evidence.</p><div className="outcomes"><span>01 · Documented steps</span><span>02 · Focused questions</span><span>03 · Escalation draft</span></div></div>}
 <div aria-live="polite">{turns.map((t,i)=><section className="turn" key={i}><div className="user-message">{t.message}</div><article className="reply"><span className="badge">{t.result.reply.status==='answered'?'Documented guidance':t.result.reply.status==='clarify'?'A little more context':'Ready for review'}</span><h2>{t.result.reply.status==='answered'?'Here’s the documented next step.':t.result.reply.status==='clarify'?'Let’s narrow it down.':'The evidence doesn’t establish a fix.'}</h2>{points(t.result.reply.summary)}{points(t.result.reply.steps,true)}{t.result.reply.reason&&<p>{t.result.reply.reason}</p>}{t.result.reply.questions.length>0&&<><h3>Details to confirm</h3><ul>{t.result.reply.questions.map(q=><li key={q}>{q}</li>)}</ul></>}{t.result.reply.status==='answered'&&<small>Documented guidance, not confirmation that the issue is resolved.</small>}</article></section>)}</div>
 {last?.reply.status==='escalate'&&<div className="reply"><h3>Support handoff</h3><p>Review this draft before sharing. Nothing has been sent.</p><details><summary>Review draft</summary><pre className="draft">{draft}</pre></details><Button variant="outline" onClick={async()=>{try{await navigator.clipboard.writeText(draft);setCopied(true);}catch{setError('Copy was unavailable. Select the text in Review draft instead.');}}}><Copy/> Copy draft</Button>{copied&&<span className="copied" role="status">Copied</span>}</div>}
 {configured===false&&<p className="error" role="status">Preview only — the dedicated support connection still needs configuration. You can review the interface; live answers are not available yet.</p>}
 {busy&&<p className="loading" role="status">Searching approved documents and checking the response…</p>}{error&&<p className="error" role="alert">{error}</p>}
 <form onSubmit={e=>{e.preventDefault();void submit(issue).catch(()=>{});}}><label htmlFor="issue">{turns.length?'Add a detail or follow-up':'Describe your issue'}</label><Textarea id="issue" value={issue} disabled={busy||turns.length>=6} onChange={e=>setIssue(e.target.value)} placeholder="What happened, and what did you expect?" maxLength={2500}/><div className="composer-footer"><small>Don’t include passwords, API keys, or customer records.</small><Button type="submit" disabled={configured!==true||busy||!issue.trim()||turns.length>=6}>{busy?'Checking…':'Find a next step'} <ArrowUpRight/></Button></div></form>{turns.length>=6&&<p className="limit">This conversation has reached six messages. Copy what you need, then reset for another issue.</p>}</main>
 <aside className="evidence"><span className="eyebrow">THE EVIDENCE</span><h2>Check the source.</h2><p>Only passages cited in this conversation appear here.</p>{!sources.length?<div className="evidence-empty"><BookOpen size={24}/><p>Answers begin with your<br/>approved documentation.</p></div>:sources.map((s,i)=><article className="source-card" key={s.id} id={s.id}><span className="badge">{i+1} · {s.source}</span><h3>{s.title}</h3><details open><summary>Supporting passage</summary><p>{s.excerpt}</p></details></article>)}</aside></div></div>;
}
