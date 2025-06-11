# frozen_string_literal: true

class OrganizationsController < ApplicationController
  def index
    organizations = Organization.select(:id, :name)
    render status: :ok, json: { organizations: }
    # render_json({ users: })
  end
end
