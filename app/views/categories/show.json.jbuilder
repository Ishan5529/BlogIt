# frozen_string_literal: true

json.category do
  json.extract! @category, :id, :name
  json.posts_count @category.posts.count
end
