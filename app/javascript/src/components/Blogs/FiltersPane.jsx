import React from "react";

import { Input, Button } from "components/commons";
import { Pane, Typography } from "neetoui";
import Select from "react-select";

const FiltersPane = ({
  isOpen,
  onClose,
  title,
  setTitle,
  categories,
  setCategories,
  allCategories,
  status,
  setStatus,
  handleFilterSubmit,
  handleFilterReset,
}) => (
  <Pane className="w-1/3" isOpen={isOpen} onClose={onClose}>
    <div className="flex h-full flex-col justify-between px-8 py-10">
      <div>
        <div id="Header">
          <Typography style="h2" weight="semibold">
            Filters
          </Typography>
        </div>
        <div className="mt-6" id="Body">
          <div className="mb-4 flex w-full flex-col space-y-6">
            <Input
              label="Title"
              placeholder="Enter title"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
            <label>
              <p className="block text-lg font-medium text-gray-800">
                Category
              </p>
              <Select
                isMulti
                className="basic-multi-select"
                classNamePrefix="select"
                options={allCategories}
                placeholder="Select categories"
                value={categories}
                onChange={selected => setCategories(selected || [])}
              />
            </label>
            <label>
              <p className="block text-lg font-medium text-gray-800">Status</p>
              <Select
                isClearable
                className="basic-select"
                classNamePrefix="select"
                placeholder="Select status"
                value={status}
                options={["Published", "Draft"].map(status => ({
                  value: status.toLowerCase(),
                  label: status,
                }))}
                onChange={selected => setStatus(selected)}
              />
            </label>
          </div>
        </div>
      </div>
      <div className="mb-8 flex items-center space-x-2" id="Footer">
        <Button
          buttonText="Done"
          className="px-8"
          onClick={handleFilterSubmit}
        />
        <Button
          buttonText="Clear filters"
          className="px-8"
          style="secondary"
          onClick={handleFilterReset}
        />
      </div>
    </div>
  </Pane>
);

export default FiltersPane;
