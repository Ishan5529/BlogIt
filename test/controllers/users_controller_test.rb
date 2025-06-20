# frozen_string_literal: true

require "test_helper"

class UsersControllerTest < ActionDispatch::IntegrationTest
  def setup
    user = create(:user)
    @headers = headers(user)
  end

  def test_should_list_all_users
    get users_path, headers: @headers
    assert_response :success
    response_json = response.parsed_body

    expected_user_ids = User.pluck(:id).sort
    actual_user_ids = response_json["users"].pluck("id").sort

    assert_equal expected_user_ids, actual_user_ids
  end

  def test_should_signup_user_with_valid_credentials
    post users_path, params: {
      user: {
        name: "Sam Smith",
        email: "sam@example.com",
        password: "welcomePass",
        password_confirmation: "welcomePass",
        organization_id: create(:organization).id
      }
    }, headers: @headers
    assert_response :success
    response_json = response.parsed_body
    assert_equal I18n.t("successfully_created", entity: "User"), response_json["notice"]
  end

  def test_shouldnt_signup_user_with_invalid_credentials
    post users_path, params: {
      user: {
        name: "Sam Smith",
        email: "sam@example.com",
        organization_id: create(:organization).id,
        password: "welcomePass",
        password_confirmation: "not matching confirmation"
      }
    }, headers: @headers

    assert_response :unprocessable_entity
    assert_equal "Password confirmation doesn't match Password", response.parsed_body["error"]
  end
end
