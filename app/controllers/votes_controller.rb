# frozen_string_literal: true

class VotesController < ApplicationController
  before_action :authenticate_user_using_x_auth_token

  def show
    vote = fetchVote()
    render json: { vote_type: vote&.vote_type || "none" }
  end

  def create
    post = fetchPost
    vote = fetchVote

    if params[:vote_type].nil?
      vote.destroy if vote.persisted?
    else
      vote.vote_type = params[:vote_type]
      vote.save!
    end

    render json: { upvotes: post.upvotes_count, downvotes: post.downvotes_count }
  end

  def destroy
    post = Post.find_by!(slug: params[:slug])
    vote = post.votes.find_by(user: current_user)
    vote&.destroy
    render json: { upvotes: post.upvotes_count, downvotes: post.downvotes_count }
  end

  private

    def fetchVote
      post = fetchPost
      post.votes.find_or_initialize_by(user: current_user)
    end

    def fetchPost
      Post.find_by!(slug: params[:post_slug])
    end
end
