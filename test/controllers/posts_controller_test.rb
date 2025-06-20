# frozen_string_literal: true

require "test_helper"

class PostsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @creator = create(:user)
    @valid_reader = create(:user, organization: @creator.organization)
    @invalid_reader = create(:user)
    @post = create(:post, user: @creator)
    @creator_headers = headers(@creator)
    @valid_reader_headers = headers(@valid_reader)
    @invalid_reader_headers = headers(@invalid_reader)
  end

  def test_should_list_all_posts_for_creator
    get posts_path, headers: @creator_headers
    assert_response :success
    response_json = response.parsed_body
    all_posts = response_json["posts"]
    user_posts = Post.where(user_id: @creator.id)

    assert_not_nil all_posts
    assert_kind_of Array, all_posts
    assert all_posts.any?
    assert_equal all_posts.length, user_posts.count
  end

  def test_should_show_post_for_valid_user
    get post_path(@post.slug), headers: @valid_reader_headers
    assert_response :success
    response_json = response.parsed_body
    assert_equal @post.id, response_json["post"]["id"]
  end

  def test_should_not_show_post_for_invalid_user
    get post_path(@post.slug), headers: @invalid_reader_headers
    assert_response :forbidden
  end

  def test_published_posts_are_listed_for_non_creator_valid_user
    @post.update(status: "published")
    get posts_path, headers: @valid_reader_headers
    assert_response :success
    response_json = response.parsed_body
    all_posts = response_json["posts"]
    assert_includes all_posts.map { |post| post["id"] }, @post.id
  end

  def test_draft_posts_are_not_listed_for_non_creator_valid_user
    @post.update(status: "draft")
    get posts_path, headers: @valid_reader_headers
    assert_response :success
    response_json = response.parsed_body
    all_posts = response_json["posts"]
    assert_not_includes all_posts.map { |post| post["id"] }, @post.id
  end

  def test_should_create_post
    post_params = {
      post: {
        title: "New Post",
        description: "Post description",
        user_id: @creator.id,
        status: "draft",
        category_ids: [@post.categories.first.id]
      }
    }
    assert_difference "Post.count", 1 do
      post posts_path, params: post_params, headers: @creator_headers
    end
    assert_response :success
  end

  def test_any_user_can_create_post
    post_params = {
      post: {
        title: "New Post",
        description: "Post description",
        user_id: @valid_reader.id,
        status: "draft",
        category_ids: [@post.categories.first.id]
      }
    }
    assert_difference "Post.count", 1 do
      post posts_path, params: post_params, headers: @valid_reader_headers
    end
    assert_response :success
    post_params = {
      post: {
        title: "New Post 2",
        description: "Post description 2",
        user_id: @invalid_reader.id,
        status: "draft",
        category_ids: [@post.categories.first.id]
      }
    }
    assert_difference "Post.count", 1 do
      post posts_path, params: post_params, headers: @invalid_reader_headers
    end
    assert_response :success
  end

  def test_should_update_post
    put post_path(@post.slug), params: { post: { title: "Updated Title" } }, headers: @creator_headers
    assert_response :success
    assert_equal "Updated Title", @post.reload.title
  end

  def test_only_creator_could_update_post
    put post_path(@post.slug), params: { post: { title: "Updated Title" } }, headers: @valid_reader_headers
    assert_response :forbidden
    assert_not_equal "Updated Title", @post.reload.title
    put post_path(@post.slug), params: { post: { title: "Updated Title" } }, headers: @invalid_reader_headers
    assert_response :forbidden
    assert_not_equal "Updated Title", @post.reload.title
  end

  def test_should_destroy_post
    assert_difference "Post.count", -1 do
      delete post_path(@post.slug), headers: @creator_headers
    end
    assert_response :success
  end

  def test_only_creator_could_destroy_post
    assert_difference "Post.count", 0 do
      delete post_path(@post.slug), headers: @valid_reader_headers
    end
    assert_response :forbidden
    assert_difference "Post.count", 0 do
      delete post_path(@post.slug), headers: @invalid_reader_headers
    end
    assert_response :forbidden
  end

  def test_not_found_error_rendered_for_invalid_post_slug
    invalid_slug = "invalid-slug"

    get post_path(invalid_slug), headers: @creator_headers
    assert_response :not_found
    assert_equal I18n.t("post.not_found"), response.parsed_body["error"]
  end

  def test_should_filter_posts_by_category_names
    category1 = create(:category, name: "Tech")
    category2 = create(:category, name: "Ruby")
    post1 = create(:post, user: @creator, categories: [category1])
    post2 = create(:post, user: @creator, categories: [category2])
    post3 = create(:post, user: @creator, categories: [category1, category2])

    get posts_path, params: { category_names: ["Tech"] }, headers: @creator_headers
    assert_response :success
    ids = response.parsed_body["posts"].map { |p| p["id"] }
    assert_includes ids, post1.id
    assert_includes ids, post3.id
    assert_not_includes ids, post2.id

    get posts_path, params: { category_names: ["Tech", "Ruby"] }, headers: @creator_headers
    assert_response :success
    ids = response.parsed_body["posts"].map { |p| p["id"] }
    assert_includes ids, post3.id
    assert_not_includes ids, post1.id
    assert_not_includes ids, post2.id
  end

  def test_should_filter_posts_by_category_ids
    category1 = create(:category)
    category2 = create(:category)
    post1 = create(:post, user: @creator, categories: [category1])
    post2 = create(:post, user: @creator, categories: [category2])
    post3 = create(:post, user: @creator, categories: [category1, category2])

    get posts_path, params: { category_ids: [category1.id] }, headers: @creator_headers
    assert_response :success
    ids = response.parsed_body["posts"].map { |p| p["id"] }
    assert_includes ids, post1.id
    assert_includes ids, post3.id
    assert_not_includes ids, post2.id

    get posts_path, params: { category_ids: [category1.id, category2.id] }, headers: @creator_headers
    assert_response :success
    ids = response.parsed_body["posts"].map { |p| p["id"] }
    assert_includes ids, post3.id
    assert_not_includes ids, post1.id
    assert_not_includes ids, post2.id
  end

  def test_should_filter_posts_by_status
    draft_post = create(:post, user: @creator, status: "draft")
    published_post = create(:post, user: @creator, status: "published")

    get posts_path, params: { status: "draft" }, headers: @creator_headers
    assert_response :success
    ids = response.parsed_body["posts"].map { |p| p["id"] }
    assert_includes ids, draft_post.id
    assert_not_includes ids, published_post.id

    get posts_path, params: { status: "published" }, headers: @creator_headers
    assert_response :success
    ids = response.parsed_body["posts"].map { |p| p["id"] }
    assert_includes ids, published_post.id
    assert_not_includes ids, draft_post.id
  end

  def test_should_filter_posts_by_user_id
    user1 = create(:user, organization: @creator.organization)
    user2 = create(:user, organization: @creator.organization)
    post1 = create(:post, user: user1)
    post2 = create(:post, user: user2)

    get posts_path, params: { user_id: user1.id }, headers: headers(user1)
    assert_response :success
    ids = response.parsed_body["posts"].map { |p| p["id"] }
    assert_includes ids, post1.id
    assert_not_includes ids, post2.id

    get posts_path, params: { user_id: user2.id }, headers: headers(user2)
    assert_response :success
    ids = response.parsed_body["posts"].map { |p| p["id"] }
    assert_includes ids, post2.id
    assert_not_includes ids, post1.id
  end
end
