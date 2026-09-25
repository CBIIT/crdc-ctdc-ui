import React, { useEffect, useState } from "react";
import yaml from "js-yaml";
import axios from "axios";
import env from "../../utils/env";
import RASLoginPage from "./rasLoginView";

const LOCAL_LOGIN_CONTENT_URL = "/local-static-content/login/loginView.yaml";
const LOGIN_CONTENT_FILE = "loginView.yaml";
const LOGIN_CONTENT_PATH = "/login/loginView.yaml";

function isTemplateValue(value) {
  return typeof value === "string" && /^\$\{[^}]+\}$/.test(value);
}

function getLoginContentUrl() {
  if (env.NODE_ENV === "development") {
    return LOCAL_LOGIN_CONTENT_URL;
  }

  const staticContentUrl = env.REACT_APP_STATIC_CONTENT_URL;

  if (!staticContentUrl || isTemplateValue(staticContentUrl)) {
    return staticContentUrl;
  }

  return `${staticContentUrl.replace(/\/+$/, "")}${LOGIN_CONTENT_PATH}`;
}

function resolveUrl(url, baseUrl) {
  if (!url || typeof url !== "string") return url;

  try {
    const base = typeof window !== "undefined"
      ? new URL(baseUrl, window.location.href).href
      : baseUrl;

    return new URL(url, base).href;
  } catch (error) {
    return url;
  }
}

function resolveAsset(asset, baseUrl) {
  if (typeof asset === "string") {
    return resolveUrl(asset, baseUrl);
  }

  if (!asset || typeof asset !== "object") {
    return asset;
  }

  return {
    ...asset,
    src: resolveUrl(asset.src, baseUrl),
  };
}

function resolveLoginContent(loginContent = {}, baseUrl) {
  const assets = Object.entries(loginContent.assets || {}).reduce(
    (resolvedAssets, [key, asset]) => ({
      ...resolvedAssets,
      [key]: resolveAsset(asset, baseUrl),
    }),
    {},
  );

  return {
    ...loginContent,
    assets,
    help: {
      ...(loginContent.help || {}),
      tutorial: {
        ...((loginContent.help || {}).tutorial || {}),
        videoUrl: resolveUrl(
          ((loginContent.help || {}).tutorial || {}).videoUrl,
          baseUrl,
        ),
      },
    },
  };
}

function getContentLoadError(fetchError, loginContentUrl) {
  if (!loginContentUrl || isTemplateValue(loginContentUrl)) {
    return {
      title: "Login page content is not configured.",
      message:
        "The login page cannot load because the static content URL is missing or unresolved.",
      details:
        "Set REACT_APP_STATIC_CONTENT_URL to the static-content repository base URL. The frontend will load login content from /login/loginView.yaml. In local development, confirm the local static-content proxy is serving login/loginView.yaml.",
    };
  }

  if (fetchError && fetchError.response) {
    return {
      title: "Login page content could not be loaded.",
      message:
        `The request for ${LOGIN_CONTENT_FILE} failed with HTTP status ${fetchError.response.status}.`,
      details:
        "Confirm the content file exists, the URL is reachable, and the static-content branch is deployed.",
    };
  }

  if (fetchError && fetchError.name === "YAMLException") {
    return {
      title: "Login page content is not valid YAML.",
      message:
        `The ${LOGIN_CONTENT_FILE} file was found, but the frontend could not parse it.`,
      details:
        "Check the YAML indentation, list formatting, and quoted values in the login content file.",
    };
  }

  return {
    title: "Login page content could not be loaded.",
    message:
      `The frontend could not load ${LOGIN_CONTENT_FILE} from the configured content source.`,
    details:
      "Refresh the page. If the problem continues, confirm the content URL is reachable and the YAML file is valid.",
  };
}

function validateLoginContent(content) {
  if (!content || typeof content !== "object" || Array.isArray(content)) {
    throw new Error("loginView.yaml must contain a YAML object.");
  }
}

function LoginContentError({ error }) {
  if (!error) return null;

  return (
    <div
      role="alert"
      style={{
        margin: "48px auto",
        maxWidth: "760px",
        padding: "24px",
        border: "2px solid #BA1F40",
        borderRadius: "8px",
        backgroundColor: "#FFF7F8",
        color: "#000",
        fontFamily: "Roboto, Arial, sans-serif",
        lineHeight: 1.5,
      }}
    >
      <h1
        style={{
          margin: "0 0 12px",
          color: "#BA1F40",
          fontSize: "24px",
          lineHeight: 1.25,
        }}
      >
        {error.title}
      </h1>
      <p style={{ margin: "0 0 8px" }}>{error.message}</p>
      <p style={{ margin: "0 0 8px" }}>{error.details}</p>
      {error.url && (
        <p style={{ margin: 0 }}>
          Attempted content URL: <code>{error.url}</code>
        </p>
      )}
    </div>
  );
}

const RASLoginController = () => {
  const [loginContent, setLoginContent] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    const fetchLoginContent = async () => {
      const loginContentUrl = getLoginContentUrl();

      if (!loginContentUrl || isTemplateValue(loginContentUrl)) {
        setError(getContentLoadError(null, loginContentUrl));
        return;
      }

      try {
        const result = await axios.get(loginContentUrl);
        const parsedContent = yaml.safeLoad(result.data);
        validateLoginContent(parsedContent);
        setLoginContent(
          resolveLoginContent(parsedContent, loginContentUrl),
        );
      } catch (fetchError) {
        console.error("Error loading loginView.yaml:", fetchError);
        setError({
          ...getContentLoadError(fetchError, loginContentUrl),
          url: loginContentUrl,
        });
      }
    };

    fetchLoginContent();
  }, []);

  if (error) {
    return <LoginContentError error={error} />;
  }

  if (!loginContent) {
    return null;
  }

  return (
    <RASLoginPage
      loginContent={loginContent}
      rasAuthorizeUrl={env.REACT_APP_RAS_AUTHORIZE_URL}
    />
  );
};

export default RASLoginController;
