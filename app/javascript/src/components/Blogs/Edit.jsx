import { USER_ID } from "constants/user_details";

import React, { useState, useEffect } from "react";

import categoriesApi from "apis/categories";
import postsApi from "apis/posts";
import Form from "components/Blogs/Form";
import { PageTitle, PageLoader } from "components/commons";
import { useParams } from "react-router-dom";

const Edit = ({ history }) => {
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const [categories, setCategories] = useState([]);
  const [original, setOriginal] = useState({
    title: "",
    content: "",
    categories: [],
    status: "",
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
      setStatus(post.status);
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
        status: post.status,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      logger.error(error);
    }
  };

  const isUnchanged =
    title === original.title &&
    content === original.content &&
    status === original.status &&
    JSON.stringify(categories) === JSON.stringify(original.categories);

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      await postsApi.update({
        slug,
        payload: {
          status: "published",
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

  const handleSaveAsDraft = async ({ skip_dash = false, quiet = false }) => {
    try {
      await postsApi.update({
        slug,
        quiet,
        payload: {
          status: "draft",
          title,
          description: content,
          category_ids: categories.map(category => category.value),
          user_id: USER_ID,
        },
      });
      if (!skip_dash) {
        history.push("/");
      }
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

  const showPreview = async () => {
    setLoading(true);
    await handleSaveAsDraft({ skip_dash: true, quiet: true });
    setLoading(false);
    history.push(`/blogs/${slug}/preview`);
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-12 py-4 pl-14">
      <PageTitle
        enable_options
        enable_preview
        enable_secondary_button
        button_options={["Publish", "Save as draft"]}
        button_text="Save"
        changeStatus={[() => setStatus("published"), () => setStatus("draft")]}
        disabled={isUnchanged}
        handleClickOptions={[handleSubmit, handleSaveAsDraft]}
        handleDelete={handleDelete}
        handleSecondaryClick={() => history.push("/")}
        initialStatus={status === "published" ? 0 : 1}
        secondary_button_text="Cancel"
        showPreview={showPreview}
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
