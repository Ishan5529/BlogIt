import React from "react";

import Header from "./Header";
import Row from "./Row";

const Table = ({
  data,
  destroyPost,
  editPost,
  handleStatusToggle,
  selectedColumns,
  selectedPosts,
  setSelectedPosts,
}) => (
  <div className="inline-block w-full">
    <table className="w-full border-collapse">
      <Header
        data={data}
        selectedColumns={selectedColumns}
        selectedPosts={selectedPosts}
        setSelectedPosts={setSelectedPosts}
      />
      <Row
        data={data}
        destroyPost={destroyPost}
        editPost={editPost}
        handleStatusToggle={handleStatusToggle}
        selectedColumns={selectedColumns}
        selectedPosts={selectedPosts}
        setSelectedPosts={setSelectedPosts}
      />
    </table>
  </div>
);

export default Table;
