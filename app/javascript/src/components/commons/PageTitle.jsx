import React from "react";

const PageTitle = ({ title, enable_button, handleClick, button_text }) => (
  <div className="mt-8 flex items-center justify-between pr-20">
    <h1 className="text-5xl font-semibold">{title}</h1>
    {enable_button && (
      <button
        className="ml-4 rounded bg-black px-10 py-3 text-white hover:bg-gray-900"
        onClick={handleClick}
      >
        {button_text}
      </button>
    )}
  </div>
);

export default PageTitle;
