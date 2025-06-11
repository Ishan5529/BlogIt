# frozen_string_literal: true

class Organization < ApplicationRecord
  MAX_NAME_LENGTH = 255
  has_many :users, dependent: :destroy
  has_many :posts, through: :users
  validates :name, presence: true, length: { maximum: MAX_NAME_LENGTH }
end
