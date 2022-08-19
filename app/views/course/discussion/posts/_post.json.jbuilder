# frozen_string_literal: true
json.(post, :id, :title, :text)
json.formattedText format_ckeditor_rich_text(simple_format(post.text))
creator = post.creator
json.creator do
  json.id creator.id
  json.name post.author_name
  json.imageUrl creator.profile_photo.medium.url || image_url('user_silhouette.svg')
end
json.createdAt post.created_at&.iso8601
json.topicId post.topic_id
json.canUpdate can?(:update, post)
json.canDestroy can?(:destroy, post)
json.isDelayed post.delayed?
