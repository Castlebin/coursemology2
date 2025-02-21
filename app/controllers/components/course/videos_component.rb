# frozen_string_literal: true
class Course::VideosComponent < SimpleDelegator
  include Course::ControllerComponentHost::Component
  include Course::UnreadCountsConcern

  def self.display_name
    I18n.t('components.video.name')
  end

  def self.lesson_plan_item_actable_names
    [Course::Video.name]
  end

  def self.enabled_by_default?
    false
  end

  def sidebar_items
    main_sidebar_items + settings_sidebar_items
  end

  private

  def main_sidebar_items
    [
      {
        key: :videos,
        icon: :video,
        title: settings.title || t('course.video.videos.sidebar_title'),
        weight: 12,
        path: course_videos_path(current_course, tab: current_course.default_video_tab),
        unread: unwatched_videos_count
      }
    ]
  end

  def settings_sidebar_items
    [
      {
        title: settings.title || t('course.video.videos.sidebar_title'),
        type: :settings,
        weight: 13,
        path: course_admin_videos_path(current_course)
      }
    ]
  end
end
