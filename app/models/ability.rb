class Ability
  include CanCan::Ability

  # Initialize the ability of user.
  #
  # @param [User] user The current user.
  def initialize(user)
    # TODO: Replace with just the symbols when Rails 5 is released.
    can [:read, :register], Course, status: [Course.statuses[:published], Course.statuses[:opened],
                                             'published', 'opened']

    return unless user

    can [:create, :register], CourseUser, user_id: user.id, workflow_state: 'pending'
    can :manage, CourseUser, course: { creator_id: user.id }
    can :manage, CourseUser, course: { course_users: { user_id: user.id,
                                                       role: [CourseUser.roles[:manager],
                                                              CourseUser.roles[:owner],
                                                              'manager', 'owner'] } }

    can [:read], Course, course_users: { user_id: user.id, workflow_state: ['approved'] }

    can :manage, Course, course_users: { user_id: user.id,
                                         role: [CourseUser.roles[:manager],
                                                CourseUser.roles[:owner],
                                                'manager', 'owner'] }
    can :show_users, Course, course_users: { user_id: user.id,
                                             role: [CourseUser.roles[:manager],
                                                    CourseUser.roles[:owner],
                                                    CourseUser.roles[:teaching_assistant],
                                                    'manager', 'owner', 'teaching_assistant'] }
    can :manage_users, Course, course_users: { user_id: user.id,
                                               role: [CourseUser.roles[:manager],
                                                      CourseUser.roles[:owner],
                                                      CourseUser.roles[:teaching_assistant],
                                                      'manager', 'owner', 'teaching_assistant'] }
    can :manage, :all if user.administrator?
  end
end
