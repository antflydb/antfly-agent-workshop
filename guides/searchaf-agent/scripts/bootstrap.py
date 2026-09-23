#!/usr/bin/env python3
"""Copy the sanitized starter into a new workspace. No network, ingestion or secrets."""
import argparse
import shutil
from pathlib import Path

p=argparse.ArgumentParser();p.add_argument('--destination',type=Path,required=True);p.add_argument('--agent',choices=['knowledge','meeting-prep','project-handoff'],required=True);a=p.parse_args()
g=Path(__file__).resolve().parents[1];dest=a.destination.expanduser().resolve()
if dest.exists():
    raise SystemExit('Destination already exists. Choose a new directory; nothing was overwritten.')
dest.mkdir(parents=True)
for item in (g/'starter').iterdir():
    if item.name in {'site','meeting-site','handoff-site'}:continue
    if item.is_dir():shutil.copytree(item,dest/item.name,ignore=shutil.ignore_patterns('__pycache__','.venv','bin'))
    else:shutil.copy2(item,dest/item.name)
shutil.copytree(g/'starter'/({'knowledge':'site','meeting-prep':'meeting-site','project-handoff':'handoff-site'}[a.agent]),dest/'site')
(dest/'WORKSHOP-AGENT.json').write_text(__import__('json').dumps({'agent':a.agent})+'\n')
shutil.copytree(g/'sample-data',dest/'sample-data')
print('Created starter workspace:',dest)
print('Next: follow AGENT-HANDOFF.md. No database or account changes were made.')
