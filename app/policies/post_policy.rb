# frozen_string_literal: true

class PostPolicy
  attr_reader :user, :post

  def initialize(user, post)
    @user = user
    @post = post
  end

  # The show policy check is invoked when we call `authorize @post`
  def show?
    post.user.organization_id == user.organization_id
  end

  # def edit?
  #   show?
  # end

  def update?
    post.user_id == user.id
  end

  def create?
    true
  end

  def destroy?
    post.user_id == user.id
  end

  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      scope.where(user: { organization_id: user.organization_id }, status: :published).or(scope.where(user_id: user.id))
    end
  end
end
