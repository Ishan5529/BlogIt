import React, { useState, useEffect } from "react";

import { Search, Plus } from "@bigbinary/neeto-icons";
import categoriesApi from "apis/categories";
import classNames from "classnames";
import Blogs from "components/Blogs";
import { PageLoader, Modal } from "components/commons";
import { useHistory } from "react-router-dom";

// Simple modal component

const FilteredBlogs = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const history = useHistory();

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
        setLoading(false);
      } catch (error) {
        logger.error(error);
        setAllCategories([]);
        setLoading(false);
      }
    };
    fetchAllCategories();
  }, []);

  useEffect(() => {
    const sortedSelected = [...selectedCategories].sort((a, b) => {
      const catA = allCategories.find(c => c.label === a);
      const catB = allCategories.find(c => c.label === b);

      return (catA?.value || 0) - (catB?.value || 0);
    });

    const params = sortedSelected
      .map(categoryLabel => {
        const cat = allCategories.find(c => c.label === categoryLabel);

        return cat ? `category_ids[]=${encodeURIComponent(cat.value)}` : null;
      })
      .filter(Boolean)
      .join("&");

    history.replace({
      pathname: "/blogs/filter",
      search: params ? `?${params}` : "",
    });
  }, [selectedCategories, allCategories, history]);

  const handleCreateCategory = async name => {
    try {
      await categoriesApi.create({ name });
      setShowModal(false);
      setLoading(true);
      const {
        data: { categories },
      } = await categoriesApi.fetch();

      setAllCategories(
        categories.map(category => ({
          value: category.id,
          label: category.name,
        }))
      );
      setLoading(false);
    } catch (error) {
      logger.error(error);
      setShowModal(false);
      setLoading(false);
    }
  };

  const toggleCategoryFilter = event => {
    const category = event.target.innerText;
    setSelectedCategories(prevSelected => {
      if (prevSelected.includes(category)) {
        return prevSelected.filter(item => item !== category);
      }

      return [...prevSelected, category];
    });
  };

  const filteredCategories = searchTerm
    ? allCategories.filter(cat =>
        cat.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allCategories;

  if (loading) {
    return (
      <div className="h-screen w-screen">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-row">
      <Modal
        input_label="Category title"
        input_placeholder="Enter category name"
        isOpen={showModal}
        title="New category"
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateCategory}
      />
      <div className="w-[550px] space-y-12 bg-gray-100 p-10">
        <div className="flex flex-row items-center justify-between">
          <h3>CATEGORIES</h3>
          <div className="flex flex-row items-center">
            {showSearch || searchTerm ? (
              <input
                autoFocus
                className="ml-2 rounded border px-2 text-sm"
                placeholder="Search category"
                type="text"
                value={searchTerm}
                onBlur={e => {
                  if (!e.target.value) setShowSearch(false);
                }}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  if (!showSearch) setShowSearch(true);
                }}
                onKeyDown={e => {
                  if (e.key === "Escape") {
                    setSearchTerm("");
                    setShowSearch(false);
                  }
                }}
              />
            ) : (
              <Search
                className="cursor-pointer text-gray-500"
                onClick={() => setShowSearch(true)}
              />
            )}
            <Plus
              className="ml-2 text-gray-500"
              size={24}
              style={{ cursor: "pointer" }}
              onClick={() => setShowModal(true)}
            />
          </div>
        </div>
        <div>
          <ul className="mt-4 space-y-4">
            {filteredCategories.map(category => (
              <li
                key={category.value}
                className={classNames(
                  "cursor-pointer rounded-lg px-4 py-2 text-lg",
                  {
                    "bg-white hover:bg-gray-50": selectedCategories.includes(
                      category.label
                    ),
                    "bg-gray-200 hover:bg-gray-300":
                      !selectedCategories.includes(category.label),
                  }
                )}
                onClick={toggleCategoryFilter}
              >
                {category.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Blogs
        fetchFiltered
        history={{ push: path => (window.location.href = path) }}
      />
    </div>
  );
};

export default FilteredBlogs;
