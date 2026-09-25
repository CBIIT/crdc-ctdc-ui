import fallbackLoginContentUrl from "../assets/login/loginView.yaml";
import lockBorderAsset from "../assets/login/lock-border.svg";
import lockIconAsset from "../assets/login/lock-icon.svg";
import helpIconAsset from "../assets/login/help-icon.svg";
import videoThumbnailAsset from "../assets/login/CTDC_Tutorial_Video_Placeholder.png";
import playIconAsset from "../assets/login/video_play_icon_large.svg";
import arrowOpenAsset from "../assets/login/up_arrow.svg";
import arrowClosedAsset from "../assets/login/down_arrow.svg";
import externalLinkIconAsset from "../assets/externalLinkIcon.svg";

export const LOGIN_CONTENT_PATH = "/login/loginView.yaml";

export const CONTENT_LOAD_NOTICE =
  "Some login-page content could not be loaded.";
export const CONTENT_LOAD_MESSAGE =
  "We are showing a saved version of this login page so you can continue.";
export const CONTENT_LOAD_DETAILS =
  "You can still use the login button. Some page details may not include the latest updates.";

export const RAS_LOGIN_UNAVAILABLE_MESSAGE =
  "RAS login is temporarily unavailable because it is not configured.";

export const EMERGENCY_LOGIN_CONTENT = {
  page: "/user/login",
  title: "Login",
  hero: {
    title: "Login to the CTDC",
  },
  sections: [
    {
      id: "ras-login",
      type: "rasLogin",
      title: "Log in with NIH Researcher Auth Service (RAS)",
      blocks: [
        {
          blocks: [
            {
              paragraph:
                "Before accessing CTDC data, you are required to verify your identity through NIH's secure Researcher Auth Service (RAS).",
            },
            {
              rasButtonText: "Login with RAS",
            },
          ],
        },
      ],
    },
  ],
};

export const FALLBACK_LOGIN_CONTENT_URL = fallbackLoginContentUrl;

export const BUNDLED_LOGIN_ASSETS = {
  "assets/lock-border.svg": lockBorderAsset,
  "assets/lock-icon.svg": lockIconAsset,
  "assets/help-icon.svg": helpIconAsset,
  "assets/CTDC_Tutorial_Video_Placeholder.png": videoThumbnailAsset,
  "assets/video_play_icon_large.svg": playIconAsset,
  "assets/up_arrow.svg": arrowOpenAsset,
  "assets/down_arrow.svg": arrowClosedAsset,
  "assets/externalLinkIcon.svg": externalLinkIconAsset,
};

export default null;
