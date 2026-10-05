# CTDC Login Page Frontend

This directory implements the YAML-driven `/user/login` page. Content editors
update `login/loginView.yaml` in the static-content repository; this frontend
loads that YAML, resolves media paths, and renders the page.

Editor-facing YAML instructions live in the static-content repository at `bento-ctdc-static-content/login/README.md`:
[bento-ctdc-static-content/login/README.md](https://github.com/CBIIT/bento-ctdc-static-content/blob/develop/login/README.md).
Keep that guide aligned when changing supported YAML behavior here.

## Files

| File | Purpose |
| --- | --- |
| `rasLoginController.js` | Builds the content URL, loads/parses YAML, resolves assets, and falls back when loading fails. |
| `rasLoginView.js` | Page shell and state owner for accordions, warning open state, fallback banner, and video playback. |
| `rasLoginStyles.js` | Material UI styles for layout, typography, boxes, accordions, buttons, warning, help, and responsive behavior. |
| `components/LoginSections.js` | Renders hero, section boxes, RAS button, accordions, warning notice, and Help panel. |
| `components/LoginMarkdownContent.js` | Structured `blocks` renderer and inline Bento token parser. |
| `components/ContentImage.js` | Adapter for YAML-defined image assets. Missing image assets render as `null`. |
| `components/ToggleHeader.js` | Shared keyboard-accessible accordion/toggle header. |
| `src/bento/loginData.js` | Login constants, fallback notice text, emergency content, and bundled asset mappings. |
| `src/assets/login/loginView.yaml` | Bundled fallback YAML used when remote static content cannot load. |

## Content Loading

The remote content URL is:

```text
REACT_APP_STATIC_CONTENT_URL + /login/loginView.yaml
```

`LOGIN_CONTENT_PATH` defines the `/login/loginView.yaml` suffix. The controller
fetches YAML with `axios`, applies a 10-second timeout, parses it with
`js-yaml`, verifies the parsed value is an object, and resolves asset/video URLs
relative to the loaded YAML file.

Fallback order:

1. Remote static-content YAML.
2. Bundled fallback YAML from `src/assets/login/loginView.yaml`.
3. `EMERGENCY_LOGIN_CONTENT` from `src/bento/loginData.js`.

When fallback content is used, the page shows a full-width dismissible banner.
Login can still work if `REACT_APP_RAS_AUTHORIZE_URL` is configured.

## Asset Resolution

Remote YAML assets are resolved relative to the loaded YAML URL:

```yaml
assets:
  lockIcon:
    src: assets/lock-icon.svg
```

With:

```text
REACT_APP_STATIC_CONTENT_URL=https://raw.githubusercontent.com/CBIIT/bento-ctdc-static-content/refs/heads/develop
```

the asset resolves to:

```text
https://raw.githubusercontent.com/CBIIT/bento-ctdc-static-content/refs/heads/develop/login/assets/lock-icon.svg
```

Bundled fallback assets use the same `assets/...` paths and are mapped in
`BUNDLED_LOGIN_ASSETS`. The external-link icon is imported from the shared root
asset at `src/assets/externalLinkIcon.svg`.

## Render Contract

`RASLoginPage` renders:

1. Fallback banner, if content loading failed.
2. `hero`.
3. Left-column `sections`.
4. `warning` below the left column.
5. Right-column `help`.

Supported section types are `rasLogin` and `contentBox`. Unknown section types
are ignored.

Each section uses one ordered `blocks` array. `LoginSections.js` converts that
array into render items:

| YAML item | Render behavior |
| --- | --- |
| Plain block entries | Batched into one text area. |
| `- blocks:` entries | Render as separate text areas; optional `title` becomes a subsection title. |
| `- accordions:` entries | Render as styled accordion rows. |

`rasLogin` and `contentBox` share the same layout. The only special `rasLogin`
behavior is the first valid `rasButtonText` block, which renders the RAS button
beside that text group on desktop and below it on smaller screens.

## Parser Summary

`LoginMarkdownContent.js` is not a full Markdown renderer. It supports the CTDC
About-page-style block vocabulary used by `login/loginView.yaml`:

| Block | Output |
| --- | --- |
| `paragraph` | Paragraph text with inline token parsing. |
| `listWithDots` | Bulleted list. |
| `listWithNumbers` | Numbered list. |
| `listWithAlphabets` | Lower-alpha ordered list. |
| `listWithLetters` | Alias for lower-alpha ordered list. |
| `table` | About-style table. |

List items can be strings or objects with `text` plus nested list keys. Unknown
or malformed block entries return `null` so optional content does not crash the
page.

Inline content supports Bento `$$...$$` tokens such as bold/title text,
headings, italic text, email/text emphasis, indented text, spacing, links, and
download links. Plain Markdown-style links or emphasis are displayed literally
unless wrapped in supported Bento tokens.

## Links And Buttons

Inline links and contact button hrefs use the same safe-link allowlist:
absolute `http://` and `https://`, `mailto:`, `tel:`, hash links,
root-relative links, dot-relative links, and simple relative paths without a
scheme. Raw email addresses in Bento links become `mailto:` links.

Protocol-relative URLs and unsupported schemes such as `javascript:`, `data:`,
`file:`, `blob:`, and `ftp:` are not rendered as links. External HTTP/HTTPS
links show the outbound icon by default. Same-origin, relative, hash,
`mailto:`, `tel:`, and `target:_self` links do not show the icon.

The RAS button URL is never read from YAML. It comes from
`REACT_APP_RAS_AUTHORIZE_URL` and must be an absolute `http://` or `https://`
URL. Missing, unresolved, relative, or invalid values disable the button and
show the configured unavailable message.

RAS logout is currently hardcoded in `injectEnv.js` through
`conf/inject.template.js`:
`https://authtest.nih.gov/siteminderagent/raslogout.asp?target=https://clinical-dev.datacommons.cancer.gov`.
The target CTDC return URL must be whitelisted by RAS.

## Warning And Help

Warning content uses the same `blocks` parser as sections. `collapsible`
defaults to `true`; `defaultOpen` defaults to `false`.

The Help panel supports `blocks`, `tutorial`, and `contact`. Those subareas
render in YAML key order after the fixed Help header. `help.ariaLabel` defaults
to `Help and Support`; `tutorial.playButtonAriaLabel` defaults to
`Play tutorial video`; new-tab contact buttons default to
`rel="noopener noreferrer"` unless YAML provides `rel`.

## Tests

Login coverage lives beside the implementation:

| Test | Coverage |
| --- | --- |
| `rasLoginController.test.js` | Content URL, YAML parsing, asset normalization, fallbacks, error notices. |
| `rasLoginView.test.js` | Page rendering, section order, RAS button behavior, accordions, warning/help rendering. |
| `components/LoginMarkdownContent.test.js` | Blocks, inline tokens, links, lists, tables, edge cases. |

Focused command:

```bash
CI=true node scripts/test.js --runTestsByPath \
  src/pages/login/rasLoginController.test.js \
  src/pages/login/rasLoginView.test.js \
  src/pages/login/components/LoginMarkdownContent.test.js \
  --watchAll=false
```

## Developer Checklist

- Keep editor-facing YAML rules in sync with the static-content login README.
- Keep supported section types explicit.
- Keep fallback constants and bundled asset mappings in `src/bento/loginData.js`.
- Cover parser or fallback behavior changes with focused tests.
- Keep `/user/login` usable when remote static content fails.
