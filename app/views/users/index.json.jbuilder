# frozen_string_literal: true

json.users @users do |user|
  json.extract! user, :id, :name, :email
  json.posts_count user.posts.count

  json.organization do
    json.extract! user.organization, :id, :name
  end

  json.votes do
    json.array! user.votes do |vote|
      json.extract! vote, :vote_type, :post_id
      json.slug vote.post.slug
    end
  end
end
