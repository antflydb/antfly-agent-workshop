import test from 'node:test';
import assert from 'node:assert/strict';
import { answerQuestion } from './answer.ts';

const config = { key: 'test-fixture', model: 'test-model', apiBase: 'https://platform.antfly.io/cloud/v1/11111111-1111-1111-1111-111111111111', table: 'atlas_workshop', cloudKey: 'cloud-fixture' };
const row = { filename: 'Evidence.pdf', content: 'A supported fact.' };

test('citation validation and missing evidence fail closed', async () => {
  const original = globalThis.fetch;
  let sourceId = '';
  // One search, then an answer. `answer` may name the real source id with {id}.
  const fake = (answer: string, found: boolean) => {
    globalThis.fetch = async (url, init) => {
      if (String(url).startsWith(config.apiBase)) return Response.json({responses:[{hits:{hits: found ? [{_id:'Evidence.pdf',_source:row}] : []}}]});
      const request = JSON.parse(String(init?.body));
      assert.equal(request.store, false);
      assert.equal(request.tools[0].name, 'search_workshop_files');
      const output = request.input.find((i: {type:string}) => i.type === 'function_call_output');
      if (!output) return Response.json({status:'completed',output:[{type:'function_call',name:'search_workshop_files',call_id:'c1',arguments:'{"query":"fact"}'}]});
      sourceId = JSON.parse(output.output).sources[0]?.id ?? '';
      return Response.json({status:'completed',output:[{type:'message',content:[{type:'output_text',text:answer.replace('{id}', sourceId)}]}]});
    };
  };
  try {
    fake('Supported fact [{id}]', true);
    assert.equal((await answerQuestion('question',config)).cited[0], sourceId);
    fake('Invented [Sffffffffffff]', true);
    await assert.rejects(answerQuestion('question',config), /unverified citation/);
    fake('An unsupported confident answer', false);
    assert.match((await answerQuestion('question',config)).answer, /could not find supporting evidence/);
    fake('No citation in this answer', true);
    assert.match((await answerQuestion('question',config)).answer, /could not be verified/);
  } finally { globalThis.fetch = original; }
});
