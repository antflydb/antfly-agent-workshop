import test from 'node:test';
import assert from 'node:assert/strict';
import { answerQuestion, extractSources } from './answer.ts';

const source = { id: 'S0123456789ab', title: 'Evidence.pdf', excerpt: 'A supported fact.', source: 'Desktop' };
test('source cards come only from successful allowlisted MCP calls', () => {
  const output = [
    { type: 'mcp_call', name: 'other', output: JSON.stringify({sources:[source]}) },
    { type: 'mcp_call', name: 'search_workshop_files', error: 'failed', output: JSON.stringify({sources:[source]}) },
  ];
  assert.deepEqual(extractSources(output), []);
  assert.equal(extractSources([{type:'mcp_call',name:'search_workshop_files',output:JSON.stringify({content:[{type:'text',text:JSON.stringify({sources:[source]})}]})}])[0].title, source.title);
});

test('citation validation and missing evidence fail closed', async () => {
  const original = globalThis.fetch;
  const config = { key: 'test-fixture', tunnel: 'tunnel_fixture', model: 'test-model' };
  const fake = (answer: string, sources: unknown[]) => {
    globalThis.fetch = async (_url, init) => {
      const request = JSON.parse(String(init?.body));
      assert.equal(request.store, false);
      assert.deepEqual(request.tools[0].allowed_tools, ['search_workshop_files']);
      return Response.json({status:'completed',output:[
        {type:'mcp_call',name:'search_workshop_files',output:JSON.stringify({sources})},
        {type:'message',content:[{type:'output_text',text:answer}]},
      ]});
    };
  };
  try {
    fake('Supported fact [S0123456789ab]', [source]);
    assert.equal((await answerQuestion('question',config)).cited[0], source.id);
    fake('Invented [Sffffffffffff]', [source]);
    await assert.rejects(answerQuestion('question',config), /unverified citation/);
    fake('An unsupported confident answer', []);
    assert.match((await answerQuestion('question',config)).answer, /could not find supporting evidence/);
    fake('No citation in this answer', [source]);
    assert.match((await answerQuestion('question',config)).answer, /could not be verified/);
  } finally { globalThis.fetch = original; }
});
