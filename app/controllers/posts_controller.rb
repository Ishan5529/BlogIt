# frozen_string_literal: true

class PostsController < ApplicationController
  def index
    @posts = filtered_posts
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

    def filtered_posts
      if params[:category_ids].present?
        post_ids = Post.joins(:categories)
          .where(categories: { id: params[:category_ids] })
          .distinct
          .pluck(:id)
        Post.includes(:categories, user: :organization)
          .where(id: post_ids)
      else
        Post.includes(:categories, user: :organization).all
      end
    end

    def post_params
      params.require(:post).permit(:title, :description, :user_id, category_ids: [])
    end
end
