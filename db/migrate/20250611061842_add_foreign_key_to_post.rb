# frozen_string_literal: true

class AddForeignKeyToPost < ActiveRecord::Migration[7.1]
  def change
    add_foreign_key :posts, :users, column: :user_id, on_delete: :cascade
  end
end
