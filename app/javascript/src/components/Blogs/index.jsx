import { routes } from "constants/routes";

import React, { useState, useEffect } from "react";

import postsApi from "apis/posts";
import votesApi from "apis/votes";
import Blog from "components/Blogs/Blog";
import DisplayVotes from "components/Blogs/DisplayVotes";
import { PageLoader, PageTitle } from "components/commons";
import { isNil, isEmpty, either } from "ramda";
import { useLocation } from "react-router-dom";
import { formatDate } from "utils/formatDate";

const Blogs = ({ history, fetchFiltered = false }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voteStatus, setVoteStatus] = useState({});

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

  const initializeVoteStatus = async posts => {
    const statusResults = await Promise.all(
      posts.map(post =>
        votesApi
          .fetchVoteStatus({ slug: post.slug })
          .catch(() => ({ vote_type: "none" }))
      )
    );
    const statusObj = {};
    posts.forEach((post, idx) => {
      statusObj[post.slug] = {
        upVoted: statusResults[idx].vote_type === "upvote",
        downVoted: statusResults[idx].vote_type === "downvote",
      };
    });
    setVoteStatus(statusObj);
  };

  const fetchPosts = async () => {
    try {
      const {
        data: { posts },
      } = await postsApi.fetch({ status: "published" });
      setPosts(posts);
      initializeVoteStatus(posts);
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
      } = await postsApi.fetch({ ...filterParams, status: "published" });
      setPosts(posts);
      initializeVoteStatus(posts);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      logger.error(error);
    }
  };

  useEffect(() => {
    if (fetchFiltered) {
      fetchFilteredPosts();
    } else {
      fetchPosts();
    }
  }, [fetchFiltered, search]);

  const showPost = slug => {
    history.push(`/blogs/${slug}/show`);
  };

  const handleUpVote = async (slug, alreadyUpVoted) => {
    try {
      let response;
      if (alreadyUpVoted) {
        response = await votesApi.create({ slug, voteType: null });
        setVoteStatus(prev => ({
          ...prev,
          [slug]: { upVoted: false, downVoted: false },
        }));
      } else {
        response = await votesApi.create({ slug, voteType: 1 });
        setVoteStatus(prev => ({
          ...prev,
          [slug]: { upVoted: true, downVoted: false },
        }));
      }

      if (response?.data) {
        setPosts(prev =>
          prev.map(post =>
            post.slug === slug
              ? {
                  ...post,
                  upvotes: response.data.upvotes,
                  downvotes: response.data.downvotes,
                }
              : post
          )
        );
      }
    } catch (error) {
      logger.error(error);
    }
  };

  const handleDownVote = async (slug, alreadyDownVoted) => {
    try {
      let response;
      if (alreadyDownVoted) {
        response = await votesApi.create({ slug, voteType: null });
        setVoteStatus(prev => ({
          ...prev,
          [slug]: { upVoted: false, downVoted: false },
        }));
      } else {
        response = await votesApi.create({ slug, voteType: -1 });
        setVoteStatus(prev => ({
          ...prev,
          [slug]: { upVoted: false, downVoted: true },
        }));
      }

      if (response?.data) {
        setPosts(prev =>
          prev.map(post =>
            post.slug === slug
              ? {
                  ...post,
                  upvotes: response.data.upvotes,
                  downvotes: response.data.downvotes,
                }
              : post
          )
        );
      }
    } catch (error) {
      logger.error(error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen">
        <PageLoader />
      </div>
    );
  }

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
          ({
            id,
            title,
            updated_at,
            slug,
            upvotes,
            downvotes,
            isBloggable,
            categories,
            user: { name },
          }) => {
            const status = voteStatus[slug] || {
              upVoted: false,
              downVoted: false,
            };

            return (
              <div
                className="flex w-full flex-row space-x-4 border-b border-gray-300"
                key={id}
              >
                <Blog
                  categories={categories.map(category => category.name)}
                  date={formatDate(updated_at)}
                  isBloggable={isBloggable}
                  name={name}
                  showPost={showPost}
                  slug={slug}
                  title={title}
                />
                <DisplayVotes
                  downvotes={downvotes}
                  handleDownVote={() => handleDownVote(slug, status.downVoted)}
                  handleUpVote={() => handleUpVote(slug, status.upVoted)}
                  upvotes={upvotes}
                  voteStatus={status}
                />
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default Blogs;
