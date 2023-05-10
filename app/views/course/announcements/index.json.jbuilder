# frozen_string_literal: true
json.partial! 'layouts/page_title', title: @settings.title || t('breadcrumbs.course.announcements.index')

json.announcements @announcements do |announcement|
  json.partial! 'announcements/announcement_data',
                announcement: announcement,
                course_user: @course_users_hash[announcement.creator_id]
end

json.permissions do
  json.canCreate can?(:create, Course::Announcement.new(course: current_course))
end
