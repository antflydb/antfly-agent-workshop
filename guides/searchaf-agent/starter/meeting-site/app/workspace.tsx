'use client';
import { useCallback, useEffect, useState } from 'react';
import { ArrowUpRight, ArrowRight, BookOpen, Check, ChevronDown, Clock3, Copy, FileText, Layers3, LockKeyhole, Printer, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { BriefResult, EvidencePoint, MeetingInput } from '@/lib/brief-types';
const initial: MeetingInput = {topic:'',participants:'',goal:'',duration:30};
const examples = [
  {label:'Atlas pilot readiness',topic:'Project Atlas pilot readiness',participants:'Product and engineering',goal:'Review launch gates, ownership, and unresolved questions.',duration:30},
  {label:'Draft vs approved plan',topic:'Project Atlas planning changes',participants:'Project team',goal:'Compare the superseded draft with the approved plan and identify what to confirm.',duration:30},
  {label:'Rollback preparation',topic:'Project Atlas rollback rehearsal',participants:'Product and engineering',goal:'Clarify rollback ownership, triggers, and preparation.',duration:15},
];

export default function MeetingWorkspace({knowledgeUrl}: {knowledgeUrl?:string}) {
 const [input,setInput]=useState<MeetingInput>(initial);
 const [result,setResult]=useState<BriefResult|null>(null);
 const [submitted,setSubmitted]=useState<MeetingInput|null>(null);
 const [busy,setBusy]=useState(false);
 const [configured,setConfigured]=useState(false);
 const [error,setError]=useState('');
 const [copied,setCopied]=useState(false);
 const [activeSource,setActiveSource]=useState<string|null>(null);
 useEffect(()=>{fetch('/api/status').then(async r=>await r.json() as {configured?:boolean}).then(s=>setConfigured(s.configured===true)).catch(()=>{});},[]);
 const build = useCallback(async (values: MeetingInput) => {
  if (!values.topic.trim() || values.topic.length>300 || values.participants.length>500 || values.goal.length>1000 || ![15,30,45,60].includes(values.duration)) throw new Error('Enter a meeting topic and valid meeting details.');
  setInput(values);setBusy(true);setError('');setResult(null);setActiveSource(null);setCopied(false);setSubmitted(values);
  try {
   const response=await fetch('/api/brief',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(values),signal:AbortSignal.timeout(180000)});
   const data=await response.json() as BriefResult & {error?:string};if(!response.ok)throw new Error(data.error||'The briefing could not be prepared.');setResult(data);return {status:data.status,sourceCount:data.sources.length,title:data.brief.title};
  } catch(e) {setError(e instanceof Error?e.message:'Please try again.');throw e;} finally{setBusy(false);}
 },[]);
 useEffect(()=>{
  const context=(document as unknown as {modelContext?:{registerTool:(tool:unknown,opts:{signal:AbortSignal})=>unknown}}).modelContext;if(!context?.registerTool)return;
  const lifecycle=new AbortController();
  try {void Promise.resolve(context.registerTool({name:'prepare_meeting_brief',title:'Prepare a meeting brief',description:'Retrieve evidence from the connected Antfly index, generate a meeting brief and display it. Sends selected excerpts to OpenAI. Does not create a calendar event or send messages.',inputSchema:{type:'object',properties:{topic:{type:'string',minLength:1,maxLength:300},participants:{type:'string',maxLength:500},goal:{type:'string',maxLength:1000},duration:{type:'integer',enum:[15,30,45,60]}},required:['topic','participants','goal','duration'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:true},execute:async(raw:unknown)=>{if(!raw||typeof raw!=='object')throw new Error('Meeting details required.');const v=raw as MeetingInput;if(typeof v.topic!=='string'||typeof v.participants!=='string'||typeof v.goal!=='string')throw new Error('Invalid meeting details.');return build(v);}}, {signal:lifecycle.signal})).catch(()=>{});}catch{}return()=>lifecycle.abort();
 },[build]);
 const update=(key:keyof MeetingInput,value:string|number)=>setInput(v=>({...v,[key]:value}));
 const cite=(ids:string[])=>ids.map(id=>{const n=result?.sources.findIndex(s=>s.id===id)??-1;return <button type="button" className="citation" key={id} aria-label={`Open source ${n+1}`} onClick={()=>{setActiveSource(id);document.getElementById('evidence-'+id)?.scrollIntoView({behavior:'smooth',block:'center'});}}>{n+1}</button>;});
 const point=(item:EvidencePoint,i:number)=><li key={i}>{item.text} <span className="citations">{cite(item.source_ids)}</span></li>;
 const copy=async()=>{if(!result)return;const b=result.brief;const evidence=(p:EvidencePoint)=>`${p.text} ${p.source_ids.map(id=>'['+((result.sources.findIndex(s=>s.id===id))+1)+']').join(' ')}`;const text=[b.title,'CONTEXT',...b.context.map(evidence),'PRIOR DECISIONS & PROPOSALS',...b.decisions.map(p=>`${p.status}: ${evidence(p)}`),'TENSIONS',...b.tensions.map(evidence),'GAPS',...b.gaps,'SUGGESTED AGENDA',...b.agenda.map(a=>`${a.minutes} min — ${a.topic}: ${a.purpose}`),'SUGGESTED QUESTIONS',...b.questions,'SOURCE EXCERPTS',...result.sources.map((s,i)=>`[${i+1}] ${s.title} (${s.source})\n${s.excerpt}`)].join('\n\n');try{await navigator.clipboard.writeText(text);setCopied(true);}catch{setError('Clipboard access is unavailable. Use Print / save PDF instead.');}};
 const brief=result?.brief;
 return <div className="brief-app">
  <header className="masthead"><a href="/" className="wordmark"><Layers3 size={21}/><strong>Antfly</strong><span>FIELDNOTES</span></a><nav aria-label="Workshop agents">{knowledgeUrl ? <a href={knowledgeUrl}><BookOpen size={15}/> Knowledge agent <ArrowUpRight size={13}/></a> : <span>Knowledge agent · separate workshop path</span>}<span className="current-agent"><Sparkles size={14}/> Meeting-prep agent</span></nav><span className="private-badge"><LockKeyhole size={12}/> Private workspace</span></header>
  <div className="intro-strip"><span className="edition">AGENT 02 / MEETING PREPARATION</span><span>Same knowledge. A different kind of preparation.</span></div>
  <main className="desk">
   <aside className="setup-panel"><div className="setup-title"><span className="small-label">THE MEETING</span><h1>Walk in<br/><em>with context.</em></h1><p>Turn what your workspace knows into a brief worth bringing to the room.</p></div>
    <form onSubmit={e=>{e.preventDefault();void build(input).catch(()=>{});}}>
     <label htmlFor="topic">What’s the meeting about? <span>Required</span></label><Input id="topic" placeholder="e.g. Project Atlas pilot readiness" value={input.topic} onChange={e=>update('topic',e.target.value)} maxLength={300} required disabled={busy}/>
     <label htmlFor="participants">Who’s in the room?</label><Input id="participants" placeholder="Names, teams, or organizations" value={input.participants} onChange={e=>update('participants',e.target.value)} maxLength={500} disabled={busy}/>
     <label htmlFor="goal">What would make it a good meeting?</label><Textarea id="goal" placeholder="The outcome you want to leave with…" value={input.goal} onChange={e=>update('goal',e.target.value)} maxLength={1000} rows={3} disabled={busy}/>
     <fieldset disabled={busy}><legend>Time available</legend><div className="duration-picker">{[15,30,45,60].map(n=><Button key={n} type="button" variant="outline" aria-pressed={input.duration===n} onClick={()=>update('duration',n)}>{n} <span>min</span></Button>)}</div></fieldset>
     <Button type="submit" className="prepare-button" disabled={busy||!configured||!input.topic.trim()}>{busy?'Preparing your brief…':'Prepare my brief'}{busy?<span className="spinner"/>:<ArrowRight size={18}/>}</Button>
     <p className="connection-note"><span className={configured?'status-dot':'status-dot waiting'}/>{configured?'Antfly connection configured':'Connection setup needed'}</p>
    </form>
    <div className="examples"><span className="small-label">START WITH AN EXAMPLE</span>{examples.map(example=><button key={example.label} type="button" disabled={busy} onClick={()=>setInput({topic:example.topic,participants:example.participants,goal:example.goal,duration:example.duration})}>{example.label}<ArrowUpRight size={14}/></button>)}</div>
    <div className="data-note"><Layers3 size={17}/><p>Same Antfly index as your knowledge agent.<br/>SearchAF brings in your files. Your brief draws on that evidence.</p></div>
   </aside>
   <section className="brief-workspace" aria-label="Meeting brief">
    <div className="document-toolbar"><span><span className="coral-mark"/>{result?'YOUR MEETING BRIEF':'THE BRIEFING DESK'}</span>{result&&<div><Button variant="ghost" size="sm" onClick={()=>void copy()}>{copied?<Check size={14}/>:<Copy size={14}/>} {copied?'Copied':'Copy brief'}</Button><Button variant="ghost" size="sm" onClick={()=>window.print()}><Printer size={14}/> Print / PDF</Button></div>}</div>
    {error&&<div role="alert" className="error-box">{error}</div>}
    {busy?<div className="preparing" role="status"><span className="loading-orbit"><Sparkles size={26}/></span><h2>Connecting the dots.</h2><p>Searching your Antfly index and assembling a brief with evidence.</p><div className="preparing-steps"><span>01 Find relevant context</span><span>02 Separate facts from proposals</span><span>03 Prepare the conversation</span></div><small>This can take a minute. Keep SearchAF and your tunnel running.</small></div>:!brief?<div className="empty-brief"><div className="empty-header"><span className="folio">BRIEF / 001</span><span className="small-label">READY WHEN YOU ARE</span></div><h2>A better meeting<br/>starts <em>before the meeting.</em></h2><p className="empty-intro">Set the context on the left. We’ll gather the background, surface what’s unresolved, and suggest a way forward.</p><div className="preview-sections"><div><span>01</span><h3>What to know</h3><p>Relevant background and prior decisions, linked to source passages.</p></div><div><span>02</span><h3>What to resolve</h3><p>Conflicting accounts, missing context, and questions worth asking.</p></div><div><span>03</span><h3>How to use the time</h3><p>A suggested agenda shaped around your meeting’s goal.</p></div></div><div className="empty-foot"><FileText size={18}/><span>A preparation brief, grounded in your documents.<br/>No calendar connection needed.</span></div></div>:<article className="brief-paper" aria-live="polite"><div className="paper-meta"><span className="folio">MEETING BRIEF</span><span><Clock3 size={13}/> {submitted?.duration} MINUTES</span></div><h2>{brief.title}</h2><p className="attendees">{submitted?.participants||'Participants not specified'}</p>{submitted?.goal&&<p className="meeting-goal"><span>YOUR GOAL</span>{submitted.goal}</p>}{result?.status==='insufficient_evidence'&&<div className="evidence-warning">The index did not return enough evidence for a grounded brief. Try a narrower topic or check that the relevant documents are indexed.</div>}
     <section className="brief-section"><div className="section-title"><span>01</span><h3>What to know</h3><small>FROM YOUR DOCUMENTS</small></div>{brief.context.length?<ul className="context-list">{brief.context.map(point)}</ul>:<p className="no-finding">No supported background found.</p>}{brief.decisions.length>0&&<div className="decision-list"><h4>Prior decisions & proposals</h4>{brief.decisions.map((d,i)=><div className="decision" key={i}><span className={'decision-status '+d.status}>{d.status}</span><p>{d.text} {cite(d.source_ids)}</p></div>)}</div>}</section>
     <section className="brief-section"><div className="section-title"><span>02</span><h3>What to resolve</h3></div>{brief.tensions.length>0&&<><h4>Differences to examine</h4><ul>{brief.tensions.map(point)}</ul></>}{brief.gaps.length>0&&<div className="gaps"><h4>Not established by the retrieved evidence</h4><ul>{brief.gaps.map((g,i)=><li key={i}>{g}</li>)}</ul></div>}{!brief.gaps.length&&!brief.tensions.length&&<p className="no-finding">No specific gaps or conflicts identified in the retrieved passages.</p>}</section>
     <section className="brief-section"><div className="section-title"><span>03</span><h3>Make the time count</h3><small>SUGGESTED · NOT AGREED</small></div><div className="agenda">{brief.agenda.map((a,i)=><div className="agenda-item" key={i}><span className="agenda-time">{a.minutes}<small>MIN</small></span><div><h4>{a.topic}</h4><p>{a.purpose} {cite(a.source_ids)}</p></div></div>)}</div>{brief.questions.length>0&&<div className="questions"><h4>Questions to bring into the room</h4>{brief.questions.map((q,i)=><p key={i}><span>{String(i+1).padStart(2,'0')}</span>{q}</p>)}</div>}</section>
     <section className="evidence-section"><div className="section-title"><FileText size={17}/><h3>Check the source</h3><small>{result?.sources.length} EXCERPTS</small></div>{result?.sources.map((s,i)=><details key={s.id} id={'evidence-'+s.id} open={activeSource===s.id||undefined}><summary onClick={e=>{if(activeSource===s.id){e.preventDefault();setActiveSource(null);}}}><span className="source-number">{i+1}</span><div><strong>{s.title}</strong><small>{s.source}</small></div><ChevronDown size={15}/></summary><p>{s.excerpt}</p></details>)}</section><div className="paper-footer">Prepared {new Date(result!.createdAt).toLocaleString()} · Based on retrieved snapshots, not complete organizational history.</div></article>}
    <p className="privacy-note"><LockKeyhole size={12}/> Your index stays local. Selected excerpts are sent to OpenAI. Briefs are not saved by this app.</p>
   </section>
  </main><footer className="page-footer"><span>ANTFLY FIELDNOTES</span><span>SearchAF ingestion → Antfly MCP retrieval → OpenAI preparation</span><span>Built for a more informed room.</span></footer>
 </div>;
}
