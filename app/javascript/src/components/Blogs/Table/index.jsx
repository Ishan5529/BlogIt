import React from "react";

import Header from "./Header";
import Row from "./Row";

const Table = ({
  data,
  destroyPost,
  editPost,
  handleStatusToggle,
  selectedColumns,
}) => (
  <div className="inline-block w-full">
    <table className="w-full border-collapse">
      <Header selectedColumns={selectedColumns} />
      <Row
        data={data}
        destroyPost={destroyPost}
        editPost={editPost}
        handleStatusToggle={handleStatusToggle}
        selectedColumns={selectedColumns}
      />
    </table>
  </div>
);

export default Table;
