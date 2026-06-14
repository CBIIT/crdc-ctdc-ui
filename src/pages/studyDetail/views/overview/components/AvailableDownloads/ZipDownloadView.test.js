import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { createStore } from "redux";
import ZipDownloadView from "./ZipDownloadView";
import { fetchFileToDownload } from "../../../../../../components/DocumentDownload/DocumentDownloadView";

/**
 * Mock graphqlClient to prevent Apollo Client initialization errors.
 */
jest.mock("../../../../../utils/graphqlClient", () => ({
  client: {
    query: jest.fn(),
    mutate: jest.fn(),
  },
}));

jest.mock("../../../../../bento/siteWideConfig", () => ({
  enableAuthentication: true,
}));

jest.mock("../../../../../components/Authentication", () => ({
  useAuth: () => ({
    signInWithAuthURL: jest.fn(),
    signOut: jest.fn(),
  }),
}));

jest.mock(
  "../../../../../components/DocumentDownload/DocumentDownloadView",
  () => ({
    fetchFileToDownload: jest.fn(),
  }),
);

jest.mock("../../../../../components/Global/GlobalProvider", () => ({
  useGlobal: () => ({
    Notification: { show: jest.fn() },
  }),
}));

// Minimal Redux store
const createMockStore = (isSignedIn = false) =>
  createStore(() => ({
    login: { isSignedIn },
  }));

const defaultProps = {
  fileFormat: "zip",
  fileLocation: "file-uuid-123",
  fileName: "test_file.zip",
  toolTipTextFileDownload: "Click to download",
  toolTipTextUnauthenticated: "You must be logged in",
  iconFileDownload: "download-icon.svg",
  iconUnauthenticated: "unauth-icon.svg",
  toolTipIcon: "tooltip-icon.svg",
  buttonText: "Variant Call Files",
};

let container;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  jest.clearAllMocks();
});

afterEach(() => {
  ReactDOM.unmountComponentAtNode(container);
  container.remove();
  container = null;
});

const renderComponent = (props = {}, isSignedIn = false) => {
  const store = createMockStore(isSignedIn);
  act(() => {
    ReactDOM.render(
      <Provider store={store}>
        <ZipDownloadView {...defaultProps} {...props} />
      </Provider>,
      container,
    );
  });
};

describe("ZipDownloadView", () => {
  describe("when disabled (no ZIP file available)", () => {
    it("renders the button with custom buttonText", () => {
      renderComponent({ disabled: true });
      expect(container.textContent).toContain("Variant Call Files");
    });

    it("renders the button as disabled", () => {
      renderComponent({ disabled: true });
      const button = container.querySelector("button");
      expect(button.disabled).toBe(true);
    });

    it("does not call fetchFileToDownload on click", () => {
      renderComponent({ disabled: true });
      const button = container.querySelector("button");
      act(() => {
        button.click();
      });
      expect(fetchFileToDownload).not.toHaveBeenCalled();
    });
  });

  describe("when user is not signed in", () => {
    it("renders the button as disabled", () => {
      renderComponent({ disabled: false }, false);
      const button = container.querySelector("button");
      expect(button.disabled).toBe(true);
    });

    it("displays the custom buttonText", () => {
      renderComponent(
        { disabled: false, buttonText: "Variant Reports" },
        false,
      );
      expect(container.textContent).toContain("Variant Reports");
    });
  });

  describe("when user is signed in and has access", () => {
    it("renders the button as enabled", () => {
      renderComponent({ disabled: false }, true);
      const button = container.querySelector("button");
      expect(button.disabled).toBe(false);
    });

    it("calls fetchFileToDownload on click", () => {
      renderComponent({ disabled: false }, true);
      const button = container.querySelector("button");
      act(() => {
        button.click();
      });
      expect(fetchFileToDownload).toHaveBeenCalledWith(
        "file-uuid-123",
        expect.any(Function),
        expect.any(Function),
        "test_file.zip",
        "zip",
        expect.any(Function),
      );
    });

    it("displays the correct buttonText", () => {
      renderComponent(
        { disabled: false, buttonText: "Radiology Images" },
        true,
      );
      expect(container.textContent).toContain("Radiology Images");
    });
  });

  describe("default buttonText", () => {
    it("defaults to ZIP FILE when no buttonText provided", () => {
      const { buttonText, ...propsWithoutButtonText } = defaultProps;
      const store = createMockStore(false);
      act(() => {
        ReactDOM.render(
          <Provider store={store}>
            <ZipDownloadView {...propsWithoutButtonText} />
          </Provider>,
          container,
        );
      });
      expect(container.textContent).toContain("ZIP FILE");
    });
  });

  describe("multiple buttons with different file types", () => {
    it("renders each button independently with correct enabled/disabled state", () => {
      const store = createMockStore(true);
      act(() => {
        ReactDOM.render(
          <Provider store={store}>
            <ZipDownloadView
              {...defaultProps}
              buttonText="Variant Call Files"
              disabled={false}
            />
            <ZipDownloadView
              {...defaultProps}
              buttonText="Variant Reports"
              disabled={true}
            />
            <ZipDownloadView
              {...defaultProps}
              buttonText="Radiology Images"
              disabled={true}
            />
          </Provider>,
          container,
        );
      });

      expect(container.textContent).toContain("Variant Call Files");
      expect(container.textContent).toContain("Variant Reports");
      expect(container.textContent).toContain("Radiology Images");

      const buttons = container.querySelectorAll("button");
      expect(buttons[0].disabled).toBe(false);
      expect(buttons[1].disabled).toBe(true);
      expect(buttons[2].disabled).toBe(true);
    });
  });
});
