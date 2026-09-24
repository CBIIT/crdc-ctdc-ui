import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import LoginMarkdownContent from "./LoginMarkdownContent";

const classes = {
  BodyText: "body-text",
  MarkdownContent: "markdown-content",
  unorderedList: "unordered-list",
  orderedListNumeric: "ordered-list-numeric",
  orderedListAlpha: "ordered-list-alpha",
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

  it("renders nothing when structured content and markdown are both missing", () => {
    renderContent({});

    expect(container.textContent).toBe("");
  });

  it("prefers structured content over legacy markdown fallback", () => {
    renderContent({
      content: [
        {
          paragraph: "Structured content wins.",
        },
      ],
      markdown: "Markdown fallback loses.",
    });

    expect(container.textContent).toContain("Structured content wins.");
    expect(container.textContent).not.toContain("Markdown fallback loses.");
  });

  it("renders About-style inline text tokens", () => {
    renderContent({
      content: [
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
    renderContent({
      content: [
        {
          paragraph:
            "$$[External](https://example.org)$$ $$[Same tab](target:_self url:/same-page)$$ $$[No icon](type:noIcon url:https://example.org/no-icon target:_blank)$$ $$[Configured](url:[https://example.org/configured] target:[_blank])$$ $$(person@example.org)[Email link]$$ " +
            downloadToken,
        },
      ],
    });

    const externalLink = container.querySelector('a[href="https://example.org"]');
    expect(externalLink.getAttribute("target")).toBe("_blank");
    expect(externalLink.getAttribute("rel")).toBe("noopener noreferrer");

    const sameTabLink = container.querySelector('a[href="/same-page"]');
    expect(sameTabLink.getAttribute("target")).toBe("_self");
    expect(sameTabLink.getAttribute("rel")).toBeNull();

    expect(
      container.querySelector('a[href="https://example.org/no-icon"]'),
    ).not.toBeNull();
    expect(
      container.querySelector('a[href="https://example.org/configured"]'),
    ).not.toBeNull();
    expect(container.querySelector('a[href="mailto:person@example.org"]'))
      .not.toBeNull();

    const downloadLink = container.querySelector(
      'a[href="https://example.org/download.pdf"]',
    );
    expect(downloadLink.textContent).toBe("Download Guide");

    expect(container.querySelectorAll("img.link-icon")).toHaveLength(3);
  });

  it("renders list variants, aliases, and nested list-only items", () => {
    renderContent({
      content: [
        {
          listWithNumbers: [
            "Numeric item",
            {
              text: "Numeric item with nested dots",
              listWithDots: ["Nested dot"],
            },
            {
              content: [
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
      content: [
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
                    "[RAS Help](https://example.org/ras-help)",
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
      content: [
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
      content: representativeAboutPageContent,
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
    expect(container.querySelectorAll("img.link-icon")).toHaveLength(1);
  });

  it("renders legacy markdown fallback blocks", () => {
    renderContent({
      markdown:
        "Intro **bold markdown** and *italic markdown* and [Legacy Link](https://legacy.example.org).\n\n" +
        "1. First step\n" +
        "   - Nested detail\n" +
        "2. Second step\n\n" +
        "a. Alpha step\n" +
        "b. Beta step\n\n" +
        "- Dot item\n" +
        "* Star item",
    });

    expect(container.textContent).toContain("Intro");
    expect(container.querySelector("strong").textContent).toBe(
      "bold markdown",
    );
    expect(container.querySelector("em").textContent).toBe("italic markdown");
    expect(
      container.querySelector('a[href="https://legacy.example.org"]'),
    ).not.toBeNull();
    expect(container.textContent).toContain("Nested detail");
    expect(container.textContent).toContain("Alpha step");
    expect(container.textContent).toContain("Star item");
    expect(container.querySelectorAll("ol")).toHaveLength(2);
    expect(container.querySelectorAll("ul")).toHaveLength(2);
  });
});
