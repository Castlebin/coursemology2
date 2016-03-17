# frozen_string_literal: true
class AttachmentReference < ActiveRecord::Base
  before_save :update_expires_at

  belongs_to :attachable, polymorphic: true, inverse_of: nil
  belongs_to :attachment, inverse_of: :attachment_references

  delegate :open, :url, :path, to: :attachment

  # Get the name from the file and then further build or find an attachment based on file's SHA256
  # hash.
  #
  # @param [File|ActionDispatch::Http::UploadedFile] The uploaded file.
  def file=(file)
    self.name = filename(file)
    self.attachment = Attachment.find_or_initialize_by(file: file)
  end

  private

  # Infer the name of the file.
  #
  # @param [File|ActionDispatch::Http::UploadedFile] The uploaded file.
  # @return [String] The filename.
  def filename(file)
    name = if file.respond_to?(:original_filename)
             file.original_filename
           else
             File.basename(file)
           end
    Pathname.normalize_filename(name)
  end

  # Clears the expires_at if attachable is present, otherwise set the expires_at.
  def update_expires_at
    self.expires_at = if attachable
                        nil
                      else
                        1.day.from_now
                      end
  end
end
