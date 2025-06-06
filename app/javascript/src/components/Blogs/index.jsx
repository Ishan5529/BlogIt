import React, { useState, useEffect } from "react";

import postsApi from "apis/posts";
import Blog from "components/Blogs/Blog";
import { PageLoader, PageTitle } from "components/commons";
import { isNil, isEmpty, either } from "ramda";
import { formatDate } from "utils/formatDate";

const Blogs = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const {
        data: { posts },
      } = await postsApi.fetch();
      setPosts(posts);
      setLoading(false);
    } catch (error) {
      logger.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen">
        <PageLoader />
      </div>
    );
  }

  if (either(isNil, isEmpty)(posts)) {
    return (
      <div className="flex h-5/6 items-center justify-center">
        <h1 className="my-5 text-center text-xl leading-5">No posts yet.</h1>
      </div>
    );
  }

  return (
    <div className="space-y-12 pl-10">
      <PageTitle title="Blog posts" />
      <div className="h-full space-y-4 overflow-y-auto">
        {posts.map(({ id, title, description, updated_at }) => (
          <Blog
            blog_content={description}
            blog_date={formatDate(updated_at)}
            blog_title={title}
            className="shadow-sm"
            key={id}
          />
        ))}
      </div>
    </div>
  );
};

export default Blogs;
