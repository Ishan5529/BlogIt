# frozen_string_literal: true

class CreateJoinTablePostCategory < ActiveRecord::Migration[7.1]
  def change
    create_table :categories_posts, id: false do |t|
      t.references :post, null: false, foreign_key: true, index: true
      t.references :category, null: false, foreign_key: true, index: true
    end

    add_index :categories_posts, [:post_id, :category_id], unique: true
  end
end
