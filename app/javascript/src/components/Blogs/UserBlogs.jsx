import { USER_ID } from "constants/user_details";

import React, { useState, useEffect } from "react";

import postsApi from "apis/posts";
import { PageTitle, PageLoader } from "components/commons";
import { Filter, Down } from "neetoicons";

import Table from "./Table";

const UserBlogs = ({ history }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([
    "title",
    "category",
    "last_published_at",
    "status",
  ]);

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
    fetchUserBlogs();
  }, []);

  const fetchUserBlogs = async () => {
    try {
      const {
        data: { posts },
      } = await postsApi.fetch({ user_id: USER_ID });
      if (!posts || posts.length === 0) {
        setPosts([]);
        setLoading(false);

        return;
      }
      setPosts(sortPosts(posts));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      logger.error(error);
    }
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
          <Filter />
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
