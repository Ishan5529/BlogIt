import React from "react";

import Blogs from "components/Blogs";

const FilteredBlogs = () => (
  <div className="flex h-full flex-col space-y-12 pl-10">
    <Blogs
      fetchFiltered
      history={{ push: path => (window.location.href = path) }}
    />
  </div>
);

export default FilteredBlogs;
