import React, { useState, useEffect, useRef } from "react";

import classnames from "classnames";
import { Tooltip } from "components/commons";
import { CheckboxInactive, MenuHorizontal } from "neetoicons";
import { capitalize } from "utils/capitalize";
import { formatDateTime } from "utils/formatDateTime";

const Row = ({ data, destroyPost, editPost, handleStatusToggle }) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});

  useEffect(() => {
    function handleClickOutside(event) {
      const openMenuRef = menuRefs.current[openMenuId];
      if (openMenuRef && !openMenuRef.contains(event.target)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  return (
    <tbody className="divide-y divide-gray-200 bg-white">
      {data.map((rowData, idx) => {
        const toggledStatus =
          rowData.status === "published" ? "Unpublish" : "Publish";

        return (
          <tr
            key={rowData.id}
            className={classnames("w-full border-none hover:bg-blue-50", {
              "bg-gray-50": idx % 2 === 0,
              "bg-white": idx % 2 !== 0,
            })}
          >
            <td>
              <div className="flex w-full items-center justify-center py-2.5">
                <CheckboxInactive
                  className="cursor-pointer text-gray-300 hover:text-gray-400"
                  size={20}
                />
              </div>
            </td>
            <td onClick={() => editPost(rowData.slug)}>
              <Tooltip tooltipContent={rowData.title}>
                <p className="max-w-2xl cursor-pointer overflow-hidden truncate whitespace-nowrap text-green-600 focus:text-green-700">
                  {rowData.title}
                </p>
              </Tooltip>
            </td>
            <td>
              <span>
                {rowData.categories.map(category => category.name).join(", ")}
              </span>
            </td>
            <td>
              <span>{formatDateTime(rowData.last_published_at)}</span>
            </td>
            <td>
              <span>{capitalize(rowData.status)}</span>
            </td>
            <td>
              <div
                className="relative"
                ref={el => (menuRefs.current[rowData.id] = el)}
              >
                <div
                  className="pl-2 text-gray-400 hover:text-gray-500"
                  onClick={() =>
                    setOpenMenuId(openMenuId === rowData.id ? null : rowData.id)
                  }
                >
                  <MenuHorizontal size="32px" />
                </div>
                {openMenuId === rowData.id && (
                  <div>
                    <div
                      className="absolute left-3 z-10 mt-0 flex w-48 flex-col space-y-4 rounded-md border bg-gray-50 px-4 py-3 text-red-600 shadow-lg ring-1 ring-black ring-opacity-5 hover:cursor-pointer hover:bg-gray-100"
                      id={`menu-${rowData.id}-s`}
                      onClick={() => {
                        setOpenMenuId(null);
                        const newStatus =
                          rowData.status === "published"
                            ? "draft"
                            : "published";
                        handleStatusToggle(rowData.slug, newStatus);
                      }}
                    >
                      {toggledStatus}
                    </div>
                    <div
                      className="absolute left-3 z-10 mt-12 flex w-48 flex-col space-y-4 rounded-md border bg-gray-50 px-4 py-3 text-red-600 shadow-lg ring-1 ring-black ring-opacity-5 hover:cursor-pointer hover:bg-gray-100"
                      id={`menu-${rowData.id}`}
                      onClick={() => {
                        setOpenMenuId(null);
                        destroyPost(rowData.slug);
                      }}
                    >
                      Delete
                    </div>
                  </div>
                )}
              </div>
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

export default Row;
