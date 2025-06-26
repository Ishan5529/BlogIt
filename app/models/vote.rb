# frozen_string_literal: true

class Vote < ApplicationRecord
  enum vote_type: { upvote: 1, downvote: -1 }

  belongs_to :user
  belongs_to :post

  validates :user, presence: true
  validates :post, presence: true
  validates :vote_type, inclusion: { in: Vote.vote_types.keys }

  after_save :update_post_vote_counts
  after_destroy :update_post_vote_counts
  after_save :update_post_bloggable_status
  after_destroy :update_post_bloggable_status

  private

    def update_post_vote_counts
      post.update_columns(
        upvotes: post.votes.upvote.count,
        downvotes: post.votes.downvote.count
      )
    end

    def update_post_bloggable_status
      post.update_bloggable_status_from_votes!
    end
end
