/**
 * Style preset support for loginView.yaml.
 * Purpose: let content editors reuse named React inline styles from YAML while
 * keeping style resolution in one shared place.
 */
function isPlainObject(value) {
  return Boolean(
    value &&
      typeof value === "object" &&
      !Array.isArray(value),
  );
}

function normalizeStyleObject(styleObject) {
  if (!isPlainObject(styleObject)) return {};

  return Object.entries(styleObject).reduce((style, [key, value]) => {
    if (value === undefined || value === null) return style;

    return {
      ...style,
      [key]: value,
    };
  }, {});
}

export function getContentStylePresets(loginContent = {}) {
  return isPlainObject(loginContent.styles)
    ? loginContent.styles
    : {};
}

export function resolveContentStyle(stylePresets = {}, styleRef) {
  const styleRefs = Array.isArray(styleRef) ? styleRef : [styleRef];
  const resolvedStyle = styleRefs.reduce((style, currentRef) => {
    if (typeof currentRef === "string") {
      return {
        ...style,
        ...normalizeStyleObject(stylePresets[currentRef]),
      };
    }

    if (isPlainObject(currentRef)) {
      return {
        ...style,
        ...normalizeStyleObject(currentRef),
      };
    }

    return style;
  }, {});

  return Object.keys(resolvedStyle).length > 0 ? resolvedStyle : undefined;
}

export default resolveContentStyle;
