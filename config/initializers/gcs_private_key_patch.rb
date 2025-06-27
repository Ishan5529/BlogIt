# frozen_string_literal: true

if Rails.application.secrets.gcs &&
   Rails.application.secrets.gcs[:credentials] &&
   Rails.application.secrets.gcs[:credentials][:private_key].is_a?(String)

  Rails.application.secrets.gcs[:credentials][:private_key] =
    Rails.application.secrets.gcs[:credentials][:private_key].gsub("\\n", "\n")
end
