# frozen_string_literal: true

class User < ApplicationRecord
  MAX_NAME_LENGTH = 255
  MAX_EMAIL_LENGTH = 255
  belongs_to :organization

  validates :name, presence: true, length: { maximum: MAX_NAME_LENGTH }
  validates :email, presence: true, length: { maximum: MAX_EMAIL_LENGTH }, uniqueness: true,
    format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password_digest, presence: true

  has_secure_password
end
