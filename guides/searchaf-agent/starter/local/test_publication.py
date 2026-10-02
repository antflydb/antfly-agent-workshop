"""Publication must reject changed evidence, substituted sources and unsafe credentials."""
import copy,hashlib,json,tempfile,unittest
from pathlib import Path
import publish_corpus

class PublicationSafetyTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory();self.addCleanup(self.temp.cleanup)
        self.root=Path(self.temp.name)
        names=['atlas-approved-plan.md','atlas-draft.md','atlas-meeting.md','untrusted-note.md','atlas-support-guide.pdf','atlas-sync-error.png','atlas-rollback-checklist.png']
        self.bundle={'corpus':'atlas-support-packet','version':'atlas-test','documents':[]}
        for name in names:
            body='Synthetic test evidence for '+name
            doc={'filename':name,'source_format':'synthetic','content':body,'content_sha256':hashlib.sha256(body.encode()).hexdigest(),'source_sha256':'synthetic-test','source_relative_path':name,'extraction_provenance':{},'corpus_version':'atlas-test'}
            self.bundle['documents'].append({'id':'atlas-'+hashlib.sha256(('atlas-support-packet/'+name).encode()).hexdigest()[:24],'document':doc})
    def load(self,bundle):
        path=self.root/'corpus.json';path.write_text(json.dumps(bundle));return publish_corpus.load_bundle(path)
    def test_changed_body_cannot_be_published(self):
        self.bundle['documents'][0]['document']['content']='Changed after export'
        with self.assertRaisesRegex(ValueError,'hash/version'):self.load(self.bundle)
    def test_missing_source_cannot_be_published(self):
        self.bundle['documents'].pop()
        with self.assertRaisesRegex(ValueError,'complete seven'):self.load(self.bundle)
    def test_substituted_source_cannot_be_published(self):
        self.bundle['documents'][0]['document']['filename']='personal-notes.md'
        with self.assertRaisesRegex(ValueError,'filenames'):self.load(self.bundle)
    def test_personal_binding_cannot_be_added_to_export(self):
        self.bundle['documents'][0]['document']['account_id']='private'
        with self.assertRaisesRegex(ValueError,'unexpected fields'):self.load(self.bundle)
    def test_mixed_publication_versions_rejected(self):
        self.bundle['documents'][0]['document']['corpus_version']='atlas-old'
        with self.assertRaisesRegex(ValueError,'hash/version'):self.load(self.bundle)
    def test_wrong_stable_id_rejected(self):
        self.bundle['documents'][0]['id']='unrelated-existing-row'
        with self.assertRaisesRegex(ValueError,'identity'):self.load(self.bundle)
    def test_shared_or_symlinked_credential_rejected(self):
        key=self.root/'key';key.write_text('test-only');key.chmod(0o644)
        with self.assertRaisesRegex(ValueError,'private'):publish_corpus.secret(key)
        key.chmod(0o600);link=self.root/'link';link.symlink_to(key)
        with self.assertRaisesRegex(ValueError,'private'):publish_corpus.secret(link)
    def test_sanitized_complete_bundle_is_accepted(self):
        self.assertEqual(len(self.load(self.bundle)['documents']),7)
if __name__=='__main__':unittest.main()


class PipelineReadinessTests(unittest.IsolatedAsyncioTestCase):
    async def test_mcp_taskgroup_wrapping_does_not_skip_the_wait(self):
        from unittest.mock import AsyncMock,patch
        import check_pipeline
        wrapped=ExceptionGroup('MCP task group',[ValueError('Wait for seven indexed sources')])
        with patch.object(check_pipeline,'check',AsyncMock(side_effect=[wrapped,{'pipeline_passed':True}])) as check, patch.object(check_pipeline.asyncio,'sleep',AsyncMock()) as sleep, patch('sys.argv',['check_pipeline.py','--wait-seconds','1']), patch('builtins.print'):
            await check_pipeline.main()
        self.assertEqual(check.await_count,2)
        sleep.assert_awaited_once()
    async def test_programmer_error_is_not_hidden_as_model_warmup(self):
        from unittest.mock import AsyncMock,patch
        import check_pipeline
        wrapped=ExceptionGroup('MCP task group',[KeyError('Unexpected schema')])
        with patch.object(check_pipeline,'check',AsyncMock(side_effect=wrapped)), patch.object(check_pipeline.asyncio,'sleep',AsyncMock()) as sleep, patch('sys.argv',['check_pipeline.py','--wait-seconds','1']):
            with self.assertRaises(ExceptionGroup):await check_pipeline.main()
        sleep.assert_not_awaited()
