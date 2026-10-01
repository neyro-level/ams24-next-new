# CR-12.1 Block and RichText Reachability Inventory

Status: Complete
Plan: AMS24-CONSTITUTION-REMEDIATION-2026 v3
Task: CR-12.1 — block/RichText inventory identifies reachable and speculative formats

## Decision

Only formats reachable from current validated content may be treated as runtime-supported. Formats that exist only in schema, registry or tests remain speculative until a real approved content consumer uses them.

This inventory does not add new blocks or a renderer contract. CR-12.2 owns the registry hardening and CR-12.3 owns the single RichText renderer contract.

## Reachable page blocks

Source: `src/project/content/local-content.ts` → `localContent.pages[*].blocks`.

| Block type | Reachability | Current consumer evidence | CR-12.1 status |
| --- | --- | --- | --- |
| `hero` | reachable | `/` page content graph contains the home hero block | supported by current schema/registry |
| `product-routes` | reachable | `/` page content graph references `impuls`, `pixel`, `zashchita` | supported by current schema/registry and graph refs |
| `lead-form-shell` | reachable | `/` page content graph contains `home-final-calc` intent | supported by current schema/registry |
| `rich-text` | not content-reachable | executable through `src/ui/blocks` and the canonical `RichText` renderer, but absent from `localContent.pages[*].blocks` | implemented and validation-safe; not claimed as visible page content until a page uses it |

## Reachable RichText kinds

Source: `src/project/content/local-content.ts` article and knowledge article bodies.

| RichText kind | Reachability | Current consumer evidence | CR-12.1 status |
| --- | --- | --- | --- |
| `markdown` | reachable | articles and knowledge articles use `body.format = "markdown"` | runtime-supported by `RichText` renderer |
| `lexical` | schema-only | present in `richTextSchema`, absent from real article/KB bodies | explicitly rejected until an approved Payload renderer exists |

## Renderer syntax reachable through Markdown

Source: `src/ui/content/rich-text.tsx` and real Markdown bodies.

| Syntax | Reachability | Rendering behavior |
| --- | --- | --- |
| paragraph text | reachable | rendered as `<p>` |
| `#`, `##`, `###` headings | reachable in renderer/tests; real content currently uses paragraph/links | rendered as `h2`/`h3`; `#` normalizes to `h2` |
| `- ` unordered list blocks | reachable in renderer/tests | rendered as `<ul><li>` |
| inline markdown links `[label](/path/)` or `https://` | reachable in real article/KB bodies | rendered as safe `<a>`; other hrefs degrade to `#` |
| raw HTML | rejected as executable behavior | React escapes it as text |

## Explicit speculative formats

Do not implement or claim these without a later approved content migration:

- Lexical JSON
- MDX / arbitrary JSX
- embedded components inside RichText
- tables
- images/media blocks
- quotes/callouts
- accordions
- custom CTA rows
- nested block arrays
- unknown block passthrough

## Guard

`tests/content/block-richtext-reachability.test.ts` protects this inventory by checking:

- reachable page block types in current content are exactly `hero`, `product-routes`, `lead-form-shell`;
- `rich-text` page block remains absent from live page content while its registry component is executable;
- reachable RichText body kinds in article/KB content are exactly `markdown`;
- speculative formats are documented and not present as live content kinds.
