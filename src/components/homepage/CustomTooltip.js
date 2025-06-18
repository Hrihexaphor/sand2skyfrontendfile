import React from "react";

const CustomTooltip = ({ children, tooltipText, position }) => {
  return (
    <div className="relative group inline-block">
      {children}

      <div
        className={`
          absolute z-50 whitespace-nowrap px-3 py-2 text-sm text-white bg-black rounded-md shadow-md transition-opacity duration-200 opacity-0 group-hover:opacity-100
          ${position === "top" ? "bottom-full left-1/2 -translate-x-1/2 mb-2" : ""}
          ${position === "bottom" ? "top-full left-1/2 -translate-x-1/2 mt-2" : ""}
          ${position === "left" ? "right-full top-1/2 -translate-y-1/2 mr-2" : ""}
          ${position === "right" ? "left-full top-1/2 -translate-y-1/2 ml-2" : ""}
        `}
      >
        {tooltipText}

        <div
          className={`
            absolute w-2 h-2 bg-black rotate-45
            ${position === "top" ? "top-full left-1/2 -translate-x-1/2" : ""}
            ${position === "bottom" ? "bottom-full left-1/2 -translate-x-1/2" : ""}
            ${position === "left" ? "left-full top-1/2 -translate-y-1/2" : ""}
            ${position === "right" ? "right-full top-1/2 -translate-y-1/2" : ""}
          `}
        ></div>
      </div>
    </div>
  );
};

export default CustomTooltip;
