import { routes } from "constants/routes";

import React, { useState, useEffect } from "react";

import postsApi from "apis/posts";
import Blog from "components/Blogs/Blog";
import { PageLoader, PageTitle } from "components/commons";
import { isNil, isEmpty, either } from "ramda";
import { useLocation } from "react-router-dom";
import { formatDate } from "utils/formatDate";

const Blogs = ({ history, fetchFiltered = false }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const filterParams = {};
  for (const [key, value] of params.entries()) {
    if (filterParams[key]) {
      filterParams[key] = [].concat(filterParams[key], value);
    } else {
      filterParams[key] = value;
    }
  }

  const fetchPosts = async () => {
    try {
      const {
        data: { posts },
      } = await postsApi.fetch();
      setPosts(posts);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      logger.error(error);
    }
  };

  const fetchFilteredPosts = async () => {
    try {
      const {
        data: { posts },
      } = await postsApi.fetch(filterParams);
      setPosts(posts);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      logger.error(error);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (fetchFiltered) {
      fetchFilteredPosts();
    } else {
      fetchPosts();
    }
  }, [fetchFiltered, search]);

  if (loading) {
    return (
      <div className="h-screen w-screen">
        <PageLoader />
      </div>
    );
  }

  const showPost = slug => {
    history.push(`/blogs/${slug}/show`);
  };

  if (either(isNil, isEmpty)(posts)) {
    return (
      <div className="flex h-full w-full flex-col space-y-12 pb-4 pl-14 pr-10 pt-4">
        <PageTitle
          enable_button
          button_text="Add new blog post"
          handleClick={() => (window.location.href = routes.blogs.create_blog)}
          title="Blog posts"
        />
        <div className="flex h-5/6 items-center justify-center">
          <h1 className="my-5 text-center text-xl leading-5">No posts.</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col space-y-12 pb-4 pl-14 pr-10 pt-4">
      <PageTitle
        enable_button
        button_text="Add new blog post"
        handleClick={() => (window.location.href = routes.blogs.create_blog)}
        title="Blog posts"
      />
      <div className="h-full flex-1 space-y-4 overflow-y-auto">
        {posts.map(
          ({ id, title, updated_at, slug, categories, user: { name } }) => (
            <Blog
              categories={categories.map(category => category.name)}
              date={formatDate(updated_at)}
              key={id}
              name={name}
              showPost={showPost}
              slug={slug}
              title={title}
            />
          )
        )}
      </div>
    </div>
  );
};

export default Blogs;
