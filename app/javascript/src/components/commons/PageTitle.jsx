import React, { useState, useEffect, useRef } from "react";

import classnames from "classnames";
import { Tooltip } from "components/commons";
import { Edit, MenuHorizontal, ExternalLink } from "neetoicons";
import { NavLink } from "react-router-dom";

const PageTitle = ({
  title,
  enable_button,
  enable_back_btn,
  handleBack = null,
  enable_preview,
  showPreview = null,
  enable_secondary_button,
  enable_options,
  disabled,
  handleDelete = null,
  handleClick = null,
  handleSecondaryClick = null,
  button_text,
  secondary_button_text,
  button_options,
  handleClickOptions,
  initialStatus = 0,
  changeStatus,
  enable_edit_icon,
  edit_url = "/edit",
  show_draft,
}) => {
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [btnIdx, setBtnIdx] = useState(initialStatus);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }

      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="mt-8 flex items-center justify-between pr-20">
      <div className="flex flex-row items-center">
        <h1 className="text-5xl font-semibold">{title}</h1>
        {show_draft && (
          <span className="ml-8 mt-2 rounded-xl border border-red-500 px-6 py-0.5 text-red-500">
            Draft
          </span>
        )}
        {enable_back_btn && (
          <div
            // className="ml-4 rounded bg-gray-100 px-4 py-2 text-black hover:bg-gray-200"
            className="ml-4 mt-2 cursor-pointer rounded-xl border border-black bg-gray-50 px-6 py-0.5 text-black hover:bg-gray-100"
            onClick={handleBack}
          >
            Back
          </div>
        )}
      </div>
      <div className="flex flex-row space-x-2">
        {enable_preview && (
          <Tooltip tooltipContent="Preview">
            <div
              className="ml-4 cursor-pointer px-2 pt-3 text-gray-500 transition-transform duration-300 hover:scale-110 hover:text-gray-800"
              onClick={showPreview}
            >
              <ExternalLink size={28} />
            </div>
          </Tooltip>
        )}
        {enable_secondary_button && (
          <button
            className="ml-4 rounded bg-gray-100 px-10 py-3 text-black hover:bg-gray-200"
            onClick={handleSecondaryClick}
          >
            {secondary_button_text}
          </button>
        )}
        {enable_button && (
          <button
            disabled={disabled}
            className={classnames(
              "ml-4 rounded bg-black px-10 py-3 text-white hover:bg-gray-900",
              {
                "cursor-not-allowed opacity-50": disabled,
              }
            )}
            onClick={handleClick}
          >
            {button_text}
          </button>
        )}
        {button_options && (
          <div className="relative ml-4 flex flex-row" ref={dropdownRef}>
            <button
              disabled={disabled}
              type="button"
              className={classnames(
                "mr-[1px] flex items-center rounded bg-black px-10 py-3 text-white hover:bg-gray-900",
                {
                  "cursor-not-allowed opacity-65": disabled,
                }
              )}
              onClick={handleClickOptions[btnIdx]}
            >
              {button_options[btnIdx]}
            </button>
            <button
              className="flex items-center rounded bg-black px-2 py-3 text-white hover:bg-gray-900"
              type="button"
              onClick={() => setOpen(prev => !prev)}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 9l-7 7-7-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {open && (
              <div className="absolute right-0 z-10 mt-12 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                {button_options.map((option, idx) => (
                  <button
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    key={option}
                    onClick={() => {
                      setOpen(false);
                      setBtnIdx(idx);
                      changeStatus[idx]();
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {enable_edit_icon && (
          <Tooltip tooltipContent="Edit">
            <NavLink
              className="ml-2 text-gray-400 hover:text-gray-500"
              to={edit_url}
            >
              <Edit size="32px" />
            </NavLink>
          </Tooltip>
        )}
        <div className="relative" ref={menuRef}>
          {enable_options && (
            <div
              className="pl-2 text-gray-400 hover:text-gray-500"
              onClick={() => setOpenMenu(prev => !prev)}
            >
              <MenuHorizontal size="32px" />
            </div>
          )}
          {openMenu && (
            <div
              className="absolute right-0 z-10 mt-4 flex w-48 items-center rounded-md bg-gray-50 px-4 py-3 text-red-600 shadow-lg ring-1 ring-black ring-opacity-5 hover:cursor-pointer hover:bg-gray-100"
              onClick={() => handleDelete()}
            >
              Delete
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageTitle;
