# frozen_string_literal: true

class AddSlugToPost < ActiveRecord::Migration[7.1]
  def change
    add_column :posts, :slug, :string, null: false
    add_index :posts, :slug, unique: true
  end
end
