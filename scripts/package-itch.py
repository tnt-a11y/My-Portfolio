"""Package an existing Unity WebGL export for itch.io without altering its files."""
import argparse
import hashlib
import json
import pathlib
import zipfile

parser = argparse.ArgumentParser()
parser.add_argument('--build', required=True, type=pathlib.Path)
parser.add_argument('--output', required=True, type=pathlib.Path)
args = parser.parse_args()
build = args.build.resolve()
files = sorted(path for path in build.rglob('*') if path.is_file())
if not (build / 'index.html').is_file():
    raise SystemExit('The build must contain index.html at its root.')
if not 0 < len(files) <= 1000:
    raise SystemExit('Invalid HTML5 package file count.')
if any(path.stat().st_size > 200_000_000 for path in files):
    raise SystemExit('A file exceeds the itch.io HTML5 individual-file limit.')
if sum(path.stat().st_size for path in files) > 500_000_000:
    raise SystemExit('The build exceeds the itch.io HTML5 extracted-size limit.')
args.output.parent.mkdir(parents=True, exist_ok=True)
with zipfile.ZipFile(args.output, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
    for path in files:
        archive.write(path, path.relative_to(build).as_posix())
with zipfile.ZipFile(args.output) as archive:
    if archive.testzip() is not None or 'index.html' not in archive.namelist():
        raise SystemExit('ZIP integrity verification failed.')
receipt = {
    'source': str(build),
    'archive': str(args.output.resolve()),
    'bytes': args.output.stat().st_size,
    'sha256': hashlib.sha256(args.output.read_bytes()).hexdigest(),
    'files': [path.relative_to(build).as_posix() for path in files],
    'verified': True,
}
args.output.with_suffix('.receipt.json').write_text(json.dumps(receipt, indent=2), encoding='utf-8')
print(json.dumps(receipt, indent=2))
