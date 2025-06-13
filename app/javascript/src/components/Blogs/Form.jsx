import React from "react";

import { Button, Input } from "components/commons";
import Select from "react-select";

const Form = ({
  title,
  setTitle,
  categories,
  setCategories,
  allCategories = [],
  content,
  setContent,
  loading,
  handleSubmit,
}) => (
  <div className="mr-32 h-full rounded-2xl border border-gray-300 py-16 pl-16 pr-28 shadow-md">
    <form
      className="flex h-full w-full flex-col space-y-48"
      onSubmit={handleSubmit}
    >
      <div className="flex h-full w-full flex-col space-y-8">
        <Input
          label="Title*"
          placeholder="Blog Title (Max 125 Characters Allowed)"
          value={title}
          onChange={e => setTitle(e.target.value.slice(0, 125))}
        />
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Categories*
          </label>
          <Select
            isMulti
            className="basic-multi-select"
            classNamePrefix="select"
            options={allCategories}
            placeholder="Select categories..."
            value={categories}
            onChange={selected => setCategories(selected)}
          />
        </div>
        <Input
          className="h-40 text-left align-top"
          label="Description*"
          placeholder="Blog Description (Max 10000 Characters Allowed)"
          rows={8}
          type="textarea"
          value={content}
          onChange={e => setContent(e.target.value.slice(0, 10000))}
        />
      </div>
      <div className="mt-24 flex w-full items-center justify-end space-x-4">
        <div className="rounded-md border border-black">
          <Button
            buttonText="Cancel"
            className="w-32"
            loading={loading}
            style="secondary"
            onClick={() => (window.location.href = "/")}
          />
        </div>
        <Button
          buttonText="Submit"
          className="w-32"
          loading={loading}
          style="primary"
          type="submit"
        />
      </div>
    </form>
  </div>
);

export default Form;
