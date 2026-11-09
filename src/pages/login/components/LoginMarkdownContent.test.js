/**
 * Unit coverage for the login block renderer and supported About-style tokens.
 * This protects the editable YAML schema without depending on the full page.
 */
import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import LoginMarkdownContent from "./LoginMarkdownContent";

const classes = {
  BodyText: "body-text",
  inlineText: "inline-text",
  MarkdownContent: "markdown-content",
  unorderedList: "unordered-list",
  orderedListNumeric: "ordered-list-numeric",
  orderedListAlpha: "ordered-list-alpha",
  Link: "login-link",
  linkIcon: "link-icon",
  title: "title-token",
  space: "space-token",
  head: "head-token",
  firstTitle: "first-title-token",
  italicizeText: "italic-token",
  email: "email-token",
  indentedText: "indented-token",
  nestedListOnlyItem: "nested-list-only-item",
  tableDiv: "table-div",
  table: "table",
  tableHeader: "table-header",
  tableBodyRow: "table-body-row",
  headerCell: "header-cell",
  tableCell: "table-cell",
};

const linkIcon = {
  src: "/external-link.svg",
  alt: "External link",
};

const downloadToken = [
  "$$",
  "{link:https://example.org/download.pdf,title:Download Guide}$$",
].join("");

const representativeAboutPageContent = [
  {
    paragraph: "$$~Data Access~$$",
  },
  {
    paragraph: "     ",
  },
  {
    paragraph:
      "The CTDC hosts data with varying access requirements, allowing researchers to work with a wide range of data across studies while also protecting participant privacy. Visit our $$[Request Access](type:internal url:/#/request-access target:_self )$$ page for more details.",
  },
  {
    paragraph: "$$#CTDC GUI#$$",
  },
  {
    paragraph:
      "A $$[GraphQL API](type:internal url:/#/graphql target:_self)$$ enables querying of the entire data model.",
  },
  {
    paragraph:
      "$$>1>$$. Clinical and Translational Data Commons, including URL ($$[clinical.datacommons.cancer.gov](type:internal url:/#/ target:_self )$$)",
  },
  {
    paragraph:
      "$$!\"The results published here are derived from analysis of data found within CTDC.\"!$$",
  },
  {
    paragraph:
      "$$*Alignment to F.A.I.R data principles*$$ - The CTDC adheres to Findable, Accessible, Interoperable, and Reusable ($$[FAIR](https://www.go-fair.org/fair-principles/)$$) principles.",
  },
  {
    listWithDots: [
      "$$*Clinical*$$: CSV, JSON, or XML",
      "$$*Reports:*$$ PDF",
    ],
  },
];

describe("LoginMarkdownContent", () => {
  let container;

  const renderContent = (props) => {
    act(() => {
      ReactDOM.render(
        <LoginMarkdownContent
          classes={classes}
          linkIcon={linkIcon}
          {...props}
        />,
        container,
      );
    });
  };

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
    document.body.removeChild(container);
    container = null;
  });

  it("renders nothing when structured content is missing", () => {
    renderContent({});

    expect(container.textContent).toBe("");
  });

  it("renders About-style inline text tokens", () => {
    renderContent({
      blocks: [
        {
          paragraph:
            "Tokens $$*bold text*$$ $$@support@example.org@$$ $$#Subheading#$$ $$~First title~$$ $$!italic text!$$ $$>Indented text>$$ line$$%space%$$break.",
        },
        {
          paragraph: "$$%space%$$",
        },
      ],
    });

    expect(container.querySelector(".title-token").textContent).toBe(
      "bold text",
    );
    expect(container.querySelector(".email-token").textContent).toBe(
      "support@example.org",
    );
    expect(container.querySelector(".head-token").textContent).toBe(
      "Subheading",
    );
    expect(container.querySelector(".first-title-token").textContent).toBe(
      "First title",
    );
    expect(container.querySelector(".italic-token").textContent).toBe(
      "italic text",
    );
    expect(container.querySelector(".indented-token").textContent).toBe(
      "Indented text",
    );
    expect(container.querySelector("br")).not.toBeNull();
    expect(container.querySelector(".space-token")).not.toBeNull();
  });

  it("renders About-style links, same-tab links, mail links, and download links", () => {
    const sameOriginUrl = `${window.location.origin}/same-origin`;
    const hasOutboundIcon = (link) =>
      Boolean(
        link.nextElementSibling &&
          link.nextElementSibling.className === "link-icon",
      );

    renderContent({
      blocks: [
        {
          paragraph:
            `$$[External](https://example.org)$$ $$[Same tab](target:_self url:/same-page)$$ $$[Internal route](/#/graphql)$$ $$[Same origin](${sameOriginUrl})$$ $$[Typed link](type:internal url:https://example.org/typed-link target:_blank)$$ $$[Configured](url:[https://example.org/configured] target:[_blank])$$ $$(person@example.org)[Email link]$$ $$(https://example.org/user@example.org)[At URL]$$ ` +
            downloadToken,
        },
      ],
    });

    const externalLink = container.querySelector('a[href="https://example.org"]');
    expect(externalLink.className).toBe("login-link");
    expect(externalLink.getAttribute("target")).toBe("_blank");
    expect(externalLink.getAttribute("rel")).toBe("noopener noreferrer");
    expect(hasOutboundIcon(externalLink)).toBe(true);

    const sameTabLink = container.querySelector('a[href="/same-page"]');
    expect(sameTabLink.getAttribute("target")).toBe("_self");
    expect(sameTabLink.getAttribute("rel")).toBeNull();
    expect(hasOutboundIcon(sameTabLink)).toBe(false);

    const internalRouteLink = container.querySelector('a[href="/#/graphql"]');
    expect(internalRouteLink).not.toBeNull();
    expect(hasOutboundIcon(internalRouteLink)).toBe(false);

    const sameOriginLink = container.querySelector(`a[href="${sameOriginUrl}"]`);
    expect(sameOriginLink).not.toBeNull();
    expect(hasOutboundIcon(sameOriginLink)).toBe(false);

    const typedLink = container.querySelector(
      'a[href="https://example.org/typed-link"]',
    );
    expect(typedLink).not.toBeNull();
    expect(hasOutboundIcon(typedLink)).toBe(true);

    const configuredLink = container.querySelector(
      'a[href="https://example.org/configured"]',
    );
    expect(configuredLink).not.toBeNull();
    expect(hasOutboundIcon(configuredLink)).toBe(true);

    const mailLink = container.querySelector(
      'a[href="mailto:person@example.org"]',
    );
    expect(mailLink).not.toBeNull();
    expect(hasOutboundIcon(mailLink)).toBe(false);

    expect(container.querySelector(
      'a[href="https://example.org/user@example.org"]',
    )).not.toBeNull();
    expect(container.querySelector('a[href^="mailto:"]')).toBe(mailLink);

    const downloadLink = container.querySelector(
      'a[href="https://example.org/download.pdf"]',
    );
    expect(downloadLink.textContent).toBe("Download Guide");
    expect(hasOutboundIcon(downloadLink)).toBe(false);

    expect(container.querySelectorAll(".link-icon")).toHaveLength(4);
  });

  it("does not render unsafe or protocol-relative links", () => {
    renderContent({
      blocks: [
        {
          paragraph:
            "$$[Unsafe](javascript:alert(1))$$ $$[Data](data:text/plain,test)$$ $$[Protocol relative](//other.example/path)$$",
        },
        {
          paragraph: "$$[Request access](/request-access)$$",
        },
        {
          paragraph: [
            "$$",
            "{link:javascript:alert(1),title:Unsafe download}",
            "$$",
          ].join(""),
        },
      ],
    });

    expect(container.querySelector('a[href^="javascript:"]')).toBeNull();
    expect(container.querySelector('a[href^="data:"]')).toBeNull();
    expect(container.querySelector('a[href^="//"]')).toBeNull();
    expect(container.querySelector('a[href="/request-access"]')).not.toBeNull();
  });

  it("applies content style presets to spans, blocks, links, lists, and tables", () => {
    renderContent({
      stylePresets: {
        paragraphBase: {
          marginBottom: "10px",
        },
        paragraphStyle: {
          fontWeight: 700,
          position: "absolute",
        },
        spanStyle: {
          color: "purple",
          fontWeight: 600,
        },
        emphasisLink: {
          color: "blue",
          textDecoration: "underline",
          fontWeight: 700,
        },
        externalIcon: {
          color: "green",
        },
        groupStyle: {
          paddingTop: "9px",
          backgroundColor: "rgb(240, 248, 250)",
        },
        listStyle: {
          marginTop: "12px",
        },
        listItemStyle: {
          fontStyle: "italic",
        },
        tableStyle: {
          paddingTop: "4px",
        },
        cellStyle: {
          fontWeight: 700,
        },
      },
      blocks: [
        {
          paragraph: {
            text:
              "Styled $$[Help](url:https://help.id.me/hc/en-us style:emphasisLink externalIconStyle:externalIcon)$$ " +
              "$$[Docs](url:https://example.org/docs style:emphasisLink)$$ $$" +
              "{link:https://example.org/download.pdf,title:Download,style:emphasisLink}$$",
            style: ["paragraphBase", "paragraphStyle"],
          },
        },
        {
          span: {
            text: "Inline $$*span*$$ text ",
            style: "spanStyle",
          },
        },
        {
          span: "after span",
        },
        {
          style: "groupStyle",
          blocks: [
            {
              paragraph: {
                text: "Grouped paragraph",
                style: "paragraphStyle",
              },
            },
            {
              span: " grouped span",
            },
          ],
        },
        {
          listWithDots: [
            {
              text: "Styled list item",
              style: "listItemStyle",
            },
          ],
          style: "listStyle",
        },
        {
          table: [
            {
              head: [
                {
                  text: "Styled Header",
                  style: "cellStyle",
                },
              ],
            },
            {
              body: [
                {
                  row: [
                    {
                      text: "Styled Cell",
                      style: "cellStyle",
                    },
                  ],
                },
              ],
            },
          ],
          style: "tableStyle",
        },
      ],
    });

    const paragraph = container.querySelector("p.body-text");
    expect(paragraph.style.fontWeight).toBe("700");
    expect(paragraph.style.marginBottom).toBe("10px");
    expect(paragraph.style.position).toBe("absolute");
    expect(container.querySelector(".inline-text").style.color).toBe("purple");
    expect(container.querySelector(".inline-text").style.fontWeight).toBe("600");
    expect(container.textContent).toContain("Inline span text after span");

    const styledGroup = Array.from(container.querySelectorAll("div")).find(
      (element) => element.style.paddingTop === "9px",
    );
    expect(styledGroup).not.toBeUndefined();
    expect(styledGroup.style.backgroundColor).toBe("rgb(240, 248, 250)");
    expect(styledGroup.textContent).toContain("Grouped paragraph grouped span");

    const helpLink = container.querySelector(
      'a[href="https://help.id.me/hc/en-us"]',
    );
    expect(helpLink.style.textDecoration).toBe("underline");
    expect(helpLink.style.fontWeight).toBe("700");
    expect(helpLink.style.color).toBe("blue");
    expect(helpLink.nextElementSibling.style.backgroundColor).toBe("green");

    const docsLink = container.querySelector(
      'a[href="https://example.org/docs"]',
    );
    expect(docsLink.nextElementSibling.style.backgroundColor).toBe("blue");

    const downloadLink = container.querySelector(
      'a[href="https://example.org/download.pdf"]',
    );
    expect(downloadLink.style.textDecoration).toBe("underline");

    expect(container.querySelector("ul").style.marginTop).toBe("12px");
    expect(container.querySelector("li").style.fontStyle).toBe("italic");
    expect(container.querySelector(".table-div").style.paddingTop).toBe("4px");
    expect(container.querySelectorAll("th.header-cell")[1].style.fontWeight)
      .toBe("700");
    expect(container.querySelectorAll("td.table-cell")[1].style.fontWeight)
      .toBe("700");
  });

  it("leaves Markdown-style links and emphasis as literal text", () => {
    renderContent({
      blocks: [
        {
          paragraph:
            "[Plain link](https://example.org) **plain bold** *plain italic*",
        },
      ],
    });

    expect(container.textContent).toContain(
      "[Plain link](https://example.org) **plain bold** *plain italic*",
    );
    expect(container.querySelector("a")).toBeNull();
    expect(container.querySelector("strong")).toBeNull();
    expect(container.querySelector("em")).toBeNull();
  });

  it("renders list variants, aliases, and nested list-only items", () => {
    renderContent({
      blocks: [
        {
          listWithNumbers: [
            "Numeric item",
            {
              text: "Numeric item with nested dots",
              listWithDots: ["Nested dot"],
            },
            {
              blocks: [
                {
                  listWithAlphabets: ["Nested alphabet item"],
                },
              ],
            },
          ],
        },
        {
          listWithAlphabets: ["Alphabet item"],
        },
        {
          listWithLetters: ["Letter alias item"],
        },
        {
          listWithDots: ["Dot item"],
        },
      ],
    });

    expect(container.textContent).toContain("Numeric item");
    expect(container.textContent).toContain("Nested dot");
    expect(container.textContent).toContain("Nested alphabet item");
    expect(container.textContent).toContain("Alphabet item");
    expect(container.textContent).toContain("Letter alias item");
    expect(container.textContent).toContain("Dot item");
    expect(container.querySelectorAll("ol.ordered-list-alpha"))
      .toHaveLength(3);
    expect(container.querySelectorAll("ul.unordered-list")).toHaveLength(2);
    expect(container.querySelector(".nested-list-only-item")).not.toBeNull();
    expect(container.querySelectorAll("li p")).toHaveLength(0);
  });

  it("renders About-style tables with styled cells and cell links", () => {
    renderContent({
      blocks: [
        {
          table: [
            {
              head: [
                "Resource",
                "{style:width:40%$$text:Styled Header}",
              ],
            },
            {
              body: [
                {
                  row: [
                    "RAS Help",
                    "$$[RAS Help](https://example.org/ras-help)$$",
                  ],
                },
                {
                  row: [
                    "Styled value",
                    "{style:textAlign:center$$text:Centered Cell}",
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    expect(container.querySelector("table.table")).not.toBeNull();
    expect(container.querySelector("thead.table-header")).not.toBeNull();
    expect(container.textContent).toContain("Styled Header");
    expect(container.textContent).toContain("Centered Cell");
    expect(
      container.querySelector('a[href="https://example.org/ras-help"]'),
    ).not.toBeNull();
    expect(container.querySelectorAll("tbody tr.table-body-row"))
      .toHaveLength(2);
  });

  it("ignores unknown structured blocks and empty tables without crashing", () => {
    renderContent({
      blocks: [
        null,
        42,
        true,
        ["invalid", "array", "block"],
        {
          unsupportedBlock: "This should not render.",
        },
        {
          table: [],
        },
        {
          paragraph: "Known content still renders.",
        },
      ],
    });

    expect(container.textContent).not.toContain("This should not render.");
    expect(container.querySelector("table")).toBeNull();
    expect(container.textContent).toContain("Known content still renders.");
  });

  it("renders representative CTDC About page content patterns", () => {
    renderContent({
      blocks: representativeAboutPageContent,
    });

    expect(container.textContent).toContain("Data Access");
    expect(container.textContent).toContain("CTDC GUI");
    expect(container.textContent).toContain("GraphQL API");
    expect(container.textContent).toContain("Clinical and Translational Data Commons");
    expect(container.textContent).toContain("Alignment to F.A.I.R data principles");
    expect(container.textContent).toContain("Clinical: CSV, JSON, or XML");
    expect(container.textContent).toContain("Reports: PDF");

    expect(container.querySelector(".first-title-token").textContent)
      .toBe("Data Access");
    expect(container.querySelector(".head-token").textContent).toBe("CTDC GUI");
    expect(container.querySelector(".indented-token").textContent).toBe("1");
    expect(container.querySelector(".italic-token").textContent)
      .toContain("results published here");
    expect(container.querySelectorAll(".title-token")).toHaveLength(3);

    const requestAccessLink = container.querySelector(
      'a[href="/#/request-access"]',
    );
    expect(requestAccessLink.getAttribute("target")).toBe("_self");
    expect(requestAccessLink.getAttribute("rel")).toBeNull();

    const graphQlLink = container.querySelector('a[href="/#/graphql"]');
    expect(graphQlLink.getAttribute("target")).toBe("_self");

    expect(
      container.querySelector('a[href="https://www.go-fair.org/fair-principles/"]'),
    ).not.toBeNull();
    expect(container.querySelectorAll(".link-icon")).toHaveLength(1);
  });

  it("styles paragraph text only from the paragraph value", () => {
    renderContent({
      stylePresets: {
        paragraphStyle: {
          fontWeight: 700,
        },
      },
      blocks: [
        {
          paragraph: "Block-level style is ignored for paragraph text.",
          style: "paragraphStyle",
        },
        {
          paragraph: {
            text: "Paragraph-level style is applied.",
            style: "paragraphStyle",
          },
        },
      ],
    });

    const paragraphs = container.querySelectorAll("p.body-text");

    expect(paragraphs[0].style.fontWeight).toBe("");
    expect(paragraphs[1].style.fontWeight).toBe("700");
  });

});
