# frozen_string_literal: true

class User < ApplicationRecord
  MAX_NAME_LENGTH = 255
  MAX_EMAIL_LENGTH = 255
  MAX_PASSWORD_LENGTH = 72
  MIN_PASSWORD_LENGTH = 8

  belongs_to :organization
  has_many :posts, dependent: :destroy

  validates :name, presence: true, length: { maximum: MAX_NAME_LENGTH }
  validates :email, presence: true, length: { maximum: MAX_EMAIL_LENGTH }, uniqueness: true,
    format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, presence: true, length: { minimum: MIN_PASSWORD_LENGTH, maximum: MAX_PASSWORD_LENGTH },
    confirmation: true, if: :password_required?
  validates :password_confirmation, presence: true, if: :password_required?

  has_secure_password
  has_secure_token :authentication_token

  before_save :to_lowercase

  private

    def to_lowercase
      email.downcase!
    end

    def password_required?
      new_record? || !password.nil?
    end
end
