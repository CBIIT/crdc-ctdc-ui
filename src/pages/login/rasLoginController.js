import React, { useEffect, useState } from "react";
import yaml from "js-yaml";
import axios from "axios";
import env from "../../utils/env";
import RASLoginPage from "./rasLoginView";

const LOGIN_CONTENT_URL = env.REACT_APP_LOGIN_CONTENT_URL;
const RAS_AUTHORIZE_URL = env.REACT_APP_RAS_AUTHORIZE_URL;

function resolveUrl(url, baseUrl) {
  if (!url || typeof url !== "string") return url;

  try {
    return new URL(url, baseUrl).href;
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

function resolveLoginContent(content = {}, baseUrl) {
  const assets = Object.entries(content.assets || {}).reduce(
    (resolvedAssets, [key, asset]) => ({
      ...resolvedAssets,
      [key]: resolveAsset(asset, baseUrl),
    }),
    {},
  );

  return {
    ...content,
    assets,
    help: {
      ...(content.help || {}),
      tutorial: {
        ...((content.help || {}).tutorial || {}),
        videoUrl: resolveUrl(
          ((content.help || {}).tutorial || {}).videoUrl,
          baseUrl,
        ),
      },
    },
  };
}

const RASLoginController = () => {
  const [content, setContent] = useState();
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchLoginContent = async () => {
      if (!LOGIN_CONTENT_URL) {
        setError(true);
        return;
      }

      try {
        const result = await axios.get(LOGIN_CONTENT_URL);
        setContent(
          resolveLoginContent(yaml.safeLoad(result.data), LOGIN_CONTENT_URL),
        );
      } catch (fetchError) {
        console.error("Error loading loginView.yaml:", fetchError);
        setError(true);
      }
    };

    fetchLoginContent();
  }, []);

  if (error) {
    return <div>Error in Loading loginView.yaml.</div>;
  }

  if (!content) {
    return null;
  }

  return (
    <RASLoginPage
      content={content}
      rasAuthorizeUrl={RAS_AUTHORIZE_URL}
    />
  );
};

export default RASLoginController;
