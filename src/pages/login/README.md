# CTDC Login Page Frontend

This directory implements the YAML-driven `/user/login` page. The editable
content lives in the static-content repository at `login/loginView.yaml`; the
frontend loads that YAML, normalizes asset paths, and renders the page through
React components.

For content editor instructions, see the static-content guide:

```text
bento-ctdc-static-content/login/README.md
```

This README documents the frontend implementation and how the YAML parser is
interpreted by the UI.

## File Structure

| File | Purpose |
| --- | --- |
| `rasLoginController.js` | Loads `login/loginView.yaml`, parses YAML, resolves assets, and provides fallback content when loading fails. |
| `rasLoginView.js` | Page shell. Owns UI state for section accordions, warning notice open state, and tutorial video playback. |
| `rasLoginStyles.js` | Material UI style object for layout, typography, accordions, warning/help panels, buttons, and responsive behavior. |
| `components/LoginSections.js` | Renders hero, section boxes, RAS button, accordions, warning notice, and Help sidebar. |
| `components/LoginMarkdownContent.js` | Structured block parser/renderer for `blocks` arrays and inline Bento tokens. |
| `components/ContentImage.js` | Small image adapter for YAML-defined assets. Missing assets render as `null`. |
| `components/ToggleHeader.js` | Shared keyboard-accessible accordion/toggle header. |
| `src/bento/loginData.js` | Central login constants, bundled fallback content, fallback notice text, and bundled asset mappings. |
| `src/assets/login/loginView.yaml` | Bundled fallback copy used if remote static content cannot load. |

## Data Loading Flow

The page content source is:

```text
REACT_APP_STATIC_CONTENT_URL + /login/loginView.yaml
```

The path suffix comes from `LOGIN_CONTENT_PATH` in `src/bento/loginData.js`.

Load flow:

1. `RASLoginController` builds the remote YAML URL from
   `REACT_APP_STATIC_CONTENT_URL`.
2. It fetches the YAML with `axios`.
3. It parses the response with `js-yaml`.
4. It validates that the parsed result is a YAML object.
5. It resolves asset paths and tutorial video URLs.
6. It passes the normalized payload to `RASLoginPage`.

If the static-content URL is missing, unresolved, unavailable, invalid YAML, or
not a YAML object, the controller loads the bundled fallback YAML from
`src/assets/login/loginView.yaml`. If that also fails, it renders
`EMERGENCY_LOGIN_CONTENT`.

The page displays a full-width, dismissible one-line banner at the top when
fallback content is used. Login can still work as long as
`REACT_APP_RAS_AUTHORIZE_URL` is configured.

## Asset Resolution

Remote YAML assets are resolved relative to the loaded YAML URL.

Example static-content YAML:

```yaml
assets:
  lockIcon:
    src: assets/lock-icon.svg
```

With `REACT_APP_STATIC_CONTENT_URL=https://raw.githubusercontent.com/CBIIT/bento-ctdc-static-content/refs/heads/develop/`,
that asset resolves from:

```text
https://raw.githubusercontent.com/CBIIT/bento-ctdc-static-content/refs/heads/develop/login/assets/lock-icon.svg
```

The bundled fallback YAML mirrors the same `assets/...` paths, but the frontend
fallback assets are imported from `src/assets/login` and mapped in
`BUNDLED_LOGIN_ASSETS`. The external-link icon uses the shared root asset:

```js
"assets/externalLinkIcon.svg": externalLinkIconAsset
```

## Render Flow

`RASLoginPage` renders these top-level regions:

1. Full-width dismissible fallback/error banner, if content loading failed.
2. Hero from `hero`.
3. Left-column `sections`.
4. `warning` notice below left-column sections.
5. Right-column `help` panel.

Supported section types are explicit in `rasLoginView.js`:

```js
["rasLogin", "contentBox"]
```

Unknown section types are ignored by the frontend instead of crashing the page.

## Supported YAML Areas

Top-level fields:

| Field | Frontend behavior |
| --- | --- |
| `page` | Metadata for indexing/content ownership. The renderer does not route from this value. |
| `title` | Metadata for indexing/content ownership. The visible page title comes from `hero.title`. |
| `assets` | Image/icon definitions used by hero, Help panel, accordions, video, and outbound links. |
| `hero` | Hero title and lock imagery. |
| `sections` | Repeatable left-column cards. |
| `warning` | Toggleable warning panel under the left column. |
| `help` | Right-side Help panel with optional generic blocks, tutorial, and contact sections. |

## Sections

Each supported section uses one `blocks` array. The frontend converts that list
into render items:

- Plain blocks are grouped together into one text area.
- Nested `blocks` entries render as separate text areas.
- `accordions` entries render as accordion groups.

Example:

```yaml
sections:
  - id: request-access
    type: contentBox
    title: Request Access
    blocks:
      - paragraph: "Intro text."
      - blocks:
          - paragraph: "Separate grouped text."
      - accordions:
          - title: Details
            blocks:
              - paragraph: "Accordion body."
```

Do not repeat the section-level `blocks:` key. YAML duplicate keys can fail
parsing or drop content.

## RAS Login Button

Only `type: rasLogin` sections can render the RAS login button. The button
label comes from a block-level `rasButtonText`.

```yaml
sections:
  - id: ras-login
    type: rasLogin
    blocks:
      - blocks:
          - paragraph: "Before accessing CTDC data..."
          - rasButtonText: Login with RAS
```

The RAS button URL is not stored in YAML. It comes from:

```text
REACT_APP_RAS_AUTHORIZE_URL
```

If the URL is missing, empty, unresolved, or not HTTP/HTTPS, the button is
disabled and the user sees the configured unavailable message.

## Accordions

Accordion rows are configured inside a section `blocks` list:

```yaml
blocks:
  - accordions:
      - title: How to sign in
        defaultOpen: true
        blocks:
          - listWithNumbers:
              - "Begin from the CTDC login page."
```

Supported accordion options:

| Field | Behavior |
| --- | --- |
| `title` | Accordion header text. |
| `blocks` | Accordion body content. |
| `collapsible` | Defaults to `true`. Set `false` for always-visible content. |
| `defaultOpen` | Defaults to `false`. Set `true` to initially open a collapsible accordion. |

Accordion state is section-scoped in `rasLoginView.js`, so accordions can be
reordered in YAML without affecting other sections.

## Warning Notice

The `warning` area supports the same `blocks` parser and the same open-state
options as accordions:

```yaml
warning:
  title: Warning Notice
  defaultOpen: true
  blocks:
    - paragraph: "Warning text."
```

If `collapsible: false`, the warning content is always visible and
`defaultOpen` is ignored.

## Help Panel

The Help panel supports these subareas:

- `blocks`
- `tutorial`
- `contact`

The frontend preserves YAML key order for those subareas after the fixed Help
header. That allows editors to move generic Help copy before or after tutorial
and contact content.

Tutorial support includes:

- `tutorial.title`
- `tutorial.blocks`
- `tutorial.videoUrl`
- `tutorial.playButtonAriaLabel`
- `videoThumbnail` and `playIcon` assets

Contact support includes:

- `contact.title`
- `contact.blocks`
- `contact.buttonText`
- `contact.href`
- `contact.target`
- `contact.rel`

New-tab contact buttons default to `rel="noopener noreferrer"` unless `rel` is
provided.

## Block Parser

`LoginMarkdownContent.js` renders structured `blocks` arrays. Despite the file
name, this is not a full Markdown parser. It supports the CTDC About-page block
format and inline Bento `$$...$$` tokens.

Supported block keys:

| Block key | Output |
| --- | --- |
| `paragraph` | Paragraph text with inline token parsing. |
| `listWithDots` | Bulleted list. |
| `listWithNumbers` | Numbered list. |
| `listWithAlphabets` | Lower-alpha ordered list. |
| `listWithLetters` | Alias for lower-alpha ordered list. |
| `table` | About-style table. |

Unknown block keys return `null` so malformed optional content does not crash
the login page.

## Lists And Nested Lists

List items may be strings or objects.

String item:

```yaml
- listWithDots:
    - "First item"
```

Object item with nested list:

```yaml
- listWithAlphabets:
    - text: "One of the following valid IDs:"
      listWithDots:
        - "U.S. driver's license"
        - "State-issued ID"
```

Nested list keys supported in list items:

- `listWithDots`
- `listWithNumbers`
- `listWithAlphabets`
- `listWithLetters`
- `blocks`

## Inline Tokens

Inline content supports Bento-style `$$...$$` tokens:

| Token | Output |
| --- | --- |
| `$$*text*$$` | Bold/title style. |
| `$$#text#$$` | Heading style. |
| `$$~text~$$` | First-title style. |
| `$$!text!$$` | Italic style. |
| `$$@text@$$` | Email/text emphasis style. |
| `$$>text>$$` | Indented text style. |
| `$$%space%$$` | Vertical spacing block or inline line break. |
| `$$[label](https://example.org)$$` | Link. |

Download links use the Bento download object inside a paragraph or list item:

```yaml
- paragraph: "$${link:https://example.org/file.pdf,title:Download}$$"
```

Use Bento-style tokens for inline links and emphasis. Plain Markdown-style
`[Label](https://example.org)`, `**bold**`, and `*italic*` text is displayed
literally unless it is wrapped in a supported `$$...$$` token.

## Link Behavior

Link parsing happens in `LoginMarkdownContent.js`.

Supported forms:

```yaml
- paragraph: "$$[External](https://example.org)$$"
- paragraph: "$$[Internal](url:/#/request-access target:_self)$$"
- paragraph: "$$[Email](NCICRDC@mail.nih.gov)$$"
- paragraph: "$${link:https://example.org/file.pdf,title:Download}$$"
```

Outbound icon rules:

- External HTTP/HTTPS links show the outbound icon by default.
- Same-origin, relative, hash, `mailto:`, and `tel:` links do not show the icon.
- `target:_self` suppresses the icon.

`type: internal` is not required. Behavior is determined from URL and target.

## Error Handling

The page is designed so static content failure does not block authentication.

Handled failure cases:

- Missing `REACT_APP_STATIC_CONTENT_URL`.
- Unresolved template value such as `${REACT_APP_STATIC_CONTENT_URL}`.
- Failed remote request.
- YAML parse error.
- Parsed YAML is not an object.
- Bundled fallback YAML fails to load.
- Missing image assets.
- Unknown section types.
- Unknown block keys.
- Missing or invalid `REACT_APP_RAS_AUTHORIZE_URL`.

Fallback order:

1. Remote static content.
2. Bundled fallback YAML from `src/assets/login/loginView.yaml`.
3. `EMERGENCY_LOGIN_CONTENT`.

When fallback content is used, the UI shows a full-width dismissible
non-technical banner controlled by constants in `src/bento/loginData.js`.

## Tests

Login coverage lives beside the implementation:

| Test | Coverage |
| --- | --- |
| `rasLoginController.test.js` | URL construction, YAML parsing, asset normalization, fallback content, error notices. |
| `rasLoginView.test.js` | Page rendering, section order, RAS button behavior, accordions, warning/help rendering. |
| `components/LoginMarkdownContent.test.js` | Block parser, inline tokens, links, lists, tables, edge cases. |

Useful focused command:

```bash
CI=true node scripts/test.js --runTestsByPath \
  src/pages/login/rasLoginController.test.js \
  src/pages/login/rasLoginView.test.js \
  src/pages/login/components/LoginMarkdownContent.test.js \
  --watchAll=false
```

## Developer Checklist

When changing the login implementation:

- Keep YAML editing rules aligned with `bento-ctdc-static-content/login/README.md`.
- Keep supported section types explicit in `rasLoginView.js`.
- Keep content/schema constants in `src/bento/loginData.js`.
- Keep parser changes covered in `LoginMarkdownContent.test.js`.
- Keep fallback behavior graceful so `/user/login` can still render if remote
  content fails.
- Do not place new editor-facing content directly in React components unless it
  is true emergency fallback content.
