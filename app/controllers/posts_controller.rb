# frozen_string_literal: true

class PostsController < ApplicationController
  after_action :verify_authorized, except: :index
  after_action :verify_policy_scoped, only: :index
  def index
    @posts = policy_scope(Post)
    @posts = filter_posts_by_category_name_or_category_id(@posts)
    @posts = filter_posts_by_status(@posts)
    @posts = filter_posts_by_user_id(@posts) if params[:user_id].present?
    render
  end

  def show
    @post = Post.find_by!(slug: params[:slug])
    authorize @post
    render
  end

  def create
    post = Post.new(post_params)
    authorize post
    post.save!
    render_notice(t("successfully_created", entity: "Post"))
  end

  def update
    post = Post.find_by!(slug: params[:slug])
    authorize post
    post.update!(post_params)
    render_notice(t("successfully_updated", entity: "Post")) unless params.key?(:quiet)
  end

  def destroy
    post = Post.find_by!(slug: params[:slug])
    authorize post
    post.destroy!
    render_notice(t("successfully_deleted", entity: "Post")) unless params.key?(:quiet)
  end

  private

    def filter_posts_by_category_name_or_category_id(base_scope)
      base_scope = base_scope.includes(user: :organization)

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

    def filter_posts_by_status(base_scope)
      base_scope = base_scope.includes(user: :organization)
      if params[:status].present?
        base_scope.where(status: params[:status])
      else
        base_scope.all
      end
    end

    def filter_posts_by_user_id(base_scope)
      base_scope = base_scope.includes(user: :organization)
      base_scope.where(user_id: params[:user_id])
    end

    def post_params
      params.require(:post).permit(:title, :description, :user_id, :status, category_ids: [])
    end
end
