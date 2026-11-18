# Outreach report and purge

`netlify/functions/report.js` serves `/track/report`. It reads the outreach open
counter from the `outreach-opens` blob store and can wipe it.

## Reading the report

The token is only accepted in an `Authorization` header. A URL token is refused,
because URLs end up in browser history, log files, screenshots and pasted
messages.

```sh
curl -H "Authorization: Bearer $TRACK_TOKEN" \
  "https://tomas.gorjux.net/track/report"
```

The old bookmark with `?token=` no longer works. That is deliberate. Keep the
token in a shell variable or a password manager, not in a URL. A browser
extension that sets a request header, or the command above, both work.

## Purging

Deleting needs a `POST` and the token in an `Authorization` header. The query
string is deliberately not enough, so a URL that leaks through browser history,
a log file or a pasted link cannot destroy the store:

```sh
curl -X POST \
  -H "Authorization: Bearer $TRACK_TOKEN" \
  "https://tomas.gorjux.net/track/report?purge=1"
```

A `GET` with `purge=1` is refused, with or without a token.

## Why it is built this way

The token used to sit only in the query string and a plain `GET` deleted every
record. The first repair stopped the destructive `GET` but still accepted the
same secret in a URL for reading, which meant a leaked URL still carried purge
authority. Since 18 November 2026 the query string is refused entirely and the
header is required for both reading and purging. Only the SHA-256 of the token is
stored in the function; the token itself is held privately.

Rotating the token is still outstanding: change the plaintext, replace
`TOKEN_SHA256` with the new digest, and redeploy.

Covered by `tests/report-auth.test.js`. Run with:

```sh
node --test "tests/*.test.js"
```
