# frozen_string_literal: true
require 'rails_helper'

RSpec.describe Course::Condition::Assessment do
  let!(:instance) { Instance.default }
  with_tenant(:instance) do
    subject { Ability.new(user, course, course_user) }
    let(:course) { create(:course) }
    let(:condition) { create(:assessment_condition, course: course) }

    context 'when the user is a Course Staff' do
      let(:course_user) { create(:course_manager, course: course) }
      let(:user) { course_user.user }

      it { is_expected.to be_able_to(:manage, condition) }
    end

    context 'when the user is a Course Student' do
      let(:course_user) { create(:course_student, course: course) }
      let(:user) { course_user.user }

      context 'when the assessment is published but has not started' do
        let(:not_started_assessment) do
          create(:assessment, :published_with_mrq_question, :not_started, course: course)
        end

        it { is_expected.to_not be_able_to(:attempt, not_started_assessment) }
      end

      context 'when the assessment has started' do
        let(:assessment1) { create(:assessment, :published_with_mrq_question, course: course) }
        let(:assessment2) { create(:assessment, :published_with_mrq_question, course: course) }
        let!(:condition) do
          create(:assessment_condition,
                 course: course,
                 assessment: assessment2,
                 conditional: assessment1)
        end

        context 'when the assessment does not have any condition' do
          it { is_expected.to be_able_to(:attempt, assessment2) }
        end

        context "when the user does not satisfied the assessment's conditions" do
          it { is_expected.to_not be_able_to(:attempt, assessment1) }
        end

        context "when the user satisfied the assessment's conditions" do
          it 'is able to attempt the assessment' do
            allow(assessment1).to receive(:conditions_satisfied_by?).and_return(true)

            expect(subject.can?(:attempt, assessment1)).to be_truthy
          end
        end
      end
    end
  end
end
