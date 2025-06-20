# frozen_string_literal: true

require "test_helper"

class OrganizationsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = create(:user)
    @organization = @user.organization
    @headers = {
      "X-Auth-Email" => @user.email,
      "X-Auth-Token" => @user.authentication_token,
      "Accept" => "application/json"
    }
    @empty_headers = {
      "X-Auth-Email" => nil,
      "X-Auth-Token" => nil,
      "Accept" => "application/json"
    }
  end

  def test_should_list_all_organizations
    org2 = create(:organization)
    get organizations_path, headers: @headers
    assert_response :success
    response_json = response.parsed_body
    assert response_json["organizations"].is_a?(Array)
    ids = response_json["organizations"].map { |org| org["id"] }
    assert_includes ids, @organization.id
    assert_includes ids, org2.id
  end

  def test_should_return_unauthorized_without_auth_headers
    get organizations_path, headers: @empty_headers
    assert_response :unauthorized
    assert_equal I18n.t("session.could_not_auth"), response.parsed_body["error"]
  end
end
