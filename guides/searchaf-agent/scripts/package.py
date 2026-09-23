#!/usr/bin/env python3
"""Package only this guide and its Skill, with hashes; refuse private artifacts."""
import argparse
import hashlib
import io
import json
from pathlib import Path
import re
import zipfile

GUIDE=Path(__file__).resolve().parents[1]
ROOT=GUIDE.parents[1]
SKILL=ROOT/'skills/use-cases/build-antfly-searchaf-agent'
IGNORE={'.git','__pycache__','node_modules','.venv','.wrangler','dist','.next','.vinext','bin'}
PATTERNS=[r'\bsk-(?!placeholder)[A-Za-z0-9_-]{20,}',r'\bantflydb_[A-Za-z0-9_-]{16,}',
          r'\btunnel_[a-f0-9]{24,}',r'\bappgprj_[a-f0-9]+',r'/' + r'Users/[^/\s]+/',r'[A-Za-z0-9._%+-]+@antfly\.io',
          r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----']

def files():
    result={}
    for tree in [GUIDE,SKILL]:
        for path in sorted(tree.rglob('*')):
            relative=path.relative_to(tree)
            if any(part in IGNORE for part in relative.parts):continue
            if path.is_symlink():raise ValueError('Refusing symlink: '+str(relative))
            if not path.is_file():continue
            if path.name in {'connection.json','.env.local'} or path.name.endswith(('.private.json','.zip','.tsbuildinfo')):
                raise ValueError('Private/generated file inside package: '+str(relative))
            if path.name.startswith('.env') and path.name!='.env.example':raise ValueError('Private environment file')
            data=path.read_bytes()
            try:text=data.decode()
            except UnicodeDecodeError:text=''
            if any(re.search(pattern,text) for pattern in PATTERNS):raise ValueError('Personal identifier or secret in '+str(relative))
            result[path.relative_to(ROOT).as_posix()]=data
    return result

def main():
    p=argparse.ArgumentParser();p.add_argument('--output',type=Path,required=True);a=p.parse_args()
    if a.output.exists():p.error('Archive already exists; choose a new version/path')
    payload=files()
    payload['START-HERE.md']=b'# Antfly file-agent workshop\n\nRead guides/searchaf-agent/AGENT-HANDOFF.md. Runnable code, sample documents and optional Skill are included. No personal credentials or deployment are included.\n'
    hashes={name:hashlib.sha256(data).hexdigest() for name,data in payload.items()}
    payload['MANIFEST.json']=(json.dumps({'version':'0.3.1','sha256':hashes},indent=2)+'\n').encode()
    for name,data in payload.items():
        if name.endswith('.md'):
            for link in re.findall(r'\]\(([^)#]+)(?:#[^)]*)?\)',data.decode()):
                if '://' in link or link.startswith('#'):continue
                # Validate normal relative file links; instructions may also use inline paths.
                import posixpath
                target=posixpath.normpath(posixpath.join(posixpath.dirname(name),link))
                if target not in payload:raise ValueError('Broken bundle link: '+name+' → '+link)
    with zipfile.ZipFile(a.output,'x',compression=zipfile.ZIP_DEFLATED) as archive:
        for name,data in sorted(payload.items()):
            info=zipfile.ZipInfo('antfly-searchaf-agent/'+name,(2026,9,20,0,0,0))
            info.compress_type=zipfile.ZIP_DEFLATED;archive.writestr(info,data)
    print(json.dumps({'archive':str(a.output),'files':len(payload),'sha256':hashlib.sha256(a.output.read_bytes()).hexdigest()}))
if __name__=='__main__':main()
