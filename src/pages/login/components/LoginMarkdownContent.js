import React from "react";
import { Box, Typography } from "@material-ui/core";
import ContentImage from "./ContentImage";

function isBlankLine(line) {
  return !line || line.trim() === "";
}

function isListLine(line) {
  return /^\s*(\d+\.|-|\*)\s+/.test(line);
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

    if (/^\s*\d+\.\s+/.test(line)) {
      const items = [];

      while (index < lines.length && /^\s*\d+\.\s+/.test(lines[index])) {
        const [, text] = lines[index].match(/^\s*\d+\.\s+(.*)$/);
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

      blocks.push({ type: "ol", items });
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

function renderInlineMarkdown(text, linkIcon, classes, keyPrefix) {
  const pattern = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
  const nodes = [];
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[2] && match[3]) {
      nodes.push(
        <React.Fragment key={`${keyPrefix}-link-${match.index}`}>
          <a href={match[3]} target="_blank" rel="noopener noreferrer">
            {match[2]}
          </a>
          <ContentImage
            asset={linkIcon}
            fallbackAlt="outbound web site icon"
            className={classes.linkIcon}
          />
        </React.Fragment>,
      );
    } else if (match[4]) {
      nodes.push(
        <strong key={`${keyPrefix}-strong-${match.index}`}>
          {match[4]}
        </strong>,
      );
    } else if (match[5]) {
      nodes.push(
        <em key={`${keyPrefix}-em-${match.index}`}>
          {match[5]}
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

function renderListItem({
  item,
  itemIndex,
  classes,
  unorderedListClassName,
  linkIcon,
  keyPrefix,
}) {
  return (
    <li key={`${keyPrefix}-${itemIndex}`}>
      {renderInlineMarkdown(item.text, linkIcon, classes, `${keyPrefix}-${itemIndex}`)}
      {item.children.length > 0 && (
        <ul className={unorderedListClassName}>
          {item.children.map((child, childIndex) => (
            <li key={`${keyPrefix}-${itemIndex}-${childIndex}`}>
              {renderInlineMarkdown(
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
  linkIcon,
}) {
  if (block.type === "p") {
    return (
      <Typography key={`paragraph-${blockIndex}`} className={paragraphClassName}>
        {renderInlineMarkdown(block.text, linkIcon, classes, `paragraph-${blockIndex}`)}
      </Typography>
    );
  }

  if (block.type === "ol") {
    return (
      <ol key={`ordered-list-${blockIndex}`} className={orderedListClassName}>
        {block.items.map((item, itemIndex) =>
          renderListItem({
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
        renderListItem({
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
  markdown,
  classes,
  paragraphClassName,
  unorderedListClassName,
  orderedListClassName,
  linkIcon,
}) {
  if (!markdown) return null;

  const blocks = parseMarkdownBlocks(markdown);

  return (
    <Box className={classes.MarkdownContent}>
      {blocks.map((block, blockIndex) =>
        renderMarkdownBlock({
          block,
          blockIndex,
          classes,
          paragraphClassName: paragraphClassName || classes.BodyText,
          unorderedListClassName: unorderedListClassName || classes.unorderedList,
          orderedListClassName: orderedListClassName || classes.orderedListNumeric,
          linkIcon,
        }))}
    </Box>
  );
}

export default LoginMarkdownContent;
