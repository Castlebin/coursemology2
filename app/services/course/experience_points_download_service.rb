#frozen_string_literal: true
require 'csv'
class Course::ExperiencePointsDownloadService
  include ApplicationFormattersHelper

  class << self
    def download(current_course, course_user_id)
      service = new(current_course, course_user_id)
      ActsAsTenant.without_tenant do
        service.generate_csv_report
      end
    end
  end

  def generate_csv_report
    if @course_user_id
      exp_points_records = Course::ExperiencePointsRecord.
                           where(course_user_id: @course_user_id)
    else
      exp_points_records = Course::ExperiencePointsRecord.
                           where(course_user_id: @current_course.course_users.pluck(:id))
    end
    exp_points_file_path = File.join(@base_dir, 'records.csv')
    updater_ids = exp_points_records.active.pluck(:updater_id)
    @updater_preload_service =
      Course::CourseUserPreloadService.new(updater_ids, @current_course)
    exp_points_records = exp_points_records.active.includes(course_user: :user).order('users.name ASC')
    CSV.open(exp_points_file_path, 'w') do |csv|
      download_exp_points_header csv
      exp_points_records.each do |record|
        download_exp_points csv, record
      end
    end
    exp_points_file_path
  end

  private

  def initialize(current_course, course_user_id)
    @course_user_id = course_user_id
    @current_course = current_course
    @base_dir = Dir.mktmpdir('experience-points-')
  end

  def download_exp_points_header(csv)
    csv << [I18n.t('course.experience_points_records.download.name'),
            I18n.t('course.experience_points_records.download.updated_at'),
            I18n.t('course.experience_points_records.download.updater'),            
            I18n.t('course.experience_points_records.download.reason'),           
            I18n.t('course.experience_points_records.download.exp_points')]
  end

  def download_exp_points(csv, record)
    point_updater = @updater_preload_service.course_user_for(record.updater)
    updater_user = point_updater || record.updater

    if record.manually_awarded?
      @reason = record.reason
    else
      specific = record.specific
      actable = specific.actable
      case actable
      when Course::Assessment::Submission
        submission = specific
        assessment = submission.assessment
        @reason = assessment.title
      when Course::Survey::Response
        response = specific
        survey = response.survey
        @reason = survey.title
      end
    end

    csv << [record.course_user.user.name.strip,
            record.updated_at,
            updater_user.name,
            @reason,
            record.points_awarded]
  end
end