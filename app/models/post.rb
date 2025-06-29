# frozen_string_literal: true

class Post < ApplicationRecord
  require Rails.root.join("config/initializers/constants.rb")

  scope :accessible_to, ->(user_id, org_id) {
    joins(:user).where("posts.user_id = ? OR users.organization_id = ?", user_id, org_id)
  }

  MAX_TITLE_LENGTH = 125
  MAX_DESCRIPTION_LENGTH = 10000

  enum :status, { draft: "Draft", published: "Published" }, default: :published

  has_and_belongs_to_many :categories
  belongs_to :user
  has_many :votes, dependent: :destroy
  has_one_attached :blogpost

  validates :categories, presence: true
  validates :title, presence: true, length: { maximum: MAX_TITLE_LENGTH }
  validates :description, presence: true, length: { maximum: MAX_DESCRIPTION_LENGTH }
  validates :is_bloggable, inclusion: { in: [true, false] }
  validates :upvotes, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :downvotes, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validate :slug_not_changed

  before_create :set_slug
  before_save :set_last_published_at

  def upvotes_count
    votes.upvote.count
  end

  def downvotes_count
    votes.downvote.count
  end

  def update_bloggable_status_from_votes!
    threshold = Constants::BLOGGABLE_THRESHOLD
    net_votes = votes.upvote.count - votes.downvote.count
    update_column(:is_bloggable, net_votes >= threshold)
  end

  private

    def set_last_published_at
      if status == "published"
        self.last_published_at = Time.current
      end
    end

    def set_slug
      title_slug = title.parameterize
      regex_pattern = "slug #{Constants::DB_REGEX_OPERATOR} ?"
      latest_task_slug = Post.where(
        regex_pattern,
        "^#{title_slug}$|^#{title_slug}-[0-9]+$"
      ).order("LENGTH(slug) DESC", slug: :desc).first&.slug
      slug_count = 0
      if latest_task_slug.present?
        slug_count = latest_task_slug.split("-").last.to_i
        only_one_slug_exists = slug_count == 0
        slug_count = 1 if only_one_slug_exists
      end
      slug_candidate = slug_count.positive? ? "#{title_slug}-#{slug_count + 1}" : title_slug
      self.slug = slug_candidate
    end

    def slug_not_changed
      if will_save_change_to_slug? && self.persisted?
        errors.add(:slug, I18n.t("post.slug.immutable"))
      end
    end
end
