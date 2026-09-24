import React from "react";
import { Box, Typography } from "@material-ui/core";
import ContentImage from "./ContentImage";

function isBlankLine(line) {
  return !line || line.trim() === "";
}

function getOrderedListMatch(line) {
  return line.match(/^\s*(\d+|[a-zA-Z])\.\s+(.*)$/);
}

function getOrderedListStyle(marker) {
  return /^\d+$/.test(marker) ? "numeric" : "alpha";
}

function isListLine(line) {
  return /^\s*((\d+|[a-zA-Z])\.|-|\*)\s+/.test(line);
}

function parseMarkdownBlocks(markdown) {
  const lines = markdown.split(/\r?\n/);
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (isBlankLine(line)) {
      index += 1;
      continue;
    }

    const orderedListMatch = getOrderedListMatch(line);

    if (orderedListMatch) {
      const items = [];
      const listStyle = getOrderedListStyle(orderedListMatch[1]);

      while (index < lines.length) {
        const match = getOrderedListMatch(lines[index]);
        if (!match || getOrderedListStyle(match[1]) !== listStyle) {
          break;
        }

        const [, , text] = match;
        const item = { text, children: [] };
        index += 1;

        while (
          index < lines.length &&
          /^\s+[-*]\s+/.test(lines[index])
        ) {
          const [, childText] = lines[index].match(/^\s+[-*]\s+(.*)$/);
          item.children.push(childText);
          index += 1;
        }

        items.push(item);
      }

      blocks.push({ type: "ol", items, listStyle });
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items = [];

      while (index < lines.length && /^\s*[-*]\s+/.test(lines[index])) {
        const [, text] = lines[index].match(/^\s*[-*]\s+(.*)$/);
        items.push({ text, children: [] });
        index += 1;
      }

      blocks.push({ type: "ul", items });
      continue;
    }

    const paragraphLines = [];

    while (
      index < lines.length &&
      !isBlankLine(lines[index]) &&
      !isListLine(lines[index])
    ) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    blocks.push({
      type: "p",
      text: paragraphLines.join(" "),
    });
  }

  return blocks;
}

function parseEnhancedLink(value) {
  const labelMatch = value.match(/^\[([^\]]+)\]\((.*)\)$/);
  if (!labelMatch) return null;

  const [, label, linkValue] = labelMatch;
  const urlMatch = linkValue.match(/url:\s*(?:\[([^\]]+)\]|([^\s]+))/);
  const targetMatch = linkValue.match(/target:\s*(?:\[([^\]]+)\]|([^\s]+))/);

  if (urlMatch) {
    return {
      href: urlMatch[1] || urlMatch[2],
      label,
      target: targetMatch ? targetMatch[1] || targetMatch[2] : "_blank",
    };
  }

  return {
    href: linkValue,
    label,
    target: "_blank",
  };
}

function renderLink({
  href,
  label,
  target,
  linkIcon,
  classes,
  keyPrefix,
}) {
  const isExternalTarget = target !== "_self";

  return (
    <React.Fragment key={keyPrefix}>
      <a
        href={href}
        target={target}
        rel={isExternalTarget ? "noopener noreferrer" : undefined}
      >
        {label}
      </a>
      {isExternalTarget && (
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
  if (token === "%space%") {
    return <br key={keyPrefix} />;
  }

  const link = parseEnhancedLink(token);
  if (link) {
    return renderLink({
      ...link,
      linkIcon,
      classes,
      keyPrefix,
    });
  }

  if (/^\*.*\*$/.test(token)) {
    return <strong key={keyPrefix}>{token.slice(1, -1)}</strong>;
  }

  if (/^#.*#$/.test(token)) {
    return <strong key={keyPrefix}>{token.slice(1, -1)}</strong>;
  }

  if (/^~.*~$/.test(token)) {
    return <strong key={keyPrefix}>{token.slice(1, -1)}</strong>;
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
    "listWithLetters",
  ].reduce((blocks, key) => {
    if (item[key]) {
      return [...blocks, { [key]: item[key] }];
    }
    return blocks;
  }, item.content || []);
}

function getListItemText(item) {
  if (typeof item === "string") return item;
  if (!item || typeof item !== "object") return "";

  return item.text || item.paragraph || "";
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

  return (
    <li key={`${keyPrefix}-${itemIndex}`}>
      {renderInlineContent(
        getListItemText(item),
        linkIcon,
        classes,
        `${keyPrefix}-${itemIndex}`,
      )}
      {nestedBlocks.map((block, nestedIndex) =>
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
        }))}
    </li>
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
  keyPrefix = "content-block",
}) {
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
    if (block.paragraph === "$$%space%$$") {
      return <Box key={`${keyPrefix}-space-${blockIndex}`} height={16} />;
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

  return null;
}

function renderMarkdownListItem({
  item,
  itemIndex,
  classes,
  unorderedListClassName,
  linkIcon,
  keyPrefix,
}) {
  return (
    <li key={`${keyPrefix}-${itemIndex}`}>
      {renderInlineContent(item.text, linkIcon, classes, `${keyPrefix}-${itemIndex}`)}
      {item.children.length > 0 && (
        <ul className={unorderedListClassName}>
          {item.children.map((child, childIndex) => (
            <li key={`${keyPrefix}-${itemIndex}-${childIndex}`}>
              {renderInlineContent(
                child,
                linkIcon,
                classes,
                `${keyPrefix}-${itemIndex}-${childIndex}`,
              )}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function renderMarkdownBlock({
  block,
  blockIndex,
  classes,
  paragraphClassName,
  unorderedListClassName,
  orderedListClassName,
  alphaOrderedListClassName,
  linkIcon,
}) {
  if (block.type === "p") {
    return (
      <Typography key={`paragraph-${blockIndex}`} className={paragraphClassName}>
        {renderInlineContent(block.text, linkIcon, classes, `paragraph-${blockIndex}`)}
      </Typography>
    );
  }

  if (block.type === "ol") {
    const listClassName = block.listStyle === "alpha"
      ? alphaOrderedListClassName
      : orderedListClassName;

    return (
      <ol key={`ordered-list-${blockIndex}`} className={listClassName}>
        {block.items.map((item, itemIndex) =>
          renderMarkdownListItem({
            item,
            itemIndex,
            classes,
            unorderedListClassName,
            linkIcon,
            keyPrefix: `ordered-list-${blockIndex}`,
          }))}
      </ol>
    );
  }

  return (
    <ul key={`unordered-list-${blockIndex}`} className={unorderedListClassName}>
      {block.items.map((item, itemIndex) =>
        renderMarkdownListItem({
          item,
          itemIndex,
          classes,
          unorderedListClassName,
          linkIcon,
          keyPrefix: `unordered-list-${blockIndex}`,
        }))}
    </ul>
  );
}

function LoginMarkdownContent({
  content,
  markdown,
  classes,
  paragraphClassName,
  unorderedListClassName,
  orderedListClassName,
  alphaOrderedListClassName,
  linkIcon,
}) {
  const hasStructuredContent = Array.isArray(content) && content.length > 0;
  if (!hasStructuredContent && !markdown) return null;

  const resolvedParagraphClassName = paragraphClassName || classes.BodyText;
  const resolvedUnorderedListClassName = unorderedListClassName || classes.unorderedList;
  const resolvedOrderedListClassName = orderedListClassName || classes.orderedListNumeric;
  const resolvedAlphaOrderedListClassName =
    alphaOrderedListClassName || classes.orderedListAlpha;

  return (
    <Box className={classes.MarkdownContent}>
      {hasStructuredContent
        ? content.map((block, blockIndex) =>
          renderStructuredBlock({
            block,
            blockIndex,
            classes,
            paragraphClassName: resolvedParagraphClassName,
            unorderedListClassName: resolvedUnorderedListClassName,
            orderedListClassName: resolvedOrderedListClassName,
            alphaOrderedListClassName: resolvedAlphaOrderedListClassName,
            linkIcon,
          }))
        : parseMarkdownBlocks(markdown).map((block, blockIndex) =>
          renderMarkdownBlock({
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
