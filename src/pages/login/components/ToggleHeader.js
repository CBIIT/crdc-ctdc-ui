/**
 * Shared keyboard-accessible toggle header for login accordions and notices.
 * Assumption: open/closed icon assets come from loginView.yaml and may be
 * omitted; ContentImage handles missing assets safely.
 */
import React from "react";
import { Box, Typography } from "@material-ui/core";
import ContentImage from "./ContentImage";

export function ToggleArrow({ isOpen, openIcon, closedIcon }) {
  const icon = isOpen ? openIcon : closedIcon;

  return (
    <ContentImage
      asset={icon}
      fallbackAlt={isOpen ? "Collapse" : "Expand"}
      style={{
        cursor: "pointer",
        flexShrink: 0,
      }}
    />
  );
}

function ToggleHeader({
  classes,
  title,
  headerClassName,
  titleClassName,
  titleVariant = "h3",
  titleComponent = "h3",
  titleStyle,
  isOpen,
  onToggle,
  openIcon,
  closedIcon,
}) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle();
    }
  };

  return (
    <Box
      className={headerClassName || classes.AccordionHeader}
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
    >
      <Typography
        variant={titleVariant}
        component={titleComponent}
        className={titleClassName}
        style={titleStyle}
      >
        {title}
      </Typography>
      <ToggleArrow
        isOpen={isOpen}
        openIcon={openIcon}
        closedIcon={closedIcon}
      />
    </Box>
  );
}

export default ToggleHeader;
