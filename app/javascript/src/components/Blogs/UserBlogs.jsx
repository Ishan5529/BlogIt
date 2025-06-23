import { USER_ID } from "constants/user_details";

import React, { useState, useEffect } from "react";

import categoriesApi from "apis/categories";
import postsApi from "apis/posts";
import { PageTitle, PageLoader, Input, Button } from "components/commons";
import { Filter, Down } from "neetoicons";
import { Typography, Pane } from "neetoui";
import Select from "react-select";

import Table from "./Table";

const UserBlogs = ({ history }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(false);
  const [isPaneOpen, setIsPaneOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([
    "title",
    "category",
    "last_published_at",
    "status",
  ]);
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [allCategories, setAllCategories] = useState([]);

  const allColumns = ["title", "category", "last_published_at", "status"];

  const sortPosts = data =>
    data.sort((a, b) => {
      const getValidDate = post => {
        if (post.status === "published") {
          return new Date(post.last_published_at);
        }

        return new Date(post.updated_at);
      };

      const dateA = getValidDate(a);
      const dateB = getValidDate(b);

      return dateB - dateA;
    });

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const {
          data: { categories },
        } = await categoriesApi.fetch();

        setAllCategories(
          categories.map(category => ({
            value: category.id,
            label: category.name,
          }))
        );
      } catch (error) {
        setAllCategories([]);
        logger.error(error);
      }
    };
    fetchAllCategories();
  }, []);

  useEffect(() => {
    fetchUserBlogs();
  }, []);

  const fetchUserBlogs = async (filters = {}) => {
    try {
      const {
        data: { posts },
      } = await postsApi.fetch({ user_id: USER_ID, ...filters });

      setPosts(sortPosts(posts));
      setLoading(false);

      return posts;
    } catch (error) {
      setLoading(false);
      logger.error(error);
    }

    return [];
  };

  const editPost = slug => {
    history.push(`/blogs/${slug}/edit`);
  };

  if (loading) {
    return <PageLoader />;
  }

  const destroyPost = async slug => {
    try {
      await postsApi.destroy({ slug, quiet: true });
      setPosts(posts.filter(post => post.slug !== slug));
    } catch (error) {
      logger.error(error);
    }
  };

  const handleStatusToggle = async (slug, status) => {
    try {
      await postsApi.update({ quiet: true, slug, payload: { status } });
      const updatedPosts = posts.map(p =>
        p.slug === slug
          ? {
              ...p,
              status,
              updated_at: new Date().toISOString(),
              last_published_at:
                status === "published"
                  ? new Date().toISOString()
                  : p.last_published_at,
            }
          : p
      );
      setPosts(sortPosts(updatedPosts));
    } catch (error) {
      logger.error(error);
    }
  };

  const handleMenuToggle = () => {
    setOpenMenu(!openMenu);
  };

  const handleFilterSubmit = async () => {
    setLoading(true);
    const filters = {
      title,
      status: status?.value,
      category_ids: categories.map(c => c.value),
    };
    await fetchUserBlogs(filters);
    setIsPaneOpen(false);
  };

  const handleFilterReset = () => {
    setTitle("");
    setCategories([]);
    setStatus("");
  };

  return (
    <div className="mt-8 flex h-full flex-col space-y-6 overflow-y-auto pb-20 pl-10 pr-40">
      <PageTitle title="My blog posts" />
      <div className="flex items-center justify-between">
        <p className="text-xl font-medium">
          {posts.length} {posts.length === 1 ? "article" : "articles"}
        </p>
        <div className="flex items-center space-x-4">
          <div
            className="relative flex items-center space-x-0.5"
            onClick={handleMenuToggle}
          >
            <p className="h-full bg-gray-100 px-3 py-1 hover:bg-gray-200">
              Columns
            </p>
            <div className="h-full bg-gray-100 hover:bg-gray-200">
              <Down
                size={29}
                className={`transition-transform duration-200 ${
                  openMenu ? "rotate-180" : ""
                }`}
              />
            </div>
            {openMenu && (
              <div
                className="absolute left-12 top-8 z-10 mt-2 flex w-48 flex-col space-y-2 rounded-md border bg-white p-3 shadow-lg"
                onClick={e => e.stopPropagation()}
              >
                {allColumns.map(column => (
                  <label
                    className="flex items-center space-x-2"
                    key={column}
                    style={
                      column === "title"
                        ? { opacity: 0.6, cursor: "not-allowed" }
                        : {}
                    }
                    onClick={e => e.stopPropagation()}
                  >
                    <input
                      checked={selectedColumns.includes(column)}
                      className="cursor-pointer text-green-800 hover:text-green-700"
                      disabled={column === "title"}
                      type="checkbox"
                      onClick={e => e.stopPropagation()}
                      onChange={() => {
                        setSelectedColumns(prev =>
                          prev.includes(column)
                            ? prev.filter(c => c !== column)
                            : [...prev, column]
                        );
                      }}
                    />
                    <span className="text-sm">
                      {column.charAt(0).toUpperCase() +
                        column.slice(1).replace(/_/g, " ")}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
          <div>
            <Filter onClick={() => setIsPaneOpen(true)} />
            <Pane
              className="w-1/3"
              isOpen={isPaneOpen}
              onClose={() => setIsPaneOpen(false)}
            >
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
                          onChange={selected => setCategories(selected)}
                        />
                      </label>
                      <label>
                        <p className="block text-lg font-medium text-gray-800">
                          Status
                        </p>
                        <Select
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
          </div>
        </div>
      </div>
      <Table
        data={posts}
        destroyPost={destroyPost}
        editPost={editPost}
        handleStatusToggle={handleStatusToggle}
        selectedColumns={selectedColumns}
      />
    </div>
  );
};

export default UserBlogs;
