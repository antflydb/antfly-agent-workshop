"""Run the participant's tunnel; secrets stay in process environment, never argv."""
import argparse
import os
from pathlib import Path
import re
import shlex
import shutil
import sys
from dotenv import dotenv_values

HERE=Path(__file__).resolve().parent

def command(action, alias, binary, values):
    if not re.fullmatch(r'[a-zA-Z0-9_-]+',alias): raise ValueError('Invalid alias')
    if action=='start':
        tunnel=values.get('ANTFLY_TUNNEL_ID','')
        if not re.fullmatch(r'tunnel_[a-zA-Z0-9_]+',tunnel): raise ValueError('Set a valid tunnel ID')
        return [binary,'runtimes','connect','--alias',alias,'--profile',alias,
                '--tunnel-id',tunnel,'--runtime-api-key','env:CONTROL_PLANE_API_KEY',
                '--mcp-command',shlex.join([sys.executable,str(HERE/'adapter.py')])]
    return [binary,'runtimes','stop' if action=='stop' else 'status',alias]

def main():
    p=argparse.ArgumentParser();p.add_argument('action',choices=['start','stop','status']);p.add_argument('--alias',default='antfly-files-workshop')
    p.add_argument('--env-file',type=Path,default=HERE.parent/'.env.local');p.add_argument('--binary',default=str(HERE/'bin/tunnel-client'));a=p.parse_args()
    values={k:v for k,v in dotenv_values(a.env_file,interpolate=False).items() if v is not None} if a.env_file.is_file() else {}
    for key in ['OPENAI_API_KEY','ANTFLY_TUNNEL_ID']:
        if os.environ.get(key): values[key]=os.environ[key]
    if a.action=='start' and not values.get('OPENAI_API_KEY'): p.error('Set the authorized key in the private env file or environment')
    binary=shutil.which(a.binary)
    if not binary: p.error('Install tunnel-client with install_tunnel.py first')
    try: args=command(a.action,a.alias,binary,values)
    except ValueError as e: p.error(str(e))
    env=os.environ.copy()
    if values.get('OPENAI_API_KEY'):env['CONTROL_PLANE_API_KEY']=values['OPENAI_API_KEY']
    os.execve(binary,args,env)

if __name__=='__main__':main()
