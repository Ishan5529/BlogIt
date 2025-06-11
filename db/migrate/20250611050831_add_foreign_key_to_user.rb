# frozen_string_literal: true

class AddForeignKeyToUser < ActiveRecord::Migration[7.1]
  def change
    add_foreign_key :users, :organizations, column: :organization_id
  end
end
