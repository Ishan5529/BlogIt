# frozen_string_literal: true

require "test_helper"

class CategoriesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = create(:user)
    @headers = {
      "X-Auth-Email" => @user.email,
      "X-Auth-Token" => @user.authentication_token,
      "Accept" => "application/json"
    }
    @category = create(:category)
  end

  def test_should_list_all_categories
    get categories_path, headers: @headers
    assert_response :success
    response_json = response.parsed_body
    assert response_json["categories"].is_a?(Array)
    assert response_json["categories"].any? { |cat| cat["id"] == @category.id }
  end

  def test_should_show_category_by_name
    get category_path(@category.name), headers: @headers
    assert_response :success
    response_json = response.parsed_body
    assert_equal @category.name, response_json["category"]["name"]
    assert_equal @category.id, response_json["category"]["id"]
  end

  def test_should_return_not_found_for_invalid_category_name
    get category_path("non-existent-category"), headers: @headers
    assert_response :not_found
    assert_equal "Couldn't find Category", response.parsed_body["error"]
  end

  def test_should_create_category_with_valid_params
    post categories_path, params: { category: { name: "NewCategory" } }, headers: @headers
    assert_response :success
    assert_equal I18n.t("successfully_created", entity: "Category"), response.parsed_body["notice"]
    assert Category.exists?(name: "NewCategory")
  end

  def test_should_not_create_category_with_blank_name
    post categories_path, params: { category: { name: "" } }, headers: @headers
    assert_response :unprocessable_entity
    assert_includes response.parsed_body["error"], "Name can't be blank"
  end

  def test_should_not_create_category_with_duplicate_name
    post categories_path, params: { category: { name: @category.name } }, headers: @headers
    assert_response :unprocessable_entity
    assert_includes response.parsed_body["error"], "Name has already been taken"
  end

  def test_should_not_create_category_with_long_name
    long_name = "a" * (Category::MAX_NAME_LENGTH + 1)
    post categories_path, params: { category: { name: long_name } }, headers: @headers
    assert_response :unprocessable_entity
    assert_includes response.parsed_body["error"], "Name is too long"
  end

  def test_authentication_required_for_all_actions
    empty_headers = {
      "X-Auth-Email" => nil,
      "X-Auth-Token" => nil,
      "Accept" => "application/json"
    }
    get categories_path, headers: empty_headers
    assert_response :unauthorized

    get category_path(@category.name), headers: empty_headers
    assert_response :unauthorized

    post categories_path, params: { category: { name: "Test" } }, headers: empty_headers
    assert_response :unauthorized
  end

  def test_parameter_missing_is_handled
    post categories_path, params: {}, headers: @headers
    assert_response :internal_server_error
    assert_match "param is missing", response.parsed_body["error"]
  end

  def test_record_not_found_is_handled
    get category_path("non-existent-category"), headers: @headers
    assert_response :not_found
    assert_equal "Couldn't find Category", response.parsed_body["error"]
  end

  def test_record_not_unique_is_handled
    category = create(:category, name: "UniqueName")
    assert_no_difference "Category.count" do
      post categories_path, params: { category: { name: category.name } }, headers: @headers
    end
    assert_response :unprocessable_entity
    assert_match "has already been taken", response.parsed_body["error"]
  end

  def test_validation_error_is_handled
    post categories_path, params: { category: { name: "" } }, headers: @headers
    assert_response :unprocessable_entity
    assert_match "can't be blank", response.parsed_body["error"]
  end
end
