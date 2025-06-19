# frozen_string_literal: true

require "test_helper"

class OrganizationTest < ActiveSupport::TestCase
  def setup
    @organization = build(:organization)
  end

  def test_organization_should_not_be_valid_and_saved_without_name
    @organization.name = ""
    assert_not @organization.valid?
    assert_includes @organization.errors.full_messages, "Name can't be blank"
  end

  def test_name_should_be_of_valid_length
    @organization.name = "a" * (Organization::MAX_NAME_LENGTH + 1)
    assert @organization.invalid?
  end

  def test_posts_created_by_organization_users_are_deleted_when_organization_is_deleted
    post_organization = create(:organization)
    user = create(:user, organization: post_organization)
    create(:post, user: user)

    assert_difference "Post.count", -1 do
      post_organization.destroy
    end
  end

  def test_users_under_organization_are_deleted_when_organization_is_deleted
    user_organization = create(:organization)
    create(:user, organization: user_organization)
    assert_difference "User.count", -1 do
      user_organization.destroy
    end
  end

  def test_posts_count_for_organization
    organization = create(:organization)
    user = create(:user, organization: organization)
    create(:post, user: user)
    create(:post, user: user)
    organization.reload
    assert_equal 2, organization.posts.count
  end

  def test_users_count_for_organization
    organization = create(:organization)
    create(:user, organization: organization)
    create(:user, organization: organization)
    organization.reload
    assert_equal 2, organization.users.count
  end

  def test_organization_should_be_valid_and_saved_with_valid_name
    @organization.name = "Valid Organization Name"
    assert @organization.valid?
    assert @organization.save
    assert_includes Organization.pluck(:name), @organization.name
  end

  def test_organization_should_have_unique_name
    @organization.name = "Unique Organization Name"
    @organization.save!
    duplicate_organization = build(:organization, name: @organization.name)

    assert_not duplicate_organization.valid?
    assert_includes duplicate_organization.errors.full_messages, "Name has already been taken"
  end

  def test_organization_should_have_case_insensitive_unique_name
    @organization.name = "Unique Organization Name"
    @organization.save!
    duplicate_organization = build(:organization, name: @organization.name.downcase)

    assert_not duplicate_organization.valid?
    assert_includes duplicate_organization.errors.full_messages, "Name has already been taken"
  end
end
