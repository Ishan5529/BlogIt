import { USER_ID } from "constants/user_details";

import React, { useState, useEffect } from "react";

import categoriesApi from "apis/categories";
import postsApi from "apis/posts";
import Form from "components/Blogs/Form";
import { PageTitle } from "components/commons";

const Create = ({ history }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(false);

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
        logger.error(error);
        setAllCategories([]);
      }
    };
    fetchAllCategories();
  }, []);

  const handleSubmit = async event => {
    event.preventDefault();
    setLoading(true);
    try {
      await postsApi.create({
        title,
        description: content,
        category_ids: categories.map(category => category.value),
        user_id: USER_ID,
      });
      setLoading(false);
      history.push("/blogs");
    } catch (error) {
      logger.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 py-4 pl-14">
      <PageTitle title="Add new blog" />
      <Form
        allCategories={allCategories}
        categories={categories}
        content={content}
        handleSubmit={handleSubmit}
        loading={loading}
        setCategories={setCategories}
        setContent={setContent}
        setTitle={setTitle}
        title={title}
      />
    </div>
  );
};

export default Create;
