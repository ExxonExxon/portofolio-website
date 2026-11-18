# Outreach report and purge

`netlify/functions/report.js` serves `/track/report`. It reads the outreach open
counter from the `outreach-opens` blob store and can wipe it.

## Reading the report

Open the report URL with the token in the query string:

```text
https://tomas.gorjux.net/track/report?token=<token>
```

Reading works with a `GET` and accepts the token in the query string, because a
hand-opened bookmark is the normal way to look at it.

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
record. That put a destructive action one click, prefetch or shared link away,
and left the credential in every access log. Only the SHA-256 of the token is
stored in the function; the token itself is held privately.

Covered by `tests/report-auth.test.js`. Run with:

```sh
node --test "tests/*.test.js"
```
