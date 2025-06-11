# frozen_string_literal: true

class PostsController < ApplicationController
  def index
    @posts = Post.includes(:categories, user: :organization).all
    render
  end

  def show
    @post = Post.find_by!(slug: params[:slug])
    render
  end

  def create
    post = Post.new(post_params)
    post.save!
    render_notice("Post created successfully")
  end

  private

    def post_params
      params.require(:post).permit(:title, :description, :user_id, category_ids: [])
    end
end
