# frozen_string_literal: true

class PostsController < ApplicationController
  respond_to :html, :json, :xml
  def index
    @posts = Post.all
    respond_with(@posts)
  end
end
