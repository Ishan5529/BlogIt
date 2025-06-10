import React, { useState } from "react";

import postsApi from "apis/posts";
import Form from "components/Blogs/Form";
import { PageTitle } from "components/commons";

const Create = ({ history }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();
    setLoading(true);
    try {
      await postsApi.create({ title, description: content });
      setLoading(false);
      history.push("/blogs");
    } catch (error) {
      logger.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 pl-10">
      <PageTitle title="Add new blog" />
      <Form
        content={content}
        handleSubmit={handleSubmit}
        loading={loading}
        setContent={setContent}
        setTitle={setTitle}
        title={title}
      />
    </div>
  );
};

export default Create;
