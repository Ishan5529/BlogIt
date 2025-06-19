# frozen_string_literal: true

class Category < ApplicationRecord
  MAX_NAME_LENGTH = 255

  has_and_belongs_to_many :posts

  validates :name, presence: true, uniqueness: { case_sensitive: false }, length: { maximum: MAX_NAME_LENGTH }

  after_destroy :destroy_orphan_posts
  before_destroy :store_post_ids

  private

    def store_post_ids
      @post_ids = posts.pluck(:id)
    end

    def destroy_orphan_posts
      Post.where(id: @post_ids).find_each do |post|
        post.destroy if post.categories.reload.empty?
      end
    end
end
