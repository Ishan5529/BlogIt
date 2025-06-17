import { USER_ID } from "constants/user_details";

import React, { useState, useEffect } from "react";

import categoriesApi from "apis/categories";
import postsApi from "apis/posts";
import Form from "components/Blogs/Form";
import { PageTitle } from "components/commons";
import { useParams } from "react-router-dom";

const Edit = ({ history }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState([]);
  const [original, setOriginal] = useState({
    title: "",
    content: "",
    categories: [],
  });
  const [allCategories, setAllCategories] = useState([]);
  const { slug } = useParams();

  useEffect(() => {
    fetchAllCategories();
    fetchPostDetails();
  }, []);

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
      setAllCategories([]);
      logger.error(error);
    }
  };

  const fetchPostDetails = async () => {
    try {
      const {
        data: { post },
      } = await postsApi.show(slug);
      setTitle(post.title);
      setContent(post.description);
      setCategories(
        post.categories.map(category => ({
          value: category.id,
          label: category.name,
        }))
      );

      setOriginal({
        title: post.title,
        content: post.description,
        categories: post.categories.map(category => ({
          value: category.id,
          label: category.name,
        })),
      });
    } catch (error) {
      logger.error(error);
    }
  };

  const isUnchanged =
    title === original.title &&
    content === original.content &&
    JSON.stringify(categories) === JSON.stringify(original.categories);

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      await postsApi.update({
        slug,
        payload: {
          title,
          description: content,
          category_ids: categories.map(category => category.value),
          user_id: USER_ID,
        },
      });
      history.push("/");
    } catch (error) {
      logger.error(error);
    }
  };

  const handleSaveAsDraft = async () => {
    try {
      await postsApi.update({
        slug,
        payload: {
          title,
          description: content,
          category_ids: categories.map(category => category.value),
          user_id: USER_ID,
          status: "draft",
        },
      });
      history.push("/");
    } catch (error) {
      logger.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await postsApi.destroy(slug);
      history.push("/");
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <div className="space-y-12 py-4 pl-14">
      <PageTitle
        enable_options
        enable_secondary_button
        button_options={["Publish", "Save as draft"]}
        button_text="Save"
        disabled={isUnchanged}
        handleClickOptions={[handleSubmit, handleSaveAsDraft]}
        handleDelete={handleDelete}
        handleSecondaryClick={() => history.push("/")}
        secondary_button_text="Cancel"
        title="Edit blog post"
      />
      <Form
        allCategories={allCategories}
        categories={categories}
        content={content}
        setCategories={setCategories}
        setContent={setContent}
        setTitle={setTitle}
        title={title}
      />
    </div>
  );
};

export default Edit;
