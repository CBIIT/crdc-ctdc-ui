export const getAuthenticatedIdp = (authData = {}) => {
  const idp = authData.IDP || authData.idp;

  return typeof idp === "string" && idp.trim() !== ""
    ? idp.trim().toLowerCase()
    : "ras";
};
