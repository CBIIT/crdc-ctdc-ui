import React from "react";
import ReactDOM from "react-dom";
import { act, Simulate } from "react-dom/test-utils";

const RASLoginPage = require("./rasLoginView").default;

const loginContent = {
  assets: {
    lockBorder: { src: "/login/lock-border.svg", alt: "Lock Border" },
    lockIcon: { src: "/login/lock-icon.svg", alt: "Lock Icon" },
    helpIcon: { src: "/login/help-icon.svg", alt: "Help Icon" },
    videoThumbnail: {
      src: "/login/CTDC_Tutorial_Video_Placeholder.png",
      alt: "Tutorial Video",
    },
    playIcon: { src: "/login/video_play_icon_large.svg", alt: "Play" },
    arrowOpen: { src: "/login/up_arrow.svg", alt: "Collapse" },
    arrowClosed: { src: "/login/down_arrow.svg", alt: "Expand" },
    externalLinkIcon: {
      src: "/login/externalLinkIcon.svg",
      alt: "outbound web site icon",
    },
  },
  hero: {
    title: "Login to the CTDC",
  },
  sections: [
    {
      id: "ras-login",
      type: "rasLogin",
      title: "Log in with NIH Research Auth Service (RAS)",
      content: [
        {
          paragraph:
            "Before accessing CTDC data, you may be required to verify your identity.",
          buttonText: "Login with RAS",
        },
        {
          paragraph:
            "If you already have a CTDC account, you must complete identity verification.",
        },
        {
          paragraph:
            "$$~Overview~$$ $$#RAS details#$$ $$!Italic note!$$ $$@ctdc@example.org@$$ $$>Indented note>$$",
        },
        {
          accordions: [
            {
              title: "How to sign in",
              content: [
                {
                  listWithNumbers: [
                    "Begin from the CTDC login page and select the RAS sign-in option.",
                    "Complete the required identity proofing steps.",
                  ],
                },
              ],
            },
            {
              title: "Preparing your identity",
              collapsible: false,
              content: [
                {
                  paragraph:
                    "The verification process typically takes up to 30 minutes and requires:",
                },
                {
                  listWithAlphabets: [
                    "A mobile phone with a working camera",
                    "Your Social Security number",
                    {
                      text: "One of the following valid government-issued IDs:",
                      listWithDots: [
                        "U.S. driver's license",
                        "State-issued ID",
                      ],
                    },
                  ],
                },
                {
                  paragraph:
                    "Before selecting $$*Log in with NIH Research Auth Service (RAS)*$$, please gather the required information.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "request-access",
      type: "contentBox",
      title: "Request Access",
      content: [
        {
          accordions: [
            {
              title: "Access Requirements",
              collapsible: false,
              content: [
                {
                  paragraph: "CTDC contains controlled-access research data.",
                },
                {
                  paragraph: "To request CTDC access, you must have:",
                },
                {
                  listWithDots: [
                    "An $$*NIH account*$$",
                  ],
                },
              ],
            },
            {
              title: "Instructions to Request Access",
              collapsible: true,
              content: [
                {
                  listWithNumbers: [
                    "Create a Login.gov or ID.me account. If you do not have an NIH account, also create an eRA Commons account.",
                  ],
                },
                {
                  paragraph:
                    "Access requests are typically processed within two business days.",
                },
              ],
            },
          ],
        },
        {
          title: "Documentation",
          content: [
            {
              listWithDots: [
                "$$[eRA Commons Account Creation](https://www.era.nih.gov/register-accounts/create-and-edit-an-account.htm)$$",
                "$$[Same tab documentation](target:_self url:/documentation)$$",
                "$$" +
                  "{link:https://example.org/download.pdf,title:Download Guide}$$",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "another-section",
      type: "contentBox",
      title: "Another Editable Box",
      content: [
        {
          paragraph: "This can be added without frontend code changes.",
        },
      ],
    },
  ],
  warning: {
    title: "Warning Notice",
    content: [
      {
        paragraph:
          "This warning banner provides privacy and security notices consistent with applicable federal laws.",
      },
    ],
  },
  help: {
    ariaLabel: "Help and Support",
    headerText: "NEED HELP?",
    content: [
      {
        paragraph:
          "For help signing in, review the resources below or contact CTDC support.",
      },
    ],
    tutorial: {
      title: "Creating Accounts to Access CTDC data",
      content: [
        {
          paragraph:
            "This tutorial explains the steps involved in creating a Login.gov account.",
        },
        {
          table: [
            {
              head: ["Resource", "Link"],
            },
            {
              body: [
                {
                  row: ["RAS help", "[RAS Help](https://example.org/ras)"],
                },
              ],
            },
          ],
        },
      ],
      videoUrl: "https://example.org/tutorial.mp4",
      playButtonAriaLabel: "Play tutorial video",
    },
    contact: {
      title: "Let us assist you with your login or access issues",
      content: [
        {
          paragraph:
            "If you experience any difficulties with logging in or accessing your account, please reach out to our support team for assistance.",
        },
      ],
      buttonText: "Contact Us",
      href: "mailto:NCICRDC@mail.nih.gov",
      target: "_self",
    },
  },
};

describe("RASLoginPage", () => {
  let container;

  const renderPage = (
    content = loginContent,
    rasAuthorizeUrl = "https://ras.example.org/authorize",
  ) => {
    act(() => {
      ReactDOM.render(
        <RASLoginPage
          content={content}
          rasAuthorizeUrl={rasAuthorizeUrl}
        />,
        container,
      );
    });
  };

  const pressKey = (element, key) => {
    act(() => {
      Simulate.keyDown(element, { key });
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

  it("renders the configured RAS login button", () => {
    renderPage();

    const loginButton = container.querySelector("button");
    expect(loginButton.disabled).toBe(false);
    expect(loginButton.textContent).toBe("Login with RAS");
    expect(container.querySelector('[role="alert"]')).toBeNull();
  });

  it("renders list content without paragraph nesting", () => {
    renderPage();

    const lists = container.querySelectorAll("ul, ol");
    lists.forEach((list) => {
      expect(list.parentElement.tagName).not.toBe("P");
    });
  });

  it("renders About-style structured content tokens", () => {
    renderPage();

    expect(container.textContent).toContain("Overview");
    expect(container.textContent).toContain("RAS details");
    expect(container.textContent).toContain("Italic note");
    expect(container.textContent).toContain("ctdc@example.org");
    expect(container.textContent).toContain("Indented note");
    expect(container.textContent).toContain(
      "The verification process typically",
    );

    const sameTabLink = container.querySelector(
      'a[href="/documentation"]',
    );
    expect(sameTabLink).not.toBeNull();
    expect(sameTabLink.getAttribute("target")).toBe("_self");

    const downloadLink = container.querySelector(
      'a[href="https://example.org/download.pdf"]',
    );
    expect(downloadLink).not.toBeNull();
    expect(downloadLink.textContent).toBe("Download Guide");

    expect(container.querySelector("table")).not.toBeNull();
    expect(
      container.querySelector('a[href="https://example.org/ras"]'),
    ).not.toBeNull();
  });

  it("renders additional contentBox sections from content", () => {
    renderPage();

    expect(container.textContent).toContain("Another Editable Box");
    expect(container.textContent).toContain(
      "This can be added without frontend code changes.",
    );
  });

  it("renders generic help content before tutorial content", () => {
    renderPage();

    const renderedText = container.textContent;
    expect(renderedText).toContain("For help signing in");
    expect(renderedText.indexOf("For help signing in"))
      .toBeLessThan(renderedText.indexOf("Creating Accounts"));
  });

  it("renders RAS content and accordions in content order", () => {
    renderPage();

    let renderedText = container.textContent;
    expect(renderedText.indexOf("Before accessing CTDC data"))
      .toBeLessThan(renderedText.indexOf("How to sign in"));

    const rasContentAfterAccordions = {
      ...loginContent,
      sections: loginContent.sections.map((section) => {
        if (section.id !== "ras-login") return section;

        const accordionGroup = section.content.find((item) =>
          item.accordions);
        const contentBlocks = section.content.filter((item) =>
          !item.accordions);

        return {
          ...section,
          content: [accordionGroup, ...contentBlocks],
        };
      }),
    };

    renderPage(rasContentAfterAccordions);

    renderedText = container.textContent;
    expect(renderedText.indexOf("How to sign in"))
      .toBeLessThan(renderedText.indexOf("Before accessing CTDC data"));
  });

  it("renders Help panel components in YAML key order", () => {
    const helpContentAfterContact = {
      ...loginContent,
      help: (() => {
        const { content, tutorial, contact, ...helpMetadata } =
          loginContent.help;

        return {
          ...helpMetadata,
          tutorial,
          contact,
          content,
        };
      })(),
    };

    renderPage(helpContentAfterContact);

    const renderedText = container.textContent;
    expect(renderedText.indexOf("Let us assist you"))
      .toBeLessThan(renderedText.indexOf("For help signing in"));
  });

  it("renders the configured contact button link", () => {
    renderPage();

    const contactButton = container.querySelector(
      'a[href="mailto:NCICRDC@mail.nih.gov"]',
    );

    expect(contactButton).not.toBeNull();
    expect(contactButton.textContent).toBe("Contact Us");
    expect(contactButton.getAttribute("target")).toBe("_self");
    expect(contactButton.getAttribute("rel")).toBeNull();

    renderPage({
      ...loginContent,
      help: {
        ...loginContent.help,
        contact: {
          ...loginContent.help.contact,
          href: "https://example.org/support",
          target: "_blank",
        },
      },
    });

    const externalContactButton = container.querySelector(
      'a[href="https://example.org/support"]',
    );

    expect(externalContactButton).not.toBeNull();
    expect(externalContactButton.getAttribute("target")).toBe("_blank");
    expect(externalContactButton.getAttribute("rel"))
      .toBe("noopener noreferrer");
  });

  it("renders contentBox content groups and accordions in content order", () => {
    renderPage();

    let renderedText = container.textContent;
    expect(renderedText.indexOf("Instructions to Request Access"))
      .toBeLessThan(renderedText.indexOf("Documentation"));

    const contentBeforeAccordions = {
      ...loginContent,
      sections: loginContent.sections.map((section) => {
        if (section.id !== "request-access") return section;

        const accordionGroup = section.content.find((item) =>
          item.accordions);
        const documentationGroup = section.content.find((item) =>
          item.title === "Documentation");

        return {
          ...section,
          content: [
            {
              title: "Before Accordions",
              content: [
                {
                  paragraph: "Before accordion text.",
                },
              ],
            },
            accordionGroup,
            documentationGroup,
          ],
        };
      }),
    };

    renderPage(contentBeforeAccordions);

    renderedText = container.textContent;
    expect(renderedText.indexOf("Before accordion text."))
      .toBeLessThan(renderedText.indexOf("Access Requirements"));
    expect(renderedText.indexOf("Instructions to Request Access"))
      .toBeLessThan(renderedText.indexOf("Documentation"));
  });

  it("uses the shared accordion styling for contentBox accordions", () => {
    renderPage();

    const toggles = container.querySelectorAll('[aria-expanded]');
    const contentBoxToggle = toggles[1];
    const contentBoxTitle = contentBoxToggle.querySelector("h3, h4, span, div");

    expect(contentBoxToggle.className).toMatch(/AccordionHeader/);
    expect(contentBoxTitle.className).toMatch(/AccordionTitle/);
  });

  it("renders accordion content as always open when collapsible is false", () => {
    renderPage();

    expect(container.textContent).toContain(
      "The verification process typically",
    );

    const toggles = container.querySelectorAll('[aria-expanded]');
    expect(toggles).toHaveLength(3);
    expect(Array.from(toggles).some((toggle) =>
      toggle.textContent.includes("Preparing your identity"))).toBe(false);
  });

  it("supports defaultOpen for rasLogin and contentBox accordions", () => {
    const contentWithDefaultOpenAccordions = {
      ...loginContent,
      sections: loginContent.sections.map((section) => {
        if (section.id === "ras-login") {
          return {
            ...section,
            content: section.content.map((item) =>
              (item.accordions
                ? {
                  ...item,
                  accordions: item.accordions.map((accordion, index) =>
                    (index === 0
                      ? { ...accordion, defaultOpen: true }
                      : accordion)),
                }
                : item)),
          };
        }

        if (section.id === "request-access") {
          return {
            ...section,
            content: section.content.map((item) =>
              (item.accordions
                ? {
                  ...item,
                  accordions: item.accordions.map((accordion) =>
                    (accordion.title === "Instructions to Request Access"
                      ? { ...accordion, defaultOpen: true }
                      : accordion)),
                }
                : item)),
          };
        }

        return section;
      }),
    };

    renderPage(contentWithDefaultOpenAccordions);

    expect(container.textContent).toContain("Begin from the CTDC login page");
    expect(container.textContent).toContain(
      "Create a Login.gov or ID.me account",
    );

    const toggles = container.querySelectorAll('[aria-expanded]');
    expect(toggles[0].getAttribute("aria-expanded")).toBe("true");
    expect(toggles[1].getAttribute("aria-expanded")).toBe("true");

    pressKey(toggles[0], " ");
    pressKey(toggles[1], " ");

    expect(container.textContent).not.toContain(
      "Begin from the CTDC login page",
    );
    expect(container.textContent).not.toContain(
      "Create a Login.gov or ID.me account",
    );
  });

  it("supports Enter and Space for each collapsible section", () => {
    renderPage();

    const toggles = container.querySelectorAll('[aria-expanded]');
    expect(toggles).toHaveLength(3);

    pressKey(toggles[0], "Enter");
    expect(container.textContent).toContain(
      "Begin from the CTDC login page",
    );
    pressKey(toggles[0], " ");
    expect(container.textContent).not.toContain(
      "Begin from the CTDC login page",
    );

    pressKey(toggles[1], "Enter");
    expect(container.textContent).toContain(
      "Create a Login.gov or ID.me account",
    );
    pressKey(toggles[1], " ");
    expect(container.textContent).not.toContain(
      "Create a Login.gov or ID.me account",
    );

    pressKey(toggles[2], "Enter");
    expect(container.textContent).toContain(
      "This warning banner provides privacy",
    );
    pressKey(toggles[2], " ");
    expect(container.textContent).toContain(
      "This warning banner provides privacy",
    );
  });

  it("renders semantic accessibility landmarks and heading structure", () => {
    renderPage();

    const pageContainer = container.firstElementChild;
    expect(pageContainer).not.toBeNull();

    const h1Heading = container.querySelector("h1");
    expect(h1Heading).not.toBeNull();
    expect(h1Heading.textContent).toBe("Login to the CTDC");

    const h2Headings = container.querySelectorAll("h2");
    expect(h2Headings.length).toBeGreaterThan(0);

    const h3Headings = container.querySelectorAll("h3");
    expect(h3Headings.length).toBeGreaterThan(0);

    const asideLandmark = container.querySelector("aside");
    expect(asideLandmark).not.toBeNull();
    expect(asideLandmark.getAttribute("aria-label")).toBe("Help and Support");
  });
});
