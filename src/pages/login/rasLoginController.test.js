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

  return function MockRASLoginPage({ content, rasAuthorizeUrl }) {
    return React.createElement(
      "div",
      {
        "data-testid": "ras-login-page",
        "data-ras-authorize-url": rasAuthorizeUrl,
      },
      content.hero.title,
    );
  };
});

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));
const axios = require("axios");
const RASLoginController = require("./rasLoginController").default;

describe("RASLoginController", () => {
  let container;

  const renderController = async () => {
    await act(async () => {
      ReactDOM.render(<RASLoginController />, container);
      await flushPromises();
    });
  };

  beforeEach(() => {
    mockEnv.NODE_ENV = "test";
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
    mockEnv.REACT_APP_RAS_AUTHORIZE_URL =
      "https://ras.example.org/authorize";

    axios.get.mockResolvedValue({
      data: [
        "hero:",
        "  title: Login to the CTDC",
      ].join("\n"),
    });

    await renderController();

    expect(axios.get).toHaveBeenCalledWith(
      "https://static.example.org/static-content/login/loginView.yaml",
    );
    expect(container.querySelector('[data-testid="ras-login-page"]').textContent)
      .toBe("Login to the CTDC");
    expect(
      container.querySelector('[data-testid="ras-login-page"]')
        .getAttribute("data-ras-authorize-url"),
    ).toBe("https://ras.example.org/authorize");
  });

  it("shows a helpful error when the static content URL is missing", async () => {
    mockEnv.REACT_APP_STATIC_CONTENT_URL = "";

    await renderController();

    expect(axios.get).not.toHaveBeenCalled();
    expect(container.querySelector('[role="alert"]')).not.toBeNull();
    expect(container.textContent).toContain(
      "Login page content is not configured.",
    );
    expect(container.textContent).toContain("REACT_APP_STATIC_CONTENT_URL");
    expect(container.textContent).toContain("/login/loginView.yaml");
  });

  it("shows the attempted URL and status code when the content request fails", async () => {
    mockEnv.REACT_APP_STATIC_CONTENT_URL =
      "https://static.example.org/static-content";

    axios.get.mockRejectedValue({
      response: {
        status: 404,
      },
    });

    await renderController();

    expect(container.querySelector('[role="alert"]')).not.toBeNull();
    expect(container.textContent).toContain(
      "The request for loginView.yaml failed with HTTP status 404.",
    );
    expect(container.textContent).toContain(
      "https://static.example.org/static-content/login/loginView.yaml",
    );
  });

  it("shows a YAML-specific error when the file cannot be parsed", async () => {
    mockEnv.REACT_APP_STATIC_CONTENT_URL =
      "https://static.example.org/static-content";

    axios.get.mockResolvedValue({
      data: "hero:\n  title: Login\n    badIndent: true",
    });

    await renderController();

    expect(container.querySelector('[role="alert"]')).not.toBeNull();
    expect(container.textContent).toContain(
      "Login page content is not valid YAML.",
    );
    expect(container.textContent).toContain("Check the YAML indentation");
  });
});
