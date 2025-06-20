# frozen_string_literal: true

class AddUserIdToPosts < ActiveRecord::Migration[7.1]
  def change
    add_column :posts, :user_id, :integer, null: false
  end
end
