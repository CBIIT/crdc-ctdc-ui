/**
 * Tests the loginView.yaml loading contract: URL construction, YAML parsing,
 * static asset normalization, and the bundled fallback page for load errors.
 */
import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";

const mockEnv = {};

jest.mock("axios", () => ({
  get: jest.fn(),
}));

jest.mock("../../utils/env", () => ({
  __esModule: true,
  default: mockEnv,
}));

jest.mock("./rasLoginView", () => {
  const React = require("react");

  function getFirstRasButtonText(loginContent) {
    const rasSection = loginContent.sections && loginContent.sections[0];
    const sectionBlocks =
      rasSection && Array.isArray(rasSection.blocks) ? rasSection.blocks : [];

    return sectionBlocks.reduce((rasButtonText, blockGroup) => {
      if (rasButtonText) return rasButtonText;

      const blocks =
        blockGroup && Array.isArray(blockGroup.blocks)
          ? blockGroup.blocks
          : [blockGroup];
      const buttonBlock = blocks.find((block) => block && block.rasButtonText);

      return buttonBlock ? buttonBlock.rasButtonText : "";
    }, "");
  }

  return function MockRASLoginPage({
    loginContent,
    rasAuthorizeUrl,
    contentLoadError,
  }) {
    return React.createElement(
      "div",
      {
        "data-testid": "ras-login-page",
        "data-ras-authorize-url": rasAuthorizeUrl,
        "data-lock-border-src":
          loginContent.assets &&
          loginContent.assets.lockBorder &&
          loginContent.assets.lockBorder.src,
        "data-content-load-error": contentLoadError
          ? contentLoadError.title
          : "",
      },
      [
        loginContent.hero.title,
        getFirstRasButtonText(loginContent),
        loginContent.sections &&
          loginContent.sections[1] &&
          loginContent.sections[1].title,
        contentLoadError && contentLoadError.notice,
        contentLoadError && contentLoadError.message,
      ]
        .filter(Boolean)
        .join(" "),
    );
  };
});

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));
const axios = require("axios");
const RASLoginController = require("./rasLoginController").default;

describe("RASLoginController", () => {
  let container;
  const bundledFallbackYaml = [
    "assets:",
    "  lockBorder:",
    "    src: assets/lock-border.svg",
    "    alt: Lock Border",
    "hero:",
    "  title: Login to the CTDC",
    "sections:",
    "  - id: ras-login",
    "    type: rasLogin",
    "    title: Log in with NIH Researcher Auth Service (RAS)",
    "    blocks:",
    "      - blocks:",
    "          - paragraph: Bundled RAS fallback copy.",
    "          - rasButtonText: Login with RAS",
    "  - id: request-access",
    "    type: contentBox",
    "    title: Request Access",
    "    blocks:",
    "      - paragraph: Bundled request access fallback copy.",
  ].join("\n");

  const mockBundledFallbackResponse = () => {
    axios.get.mockResolvedValueOnce({
      data: bundledFallbackYaml,
    });
  };

  const renderController = async () => {
    await act(async () => {
      ReactDOM.render(<RASLoginController />, container);
      await flushPromises();
    });
  };

  beforeEach(() => {
    mockEnv.REACT_APP_STATIC_CONTENT_URL = undefined;
    mockEnv.REACT_APP_RAS_AUTHORIZE_URL = undefined;
    container = document.createElement("div");
    document.body.appendChild(container);
    axios.get.mockReset();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
    document.body.removeChild(container);
    container = null;
    console.error.mockRestore();
  });

  it("renders the login page when loginView.yaml loads", async () => {
    mockEnv.REACT_APP_STATIC_CONTENT_URL =
      "https://static.example.org/static-content/";
    mockEnv.REACT_APP_RAS_AUTHORIZE_URL = "https://ras.example.org/authorize";

    axios.get.mockResolvedValue({
      data: ["hero:", "  title: Login to the CTDC"].join("\n"),
    });

    await renderController();

    expect(axios.get).toHaveBeenCalledWith(
      "https://static.example.org/static-content/login/loginView.yaml",
    );
    expect(
      container.querySelector('[data-testid="ras-login-page"]').textContent,
    ).toBe("Login to the CTDC");
    expect(
      container
        .querySelector('[data-testid="ras-login-page"]')
        .getAttribute("data-ras-authorize-url"),
    ).toBe("https://ras.example.org/authorize");
  });

  it("renders the bundled fallback when the static content URL is missing", async () => {
    mockEnv.REACT_APP_STATIC_CONTENT_URL = "";
    mockEnv.REACT_APP_RAS_AUTHORIZE_URL = "https://ras.example.org/authorize";
    mockBundledFallbackResponse();

    await renderController();

    const page = container.querySelector('[data-testid="ras-login-page"]');

    expect(axios.get).toHaveBeenCalledWith("loginView.yaml");
    expect(page).not.toBeNull();
    expect(page.textContent).toContain("Login to the CTDC");
    expect(page.textContent).toContain("Login with RAS");
    expect(page.textContent).toContain("Request Access");
    expect(page.getAttribute("data-lock-border-src")).toBe("lock-border.svg");
    expect(page.getAttribute("data-content-load-error")).toBe(
      "Login page content is not configured.",
    );
    expect(page.getAttribute("data-ras-authorize-url")).toBe(
      "https://ras.example.org/authorize",
    );
    expect(container.textContent).toContain(
      "Some content could not be loaded..",
    );
    expect(container.textContent).toContain(
      "The page is showing a saved local version because the remote content could not be reached.",
    );
    expect(container.textContent).not.toContain(
      "You can still use the login button. Some page details may not include the latest updates.",
    );
    expect(console.error).toHaveBeenCalled();
  });

  it("renders the bundled fallback when the content request fails", async () => {
    mockEnv.REACT_APP_STATIC_CONTENT_URL =
      "https://static.example.org/static-content";

    axios.get
      .mockRejectedValueOnce({
        response: {
          status: 404,
        },
      })
      .mockResolvedValueOnce({
        data: bundledFallbackYaml,
      });

    await renderController();

    const page = container.querySelector('[data-testid="ras-login-page"]');

    expect(page).not.toBeNull();
    expect(page.textContent).toContain("Login to the CTDC");
    expect(page.textContent).toContain("Request Access");
    expect(page.getAttribute("data-content-load-error")).toBe(
      "Login page content could not be loaded.",
    );
    expect(container.textContent).toContain(
      "Some content could not be loaded..",
    );
    expect(container.textContent).toContain(
      "The page is showing a saved local version because the remote content could not be reached.",
    );
    expect(axios.get).toHaveBeenNthCalledWith(2, "loginView.yaml");
  });

  it("renders the bundled fallback when the file cannot be parsed", async () => {
    mockEnv.REACT_APP_STATIC_CONTENT_URL =
      "https://static.example.org/static-content";

    axios.get
      .mockResolvedValueOnce({
        data: "hero:\n  title: Login\n    badIndent: true",
      })
      .mockResolvedValueOnce({
        data: bundledFallbackYaml,
      });

    await renderController();

    const page = container.querySelector('[data-testid="ras-login-page"]');

    expect(page).not.toBeNull();
    expect(page.textContent).toContain("Login to the CTDC");
    expect(page.textContent).toContain("Request Access");
    expect(page.getAttribute("data-content-load-error")).toBe(
      "Login page content is not valid YAML.",
    );
    expect(container.textContent).toContain(
      "Some content could not be loaded..",
    );
    expect(container.textContent).toContain(
      "The page is showing a saved local version because the remote content could not be reached.",
    );
    expect(container.textContent).not.toContain(
      "You can still use the login button. Some page details may not include the latest updates.",
    );
  });

  it("renders the bundled fallback when the loaded YAML is not an object", async () => {
    mockEnv.REACT_APP_STATIC_CONTENT_URL =
      "https://static.example.org/static-content";

    axios.get
      .mockResolvedValueOnce({
        data: "- not\n- an\n- object",
      })
      .mockResolvedValueOnce({
        data: bundledFallbackYaml,
      });

    await renderController();

    const page = container.querySelector('[data-testid="ras-login-page"]');

    expect(page).not.toBeNull();
    expect(page.textContent).toContain("Login to the CTDC");
    expect(page.textContent).toContain("Request Access");
    expect(page.getAttribute("data-content-load-error")).toBe(
      "Login page content could not be loaded.",
    );
    expect(container.textContent).toContain(
      "Some content could not be loaded..",
    );
    expect(console.error).toHaveBeenCalled();
  });

  it("renders emergency minimal content if the bundled fallback cannot load", async () => {
    mockEnv.REACT_APP_STATIC_CONTENT_URL = "";

    axios.get.mockRejectedValueOnce(new Error("Fallback missing"));

    await renderController();

    const page = container.querySelector('[data-testid="ras-login-page"]');

    expect(page).not.toBeNull();
    expect(page.textContent).toContain("Login to the CTDC");
    expect(page.textContent).toContain("Login with RAS");
    expect(page.textContent).not.toContain("Request Access");
    expect(console.error).toHaveBeenCalled();
  });
});
