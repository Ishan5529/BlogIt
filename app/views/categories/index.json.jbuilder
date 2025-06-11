# frozen_string_literal: true

json.categories @categories do |category|
  json.extract! category, :id, :name
  json.posts_count category.posts.count
end
