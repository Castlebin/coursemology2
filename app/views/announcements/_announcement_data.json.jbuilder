# frozen_string_literal: true
json.partial! 'announcement_list_data', announcement: announcement

json.endTime announcement.end_at

course_user = announcement.creator.course_users.find_by(course: current_course) unless @course.nil?
user = course_user || announcement.creator

json.creator do
  json.id user.id
  json.name user.name
  json.userUrl url_to_user_or_course_user(@course, user)
end

json.isUnread announcement.unread?(current_user)
json.isSticky announcement.sticky?
json.isCurrentlyActive announcement.currently_active?

json.permissions do
  json.canEdit can?(:edit, announcement)
  json.canDelete can?(:destroy, announcement)
end
