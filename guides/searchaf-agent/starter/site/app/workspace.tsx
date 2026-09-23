"use client";
import { useState, useEffect, useCallback } from "react";
import { ArrowUpRight, FileText, Layers, LockKeyhole, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Answer } from "@/lib/answer";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<Answer | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [configured, setConfigured] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  useEffect(() => { fetch('/api/status').then(async r=>await r.json() as {configured?:boolean}).then(s=>setConfigured(s.configured===true)).catch(()=>{}); }, []);
  const ask = useCallback(async (value: string) => {
    if (!value.trim() || value.length > 2000) throw new Error('Enter a question between 1 and 2,000 characters.');
    setQuestion(value); setBusy(true); setError(""); setResult(null); setSelected(null);
    try {
      const r = await fetch('/api/ask', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:value}),signal:AbortSignal.timeout(130000)});
      const data = await r.json() as Answer & {error?:string};
      if (!r.ok) throw new Error(data.error || 'Unable to complete the request.');
      setResult(data); return {answer:data.answer,sources:data.sources};
    } catch(e) { const message = e instanceof Error ? e.message : 'Request failed.'; setError(message); throw e; }
    finally {setBusy(false);}
  }, []);
  useEffect(() => {
    const context = (document as unknown as {modelContext?: {registerTool: (tool: unknown, options: {signal: AbortSignal})=>void | Promise<void>}}).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    try { Promise.resolve(context.registerTool({name:'ask_workspace',title:'Ask your workspace',description:'Ask a question using the connected SearchAF files, display the answer and evidence. Sends the question and retrieved excerpts to OpenAI.',inputSchema:{type:'object',properties:{question:{type:'string',minLength:1,maxLength:2000}},required:['question'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:true},execute:async(input: unknown)=>{if(!input || typeof input!=='object' || typeof (input as {question?:unknown}).question!=='string') throw new Error('A question is required.');return ask((input as {question:string}).question);}}, {signal:lifecycle.signal})).catch(()=>{}); } catch { /* Browsers without the experimental API still use the form. */ }
    return ()=>lifecycle.abort();
  }, [ask]);
  const reveal = (id: string) => {setSelected(id);document.getElementById('source-'+id)?.scrollIntoView({behavior:'smooth',block:'nearest'});};
  return <main className="workshop">
    <header className="topbar"><div className="brand"><Layers size={23}/><strong>Antfly</strong><span>/</span><span>Workspace lab</span></div><span className="private"><LockKeyhole size={13}/> Private test</span></header>
    <div className="workspace-grid"><aside className="rail"><p className="eyebrow">YOUR KNOWLEDGE</p><h2>One index.<br/>Your context.</h2><p>Ask across the files you already bring into SearchAF.</p><div className="source-row"><FileText size={18}/><div><strong>SearchAF</strong><small>Local Antfly index</small></div></div><div className="connection"><span className="amber-dot"/> {configured ? 'Configured · ready to ask' : 'Connection setup in progress'}</div><div className="rail-note"><LockKeyhole size={17}/><p>Your index stays on your Mac. Retrieved excerpts are sent to OpenAI to answer your questions.</p></div></aside>
    <section className="main-panel"><p className="eyebrow">SEARCHAF × ANTFLY MCP × OPENAI</p><h1>Ask your workspace.</h1><p className="intro">Find the context. Understand the answer. Check the source.</p><form onSubmit={e=>{e.preventDefault();if(!busy) void ask(question).catch(()=>{});}} className="question-box"><label htmlFor="question">What would you like to know?</label><Textarea id="question" value={question} onChange={e=>setQuestion(e.target.value)} placeholder="What are the Project Atlas pilot launch requirements?" rows={4} maxLength={2000} disabled={busy}/><div className="question-footer"><span>Answers grounded in your files</span><Button type="submit" disabled={busy || !configured || !question.trim()} size="lg">{busy ? "Searching your files…" : "Ask your files"} <ArrowUpRight/></Button></div></form><div className="suggestions">{["When is the Project Atlas pilot launch?", "What changed between the Atlas draft and approved plan?", "Who owns the Atlas rollback decision?"].map(q=><Button key={q} variant="outline" onClick={()=>setQuestion(q)}>{q}<ArrowUpRight size={13}/></Button>)}</div>{error && <div role="alert" className="error-message">{error}</div>}{busy && <div role="status" className="searching">Searching Antfly and checking the evidence…</div>}{result ? <section className="answer" aria-live="polite"><p className="eyebrow">ANSWER · {result.retrieved} SOURCE EXCERPTS</p>{result.answer.split(/\n\n+/).map((paragraph,index)=><p key={index}>{paragraph.split(/(\[S[a-f0-9]{12}\])/g).map((part,i)=>/^\[S[a-f0-9]{12}\]$/.test(part)?<Button key={i} variant="outline" size="xs" onClick={()=>reveal(part.slice(1,-1))} aria-label="View supporting source">{result.sources.findIndex(s=>s.id===part.slice(1,-1))+1}</Button>:part)}</p>)}</section> : !busy && <section className="answer-empty"><Search size={26}/><h2>Your answer starts with evidence.</h2><p>Once the private connection is ready, ask a question to see an answer alongside the source excerpts that support it.</p></section>}</section>
    <aside className="evidence-panel"><p className="eyebrow">EVIDENCE</p><h2>Go straight to the source.</h2><p>Retrieved documents and supporting passages will appear here with each answer.</p>{result?.sources.length ? <div className="source-list">{result.sources.map((source,index)=><article key={source.id} id={'source-'+source.id} className={'source-card '+(selected===source.id?'selected':'')}><div className="source-heading"><span>{index+1}</span><small>{source.source}{result.cited.includes(source.id)?' · Cited':' · Retrieved'}</small></div><h3>{source.title}</h3><p>{source.excerpt}</p>{source.location && <small>{source.location.kind} {source.location.page ?? source.location.value ?? ''}</small>}</article>)}</div> : <div className="evidence-note"><FileText size={20}/><span>No sources retrieved yet</span></div>}</aside></div><footer>Built with Antfly · SearchAF for ingestion · Antfly MCP for retrieval · OpenAI for answers</footer>
  </main>;
}
