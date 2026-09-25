/**
 * Structured block renderer for loginView.yaml copy.
 * Purpose: support the CTDC About-page block vocabulary on the login page
 * without requiring Markdown or HTML in content fields.
 * Assumption: callers pass the blocks arrays defined in loginView.yaml.
 */
import React from "react";
import { Box, Typography } from "@material-ui/core";
import ContentImage from "./ContentImage";

function getDelimitedValue(value, delimiter) {
  const escapedDelimiter = delimiter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = value.match(
    new RegExp(`^${escapedDelimiter}([\\s\\S]*)${escapedDelimiter}$`),
  );

  return match ? match[1] : null;
}

function parseTokenAttributes(value) {
  const attributes = {};
  const pattern = /([a-zA-Z]+):\s*(?:\[([^\]]+)\]|([^\s,]+))/g;
  let match;

  while ((match = pattern.exec(value)) !== null) {
    attributes[match[1]] = match[2] || match[3];
  }

  return attributes;
}

function isInternalHref(href) {
  if (!href) return false;

  const normalizedHref = href.trim();

  if (/^(mailto:|tel:)/i.test(normalizedHref)) return true;
  if (/^(#|\/(?!\/)|\.{1,2}\/)/.test(normalizedHref)) return true;
  if (!/^[a-z][a-z0-9+.-]*:/i.test(normalizedHref)) return true;

  if (/^https?:/i.test(normalizedHref) && typeof window !== "undefined") {
    try {
      return new URL(normalizedHref, window.location.href).origin ===
        window.location.origin;
    } catch (error) {
      return false;
    }
  }

  return false;
}

function parseContentLink(value) {
  // Links use Bento-style tokens such as $$[Label](url:/#/path target:_self)$$
  // so editors can control same-tab behavior and outbound icons declaratively.
  const standardMatch = value.match(/^\[([^\]]+)\]\((.*)\)$/);
  const reversedMatch = value.match(/^\((.*)\)\[([^\]]+)\]$/);

  if (!standardMatch && !reversedMatch) return null;

  const label = standardMatch ? standardMatch[1] : reversedMatch[2];
  const linkValue = standardMatch ? standardMatch[2] : reversedMatch[1];
  const attributes = parseTokenAttributes(linkValue);
  const rawHref = attributes.url || linkValue;
  const href = !attributes.url && rawHref.includes("@") && !rawHref.startsWith("mailto:")
    ? `mailto:${rawHref}`
    : rawHref;
  const target = attributes.target || "_blank";

  return {
    href,
    label,
    target,
    // Outbound icons are based on URL behavior and target, not the optional
    // Bento `type:` attribute used by older About page content.
    hideIcon: target === "_self" || isInternalHref(href),
  };
}

function parseDownloadLink(value) {
  const downloadMatch = value.match(/^\{([\s\S]*)\}$/);
  if (!downloadMatch) return null;

  const attributes = downloadMatch[1].split(",").reduce((accumulator, item) => {
    const separatorIndex = item.indexOf(":");
    if (separatorIndex === -1) return accumulator;

    const key = item.slice(0, separatorIndex).trim();
    const attributeValue = item.slice(separatorIndex + 1).trim();

    return {
      ...accumulator,
      [key]: attributeValue,
    };
  }, {});

  if (!attributes.link && !attributes.title) return null;

  return {
    href: attributes.link || "",
    label: attributes.title || "",
    target: "_blank",
    hideIcon: true,
  };
}

function renderLink({
  href,
  label,
  target,
  hideIcon,
  linkIcon,
  classes,
  keyPrefix,
}) {
  const showIcon = !hideIcon;

  return (
    <React.Fragment key={keyPrefix}>
      <a
        href={href}
        className={classes.Link}
        target={target}
        rel={target !== "_self" ? "noopener noreferrer" : undefined}
      >
        {label}
      </a>
      {showIcon && (
        <ContentImage
          asset={linkIcon}
          fallbackAlt="outbound web site icon"
          className={classes.linkIcon}
        />
      )}
    </React.Fragment>
  );
}

function renderBentoToken(token, linkIcon, classes, keyPrefix) {
  if (getDelimitedValue(token, "%") !== null) {
    return <br key={keyPrefix} />;
  }

  const link = parseContentLink(token) || parseDownloadLink(token);
  if (link) {
    return renderLink({
      ...link,
      linkIcon,
      classes,
      keyPrefix,
    });
  }

  const emailText = getDelimitedValue(token, "@");
  if (emailText !== null) {
    return (
      <span key={keyPrefix} className={classes.email}>
        {emailText}
      </span>
    );
  }

  const subheadingText = getDelimitedValue(token, "#");
  if (subheadingText !== null) {
    return (
      <span key={keyPrefix} className={classes.head}>
        {subheadingText}
      </span>
    );
  }

  const firstTitleText = getDelimitedValue(token, "~");
  if (firstTitleText !== null) {
    return (
      <span key={keyPrefix} className={classes.firstTitle}>
        {firstTitleText}
      </span>
    );
  }

  const italicText = getDelimitedValue(token, "!");
  if (italicText !== null) {
    return (
      <span key={keyPrefix} className={classes.italicizeText}>
        {italicText}
      </span>
    );
  }

  const boldText = getDelimitedValue(token, "*");
  if (boldText !== null) {
    return (
      <strong key={keyPrefix} className={classes.title}>
        {boldText}
      </strong>
    );
  }

  const indentedText = getDelimitedValue(token, ">");
  if (indentedText !== null) {
    return (
      <span key={keyPrefix} className={classes.indentedText}>
        {indentedText}
      </span>
    );
  }

  return token;
}

function renderInlineContent(text, linkIcon, classes, keyPrefix) {
  const pattern = /(\$\$([\s\S]*?)\$\$|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
  const nodes = [];
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[2]) {
      nodes.push(
        renderBentoToken(
          match[2],
          linkIcon,
          classes,
          `${keyPrefix}-bento-${match.index}`,
        ),
      );
    } else if (match[3] && match[4]) {
      nodes.push(
        renderLink({
          href: match[4],
          label: match[3],
          target: "_blank",
          linkIcon,
          classes,
          keyPrefix: `${keyPrefix}-link-${match.index}`,
        }),
      );
    } else if (match[5]) {
      nodes.push(
        <strong key={`${keyPrefix}-strong-${match.index}`}>
          {match[5]}
        </strong>,
      );
    } else if (match[6]) {
      nodes.push(
        <em key={`${keyPrefix}-em-${match.index}`}>
          {match[6]}
        </em>,
      );
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function getNestedListBlocks(item) {
  if (!item || typeof item !== "object") return [];

  return [
    "listWithDots",
    "listWithNumbers",
    "listWithAlphabets",
    "listWithLetters",
  ].reduce((blocks, key) => {
    if (item[key]) {
      return [...blocks, { [key]: item[key] }];
    }
    return blocks;
  }, item.blocks || []);
}

function getListItemText(item) {
  if (typeof item === "string") return item;
  if (!item || typeof item !== "object") return "";

  return item.text || item.paragraph || "";
}

function renderNestedListBlocks({
  nestedBlocks,
  itemIndex,
  classes,
  unorderedListClassName,
  orderedListClassName,
  alphaOrderedListClassName,
  linkIcon,
  keyPrefix,
}) {
  return nestedBlocks.map((block, nestedIndex) =>
    renderStructuredBlock({
      block,
      blockIndex: `${itemIndex}-${nestedIndex}`,
      classes,
      paragraphClassName: classes.BodyText,
      unorderedListClassName,
      orderedListClassName,
      alphaOrderedListClassName,
      linkIcon,
      keyPrefix: `${keyPrefix}-${itemIndex}`,
    }));
}

function renderStructuredListItem({
  item,
  itemIndex,
  classes,
  unorderedListClassName,
  orderedListClassName,
  alphaOrderedListClassName,
  linkIcon,
  keyPrefix,
}) {
  const nestedBlocks = getNestedListBlocks(item);
  const itemText = getListItemText(item);

  if (!itemText && nestedBlocks.length > 0) {
    return (
      <li
        key={`${keyPrefix}-${itemIndex}`}
        className={classes.nestedListOnlyItem}
      >
        {renderNestedListBlocks({
          nestedBlocks,
          itemIndex,
          classes,
          unorderedListClassName,
          orderedListClassName,
          alphaOrderedListClassName,
          linkIcon,
          keyPrefix,
        })}
      </li>
    );
  }

  return (
    <li key={`${keyPrefix}-${itemIndex}`}>
      {renderInlineContent(
        itemText,
        linkIcon,
        classes,
        `${keyPrefix}-${itemIndex}`,
      )}
      {renderNestedListBlocks({
        nestedBlocks,
        itemIndex,
        classes,
        unorderedListClassName,
        orderedListClassName,
        alphaOrderedListClassName,
        linkIcon,
        keyPrefix,
      })}
    </li>
  );
}

function parseInlineStyle(value) {
  return value.replace(/'/g, "").split(",").reduce((styles, styleRule) => {
    const separatorIndex = styleRule.indexOf(":");
    if (separatorIndex === -1) return styles;

    const property = styleRule.slice(0, separatorIndex).trim();
    const styleValue = styleRule.slice(separatorIndex + 1).trim();

    return {
      ...styles,
      [property]: styleValue,
    };
  }, {});
}

function parseStyledTableCell(value) {
  if (typeof value !== "string") return { text: value, style: {} };

  const styledCellMatch = value.match(/^\{([\s\S]*)\}$/);
  if (!styledCellMatch) return { text: value, style: {} };

  const attributes = styledCellMatch[1].split("$$");
  const styleAttribute = attributes.find((attribute) =>
    attribute.includes("style:"));
  const textAttribute = attributes.find((attribute) =>
    attribute.includes("text:"));

  if (!styleAttribute && !textAttribute) {
    return { text: value, style: {} };
  }

  return {
    text: textAttribute ? textAttribute.replace("text:", "") : "",
    style: styleAttribute
      ? parseInlineStyle(styleAttribute.replace("style:", ""))
      : {},
  };
}

function renderTableCellContent({
  value,
  classes,
  linkIcon,
  keyPrefix,
}) {
  const text = value === undefined || value === null ? "" : String(value);
  const link = parseContentLink(text);

  if (link) {
    return renderLink({
      ...link,
      linkIcon,
      classes,
      keyPrefix,
    });
  }

  return renderInlineContent(text, linkIcon, classes, keyPrefix);
}

function renderStructuredTable({
  table,
  blockIndex,
  classes,
  linkIcon,
  keyPrefix,
}) {
  const headerRows = table && table[0] && table[0].head ? table[0].head : [];
  const bodyRows = table && table[1] && table[1].body ? table[1].body : [];

  if (!headerRows.length && !bodyRows.length) return null;

  return (
    <Box key={`${keyPrefix}-table-${blockIndex}`} className={classes.tableDiv}>
      <table className={classes.table}>
        {headerRows.length > 0 && (
          <thead className={classes.tableHeader}>
            <tr className={classes.tableBodyRow}>
              <th className={classes.headerCell} aria-label="Index" />
              {headerRows.map((header, headerIndex) => {
                const { text, style } = parseStyledTableCell(header);

                return (
                  <th
                    key={`${keyPrefix}-table-${blockIndex}-head-${headerIndex}`}
                    className={classes.headerCell}
                    style={style}
                  >
                    {renderTableCellContent({
                      value: text,
                      classes,
                      linkIcon,
                      keyPrefix: `${keyPrefix}-table-${blockIndex}-head-${headerIndex}`,
                    })}
                  </th>
                );
              })}
            </tr>
          </thead>
        )}
        <tbody>
          {bodyRows.map((row, rowIndex) => {
            const rowValues = row && row.row ? row.row : [];

            return (
              <tr
                key={`${keyPrefix}-table-${blockIndex}-row-${rowIndex}`}
                className={classes.tableBodyRow}
              >
                <td className={classes.tableCell}>{rowIndex + 1}</td>
                {rowValues.map((rowValue, cellIndex) => {
                  const { text, style } = parseStyledTableCell(rowValue);

                  return (
                    <td
                      key={`${keyPrefix}-table-${blockIndex}-row-${rowIndex}-${cellIndex}`}
                      className={classes.tableCell}
                      style={style}
                    >
                      {renderTableCellContent({
                        value: text,
                        classes,
                        linkIcon,
                        keyPrefix: `${keyPrefix}-table-${blockIndex}-row-${rowIndex}-${cellIndex}`,
                      })}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Box>
  );
}

function renderStructuredList({
  items,
  listType,
  listClassName,
  classes,
  unorderedListClassName,
  orderedListClassName,
  alphaOrderedListClassName,
  linkIcon,
  keyPrefix,
}) {
  const ListTag = listType;

  return (
    <ListTag className={listClassName} key={keyPrefix}>
      {(items || []).map((item, itemIndex) =>
        renderStructuredListItem({
          item,
          itemIndex,
          classes,
          unorderedListClassName,
          orderedListClassName,
          alphaOrderedListClassName,
          linkIcon,
          keyPrefix,
        }))}
    </ListTag>
  );
}

function renderStructuredBlock({
  block,
  blockIndex,
  classes,
  paragraphClassName,
  unorderedListClassName,
  orderedListClassName,
  alphaOrderedListClassName,
  linkIcon,
  keyPrefix = "block",
}) {
  // Keep block support aligned with the existing About-page content format.
  // Unknown block keys are ignored so a typo does not crash the login page.
  if (typeof block === "string") {
    return (
      <Typography
        key={`${keyPrefix}-paragraph-${blockIndex}`}
        className={paragraphClassName}
      >
        {renderInlineContent(block, linkIcon, classes, `${keyPrefix}-${blockIndex}`)}
      </Typography>
    );
  }

  if (block.paragraph !== undefined) {
    if (/^\$\$%[\s\S]*%\$\$$/.test(block.paragraph)) {
      return (
        <Box
          key={`${keyPrefix}-space-${blockIndex}`}
          className={classes.space}
        />
      );
    }

    return (
      <Typography
        key={`${keyPrefix}-paragraph-${blockIndex}`}
        className={paragraphClassName}
      >
        {renderInlineContent(
          block.paragraph,
          linkIcon,
          classes,
          `${keyPrefix}-${blockIndex}`,
        )}
      </Typography>
    );
  }

  if (block.listWithDots) {
    return renderStructuredList({
      items: block.listWithDots,
      listType: "ul",
      listClassName: unorderedListClassName,
      classes,
      unorderedListClassName,
      orderedListClassName,
      alphaOrderedListClassName,
      linkIcon,
      keyPrefix: `${keyPrefix}-dots-${blockIndex}`,
    });
  }

  if (block.listWithNumbers) {
    return renderStructuredList({
      items: block.listWithNumbers,
      listType: "ol",
      listClassName: orderedListClassName,
      classes,
      unorderedListClassName,
      orderedListClassName,
      alphaOrderedListClassName,
      linkIcon,
      keyPrefix: `${keyPrefix}-numbers-${blockIndex}`,
    });
  }

  if (block.listWithAlphabets) {
    return renderStructuredList({
      items: block.listWithAlphabets,
      listType: "ol",
      listClassName: alphaOrderedListClassName,
      classes,
      unorderedListClassName,
      orderedListClassName,
      alphaOrderedListClassName,
      linkIcon,
      keyPrefix: `${keyPrefix}-alphabets-${blockIndex}`,
    });
  }

  if (block.listWithLetters) {
    return renderStructuredList({
      items: block.listWithLetters,
      listType: "ol",
      listClassName: alphaOrderedListClassName,
      classes,
      unorderedListClassName,
      orderedListClassName,
      alphaOrderedListClassName,
      linkIcon,
      keyPrefix: `${keyPrefix}-letters-${blockIndex}`,
    });
  }

  if (block.table) {
    return renderStructuredTable({
      table: block.table,
      blockIndex,
      classes,
      linkIcon,
      keyPrefix,
    });
  }

  return null;
}

function LoginMarkdownContent({
  blocks,
  classes,
  paragraphClassName,
  unorderedListClassName,
  orderedListClassName,
  alphaOrderedListClassName,
  linkIcon,
}) {
  const hasStructuredBlocks = Array.isArray(blocks) && blocks.length > 0;
  if (!hasStructuredBlocks) return null;

  const resolvedParagraphClassName = paragraphClassName || classes.BodyText;
  const resolvedUnorderedListClassName = unorderedListClassName || classes.unorderedList;
  const resolvedOrderedListClassName = orderedListClassName || classes.orderedListNumeric;
  const resolvedAlphaOrderedListClassName =
    alphaOrderedListClassName || classes.orderedListAlpha;

  return (
    <Box className={classes.MarkdownContent}>
      {blocks.map((block, blockIndex) =>
        renderStructuredBlock({
          block,
          blockIndex,
          classes,
          paragraphClassName: resolvedParagraphClassName,
          unorderedListClassName: resolvedUnorderedListClassName,
          orderedListClassName: resolvedOrderedListClassName,
          alphaOrderedListClassName: resolvedAlphaOrderedListClassName,
          linkIcon,
        }))}
    </Box>
  );
}

export default LoginMarkdownContent;
