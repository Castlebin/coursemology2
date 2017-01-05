class Course::VideoNotifier < Notifier::Base
  def video_attempted(user, video)
    create_activity(actor: user, object: video, event: :attempted).
      notify(video.course, :feed).
      save!
  end

  def video_opening(user, video)
    create_activity(actor: user, object: video, event: :opening).
      notify(video.course, :email).
      save!
  end

  def video_closing(user, video)
    activity = create_activity(actor: user, object: video, event: :closing)
    unattempted_users(video).each { |u| activity.notify(u, :email) }
    activity.save!
  end

  private

  def unattempted_users(video)
    students = video.course.course_users.student.includes(:user).map(&:user)
    submitted = video.submissions.includes(:creator).map(&:creator)
    Set.new(students) - Set.new(submitted)
  end
end
