# frozen_string_literal: true

class CategoriesController < ApplicationController
  def index
    @categories = Category.includes(:posts).all
    render
  end

  def show
    @category = Category.includes(:posts).find_by!(name: params[:name])
    render
  end
end
