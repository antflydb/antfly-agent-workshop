import tempfile
import unittest
from pathlib import Path
from adapter import in_scope, normalize_hits, enabled_cloud, query_request, endpoint

class ScopeTests(unittest.TestCase):
    def test_rejects_sibling_traversal_and_symlink(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp) / 'allowed'; root.mkdir()
            outside = Path(tmp) / 'private'; outside.mkdir()
            (root / 'escape').symlink_to(outside)
            self.assertTrue(in_scope(str(root / 'doc.pdf'), [str(root)]))
            for path in [str(root) + '-other/doc', str(root / '../private/doc'), str(root / 'escape/doc'), 'relative/doc', None]:
                self.assertFalse(in_scope(path, [str(root)]))

    def test_local_scope_rejects_cloud_and_stale_grants(self):
        grant = {'kind': 'local', 'watch_dir_id': 'active'}
        good = {'path': '/allowed/doc.pdf', 'watch_dir_id': 'active', 'content': 'supported fact'}
        docs = [good, {**good,'path':'/private/secret'}, {**good,'provider':'google_drive'}, {**good,'watch_dir_id':'retired'}]
        rows = [{'_id':str(i),'_source':d} for i,d in enumerate(docs)]
        result = normalize_hits(rows, grant, ['/allowed'], 'fact')
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]['excerpt'], 'supported fact')
        self.assertNotIn('path', result[0])
        self.assertEqual(result, normalize_hits(rows, grant, ['/allowed'], 'fact'))

    def test_cloud_requires_indexed_matching_provenance(self):
        grant = dict(kind='cloud', scope_id='scope', account_id='account', mount_fingerprint='mount', intent_id='intent')
        good = {**{k:v for k,v in grant.items() if k!='kind'},'path':'/allowed/doc.gdoc','content':'Google Doc evidence','content_state':'indexed','provider':'google_drive'}
        docs = [good] + [{**good,k:v} for k,v in [('content_state','permission_lost'),('scope_id','retired'),('account_id','other'),('mount_fingerprint','other'),('intent_id','other')]]
        result = normalize_hits([{'_id':str(i),'_source':d} for i,d in enumerate(docs)], grant, ['/allowed'], 'evidence')
        self.assertEqual(len(result),1)
        self.assertEqual(result[0]['source'],'Google Drive')

    def test_disabled_or_account_mismatched_cloud_hidden(self):
        with tempfile.TemporaryDirectory() as root:
            intent = {'root':root,'provider':'google_drive','state':'enabled','content_preparation_enabled':True,'intent_id':'intent','google_binding':{'oidc_subject':'account','mount_fingerprint':'mount'}}
            scope = {'root':root,'state':'enabled','intent_id':'intent','scope_id':'scope','account_id':'account','mount_fingerprint':'mount'}
            self.assertTrue(enabled_cloud(intent,scope,[root]))
            self.assertFalse(enabled_cloud({**intent,'state':'disabled'},scope,[root]))
            self.assertFalse(enabled_cloud(intent,{**scope,'account_id':'other'},[root]))
            self.assertFalse(enabled_cloud(intent,{**scope,'state':'retired'},[root]))

    def test_database_filters_and_hybrid_search(self):
        request = query_request('brand',{'kind':'local','watch_dir_id':'active'})
        self.assertEqual(request['filter_query'],{'term':'active','field':'watch_dir_id'})
        self.assertEqual(request['exclusion_query']['term'],'google_drive')
        self.assertEqual(request['semantic_search'],'brand')
        self.assertEqual(request['indexes'],['document_vectors'])
        request = query_request('brand',{'kind':'cloud','scope_id':'scope'})
        self.assertEqual(request['filter_query'],{'term':'scope','field':'scope_id'})

    def test_runtime_rejects_unexpected_database(self):
        import json
        with tempfile.TemporaryDirectory() as root:
            p=Path(root)/'owner.json'; p.write_text(json.dumps({'data_dir':'/wrong','port':1234}))
            with self.assertRaises(RuntimeError):
                endpoint({'runtime_file':str(p),'data_dir':'/expected'})

if __name__ == '__main__':
    unittest.main()
