export const getAuthenticatedIdp = (authData = {}) => {
  const idp = authData.IDP || authData.idp;

  return typeof idp === "string" && idp.trim() !== ""
    ? idp.trim().toLowerCase()
    : "ras";
};

export const getFileDownloadIdp = (authData = {}) => {
  const idp = authData.IDP || authData.idp;
  const normalizedIdp = typeof idp === "string" ? idp.trim().toLowerCase() : "";

  // Authentication IDP is not always a File service route source.
  // Only RAS logins should use the RAS File service route; all other logins
  // should keep the default File service route by returning an empty idp.
  // File service handles non-RAS downloads through its default route.
  return normalizedIdp === "ras" ? "ras" : "";
};
