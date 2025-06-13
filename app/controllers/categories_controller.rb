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

  def create
    category = Category.new(category_params)
    category.save!
    render_notice(t("successfully_created", entity: "Category"))
  end

  private

    def category_params
      params.require(:category).permit(:name)
    end
end
