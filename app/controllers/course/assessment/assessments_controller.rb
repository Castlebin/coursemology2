# frozen_string_literal: true
class Course::Assessment::AssessmentsController < Course::Assessment::Controller
  def index
    @assessments = @assessments.with_submissions_by(current_user)
  end

  def show
  end

  def new
  end

  def create
    if @assessment.save
      redirect_to course_assessment_path(current_course, @assessment),
                  success: t('.success', title: @assessment.title)
    else
      render 'new'
    end
  end

  def edit
  end

  def update
    if @assessment.update(assessment_params)
      redirect_to course_assessment_path(current_course, @assessment),
                  success: t('.success', title: @assessment.title)
    else
      render 'edit'
    end
  end

  def destroy
    if @assessment.destroy
      redirect_to course_assessments_path(current_course),
                  success: t('.success', assessment: @assessment.title)
    else
      redirect_to course_assessments_path(current_course),
                  danger: t('.failure', error: @assessment.errors.full_messages.to_sentence)
    end
  end

  protected

  def load_assessment_options
    { through: :tab }
  end

  private

  def assessment_params
    params.require(:assessment).permit(:title, :description, :base_exp, :time_bonus_exp,
                                       :extra_bonus_exp, :start_at, :end_at, :bonus_end_at,
                                       :draft, :display_mode, folder_params)
  end

  def tab
    @tab ||=
      if params[:tab]
        category.tabs.find(params[:tab])
      else
        category.tabs.first!
      end
  end

  def category
    @category ||=
      if params[:category]
        current_course.assessment_categories.find(params[:category])
      else
        current_course.assessment_categories.first!
      end
  end
end
