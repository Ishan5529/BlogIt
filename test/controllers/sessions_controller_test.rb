# frozen_string_literal: true

require "test_helper"

class SessionsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = create(:user)
  end

  def test_should_login_user_with_valid_credentials
    post session_path, params: { login: { email: @user.email, password: @user.password } }, as: :json
    assert_response :success
    assert_equal @user.authentication_token, response.parsed_body["authentication_token"]
  end

  def test_shouldnt_login_user_with_invalid_credentials
    post session_path, params: { login: { email: @user.email, password: "invalid password" } }, as: :json
    assert_response :unauthorized
    response_json = response.parsed_body
    assert_equal I18n.t("session.incorrect_credentials"), response_json["error"]
  end

  def test_should_respond_with_not_found_error_if_user_is_not_present
    non_existent_email = "this_email_does_not_exist_in_db@example.email"
    post session_path, params: { login: { email: non_existent_email, password: "welcome" } }, as: :json
    assert_response :not_found
    response_json = response.parsed_body
    assert_equal "Couldn't find User", response_json["error"]
  end

  def test_should_logout_user
    post session_path, params: { login: { email: @user.email, password: @user.password } }, as: :json
    assert_response :success

    delete session_path, as: :json
    assert_response :success
    assert_nil response.parsed_body["current_user"]
  end

  def test_authentication_failure_renders_unauthorized_error
    empty_headers = {
      "X-Auth-Email" => nil,
      "X-Auth-Token" => nil,
      "Accept" => "application/json"
    }
    get posts_path, headers: empty_headers
    assert_response :unauthorized
    assert_equal I18n.t("session.could_not_auth"), response.parsed_body["error"]
  end

  def test_authentication_failure_with_invalid_token
    headers = {
      "X-Auth-Email" => @user.email,
      "X-Auth-Token" => "invalidtoken",
      "Accept" => "application/json"
    }
    get posts_path, headers: headers
    assert_response :unauthorized
    assert_equal I18n.t("session.could_not_auth"), response.parsed_body["error"]
  end
end
