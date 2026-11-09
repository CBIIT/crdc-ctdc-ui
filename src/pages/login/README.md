# CTDC Login Page Frontend

This directory implements the YAML-driven `/user/login` page. Editors update
`login/loginView.yaml` in the static-content repository; editor-facing schema
details live there:
[bento-ctdc-static-content/login/README.md](https://github.com/CBIIT/bento-ctdc-static-content/blob/develop/login/README.md).

## Files

| File | Purpose |
| --- | --- |
| `rasLoginController.js` | Builds the content URL, loads/parses YAML, resolves media paths, and applies fallbacks. |
| `rasLoginView.js` | Page shell and state owner for accordions, warning state, fallback banner, and video playback. |
| `rasLoginStyles.js` | Material UI layout and responsive styles. |
| `components/LoginSections.js` | Renders hero, section boxes, RAS button, accordions, warning, and Help panel. |
| `components/LoginMarkdownContent.js` | Structured `blocks` renderer and inline Bento token parser. |
| `components/contentStyles.js` | Top-level `styles` preset resolver shared by rendered YAML elements. |
| `components/ContentImage.js` | Adapter for YAML-defined image assets. |
| `components/ToggleHeader.js` | Shared keyboard-accessible accordion/toggle header. |
| `src/bento/loginData.js` | Login constants, fallback notice text, emergency content, and bundled asset mappings. |
| `src/assets/login/loginView.yaml` | Bundled fallback YAML used when remote static content cannot load. |

## Loading And Fallbacks

The remote content URL is:

```text
REACT_APP_STATIC_CONTENT_URL + /login/loginView.yaml
```

`rasLoginController.js` fetches YAML with `axios`, applies a 10-second timeout,
parses with `js-yaml`, verifies the result is an object, and resolves asset and
video URLs relative to the loaded YAML file.

Fallback order:

1. Remote static-content YAML.
2. Bundled fallback YAML from `src/assets/login/loginView.yaml`.
3. `EMERGENCY_LOGIN_CONTENT` from `src/bento/loginData.js`.

When fallback content is used, the page shows a full-width dismissible banner.
Login still works when `REACT_APP_RAS_AUTHORIZE_URL` is configured.

## Render Contract

`RASLoginPage` renders:

1. Fallback banner, when content loading failed.
2. `hero`.
3. Left-column `sections`.
4. `warning` below the left column.
5. Right-column `help`.

Supported section types are `rasLogin` and `contentBox`; unknown types are
ignored. Both section types share the same layout. The only special `rasLogin`
behavior is the first valid `rasButton` block, which renders the RAS login
button beside that text group on desktop and below it on smaller screens.

`LoginSections.js` keeps section `blocks` in YAML order:

| YAML item | Render behavior |
| --- | --- |
| Plain block entries | Batched into one text area. |
| `- blocks:` entries | Render as separate text areas; optional section-level `title` becomes a subsection title. |
| `- accordions:` entries | Render as shared accordion rows. |

Warning and Help content use the same block parser as sections. Help subareas
render in YAML key order after the fixed Help header.

## Parser Notes

`LoginMarkdownContent.js` is not a full Markdown renderer. It supports the
About-page-style block vocabulary documented in the static-content README:
`blocks`, `paragraph`, `span`, `listWithDots`, `listWithNumbers`,
`listWithAlphabets`, `listWithLetters`, and `table`.

Important implementation behavior:

- Unknown or malformed block entries return `null` instead of crashing the page.
- Nested `blocks` groups work anywhere a `blocks` array is accepted.
- Only section-level `- blocks:` groups render an optional group `title`.
- `span` renders inline text only; it cannot contain nested blocks or lists.
- Inline content uses Bento `$$...$$` tokens, not full Markdown.

## Links, Buttons, And Styles

Inline links and contact button hrefs share the safe-link allowlist:
HTTP/HTTPS, `mailto:`, `tel:`, hash links, root-relative links, dot-relative
links, and simple relative paths. Unsupported schemes such as `javascript:`,
`data:`, `file:`, `blob:`, and `ftp:` are not rendered as links.

The RAS button URL is never read from YAML. It comes from
`REACT_APP_RAS_AUTHORIZE_URL` and must be an absolute `http://` or `https://`
URL. Missing, unresolved, relative, or invalid values disable the button and
show the unavailable message.

Top-level YAML `styles` are resolved by `contentStyles.js` and applied as React
inline styles. Style references can be a preset name, an array of preset names,
or an inline style object.

## Asset Resolution

Remote YAML assets are resolved relative to the loaded YAML URL. With:

```text
REACT_APP_STATIC_CONTENT_URL=https://raw.githubusercontent.com/CBIIT/bento-ctdc-static-content/refs/heads/develop
```

`assets/lock-icon.svg` resolves to:

```text
https://raw.githubusercontent.com/CBIIT/bento-ctdc-static-content/refs/heads/develop/login/assets/lock-icon.svg
```

Bundled fallback assets use the same `assets/...` paths and are mapped in
`BUNDLED_LOGIN_ASSETS`. The external-link icon is imported from
`src/assets/externalLinkIcon.svg`.

## Tests

Focused login coverage:

| Test | Coverage |
| --- | --- |
| `rasLoginController.test.js` | Content URL, YAML parsing, asset normalization, fallback behavior, error notices. |
| `rasLoginView.test.js` | Page rendering, section order, RAS button behavior, accordions, warning/help rendering. |
| `components/LoginMarkdownContent.test.js` | Blocks, inline tokens, links, lists, tables, edge cases. |

Run:

```bash
CI=true node scripts/test.js --runTestsByPath \
  src/pages/login/rasLoginController.test.js \
  src/pages/login/rasLoginView.test.js \
  src/pages/login/components/LoginMarkdownContent.test.js \
  --watchAll=false
```

## Developer Checklist

- Keep editor-facing YAML rules in the static-content login README.
- Keep `src/assets/login/loginView.yaml` synced with content repo `login/loginView.yaml`.
- Keep fallback constants and bundled asset mappings in `src/bento/loginData.js`.
- Cover parser, link safety, style, or fallback changes with focused tests.
- Keep `/user/login` usable when remote static content fails.
