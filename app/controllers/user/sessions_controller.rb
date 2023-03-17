# frozen_string_literal: true
class User::SessionsController < Devise::SessionsController
  # before_filter :configure_sign_in_params, only: [:create]
  prepend_before_action :require_no_authentication, only: [:create]
  protect_from_forgery except: :create

  # GET /resource/sign_in
  # def new
  #   super
  # end

  # POST /resource/sign_in
  def create
    respond_to do |format|
      format.html { super }
      format.json do
        resource = warden.authenticate!(auth_options)
        sign_in(resource_name, resource)
      end
    end
  end

  # DELETE /resource/sign_out
  # def destroy
  #   super
  # end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.for(:sign_in) << :attribute
  # end
end
