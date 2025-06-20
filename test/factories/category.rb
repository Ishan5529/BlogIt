# frozen_string_literal: true

FactoryBot.define do
  factory :category do
    sequence(:name) { |n| "Category#{n}_#{Faker::Lorem.unique.word}" }
  end
end
