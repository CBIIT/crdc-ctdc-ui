export const getAuthenticatedIdp = (authData = {}) => {
  const idp = authData.IDP || authData.idp;

  return typeof idp === "string" && idp.trim() !== ""
    ? idp.trim().toLowerCase()
    : "ras";
};

export const getFileDownloadIdp = (authData = {}) => {
  const idp = authData.IDP || authData.idp;
  const normalizedIdp = typeof idp === "string" ? idp.trim().toLowerCase() : "";

  return normalizedIdp === "ras" ? "ras" : "";
};
