# frozen_string_literal: true

require "test_helper"

class CategoryTest < ActiveSupport::TestCase
  def setup
    @category = build(:category)
  end

  def test_category_should_not_be_valid_and_saved_without_name
    @category.name = ""
    assert_not @category.valid?
    assert_includes @category.errors.full_messages, "Name can't be blank"
  end

  def test_category_name_should_be_unique
    @category.save!
    @duplicate_category = build(:category, name: @category.name)
    assert_not @duplicate_category.valid?
  end

  def test_name_should_be_of_valid_length
    @category.name = "a" * (Category::MAX_NAME_LENGTH + 1)
    assert @category.invalid?
  end

  def test_posts_with_no_category_are_deleted_when_category_is_deleted
    post_category = create(:category)
    create(:post, categories: [post_category])

    assert_difference("Post.count", -1) do
      post_category.destroy
    end
  end

  def test_posts_with_multiple_categories_are_not_deleted_when_category_is_deleted
    post_category = create(:category)
    post_category2 = create(:category)
    create(:post, categories: [post_category, post_category2])

    assert_difference("Post.count", 0) do
      post_category.destroy
    end
  end
end
