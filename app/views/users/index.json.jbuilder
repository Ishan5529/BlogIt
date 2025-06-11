# frozen_string_literal: true

json.users @users do |user|
  json.extract! user, :id, :name, :email
  json.posts_count user.posts.count

  json.organization do
    json.extract! user.organization, :id, :name
  end
end
