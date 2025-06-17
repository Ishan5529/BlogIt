import { USER_ID } from "constants/user_details";

import React, { useEffect, useState } from "react";

import postsApi from "apis/posts";
import BlogContent from "components/Blogs/BlogContent";
import { PageLoader, PageTitle, Profile } from "components/commons";
import { useHistory, useParams } from "react-router-dom";
import { formatDate } from "utils/formatDate";

import { DEFAULT_PROFILE_IMAGE_URL } from "../../constants/user_details";

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

  const isDraft = post.status === "draft" && post.user?.id === USER_ID;

  return (
    <div className="mt-8 flex h-full flex-col space-y-8 overflow-y-auto pb-20 pl-10 pr-40">
      <div className="space-y-2">
        <BlogContent
          categories={post.categories.map(category => category.name)}
        />
        <PageTitle
          enable_edit_icon={post.user?.id === USER_ID}
          show_draft={isDraft}
          title={post.title}
          edit_url={
            post.user?.id === USER_ID ? `/blogs/${slug}/edit` : undefined
          }
        />
      </div>
      <div className="flex flex-row space-x-6">
        <Profile
          profile_img_url={post.user?.profile_img || DEFAULT_PROFILE_IMAGE_URL}
        />
        <div className="flex flex-col space-y-1">
          <p className="text-gray-600">{post.user.name}</p>
          <p className="text-gray-600">{formatDate(post.updated_at)}</p>
        </div>
      </div>
      <div className="pr-32">
        <p className="text-gray-700">{post.description}</p>
      </div>
    </div>
  );
};

export default Show;
