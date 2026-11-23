import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { createStore } from "redux";
import UploadModalGenerator from "./UploadModalGenerator";

const createMockStore = () =>
  createStore(() => ({
    localFind: { upload: [], autocomplete: [], uploadMetadata: {} },
  }));

describe("UploadModalGenerator", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
    document.body.removeChild(container);
    container = null;
  });

  it("renders the 'or' separator between the two sections so it stays centered in the gap", () => {
    const { UploadModal } = UploadModalGenerator();

    act(() => {
      ReactDOM.render(
        <Provider store={createMockStore()}>
          <UploadModal open onCloseModal={() => {}} />
        </Provider>,
        container,
      );
    });

    const textArea = document.getElementById("local_find_upload_textarea");
    const orTitle = Array.from(document.querySelectorAll("div")).find(
      (el) => el.textContent === "or" && el.children.length === 0,
    );
    expect(textArea).not.toBeNull();
    expect(orTitle).toBeDefined();

    const sections = Array.from(orTitle.parentElement.children);
    const orIndex = sections.indexOf(orTitle);
    expect(sections).toHaveLength(3);
    expect(orIndex).toBe(1);
    expect(sections[0].contains(textArea)).toBe(true);
    expect(sections[2].textContent).toContain("Choose a file to upload:");

    const style = window.getComputedStyle(orTitle);
    expect(style.position).toBe("relative");
    expect(style.marginLeft).toBe("-21px");
    expect(style.marginRight).toBe("-21px");
  });
});
