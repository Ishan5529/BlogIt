import React from "react";

import classnames from "classnames";

const noop = () => {};

const Button = ({
  size = "medium",
  style = "primary",
  type = "button",
  buttonText,
  onClick = noop,
  loading,
  className = "",
  icon,
  disabled = false,
}) => {
  const handleClick = e => {
    if (!(disabled || loading)) return onClick(e);

    return null;
  };

  return (
    <button
      disabled={disabled || loading}
      type={type}
      className={classnames(
        "group relative flex items-center justify-center gap-x-2 rounded-md border border-black  border-transparent text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none",
        {
          "px-4 py-2": size === "medium",
          "px-2 py-1": size === "small",
          "bg-black text-white hover:bg-gray-800":
            !loading && style === "primary",
          "bg-gray-200 text-gray-800 hover:bg-gray-300":
            !loading && style === "secondary",
          "bg-gray-300 text-gray-800": loading,
          "cursor-wait": loading,
          "cursor-not-allowed opacity-50": disabled,
        },
        [className]
      )}
      onClick={handleClick}
    >
      {icon && <i className={`ri-${icon} text-base`} />}
      {loading ? "Loading..." : buttonText}
    </button>
  );
};

export default Button;
