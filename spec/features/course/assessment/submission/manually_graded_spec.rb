# frozen_string_literal: true
require 'rails_helper'

RSpec.describe 'Course: Assessment: Submissions: Manually Graded Assessments' do
  let(:instance) { Instance.default }

  with_tenant(:instance) do
    let(:course) { create(:course) }
    let(:assessment) do
      create(:assessment, :published_with_mrq_question, course: course)
    end
    let(:mrq_questions) { assessment.reload.questions.map(&:specific) }
    before { login_as(user, scope: :user) }

    let(:student) { create(:course_student, course: course).user }
    let(:submission) { create(:submission, assessment: assessment, creator: student) }
    let(:programming_assessment) do
      create(:assessment, :published_with_programming_question, course: course)
    end
    let(:programming_assessment_submission) do
      create(:submission, assessment: programming_assessment, creator: student)
    end
    let(:multiple_programming_assessment) do
      # Creates a manually-graded assessment with 3 programming questions:
      #   1. auto_gradable programming question (with test-cases)
      #   2. auto_gradable programming question (only evaluation test-cases)
      #   3. Non auto_gradable programming question (no test-cases)
      assessment = create(:assessment, :published_with_programming_question, course: course)
      create(:course_assessment_question_programming,
             template_package: true, template_package_deferred: false, assessment: assessment,
             evaluation_test_case_count: 1)
      create(:course_assessment_question_programming,
             template_package: true, template_package_deferred: false, assessment: assessment)
      assessment.reload
    end
    let(:multiple_programming_submission) do
      create(:submission, assessment: multiple_programming_assessment, creator: student)
    end

    context 'As a Course Student' do
      let(:user) { student }

      scenario 'I can save my submission' do
        submission
        visit edit_course_assessment_submission_path(course, assessment, submission)

        option = assessment.questions.first.actable.options.first.option
        check option
        click_button I18n.t('course.assessment.submission.submissions.buttons.save')

        expect(current_path).to eq(
          edit_course_assessment_submission_path(course, assessment, submission)
        )
        expect(page).to have_checked_field(option)
      end

      scenario 'I can run code only on programming questions with private and public test cases' do
        multiple_programming_submission
        visit edit_course_assessment_submission_path(course, multiple_programming_assessment,
                                                     multiple_programming_submission)

        # The Run Code button is only shown for the first question
        expect(page).to have_selector('.btn.submit-answer', count: 1)
      end

      scenario 'I can reset my answer to a programming question', js: true do
        assessment.tabbed_view = true
        assessment.save!
        programming_question = programming_assessment.questions.first
        programming_answer = create(:course_assessment_answer_programming,
                                    assessment: programming_assessment,
                                    question: programming_question,
                                    creator: student,
                                    file_count: 1)
        programming_submission = programming_answer.acting_as.submission

        # Modify programming file content
        file = programming_answer.files.first
        file.content = 'foooo'
        file.save

        # Reset answer
        visit edit_course_assessment_submission_path(course, programming_assessment,
                                                     programming_submission)
        expect(page).to have_selector('.btn.reset-answer', count: 1)
        page.accept_alert I18n.t('course.assessment.answer.reset_answer.warning') do
          click_link I18n.t('course.assessment.answer.reset_answer.button')
        end
        wait_for_ajax

        # Check that answer has been reset to template files
        expect(programming_answer.reload.files.first.content).
          to eq(programming_question.specific.template_files.first.content)

        # Check that ACE Editor has initialised correctly
        expect(page).to have_css('.ace_editor')
      end

      scenario 'I can finalise my submission only once' do
        submission
        visit edit_course_assessment_submission_path(course, assessment, submission)

        click_button I18n.t('course.assessment.submission.submissions.buttons.finalise')
        expect(current_path).to eq(
          edit_course_assessment_submission_path(course, assessment, submission)
        )
        expect(submission.reload).to be_submitted
        expect(page).
          not_to have_button(I18n.t('course.assessment.submission.submissions.buttons.save'))

        visit edit_course_assessment_submission_path(course, assessment, submission)
        expect(page).
          not_to have_button(I18n.t('course.assessment.submission.submissions.buttons.finalise'))
        expect(page).not_to have_selector('div.submission_answers_grade')
      end

      scenario 'I can create, update and delete comment on answers', js: true do
        assessment.questions.attempt(submission).each(&:save!)
        visit edit_course_assessment_submission_path(course, assessment, submission)

        comment_answer = submission.answers.first
        comment_topic = comment_answer.discussion_topic

        # Make a first comment
        answer_selector = content_tag_selector(comment_answer)
        comment_post_text = 'test comment'
        fill_in_summernote answer_selector, comment_post_text
        within find(answer_selector) do
          find('.reply-comment').click
        end
        wait_for_ajax

        comment_post = comment_topic.reload.posts.last
        expect(comment_post.text).to have_tag('*', text: comment_post_text)
        expect(comment_post.parent).to eq(nil)
        expect(find(content_tag_selector(comment_answer))).
          to have_selector('.answer-comment-form')

        # Reply to the first comment
        comment_reply_text = 'test reply'
        fill_in_summernote answer_selector, comment_reply_text
        within find(answer_selector) do
          find('.reply-comment').click
        end
        wait_for_ajax

        comment_reply = comment_topic.reload.posts.select { |post| post.id != comment_post.id }.last
        expect(comment_reply.text).to have_tag('*', text: comment_reply_text)
        expect(comment_reply.parent).to eq(comment_post)
        expect(find(content_tag_selector(comment_answer))).
          to have_selector('.answer-comment-form')

        # Edit the last comment made
        find(content_tag_selector(comment_reply)).find('.edit').click
        updated_post_text = 'updated comment'
        edit_form_selector = '.edit-discussion-post-form'
        fill_in_summernote edit_form_selector, updated_post_text
        within find(answer_selector).find('.edit-discussion-post-form') do
          click_button I18n.t('javascript.course.discussion.post.submit')
        end
        wait_for_ajax

        comment_reply = comment_reply.reload
        expect(comment_reply.text).to have_tag('*', text: updated_post_text)

        # Delete the reply
        within find(content_tag_selector(comment_reply)) do
          find('.delete').click
        end

        wait_for_ajax
        expect(page).not_to have_content_tag_for(comment_reply)
        expect(comment_topic.reload.posts.count).to eq(1)

        # Should still be able to reply when last comment is deleted
        comment_reply_text = 'another reply'
        fill_in_summernote answer_selector, comment_reply_text
        within find(answer_selector) do
          find('.reply-comment').click
        end
        wait_for_ajax

        expect(comment_topic.reload.posts.count).to eq(2)
      end
    end

    context 'As a Course Staff' do
      let(:user) { create(:course_teaching_assistant, course: course).user }

      scenario "I can grade the student's work" do
        mrq_questions.each { |q| q.attempt(submission).save! }
        submission.finalise!
        submission.save!

        # Check that there is NO late submission warning.
        late_submission_text = I18n.t('course.assessment.submission.submissions.progress.'\
                                      'late_submission_warning')
        visit edit_course_assessment_submission_path(course, assessment, submission)
        # Submission progress panel
        expect(page).not_to have_selector('div.alert.alert-danger', text: late_submission_text)
        # Statistics panel
        expect(page).not_to have_selector('td.text-danger')

        # Create a late submission
        assessment.end_at = Time.zone.now - 1.day
        assessment.save!

        # Refresh and check for the late submission warning.
        visit edit_course_assessment_submission_path(course, assessment, submission)
        # Submission progress panel
        expect(page).to have_selector('div.alert.alert-danger', text: late_submission_text)
        # Statistics panel
        expect(page).to have_selector('td.text-danger')

        # Create an extra question after submission is submitted, user should still be able to
        # grade the submission in this case.
        create(:course_assessment_question_multiple_response, assessment: assessment)

        visit edit_course_assessment_submission_path(course, assessment, submission)

        no_answer_text = I18n.t('course.assessment.submission.submissions.no_answer')
        expect(page).to have_selector('div.alert', text: no_answer_text)
        expect(page).to have_button(I18n.t('course.assessment.submission.submissions.buttons.save'))
        click_link I18n.t('course.assessment.submission.submissions.buttons.evaluate_answers')
        wait_for_job

        # Publish the submission with empty answer grade
        click_button I18n.t('course.assessment.submission.submissions.buttons.publish')

        expect(page).to have_selector('div.alert-danger')
        expect(page).
          to have_button(I18n.t('course.assessment.submission.submissions.buttons.publish'))

        fill_in find('input.form-control.grade')[:name], with: 0
        click_button I18n.t('course.assessment.submission.submissions.buttons.publish')

        expect(current_path).
          to eq(edit_course_assessment_submission_path(course, assessment, submission))
        expect(submission.reload.published?).to be(true)
      end

      scenario 'I can run code on autograded programming questions' do
        multiple_programming_submission
        visit edit_course_assessment_submission_path(course, multiple_programming_assessment,
                                                     multiple_programming_submission)

        # The Run Code button is only shown for the auto_gradable? questions
        expect(page).to have_selector('.btn.submit-answer', count: 2)
      end
    end
  end
end
