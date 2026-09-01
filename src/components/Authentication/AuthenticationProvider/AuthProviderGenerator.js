import React, { useContext } from "react";
import { connect } from "react-redux";
import { useGoogleLogin } from "react-use-googlelogin";
import { signInRed, signOutRed } from "../store/actions/Actions";
import DEFAULT_CONFIG from "./config";

/**
 * Generate a context for Authentication Provider component.
 */
const createContext = () => {
  const ctx = React.createContext();
  const useCtx = () => {
    const contextValue = useContext(ctx);

    if (contextValue === undefined) {
      throw new Error("useCtx must be inside a Provider with a value");
    }

    return contextValue;
  };

  return [useCtx, ctx.Provider];
};
const [useAuth, Auth] = createContext();

const SAMPLE_GOOGLE_CLIENT_ID = "Sample Id";

const isConfiguredGoogleClientId = (clientId) =>
  typeof clientId === "string" &&
  clientId.trim() !== "" &&
  clientId.trim() !== SAMPLE_GOOGLE_CLIENT_ID;

const GoogleLoginState = ({ clientId, children }) => {
  const googleAuth = useGoogleLogin({
    clientId,
  });

  // what does this return?
  return children(googleAuth);
};

const googleNotConfigured = () =>
  Promise.reject(new Error("Google login is not configured."));

/**
 * Generate a Authentication Provider component with the custom configuration applied
 *
 * @param {object} [uiConfig]
 * @returns {object} { AuthProvider }
 */
export const AuthProviderGenerator = (uiConfig = DEFAULT_CONFIG) => {
  const { config, functions } = uiConfig;

  const redirect =
    functions && typeof functions.redirect === "function"
      ? functions.redirect
      : DEFAULT_CONFIG.functions.redirect;

  const storeInLocalStorage =
    functions && typeof functions.storeInLocalStorage === "function"
      ? functions.storeInLocalStorage
      : DEFAULT_CONFIG.functions.storeInLocalStorage;

  const deleteFromLocalStorage =
    functions && typeof functions.deleteFromLocalStorage === "function"
      ? functions.deleteFromLocalStorage
      : DEFAULT_CONFIG.functions.deleteFromLocalStorage;

  const GOOGLE_CLIENT_ID =
    config && typeof config.GOOGLE_CLIENT_ID === "string"
      ? config.GOOGLE_CLIENT_ID
      : DEFAULT_CONFIG.config.GOOGLE_CLIENT_ID;

  const NIH_CLIENT_ID =
    config && typeof config.NIH_CLIENT_ID === "string"
      ? config.NIH_CLIENT_ID
      : DEFAULT_CONFIG.config.NIH_CLIENT_ID;

  const NIH_AUTH_URL =
    config && typeof config.NIH_AUTH_URL === "string"
      ? config.NIH_AUTH_URL
      : DEFAULT_CONFIG.config.NIH_AUTH_URL;

  const AUTH_API =
    config && typeof config.AUTH_API === "string"
      ? config.AUTH_API
      : DEFAULT_CONFIG.config.AUTH_API;

  const AUTH_URL =
    config && typeof config.AUTH_URL === "string"
      ? config.AUTH_URL
      : DEFAULT_CONFIG.config.AUTH_URL;

  const stateProps = () => ({
    // autocomplete: state.login.autocomplete,
  });

  const dispatchProps = (dispatch) => ({
    signIn: (data) => dispatch(signInRed(data)),
    signOut: () => dispatch(signOutRed()),
  });

  return {
    // @ts-ignore
    // eslint-disable-next-line max-len
    AuthProvider: connect(
      stateProps,
      dispatchProps,
    )((props) => {
      const { children, signIn, signOut } = props;
      const originDomain = window.location.origin;
      const googleLoginEnabled = isConfiguredGoogleClientId(GOOGLE_CLIENT_ID);

      const renderAuthProvider = ({
        googleUser = null,
        isInitialized = !googleLoginEnabled,
        grantOfflineAccess = googleNotConfigured,
        isSignedIn = false,
      } = {}) => {
        async function authServiceLogin(
          code,
          IDP,
          redirectUri,
          signInSuccess = () => {},
          signInError = () => {},
        ) {
          try {
            const rawResponse = await fetch(`${AUTH_API}login`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ code, IDP, redirectUri }),
            });

            if (!rawResponse || typeof rawResponse.json !== "function") {
              signInError("Error fetching user data.");
              return;
            }

            let responseData;
            try {
              responseData = await rawResponse.json();
            } catch (error) {
              signInError("Error fetching user data.");
              return;
            }

            if (rawResponse.status === 200) {
              signIn(responseData);
              storeInLocalStorage("userDetails", responseData);
              signInSuccess(responseData);
            } else if (
              rawResponse.status === 400 ||
              rawResponse.status === 403
            ) {
              signInError("Error fetching user data.");
            } else {
              signInError("Internal Error");
            }
          } catch (error) {
            signInError("Error fetching user data.");
          }
        }

        const signInWithGoogle = (success = () => {}, error = () => {}) => {
          grantOfflineAccess()
            .then((resp) => {
              if (resp) {
                // Send the code to auth service
                authServiceLogin(resp, "google", originDomain, success, error);
              } else {
                error();
              }
            })
            .catch((err) => {
              console.warn("[Google login] Unable to start Google login", {
                configured: googleLoginEnabled,
                message: err && err.message,
              });
              error(err);
            });
        };

        const signInWithNIH = (state) => {
          const urlParam = {
            client_id: NIH_CLIENT_ID,
            redirect_uri: `${originDomain}/nihloginsuccess`,
            response_type: "code",
            scope: "openid email profile",
            state: JSON.stringify(state || {}),
          };

          const params = new URLSearchParams(urlParam).toString();
          window.location.href = `${NIH_AUTH_URL}?${params}`;
        };

        const signInWithAuthURL = (state) => {
          window.location.href = `${AUTH_URL}`;
        };

        const onSignOut = (history, redirectPath, IDP) => {
          (async () => {
            await fetch(`${AUTH_API}logout`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ IDP }),
            })
              .then(() => {
                deleteFromLocalStorage("userDetails");
                signOut();
                dispatchProps("signOut");
                //googleSignOut();
                redirect(history, redirectPath);
              })
              .catch(() => {});
          })();
          // this.auth.signIn();
        };

        return (
          <Auth
            value={{
              signInWithGoogle,
              signInWithNIH,
              signInWithAuthURL,
              isSignedIn,
              isInitialized,
              googleUser,
              signOut: onSignOut,
              authServiceLogin,
              // fetchWithRefresh,
            }}
          >
            {children}
          </Auth>
        );
      };

      if (!googleLoginEnabled) {
        return renderAuthProvider();
      }

      return (
        <GoogleLoginState clientId={GOOGLE_CLIENT_ID}>
          {renderAuthProvider}
        </GoogleLoginState>
      );
    }),
  };
};

export default AuthProviderGenerator;
export { useAuth };
