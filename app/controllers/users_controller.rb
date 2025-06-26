# frozen_string_literal: true

class UsersController < ApplicationController
  skip_before_action :authenticate_user_using_x_auth_token, only: :index

  def index
    @users = User.includes(:organization, :votes).all
    render
  end

  def create
    user = User.new(user_params)
    user.save!
    render_notice(t("successfully_created", entity: "User"))
  end

  private

    def user_params
      params.require(:user).permit(
        :name, :email, :password, :password_confirmation, :organization_id
      )
    end
end
