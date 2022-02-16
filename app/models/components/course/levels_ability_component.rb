# frozen_string_literal: true
module Course::LevelsAbilityComponent
  include AbilityHost::Component

  def define_permissions
    if course_user
      allow_staff_read_levels if course_user.staff?
      allow_teaching_staff_manage_levels if course_user.teaching_staff?
    end

    super
  end

  private

  def allow_staff_read_levels
    can :read, Course::Level, course_id: course.id
  end

  def allow_teaching_staff_manage_levels
    can :manage, Course::Level, course_id: course.id
    # User cannot delete default level
    cannot :destroy, Course::Level, experience_points_threshold: 0
  end
end
