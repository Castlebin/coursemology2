# frozen_string_literal: true
json.array! @unread_announcements do |announcement|
  json.partial! 'announcement_list_data', announcement: announcement
end
