# frozen_string_literal: true

class AddLastPublishedAtToPosts < ActiveRecord::Migration[7.1]
  def change
    add_column :posts, :last_published_at, :datetime, null: true
  end
end
