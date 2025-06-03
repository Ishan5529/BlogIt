class Post < ApplicationRecord
  validates :title, presence: true
  validates :description, presence: true
  validates :upvotes, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :downvotes, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
end
