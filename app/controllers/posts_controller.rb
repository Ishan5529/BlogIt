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
    post = Post.new(post_params)
    authorize post
    post.save!
    render_notice(t("successfully_created", entity: "Post"))
  end

  def update
    post = Post.find_by!(slug: params[:slug])
    authorize post
    retries = 0
    begin
      post.update!(post_params)
      render_notice(t("successfully_updated", entity: "Post")) unless params.key?(:quiet)
    rescue ActiveRecord::StatementInvalid => e
      if e.message.include?("database is locked") && retries < 5
        retries += 1
        sleep 0.1
        retry
      else
        raise
      end
    end
  end

  def destroy
    post = Post.find_by!(slug: params[:slug])
    authorize post
    post.destroy!
    render_notice(t("successfully_deleted", entity: "Post")) unless params.key?(:quiet)
  end

  private

    def post_params
      params.require(:post).permit(
        :title, :description, :user_id, :upvotes, :downvotes, :status, :last_published_at,
        category_ids: [])
    end

    def filter_params
      params.permit(:title, :status, :user_id, :upvotes, :downvotes, category_ids: [], category_names: [])
    end
end
