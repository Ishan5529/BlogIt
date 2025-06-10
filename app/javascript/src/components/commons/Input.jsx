import React from "react";

import classnames from "classnames";

const Input = ({
  type = "text",
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  required = true,
  className = "",
  rows = 4,
}) => (
  <div className="flex flex-col">
    {label && (
      <label className="block text-lg font-medium leading-none text-gray-800">
        {label}
      </label>
    )}
    <div className="mt-1 rounded-md shadow-sm">
      {type === "textarea" ? (
        <textarea
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          rows={rows}
          value={value}
          className={classnames(
            "focus:shadow-outline-blue block w-full resize-none appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out focus:border-blue-300 focus:outline-none sm:text-sm sm:leading-5",
            [className]
          )}
          onChange={onChange}
        />
      ) : (
        <input
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          type={type}
          value={value}
          className={classnames(
            "focus:shadow-outline-blue block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out focus:border-blue-300 focus:outline-none sm:text-sm sm:leading-5",
            [className]
          )}
          onChange={onChange}
        />
      )}
    </div>
  </div>
);

export default Input;
