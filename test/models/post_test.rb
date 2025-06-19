# frozen_string_literal: true

require "test_helper"

class PostTest < ActiveSupport::TestCase
  def setup
    @category = create(:category)
    @user = create(:user)
    @post = build(:post, user: @user, categories: [@category])
  end

  def test_values_of_created_at_and_updated_at
    post = Post.new(
      title: "This is a test post", description: "This is a test description", user: @user,
      categories: [@category])
    assert_nil post.created_at
    assert_nil post.updated_at

    post.save!
    assert_not_nil post.created_at
    assert_equal post.updated_at, post.created_at

    post.update!(title: "This is a updated post")
    assert_not_equal post.updated_at, post.created_at
  end

  def test_post_is_valid_with_valid_attributes
    assert @post.valid?
  end

  def test_post_is_invalid_without_title
    @post.title = ""
    assert_not @post.valid?
    assert_includes @post.errors.full_messages, "Title can't be blank"
  end

  def test_title_should_be_of_valid_length
    @post.title = "a" * (Post::MAX_TITLE_LENGTH + 1)
    assert_not @post.valid?
    assert_includes @post.errors.full_messages, "Title is too long (maximum is #{Post::MAX_TITLE_LENGTH} characters)"
  end

  def test_post_is_invalid_without_description
    @post.description = ""
    assert_not @post.valid?
    assert_includes @post.errors.full_messages, "Description can't be blank"
  end

  def test_description_should_be_of_valid_length
    @post.description = "a" * (Post::MAX_DESCRIPTION_LENGTH + 1)
    assert_not @post.valid?
    assert_includes @post.errors.full_messages, "Description is too long (maximum is #{Post::MAX_DESCRIPTION_LENGTH} characters)"
  end

  def test_post_is_invalid_without_categories
    @post.categories = []
    assert_not @post.valid?
    assert_includes @post.errors.full_messages, "Categories can't be blank"
  end

  def test_post_is_invalid_without_user
    @post.user = nil
    assert_not @post.valid?
    assert_includes @post.errors.full_messages, "User must exist"
  end

  def test_post_is_invalid_with_negative_upvotes
    @post.upvotes = -1
    assert_not @post.valid?
    assert_includes @post.errors.full_messages, "Upvotes must be greater than or equal to 0"
  end

  def test_post_is_invalid_with_negative_downvotes
    @post.downvotes = -1
    assert_not @post.valid?
    assert_includes @post.errors.full_messages, "Downvotes must be greater than or equal to 0"
  end

  def test_post_is_invalid_without_is_bloggable
    @post.is_bloggable = nil
    assert_not @post.valid?
    assert_includes @post.errors.full_messages, "Is bloggable is not included in the list"
  end

  def test_slug_is_set_on_create
    @post.save!
    assert_not_nil @post.slug
    assert @post.slug.include?(@post.title.parameterize)
  end

  def test_error_raised_for_duplicate_slug
    another_test_post = create(:post)

    assert_raises ActiveRecord::RecordInvalid do
      another_test_post.update!(slug: @post.slug)
    end

    error_msg = another_test_post.errors.full_messages.to_sentence
    assert_match I18n.t("post.slug.immutable"), error_msg
  end

  def test_updating_title_does_not_update_slug
    @post.save!
    assert_no_changes -> { @post.reload.slug } do
      updated_post_title = "updated post title"
      @post.update!(title: updated_post_title)
      assert_equal updated_post_title, @post.title
    end
  end

  def test_slug_increments_when_similar_slug_exists
    post1 = create(:post, title: "Test Title")
    post2 = create(:post, title: "Test Title")

    assert_equal post1.slug, "test-title"
    assert_match(/^test-title-\d+$/, post2.slug)
    assert_not_equal post1.slug, post2.slug
  end

  def test_slug_is_immutable
    @post.save!
    @post.slug = "new-slug"
    assert_not @post.valid?
    assert_includes @post.errors.full_messages, "Slug is immutable!"
  end

  def test_existing_slug_prefixed_in_new_post_title_doesnt_break_slug_generation
    title_having_new_title_as_substring = "buy milk and apple"
    new_title = "buy milk"

    existing_post = create(:post, title: title_having_new_title_as_substring)
    assert_equal title_having_new_title_as_substring.parameterize, existing_post.slug

    new_post = create(:post, title: new_title)
    assert_equal new_title.parameterize, new_post.slug
  end

  def test_generated_slug_is_unique
    post1 = create(:post, title: "Not Unique Title")
    post2 = create(:post, title: "Not Unique Title")
    assert_not_equal post1.slug, post2.slug
  end

  def test_status_enum
    @post.status = "draft"
    assert_equal "draft", @post.status
    @post.status = "published"
    assert_equal "published", @post.status
  end

  def test_errors_to_sentence_returns_full_messages
    @post.title = ""
    @post.description = ""
    @post.valid?
    sentence = @post.errors_to_sentence
    assert sentence.include?("Title can't be blank")
    assert sentence.include?("Description can't be blank")
  end
end
