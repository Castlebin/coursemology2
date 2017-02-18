# frozen_string_literal: true
class Course::Assessment::Question::ProgrammingController < \
  Course::Assessment::QuestionsController
  load_and_authorize_resource :programming_question,
                              class: Course::Assessment::Question::Programming,
                              through: :assessment, parent: false

  def new
    @template = 'course/assessment/question/programming/new.json.jbuilder'
  end

  def create
    @template = 'course/assessment/question/programming/new.json.jbuilder'
    @programming_question.package_type =
      programming_question_params.key?(:file) ? :zip_upload : :online_editor
    process_package

    respond_to do |format|
      if @programming_question.save
        format.json { render_success_json t('.success'), true }
      else
        format.json { render_failure_json t('.failure') }
      end
    end
  end

  def edit
    @template = 'course/assessment/question/programming/edit.json.jbuilder'
    @meta = programming_package_service.extract_meta if @programming_question.edit_online?
  end

  def update
    result = @programming_question.class.transaction do
      @programming_question.assign_attributes programming_question_params
      @programming_question.skills.clear if programming_question_params[:skill_ids].blank?
      process_package

      raise ActiveRecord::Rollback unless @programming_question.save
      true
    end

    respond_to do |format|
      if result
        format.json { render_success_json t('.success'), false }
      else
        format.json { render_failure_json t('.failure') }
      end
    end
  end

  def destroy
    if @programming_question.destroy
      redirect_to course_assessment_path(current_course, @assessment),
                  success: t('.success')
    else
      error = @programming_question.errors.full_messages.to_sentence
      redirect_to course_assessment_path(current_course, @assessment),
                  danger: t('.failure', error: error)
    end
  end

  private

  def programming_question_params
    params.require(:question_programming).permit(
      :title, :description, :staff_only_comments, :maximum_grade,
      :language_id, :memory_limit, :time_limit, :attempt_limit,
      *attachment_params,
      skill_ids: []
    )
  end

  def render_success_json(message, redirect_to_edit)
    @response = { message: message, redirect_to_edit: redirect_to_edit }
    @import_job_url = job_path(@programming_question.import_job) if @programming_question.import_job

    render 'edit'
  end

  def render_failure_json(message)
    render json: { message: message, errors: @programming_question.errors.full_messages },
           status: :bad_request
  end

  def process_package
    if @programming_question.edit_online?
      programming_package_service(params).generate_package
      @meta = programming_package_service(params).extract_meta
    end
  end

  def programming_package_service(params = nil)
    @service ||= Course::Assessment::Question::Programming::ProgrammingPackageService.new(
      @programming_question, params
    )
  end
end
