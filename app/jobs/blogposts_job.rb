# frozen_string_literal: true

class BlogpostsJob
  include Sidekiq::Worker

  def perform(slug)
    post = Post.find_by!(slug: slug)
    ActionCable.server.broadcast(post.slug, { message: I18n.t("blogpost.render"), progress: 25 })
    html_blogpost = ApplicationController.render(
      assigns: {
        post:
      },
      template: "posts/blogpost/download",
      layout: "pdf"
    )
    ActionCable.server.broadcast(post.slug, { message: I18n.t("blogpost.generate"), progress: 50 })
    pdf_blogpost = WickedPdf.new.pdf_from_string html_blogpost
    if post.blogpost.attached?
      post.blogpost.purge
    end
    post.blogpost.attach(
      io: StringIO.new(pdf_blogpost), filename: "blogpost.pdf",
      content_type: "application/pdf")
    post.save
    ActionCable.server.broadcast(post.slug, { message: I18n.t("blogpost.attach"), progress: 100 })
  end
end
