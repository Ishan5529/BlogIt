import React from "react";

import Header from "./Header";
import Row from "./Row";

const Table = ({ data, destroyPost, editPost, handleStatusToggle }) => (
  <div className="inline-block w-full">
    <table className="w-full border-collapse">
      <Header />
      <Row
        data={data}
        destroyPost={destroyPost}
        editPost={editPost}
        handleStatusToggle={handleStatusToggle}
      />
    </table>
  </div>
);

export default Table;
