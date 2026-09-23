"""Install the pinned official macOS tunnel client with an archive hash check."""
import hashlib
import io
from pathlib import Path
import platform
import urllib.request
import zipfile

VERSION='v0.0.14'
HASHES={'arm64':'b540493c5bdbcdbb755700c8e2e16597e28b1569e425007e0f73111047bd6a64',
        'x86_64':'75e10be774184fb42189e347b16eb6bc9fb0780135d8af714d34e30ce068dc53'}
def main():
    arch=platform.machine()
    if platform.system()!='Darwin' or arch not in HASHES: raise SystemExit('This workshop supports macOS arm64/x86_64 only')
    target=Path(__file__).parent/'bin/tunnel-client'
    if target.exists(): raise SystemExit('Binary already exists. Inspect its version; installer will not overwrite it.')
    asset=f'tunnel-client-{VERSION}-darwin-{"amd64" if arch=="x86_64" else "arm64"}.zip'
    url=f'https://github.com/openai/tunnel-client/releases/download/{VERSION}/{asset}'
    with urllib.request.urlopen(url,timeout=60) as response: data=response.read()
    if hashlib.sha256(data).hexdigest()!=HASHES[arch]: raise SystemExit('Archive checksum mismatch')
    with zipfile.ZipFile(io.BytesIO(data)) as archive:
        matches=[n for n in archive.namelist() if Path(n).name=='tunnel-client' and not n.endswith('/')]
        if len(matches)!=1: raise SystemExit('Unexpected release archive layout')
        binary=archive.read(matches[0])
    target.parent.mkdir(exist_ok=True);target.write_bytes(binary);target.chmod(0o700)
    print('Installed verified official tunnel-client',VERSION)
if __name__=='__main__':main()
