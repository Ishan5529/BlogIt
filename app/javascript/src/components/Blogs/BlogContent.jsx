import React from "react";

const BlogContent = ({ categories }) => (
  <div className="flex flex-row items-center space-x-2">
    {categories.map((category, index) => (
      <span
        className="rounded-full bg-green-200 px-6 py-1 text-sm font-semibold text-gray-700"
        key={index}
      >
        {category}
      </span>
    ))}
  </div>
);

export default BlogContent;
