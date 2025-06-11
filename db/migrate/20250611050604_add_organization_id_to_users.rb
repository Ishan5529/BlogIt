# frozen_string_literal: true

class AddOrganizationIdToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :organization_id, :integer
  end
end
