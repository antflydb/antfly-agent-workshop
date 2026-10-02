import json
from pathlib import Path
import tempfile
import unittest
from check import corpus_case_passes, load_corpus_checks


class CorpusChecksTests(unittest.TestCase):
    def test_other_file_cannot_substitute_for_media_evidence(self):
        case = {'file': 'scan.png', 'expect': ['RBR-17', 'incident log']}
        sources = [{'title': 'notes.md', 'excerpt': 'RBR-17 requires an incident log'},
                   {'title': 'scan.png', 'excerpt': 'RBR-17'}]
        self.assertFalse(corpus_case_passes(sources, case))
        sources.append({'title': 'scan.png', 'excerpt': 'Attach the incident\nlog.'})
        self.assertTrue(corpus_case_passes(sources, case))

    def test_empty_or_malformed_expectations_do_not_pass(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / 'checks.json'
            for cases in [[], [{}], [{'file': 'scan.png', 'format': 'Scan', 'query': 'RBR-17', 'expect': []}]]:
                path.write_text(json.dumps(cases))
                with self.assertRaises(ValueError):
                    load_corpus_checks(path)


if __name__ == '__main__':
    unittest.main()
