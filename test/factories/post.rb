# frozen_string_literal: true

FactoryBot.define do
  factory :post do
    association :user
    title { Faker::Lorem.sentence[0..49] }
    description { Faker::Lorem.paragraph[0..1000] }
    upvotes { rand(0..100) }
    downvotes { rand(0..100) }
    is_bloggable { [true, false].sample }
    status { ["draft", "published"].sample }

    after(:build) do |post, evaluator|
      if post.categories.empty?
        post.categories << build_list(:category, 2)
      end
    end
  end
end
