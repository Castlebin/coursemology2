# frozen_string_literal: true
require 'rails_helper'

RSpec.describe Course::Forum::PostNotifier, type: :notifier do
  let!(:instance) { Instance.default }

  with_tenant(:instance) do
    let(:course) { create(:course) }
    let(:forum) { create(:forum, course: course) }
    let!(:topic) { create(:forum_topic, forum: forum) }
    let(:post) { create(:course_discussion_post, topic: topic.acting_as) }
    let(:user) do
      user = create(:course_user, course: course).user
      topic.subscriptions.create(user: user)
      user
    end

    describe '#post_replied' do
      subject { Course::Forum::PostNotifier.post_replied(user, post) }

      it 'sends a course notification' do
        expect { subject }.to change(course.notifications, :count).by(1)
      end

      it 'sends an email notification' do
        expect { subject }.to change { ActionMailer::Base.deliveries.count }.by(1)
      end
    end
  end
end
