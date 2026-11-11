#!/usr/bin/env bash
# Publication scan for the public site tree. Fails when a text file contains
# an account identifier, an ARN, an AWS host name, an email address or an
# external URL outside the allowlist. Extra terms to refuse (for example
# people's names or logins) are read from the FORBIDDEN_TERMS environment
# variable, a pipe-separated list, so they never need to be written in the repo.
set -u
cd "$(dirname "$0")/.."
fail=0
scan() {
  local label="$1" pattern="$2" flags="${3:-}" hits
  hits=$(grep -rIEn $flags --exclude-dir=.git --exclude-dir=_site -e "$pattern" . | grep -v '^./scripts/publication-scan.sh:' || true)
  if [ -n "$hits" ]; then
    echo "FAIL: $label"; echo "$hits" | head -20; fail=1
  else
    echo "ok:   $label"
  fi
}
scan "12-digit account identifiers" '(^|[^0-9A-Za-z._#-])[0-9]{12}([^0-9]|$)'
scan "ARNs" 'arn:aws'
scan "AWS host names" 'amazonaws\.com|\.aws\.amazon\.com|\.execute-api\.'
scan "email addresses" '[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}'
if [ -n "${FORBIDDEN_TERMS:-}" ]; then
  scan "forbidden terms (names, logins)" "\\b($FORBIDDEN_TERMS)\\b" -i
fi
# External URLs: only the organization, the SVG namespace and the diagrams tool FAQ are allowed.
urls=$(grep -rIEoh --exclude-dir=.git --exclude-dir=_site 'https?://[A-Za-z0-9./_-]+' . | sort -u \
  | grep -Ev '^https?://(github\.com/aroma-pacifico(/|$)|www\.w3\.org/|www\.drawio\.com/|www\.conventionalcommits\.org/|localhost$)' | grep -Ev '^https:///s/X+' || true)
if [ -n "$urls" ]; then echo "FAIL: external URLs outside the allowlist"; echo "$urls" | head -20; fail=1; else echo "ok:   external URLs"; fi
exit "$fail"
