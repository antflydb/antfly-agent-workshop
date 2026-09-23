"""Create explicit, portable Antfly MCP settings without modifying SearchAF."""
import argparse
import json
import os
from pathlib import Path

def main():
    p=argparse.ArgumentParser()
    p.add_argument('--root',action='append',required=True)
    p.add_argument('--searchaf-home',type=Path,default=Path.home()/'.searchaf')
    p.add_argument('--output',type=Path,default=Path(__file__).parent/'connection.json')
    p.add_argument('--replace',action='store_true')
    a=p.parse_args(); home=a.searchaf_home.expanduser().resolve()
    roots=list(dict.fromkeys(str(Path(r).expanduser().resolve()) for r in a.root))
    if not all(Path(r).is_dir() for r in roots):
        p.error('Every root must be an existing directory')
    source=json.loads((home/'config.json').read_text())
    active=source.get('watch_dirs',[])+[c['root'] for c in source.get('cloud_sources',[]) if c.get('state')=='enabled' and c.get('root')]
    if not all(any(Path(r).is_relative_to(Path(parent).resolve()) for parent in active) for r in roots):
        p.error('A selected folder is not in an active SearchAF source. Add/index it in SearchAF first.')
    if not (home/'state/swarm-owner.json').is_file():
        p.error('SearchAF runtime manifest is missing. Start SearchAF first.')
    config={'transport':'antfly_mcp','runtime_file':str(home/'state/swarm-owner.json'),
            'data_dir':str(home/'data'),'searchaf_config':str(home/'config.json'),'roots':roots}
    target=a.output.expanduser()
    if target.is_symlink() or (target.exists() and not a.replace):
        p.error('Configuration exists or is a symlink. Review it; use --replace only for an intended update.')
    fd=os.open(target,os.O_WRONLY|os.O_CREAT|os.O_TRUNC,0o600)
    with os.fdopen(fd,'w') as f: json.dump(config,f,indent=2);f.write('\n')
    target.chmod(0o600)
    print('Native Antfly MCP configured; explicit roots:',len(roots))

if __name__=='__main__': main()
