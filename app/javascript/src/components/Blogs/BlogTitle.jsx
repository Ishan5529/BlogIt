import React from "react";

import { Tag } from "neetoui";

const BlogTitle = ({ title, slug, showPost, isBloggable }) => (
  <div
    className="flex cursor-pointer items-center"
    onClick={() => showPost(slug)}
  >
    <p className="text-2xl font-semibold text-gray-800 hover:text-red-400">
      {title}
    </p>
    {isBloggable && (
      <Tag
        className="ml-8 min-w-20 bg-transparent px-4"
        label="Blog it"
        size="large"
        style="primary"
      />
    )}
  </div>
);

export default BlogTitle;
