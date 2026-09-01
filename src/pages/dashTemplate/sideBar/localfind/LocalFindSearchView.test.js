import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { createStore } from "redux";
import LocalFindSearchView from "./LocalFindSearchView";

// Mock @bento-core/local-find
jest.mock("@bento-core/local-find", () => ({
  SearchList: ({ items, onDelete }) => (
    <div data-testid="search-list">
      {items.map((item) => (
        <span key={item} onClick={() => onDelete(item)}>
          {item}
        </span>
      ))}
    </div>
  ),
  resetUploadData: () => ({ type: "RESET_UPLOAD_DATA" }),
}));

const createMockStore = (
  localFindState = { upload: [], autocomplete: [], uploadMetadata: {} },
) =>
  createStore(() => ({
    localFind: localFindState,
  }));

const mockClasses = {
  searchContainer: "searchContainer",
  customDivider: "customDivider",
  customListPadding: "customListPadding",
  uploadButton: "uploadButton",
  iconSpan: "iconSpan",
  uploadIcon: "uploadIcon",
};

const MockSearchBox = ({ classes }) => <input data-testid="search-box" />;
const MockUploadModal = ({ open, onCloseModal }) =>
  open ? (
    <div data-testid="upload-modal">
      <button onClick={onCloseModal}>Close</button>
    </div>
  ) : null;

describe("LocalFindSearchView", () => {
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

  it("renders without crashing", () => {
    const store = createMockStore();
    act(() => {
      ReactDOM.render(
        <Provider store={store}>
          <LocalFindSearchView
            classes={mockClasses}
            hidden={false}
            SearchBox={MockSearchBox}
            UploadModal={MockUploadModal}
          />
        </Provider>,
        container,
      );
    });
    expect(container.querySelector(".searchContainer")).not.toBeNull();
  });

  it("shows 'Upload Participant Set' button when no uploads exist", () => {
    const store = createMockStore({
      upload: [],
      autocomplete: [],
      uploadMetadata: {},
    });
    act(() => {
      ReactDOM.render(
        <Provider store={store}>
          <LocalFindSearchView
            classes={mockClasses}
            hidden={false}
            SearchBox={MockSearchBox}
            UploadModal={MockUploadModal}
          />
        </Provider>,
        container,
      );
    });
    const button = container.querySelector("#local_find_upload_open");
    expect(button.textContent).toContain("Upload Participant Set");
  });

  it("shows 'View Participant Set' button when uploads exist", () => {
    const store = createMockStore({
      upload: [{ subject_id: "MSB-00140", program_id: "CTDC" }],
      autocomplete: [],
      uploadMetadata: {},
    });
    act(() => {
      ReactDOM.render(
        <Provider store={store}>
          <LocalFindSearchView
            classes={mockClasses}
            hidden={false}
            SearchBox={MockSearchBox}
            UploadModal={MockUploadModal}
          />
        </Provider>,
        container,
      );
    });
    const button = container.querySelector("#local_find_upload_open");
    expect(button.textContent).toContain("View Participant Set");
  });

  it("shows SearchList chip when uploads exist", () => {
    const store = createMockStore({
      upload: [{ subject_id: "MSB-00140", program_id: "CTDC" }],
      autocomplete: [],
      uploadMetadata: {},
    });
    act(() => {
      ReactDOM.render(
        <Provider store={store}>
          <LocalFindSearchView
            classes={mockClasses}
            hidden={false}
            SearchBox={MockSearchBox}
            UploadModal={MockUploadModal}
          />
        </Provider>,
        container,
      );
    });
    const searchList = container.querySelector('[data-testid="search-list"]');
    expect(searchList).not.toBeNull();
    expect(searchList.textContent).toContain("INPUT SET");
  });

  it("does not show SearchList when no uploads", () => {
    const store = createMockStore({
      upload: [],
      autocomplete: [],
      uploadMetadata: {},
    });
    act(() => {
      ReactDOM.render(
        <Provider store={store}>
          <LocalFindSearchView
            classes={mockClasses}
            hidden={false}
            SearchBox={MockSearchBox}
            UploadModal={MockUploadModal}
          />
        </Provider>,
        container,
      );
    });
    const searchList = container.querySelector('[data-testid="search-list"]');
    expect(searchList).toBeNull();
  });

  it("opens UploadModal when button is clicked", () => {
    const store = createMockStore();
    act(() => {
      ReactDOM.render(
        <Provider store={store}>
          <LocalFindSearchView
            classes={mockClasses}
            hidden={false}
            SearchBox={MockSearchBox}
            UploadModal={MockUploadModal}
          />
        </Provider>,
        container,
      );
    });
    expect(container.querySelector('[data-testid="upload-modal"]')).toBeNull();
    act(() => {
      container.querySelector("#local_find_upload_open").click();
    });
    expect(
      container.querySelector('[data-testid="upload-modal"]'),
    ).not.toBeNull();
  });

  it("hides content when hidden prop is true", () => {
    const store = createMockStore();
    act(() => {
      ReactDOM.render(
        <Provider store={store}>
          <LocalFindSearchView
            classes={mockClasses}
            hidden={true}
            SearchBox={MockSearchBox}
            UploadModal={MockUploadModal}
          />
        </Provider>,
        container,
      );
    });
    const searchContainer = container.querySelector(".searchContainer");
    expect(searchContainer.hidden).toBe(true);
  });

  it("renders SearchBox component", () => {
    const store = createMockStore();
    act(() => {
      ReactDOM.render(
        <Provider store={store}>
          <LocalFindSearchView
            classes={mockClasses}
            hidden={false}
            SearchBox={MockSearchBox}
            UploadModal={MockUploadModal}
          />
        </Provider>,
        container,
      );
    });
    expect(
      container.querySelector('[data-testid="search-box"]'),
    ).not.toBeNull();
  });
});
