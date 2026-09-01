import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";

jest.mock("react-redux", () => ({
  connect: () => (Component) => (props) => (
    <Component {...props} signIn={jest.fn()} signOut={jest.fn()} />
  ),
}));

jest.mock("./config", () => ({
  __esModule: true,
  default: {
    config: {
      GOOGLE_CLIENT_ID: "",
      NIH_CLIENT_ID: "",
      NIH_AUTH_URL: "https://example.test/authorize",
      AUTH_API: "https://example.test/api/",
    },
    functions: {
      redirect: jest.fn(),
      storeInLocalStorage: jest.fn(),
      deleteFromLocalStorage: jest.fn(),
    },
  },
}));

jest.mock("../store/actions/Actions", () => ({
  signInRed: jest.fn(),
  signOutRed: jest.fn(),
}));

const { AuthProviderGenerator, useAuth } = require("./AuthProviderGenerator");

const AuthProbe = ({ onAuth }) => {
  onAuth(useAuth());
  return null;
};

describe("AuthProviderGenerator authServiceLogin", () => {
  let container;
  let auth;

  const renderProvider = () => {
    const { AuthProvider } = AuthProviderGenerator();
    act(() => {
      ReactDOM.render(
        <AuthProvider>
          <AuthProbe
            onAuth={(value) => {
              auth = value;
            }}
          />
        </AuthProvider>,
        container,
      );
    });
  };

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    auth = null;
    global.fetch = jest.fn();
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
    document.body.removeChild(container);
    delete global.fetch;
    jest.clearAllMocks();
  });

  it.each([400, 403, 500])("reports HTTP %s failures", async (status) => {
    global.fetch.mockResolvedValue({
      status,
      json: () => Promise.resolve({ error: "failed" }),
    });
    const onError = jest.fn();
    renderProvider();

    await act(async () => {
      await auth.authServiceLogin(
        "code",
        "ras",
        "/callback",
        jest.fn(),
        onError,
      );
    });

    expect(onError).toHaveBeenCalledWith(
      status === 500 ? "Internal Error" : "Error fetching user data.",
    );
  });

  it("stores user details and calls success for a valid response", async () => {
    const userDetails = { name: "Researcher" };
    const onSuccess = jest.fn();
    global.fetch.mockResolvedValue({
      status: 200,
      json: () => Promise.resolve(userDetails),
    });
    renderProvider();

    await act(async () => {
      await auth.authServiceLogin(
        "code",
        "ras",
        "/callback",
        onSuccess,
        jest.fn(),
      );
    });

    expect(onSuccess).toHaveBeenCalledWith(userDetails);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://example.test/api/login",
      expect.objectContaining({
        body: JSON.stringify({
          code: "code",
          IDP: "ras",
          redirectUri: "/callback",
        }),
      }),
    );
  });

  it("reports network and JSON parsing failures without rejecting", async () => {
    const onError = jest.fn();
    renderProvider();

    global.fetch.mockRejectedValueOnce(new Error("offline"));
    await act(async () => {
      await auth.authServiceLogin(
        "code",
        "ras",
        "/callback",
        jest.fn(),
        onError,
      );
    });

    global.fetch.mockResolvedValueOnce({
      status: 200,
      json: () => Promise.reject(new Error("invalid JSON")),
    });
    await act(async () => {
      await auth.authServiceLogin(
        "code",
        "ras",
        "/callback",
        jest.fn(),
        onError,
      );
    });

    expect(onError).toHaveBeenCalledTimes(2);
    expect(onError).toHaveBeenNthCalledWith(1, "Error fetching user data.");
    expect(onError).toHaveBeenNthCalledWith(2, "Error fetching user data.");
  });
});
