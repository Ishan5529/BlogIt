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
      if params[:category_names].present?
        names = params[:category_names]
        categories_post_join = Post.joins(:categories)
        filtered_posts = categories_post_join
          .where(categories: { name: names })
          .group("posts.id")
          .having("COUNT(DISTINCT categories.name) = ?", names.size)
          .distinct
        post_ids = filtered_posts.pluck(:id)
        Post.includes(:categories, user: :organization)
          .where(id: post_ids)
      elsif params[:category_ids].present?
        categories_post_join = Post.joins(:categories)
        filtered_posts = categories_post_join
          .where(categories: { id: params[:category_ids] })
          .group("posts.id")
          .having("COUNT(DISTINCT categories.id) = ?", params[:category_ids].size)
          .distinct
        post_ids = filtered_posts.pluck(:id)
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
