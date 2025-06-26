# frozen_string_literal: true

class PostsController < ApplicationController
  after_action :verify_authorized, except: :index
  after_action :verify_policy_scoped, only: :index
  def index
    pundit_scope = policy_scope(Post)
    @posts = Posts::FilterService.new(pundit_scope, filter_params).call
    render
  end

  def show
    @post = Post.find_by!(slug: params[:slug])
    authorize @post
    render
  end

  def create
    post = create_post
    authorize post
    post.save!
    render_notice(t("successfully_created", entity: "Post"))
  end

  def update
    post = Post.find_by!(slug: params[:slug])
    authorize post
    update_post(post)
    render_notice(t("successfully_updated", entity: "Post")) unless params.key?(:quiet)
  end

  def destroy
    post = Post.find_by!(slug: params[:slug])
    authorize post
    post.destroy!
    render_notice(t("successfully_deleted", entity: "Post")) unless params.key?(:quiet)
  end

  private

    def create_post
      attrs = post_params.to_h.symbolize_keys
      attrs[:last_published_at] = Time.current if attrs[:status] == "published"
      Post.new(attrs)
    end

    def update_post(post)
      attrs = post_params.to_h.symbolize_keys
      attrs[:last_published_at] = Time.current if attrs[:status] == "published"
      post.update!(attrs)
    end

    def post_params
      params.require(:post).permit(
        :title, :description, :user_id, :upvotes, :downvotes, :status, :last_published_at,
        category_ids: [])
    end

    def filter_params
      params.permit(:title, :status, :user_id, :upvotes, :downvotes, category_ids: [], category_names: [])
    end
end
