# frozen_string_literal: true

json.posts @posts do |post|
  json.extract! post,
    :id,
    :title,
    :description,
    :upvotes,
    :downvotes,
    :is_bloggable,
    :created_at,
    :updated_at,
    :last_published_at,
    :slug,
    :status

  json.categories post.categories do |category|
    json.extract! category,
      :id,
      :name
  end

  json.user do
    json.extract! post.user,
      :id,
      :name,
      :email,
      :organization_id
  end

  json.organization do
    json.extract! post.user.organization,
      :id,
      :name
  end
end
