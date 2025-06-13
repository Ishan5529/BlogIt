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
    render_notice(t("successfully_created", entity: "Post"))
  end

  private

    def filtered_posts
      org_id = current_user.organization_id

      base_scope = Post.includes(:categories, user: :organization)
        .where(users: { organization_id: org_id })
        .references(:users)

      if params[:category_names].present?
        names = params[:category_names]
        categories_post_join = base_scope.joins(:categories)
        filtered_posts = categories_post_join
          .where(categories: { name: names })
          .group("posts.id")
          .having("COUNT(DISTINCT categories.name) = ?", names.size)
          .distinct
        post_ids = filtered_posts.pluck(:id)
        base_scope.where(id: post_ids)
      elsif params[:category_ids].present?
        categories_post_join = base_scope.joins(:categories)
        filtered_posts = categories_post_join
          .where(categories: { id: params[:category_ids] })
          .group("posts.id")
          .having("COUNT(DISTINCT categories.id) = ?", params[:category_ids].size)
          .distinct
        post_ids = filtered_posts.pluck(:id)
        base_scope.where(id: post_ids)
      else
        base_scope.all
      end
    end

    def post_params
      params.require(:post).permit(:title, :description, :user_id, category_ids: [])
    end
end
