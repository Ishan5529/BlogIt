import React from "react";

import { CheckboxInactive } from "neetoicons";

const Header = ({ selectedColumns }) => (
  <thead>
    <tr className="bg-white text-left text-xs font-medium uppercase leading-4 text-gray-400">
      <th className="w-[3%]">
        <div className="flex items-center justify-center py-2.5">
          <CheckboxInactive
            className="cursor-pointer text-gray-300 hover:text-gray-400"
            size={20}
          />
        </div>
      </th>
      <th className="w-[45%]">TITLE</th>
      {selectedColumns.includes("category") && (
        <th className="w-[23%]">CATEGORY</th>
      )}
      {selectedColumns.includes("last_published_at") && (
        <th className="w-[15%]">LAST PUBLISHED AT</th>
      )}
      {selectedColumns.includes("status") && (
        <th className="w-[10%]">STATUS</th>
      )}
      <th className="w-[4%]" />
    </tr>
  </thead>
);

export default Header;
