import React, { useState, useEffect } from "react";
import "./ScrollButtonStyles.css";

const ScrollButton = () => {
  const [scroll, setScroll] = useState(0);

  const updateScroll = () => {
    setScroll(window.scrollY);
  };

  const onClickScrollToTop = () => {
    window.scrollTo(0, 0);
    setScroll(0);
  };

  useEffect(() => {
    window.addEventListener("scroll", updateScroll);

    return () => {
      window.removeEventListener("scroll", updateScroll);
    };
  }, []);

  return (
    <div
      onClick={onClickScrollToTop}
      id="stt"
      className={scroll < 200 ? "hidden" : "visisble"}
    >
      <span id="stt-span">BACK TO TOP</span>
    </div>
  );
};

export default ScrollButton;
