#!/usr/bin/env python3
"""Validate distributable workshop files without accounts or network access."""
import hashlib
import importlib.util
import json
from pathlib import Path
import re
import subprocess
import tempfile
import zipfile

root = Path(__file__).resolve().parents[1]
package = root / 'guides/searchaf-agent/scripts/package.py'
spec = importlib.util.spec_from_file_location('workshop_package', package)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
module.files()
count = 0
for path in root.rglob('*'):
    if any(part in module.IGNORE for part in path.relative_to(root).parts):
        continue
    if path.is_symlink():
        raise ValueError(f'Symlink: {path.relative_to(root)}')
    if not path.is_file():
        continue
    if path.name.startswith('.env') and path.name != '.env.example':
        raise ValueError('Private environment file')
    if path.name == 'connection.json' or path.name.endswith(('.private.json', '.zip')):
        raise ValueError('Private or generated artifact')
    try:
        text = path.read_text()
    except UnicodeDecodeError:
        continue
    if any(re.search(pattern, text) for pattern in module.PATTERNS):
        raise ValueError(f'Possible credential or personal identifier: {path.relative_to(root)}')
    if path.suffix == '.md':
        for link in re.findall(r'\]\(([^)#]+)(?:#[^)]*)?\)', text):
            if '://' in link or link.startswith('#'):
                continue
            if not (path.parent / link).exists():
                raise ValueError(f'Broken link in {path.relative_to(root)}: {link}')
    count += 1
with tempfile.TemporaryDirectory(prefix='antfly-workshop-verify-') as tmp:
    tmp = Path(tmp)
    archive = tmp / 'workshop.zip'
    subprocess.run(['python3', str(package), '--output', str(archive)], check=True, capture_output=True)
    with zipfile.ZipFile(archive) as z:
        manifest = json.loads(z.read('antfly-searchaf-agent/MANIFEST.json'))
        for name, digest in manifest['sha256'].items():
            assert hashlib.sha256(z.read('antfly-searchaf-agent/' + name)).hexdigest() == digest
    for agent in ['knowledge', 'meeting-prep', 'project-handoff']:
        destination = tmp / agent
        command = ['python3', str(package.with_name('bootstrap.py')), '--agent', agent, '--destination', str(destination)]
        subprocess.run(command, check=True, capture_output=True)
        assert (destination / 'site/package-lock.json').exists()
        assert json.loads((destination / 'site/.openai/hosting.json').read_text())['project_id'] is None
        assert subprocess.run(command, capture_output=True).returncode != 0
print(f'Validated {count} text files, Markdown links, archive hashes, all three bootstrap paths and overwrite refusal.')
