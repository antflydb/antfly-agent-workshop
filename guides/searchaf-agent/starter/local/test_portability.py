import asyncio
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import AsyncMock, patch
from types import SimpleNamespace
import adapter
import tunnel

class PortabilityTests(unittest.TestCase):
    def test_selected_subfolder_gets_parent_grant_but_siblings_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp); allowed=root/'workshop';allowed.mkdir()
            source=root/'source.json';source.write_text(json.dumps({'watch_dirs':[str(root)],'watch_dir_ids':{str(root):'active'}}))
            config={'searchaf_config':str(source),'roots':[str(allowed)]}
            grants=asyncio.run(adapter.grants(None,config))
            self.assertEqual(grants,[{'kind':'local','watch_dir_id':'active'}])
            self.assertFalse(adapter.allowed_document({'path':str(root/'other.txt'),'watch_dir_id':'active'},grants[0],config['roots']))

    def test_configure_does_not_overwrite_or_modify_searchaf(self):
        with tempfile.TemporaryDirectory(prefix='workshop with spaces ') as tmp:
            base=Path(tmp); state=base/'searchaf';(state/'state').mkdir(parents=True)
            corpus=base/'corpus';corpus.mkdir()
            original=json.dumps({'watch_dirs':[str(corpus)]})
            (state/'config.json').write_text(original);(state/'state/swarm-owner.json').write_text('{}')
            output=base/'connection.json'
            cmd=[sys.executable,str(Path(__file__).parent/'configure.py'),'--searchaf-home',str(state),'--root',str(corpus),'--output',str(output)]
            first=subprocess.run(cmd,capture_output=True);self.assertEqual(first.returncode,0)
            content=output.read_bytes();second=subprocess.run(cmd,capture_output=True)
            self.assertNotEqual(second.returncode,0);self.assertEqual(output.read_bytes(),content)
            self.assertEqual((state/'config.json').read_text(),original)
            self.assertEqual(output.stat().st_mode & 0o777,0o600)

    def test_tunnel_command_quotes_spaces_and_omits_key(self):
        with patch.object(tunnel,'HERE',Path('/tmp/path with spaces')):
            args=tunnel.command('start','test','/bin/tunnel-client',{'ANTFLY_TUNNEL_ID':'tunnel_fixture','OPENAI_API_KEY':'never-in-argv'})
        self.assertNotIn('never-in-argv',' '.join(args))
        import shlex
        self.assertEqual(shlex.split(args[-1])[-1],'/tmp/path with spaces/adapter.py')
        with self.assertRaises(ValueError): tunnel.command('stop','bad alias','binary',{})

    def test_oversized_document_is_distinct_from_other_errors(self):
        fake=SimpleNamespace(call_tool=AsyncMock(return_value=SimpleNamespace(isError=True,content=[SimpleNamespace(text='Antfly produced more data than this MCP client can safely consume.')])) )
        with self.assertRaises(adapter.ResponseTooLarge):asyncio.run(adapter.call(fake,'get_document',{}))
        fake.call_tool.return_value.content[0].text='Unauthorized'
        with self.assertRaises(RuntimeError) as error:asyncio.run(adapter.call(fake,'get_document',{}))
        self.assertNotIsInstance(error.exception,adapter.ResponseTooLarge)
        with self.assertRaises(ValueError):asyncio.run(adapter.call(fake,'drop_table',{}))

if __name__=='__main__':unittest.main()
