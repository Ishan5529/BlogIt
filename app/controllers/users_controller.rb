# frozen_string_literal: true

class UsersController < ApplicationController
  def index
    users = User.all.as_json(include: { organization: { only: %i[name id] } })
    # users = User.all
    render status: :ok, json: { users: }
    # render_json({ users: })
  end
  # def index
  #   users = User.select(:id, :name, :email, :organization_id)
  #     .includes(:organization)
  #     .as_json(include: { organization: { only: %i[id name] } })
  #   render status: :ok, json: { users: users }
  # end
end
