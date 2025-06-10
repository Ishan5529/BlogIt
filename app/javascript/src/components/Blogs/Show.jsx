import React, { useEffect, useState } from "react";

import postsApi from "apis/posts";
import BlogContent from "components/Blogs/BlogContent";
import { PageLoader, PageTitle } from "components/commons";
import { useHistory, useParams } from "react-router-dom";

const Show = () => {
  const [post, setPost] = useState({});
  const [pageLoading, setPageLoading] = useState(true);
  const { slug } = useParams();
  const history = useHistory();

  const fetchPostDetails = async () => {
    try {
      const {
        data: { post },
      } = await postsApi.show(slug);
      setPost(post);
      setPageLoading(false);
    } catch (error) {
      logger.error(error);
      history.push("/");
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, []);

  if (pageLoading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-12 pl-10">
      <PageTitle title={post.title} />
      <div className="space-y-2">
        <BlogContent blog_content={post.description} />
      </div>
    </div>
  );
};

export default Show;
