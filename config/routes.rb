# frozen_string_literal: true

Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
  constraints(lambda { |req| req.format == :json }) do
    resources :posts, only: %i[index show create update destroy], param: :slug do
      resource :vote, only: [:show, :create, :destroy]
      resource :blogpost, only: %i[create], module: :posts do
        get :download, on: :collection
      end
    end
    resources :users, only: %i[index create]
    resources :organizations, only: %i[index]
    resources :categories, only: %i[index show create], param: :name
    resource :session, only: [:create, :destroy]
  end

  root "home#index"
  get "*path", to: "home#index", via: :all

  # Defines the root path route ("/")
  # root "posts#index"
end
