import React, { useState, useEffect } from "react";

import postsApi from "apis/posts";
import Show from "components/Blogs/Show";
import { PageLoader } from "components/commons";
import { useHistory, useParams } from "react-router-dom";

const Preview = () => {
  const [post, setPost] = useState(null);
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
      setPageLoading(false);
      history.goBack();
      logger.error(error);
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, []);

  if (pageLoading || !post) {
    return <PageLoader />;
  }

  return <Show disable_edit disable_fetch enable_back_btn data={post} />;
};

export default Preview;
