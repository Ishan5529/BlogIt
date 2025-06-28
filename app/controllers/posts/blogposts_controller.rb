# frozen_string_literal: true

class Posts::BlogpostsController < ApplicationController
  before_action :set_post, only: [:download]
  def create
    post = Post.find_by!(slug: params[:post_slug] || params[:slug])
    BlogpostsJob.perform_async(post.slug)
  end

  def download
    unless @post.blogpost.attached?
      render_error(t("not_found", entity: "blogpost"), :not_found) and return
    end

    send_data @post.blogpost.download, filename: pdf_file_name, content_type: "application/pdf"
  end

  private

    def set_post
      @post = Post.find_by!(slug: params[:slug] || params[:post_slug])
    end

    def pdf_file_name
      "blog-it-post-#{current_user.id}.pdf"
    end
end
