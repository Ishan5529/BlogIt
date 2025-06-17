import { USER_ID } from "constants/user_details";

import React, { useState, useEffect } from "react";

import postsApi from "apis/posts";
import { PageTitle, PageLoader } from "components/commons";

import Table from "./Table";

const UserBlogs = ({ history }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const sortPosts = data =>
    data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

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
          ? { ...p, status, updated_at: new Date().toISOString() }
          : p
      );
      setPosts(sortPosts(updatedPosts));
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <div className="mt-8 flex h-full flex-col space-y-6 overflow-y-auto pb-20 pl-10 pr-40">
      <PageTitle title="My blog posts" />
      <p className="text-xl font-medium">
        {posts.length} {posts.length === 1 ? "article" : "articles"}
      </p>
      <Table
        data={posts}
        destroyPost={destroyPost}
        editPost={editPost}
        handleStatusToggle={handleStatusToggle}
      />
    </div>
  );
};

export default UserBlogs;
