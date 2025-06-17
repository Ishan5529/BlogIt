import React from "react";

import { CheckboxInactive } from "neetoicons";

const Header = () => (
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
      <th className="w-[23%]">CATEGORY</th>
      <th className="w-[15%]">LAST PUBLISHED AT</th>
      <th className="w-[10%]">STATUS</th>
      <th className="w-[4%]" />
    </tr>
  </thead>
);

export default Header;
