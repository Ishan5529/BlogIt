# frozen_string_literal: true

class Posts::FilterService
  def initialize(scope, params)
    @scope = scope
    @params = params
  end

  def call
    posts = @scope
    posts = posts.where("LOWER(title) LIKE ?", "%#{@params[:title].downcase}%") if @params[:title].present?

    if @params[:category_ids].present?
      ids = @params[:category_ids]
      posts = posts.joins(:categories)
        .where(categories: { id: ids })
        .group("posts.id")
        .having("COUNT(DISTINCT categories.id) = ?", ids.size)
    end

    if @params[:category_names].present?
      names = @params[:category_names]
      posts = posts.joins(:categories)
        .where(categories: { name: names })
        .group("posts.id")
        .having("COUNT(DISTINCT categories.name) = ?", names.size)
    end

    posts = posts.where(status: @params[:status]) if @params[:status].present?
    posts = posts.where(user_id: @params[:user_id]) if @params[:user_id].present?
    posts.distinct
  end
end
