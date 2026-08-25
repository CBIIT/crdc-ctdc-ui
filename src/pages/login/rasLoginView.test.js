import React from "react";
import ReactDOM from "react-dom";
import { act, Simulate } from "react-dom/test-utils";

jest.mock("../../utils/env", () => ({
  __esModule: true,
  default: {},
}));

const env = require("../../utils/env").default;
const RASLoginPage = require("./rasLoginView").default;

describe("RASLoginPage", () => {
  let container;

  const renderPage = () => {
    act(() => {
      ReactDOM.render(<RASLoginPage />, container);
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
    env.REACT_APP_RAS_AUTHORIZE_URL = "";
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
    document.body.removeChild(container);
    container = null;
  });

  it("disables RAS login and shows a configuration error when the URL is missing", () => {
    renderPage();

    const loginButton = container.querySelector("button");
    expect(loginButton.disabled).toBe(true);
    expect(container.textContent).toContain(
      "RAS login is temporarily unavailable",
    );
  });

  it("renders list content without paragraph nesting", () => {
    renderPage();

    const lists = container.querySelectorAll("ul, ol");
    lists.forEach((list) => {
      expect(list.parentElement.tagName).not.toBe("P");
    });
  });

  it("supports Enter and Space for each collapsible section", () => {
    renderPage();

    const toggles = container.querySelectorAll('[role="button"]');
    expect(toggles).toHaveLength(3);

    pressKey(toggles[0], "Enter");
    expect(container.textContent).toContain(
      "The verification process typically",
    );
    pressKey(toggles[0], " ");
    expect(container.textContent).not.toContain(
      "The verification process typically",
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
});
