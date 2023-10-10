# frozen_string_literal: true
class Course::ExperiencePointsRecordsController < Course::ComponentController
  load_resource :course_user, through: :course, id_param: :user_id, except: [:read_all_exp, :download]
  load_and_authorize_resource :experience_points_record, through: :course_user,
                                                         class: Course::ExperiencePointsRecord.name,
                                                         except: [:read_all_exp, :download]

  def read_all_exp
    if filter_and_page_params[:student_id].present?
      @experience_points_records =
        Course::ExperiencePointsRecord.where(course_user_id: filter_and_page_params[:student_id])
    else
      @experience_points_records =
        Course::ExperiencePointsRecord.where(course_user_id: @course.course_users.pluck(:id))
    end
    preload_exp_points_updater
    preload_and_count_experience_points
  end

  def show_user_exp
    preload_exp_points_updater
    preload_and_count_experience_points
  end

  def download
    @experience_points_records = fetch_experience_points_records
    experience_points_records_ids = @experience_points_records.active.pluck(:id)

    if experience_points_records_ids.empty?
      return render json: {
        error: I18n.t('course.experience_points_records.download.no_experience_points')
      }, status: :bad_request
    end

    job = Course::ExperiencePointsDownloadJob.
          perform_later(current_course, filter_download_params[:student_id]).job

    respond_to do |format|
      format.json { render partial: 'jobs/submitted', locals: { job: job } }
    end
  end

  def update
    valid_for_update = record_can_be_updated?
    if valid_for_update && @experience_points_record.update(experience_points_record_params)
      course_user = CourseUser.find_by(course: current_course, id: @experience_points_record.updater)
      user = course_user || @experience_points_record.updater

      render json: { id: @experience_points_record.id,
                     reason: { text: @experience_points_record.reason },
                     pointsAwarded: @experience_points_record.points_awarded,
                     updatedAt: @experience_points_record.updated_at,
                     updater: { id: user.id, name: user.name,
                                userUrl: url_to_user_or_course_user(current_course, user) } }, status: :ok
    elsif !valid_for_update
      render json: { errors: t('course.experience_points.disbursement.exceed_threshold') }, status: :bad_request
    else
      render json: { errors: @experience_points_record.errors.full_messages.to_sentence }, status: :bad_request
    end
  end

  def destroy
    if @experience_points_record.destroy
      head :ok
    else
      render json: { errors: @experience_points_record.errors.full_messages.to_sentence }, status: :bad_request
    end
  end

  private

  def fetch_experience_points_records
    if filter_download_params[:student_id].present?
      Course::ExperiencePointsRecord.where(course_user_id: filter_download_params[:student_id])
    else
      Course::ExperiencePointsRecord.where(course_user_id: @course.course_users.pluck(:id))
    end
  end

  def experience_points_record_params
    params.require(:experience_points_record).permit(:points_awarded, :reason)
  end

  def filter_and_page_params
    return {} if params[:filter].blank?

    params[:filter].permit(:page_num, :student_id)
  end

  def filter_download_params
    return {} if params[:filter].blank?

    params[:filter].permit(:student_id)
  end

  def preload_and_count_experience_points
    @experience_points_records =
      @experience_points_records.active.
      preload([{ actable: [:assessment, :survey] }, :updater]).order(updated_at: :desc)
    @experience_points_count = @experience_points_records.count
    @experience_points_records = @experience_points_records.paginated(filter_and_page_params)
  end

  def preload_exp_points_updater
    updater_ids = @experience_points_records.active.pluck(:updater_id)
    @updater_preload_service =
      Course::CourseUserPreloadService.new(updater_ids, current_course)
  end

  def record_can_be_updated?
    return true if @experience_points_record.manually_awarded?

    specific = @experience_points_record.specific
    actable = specific.actable

    case actable
    when Course::Assessment::Submission
      update_submission_record(specific)

    when Course::Survey::Response
      update_survey_record(specific)
    end
  end

  def update_submission_record(submission)
    assessment = submission.assessment
    can_get_bonus_points = assessment.bonus_end_at && submission.submitted_at <= assessment.bonus_end_at
    experience_points_record_params[:points_awarded] <= if can_get_bonus_points
                                                          assessment.base_exp + assessment.time_bonus_exp
                                                        else
                                                          assessment.base_exp
                                                        end
  end

  def update_survey_record(response)
    survey = response.survey
    can_get_bonus_points = survey.bonus_end_at && response.submitted_at <= survey.bonus_end_at
    experience_points_record_params[:points_awarded] <= if can_get_bonus_points
                                                          survey.base_exp + survey.time_bonus_exp
                                                        else
                                                          survey.base_exp
                                                        end
  end

  # @return [Course::ExperiencePointsComponent]
  # @return [nil] If component is disabled.
  def component
    current_component_host[:course_experience_points_component]
  end
end
