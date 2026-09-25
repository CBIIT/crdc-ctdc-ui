/**
 * Loads login/loginView.yaml, resolves relative media URLs, and passes the
 * normalized static-content payload to the RAS login page. If external content
 * cannot load, the page reads the bundled frontend loginView.yaml copy so
 * authentication remains available with stable local content.
 * The content source is REACT_APP_STATIC_CONTENT_URL + /login/loginView.yaml.
 */
import React, { useEffect, useState } from "react";
import yaml from "js-yaml";
import axios from "axios";
import env from "../../utils/env";
import {
  BUNDLED_LOGIN_ASSETS,
  CONTENT_LOAD_DETAILS,
  CONTENT_LOAD_MESSAGE,
  CONTENT_LOAD_NOTICE,
  EMERGENCY_LOGIN_CONTENT,
  FALLBACK_LOGIN_CONTENT_URL,
  LOGIN_CONTENT_PATH,
} from "../../bento/loginData";
import RASLoginPage from "./rasLoginView";

function isTemplateValue(value) {
  return typeof value === "string" && /^\$\{[^}]+\}$/.test(value);
}

function getLoginContentUrl() {
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

function normalizeAssetPath(assetPath) {
  if (typeof assetPath !== "string") return assetPath;

  return assetPath
    .replace(/^\.?\//, "")
    .replace(/^login\/assets\//, "assets/");
}

function resolveAssetPath(assetPath, baseUrl, assetOverrides = {}) {
  if (!assetPath || typeof assetPath !== "string") return assetPath;

  const normalizedPath = normalizeAssetPath(assetPath);

  return assetOverrides[assetPath] ||
    assetOverrides[normalizedPath] ||
    resolveUrl(assetPath, baseUrl);
}

function resolveAsset(asset, baseUrl, assetOverrides = {}) {
  if (typeof asset === "string") {
    return resolveAssetPath(asset, baseUrl, assetOverrides);
  }

  if (!asset || typeof asset !== "object") {
    return asset;
  }

  return {
    ...asset,
    src: resolveAssetPath(asset.src, baseUrl, assetOverrides),
  };
}

function resolveLoginContent(loginContent = {}, baseUrl, assetOverrides = {}) {
  // loginView.yaml keeps asset paths relative to the YAML file so content can
  // move between static-content branches without frontend code changes.
  const assets = Object.entries(loginContent.assets || {}).reduce(
    (resolvedAssets, [key, asset]) => ({
      ...resolvedAssets,
      [key]: resolveAsset(asset, baseUrl, assetOverrides),
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
      notice: CONTENT_LOAD_NOTICE,
      message: CONTENT_LOAD_MESSAGE,
      details: CONTENT_LOAD_DETAILS,
    };
  }

  if (fetchError && fetchError.response) {
    return {
      title: "Login page content could not be loaded.",
      notice: CONTENT_LOAD_NOTICE,
      message: CONTENT_LOAD_MESSAGE,
      details: CONTENT_LOAD_DETAILS,
    };
  }

  if (fetchError && fetchError.name === "YAMLException") {
    return {
      title: "Login page content is not valid YAML.",
      notice: CONTENT_LOAD_NOTICE,
      message: CONTENT_LOAD_MESSAGE,
      details: CONTENT_LOAD_DETAILS,
    };
  }

  return {
    title: "Login page content could not be loaded.",
    notice: CONTENT_LOAD_NOTICE,
    message: CONTENT_LOAD_MESSAGE,
    details: CONTENT_LOAD_DETAILS,
  };
}

function validateLoginContent(content) {
  // The renderer tolerates missing optional sections, but the loaded file must
  // be a YAML object so duplicate keys and invalid lists fail early.
  if (!content || typeof content !== "object" || Array.isArray(content)) {
    throw new Error("loginView.yaml must contain a YAML object.");
  }
}

async function loadLoginContent(loginContentUrl, assetOverrides = {}) {
  const result = await axios.get(loginContentUrl);
  const parsedContent = yaml.safeLoad(result.data);

  validateLoginContent(parsedContent);

  return resolveLoginContent(
    parsedContent,
    loginContentUrl,
    assetOverrides,
  );
}

async function loadBundledFallbackContent() {
  try {
    return await loadLoginContent(
      FALLBACK_LOGIN_CONTENT_URL,
      BUNDLED_LOGIN_ASSETS,
    );
  } catch (fallbackError) {
    console.error("Error loading bundled loginView.yaml:", fallbackError);
    return EMERGENCY_LOGIN_CONTENT;
  }
}

const RASLoginController = () => {
  const [loginContent, setLoginContent] = useState();
  const [contentLoadError, setContentLoadError] = useState();

  useEffect(() => {
    const fetchLoginContent = async () => {
      const loginContentUrl = getLoginContentUrl();

      if (!loginContentUrl || isTemplateValue(loginContentUrl)) {
        const loadError = getContentLoadError(null, loginContentUrl);
        const fallbackContent = await loadBundledFallbackContent();

        console.error("Error loading loginView.yaml:", loadError);
        setLoginContent(fallbackContent);
        setContentLoadError(loadError);
        return;
      }

      try {
        setLoginContent(await loadLoginContent(loginContentUrl));
        setContentLoadError();
      } catch (fetchError) {
        const loadError = {
          ...getContentLoadError(fetchError, loginContentUrl),
          url: loginContentUrl,
        };
        const fallbackContent = await loadBundledFallbackContent();

        console.error("Error loading loginView.yaml:", fetchError);
        setLoginContent(fallbackContent);
        setContentLoadError(loadError);
      }
    };

    fetchLoginContent();
  }, []);

  if (!loginContent) {
    return null;
  }

  return (
    <RASLoginPage
      loginContent={loginContent}
      rasAuthorizeUrl={env.REACT_APP_RAS_AUTHORIZE_URL}
      contentLoadError={contentLoadError}
    />
  );
};

export default RASLoginController;
