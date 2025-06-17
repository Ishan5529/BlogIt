# frozen_string_literal: true

json.post do
  json.extract! @post,
    :id,
    :title,
    :description,
    :upvotes,
    :downvotes,
    :created_at,
    :updated_at,
    :slug,
    :status

  json.categories @post.categories do |category|
    json.extract! category,
      :id,
      :name
  end

  json.user do
    json.extract! @post.user,
      :id,
      :name,
      :email,
      :organization_id
  end

  json.organization do
    json.extract! @post.user.organization,
      :id,
      :name
  end
end
