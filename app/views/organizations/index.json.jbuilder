# frozen_string_literal: true

json.organizations @organizations do |organization|
  json.extract! organization, :id, :name, :created_at, :updated_at
  json.users_count organization.users.count
  json.posts_count organization.posts.count
end
