import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';

import SubmissionsIndex from 'bundles/course/assessment/submissions/pages/SubmissionsIndex';
import DisbursementIndex from 'bundles/course/experience-points/disbursement/pages/DisbursementIndex';
import TimelineDesigner from 'bundles/course/reference-timelines/TimelineDesigner';
import NewForumPostResponsePage from 'bundles/course/assessment/question/forum-post-responses/NewForumPostResponsePage';
import EditForumPostResponsePage from 'bundles/course/assessment/question/forum-post-responses/EditForumPostResponsePage';
import NewMcqMrqPage from 'bundles/course/assessment/question/multiple-responses/NewMcqMrqPage';
import EditMcqMrqPage from 'bundles/course/assessment/question/multiple-responses/EditMcqMrqPage';
import NewTextResponsePage from 'bundles/course/assessment/question/text-responses/NewTextResponsePage';
import EditTextResponsePage from 'bundles/course/assessment/question/text-responses/EditTextResponsePage';
import AccountSettings from 'bundles/user/AccountSettings';
import NewVoicePage from 'bundles/course/assessment/question/voice-responses/NewVoicePage';
import EditVoicePage from 'bundles/course/assessment/question/voice-responses/EditVoicePage';
import GlobalAnnouncementIndex from 'bundles/announcements/pages/GlobalAnnouncementIndex';
import AchievementsIndex from 'bundles/course/achievement/pages/AchievementsIndex';
import AchievementShow from 'bundles/course/achievement/pages/AchievementShow';
import AnnouncementsIndex from 'bundles/course/announcements/pages/AnnouncementsIndex';
import SkillsIndex from 'bundles/course/assessment/skills/pages/SkillsIndex';
import CoursesIndex from 'bundles/course/courses/pages/CoursesIndex';
import CourseShow from 'bundles/course/courses/pages/CourseShow';
import CommentIndex from 'bundles/course/discussion/topics/pages/CommentIndex';
import ForumsIndex from 'bundles/course/forum/pages/ForumsIndex';
import ForumShow from 'bundles/course/forum/pages/ForumShow';
import ForumTopicShow from 'bundles/course/forum/pages/ForumTopicShow';
import LeaderboardIndex from 'bundles/course/leaderboard/pages/LeaderboardIndex';
import LearningMap from 'bundles/course/learning-map/containers/LearningMap';
import FolderShow from 'bundles/course/material/folders/pages/FolderShow';
import VideosIndex from 'bundles/course/video/pages/VideosIndex';
import VideoShow from 'bundles/course/video/pages/VideoShow';
import VideoSubmissionEdit from 'bundles/course/video/submission/pages/VideoSubmissionEdit';
import VideoSubmissionShow from 'bundles/course/video/submission/pages/VideoSubmissionShow';
import VideoSubmissionsIndex from 'bundles/course/video/submission/pages/VideoSubmissionsIndex';
import UserShow from 'bundles/users/pages/UserShow';

const RoutedApp = (): JSX.Element => {
  return (
    <App>
      <BrowserRouter>
        <Routes>
          <Route
            element={<SubmissionsIndex />}
            path="/courses/:courseId/assessments/submissions"
          />

          <Route
            element={<TimelineDesigner />}
            path="/courses/:course_id/timelines"
          />

          <Route
            element={<DisbursementIndex />}
            path="/courses/:courseId/users/disburse_experience_points"
          />

          <Route
            element={<NewForumPostResponsePage />}
            path="courses/:courseId/assessments/:assessmentId/question/forum_post_responses/new"
          />

          <Route
            element={<EditForumPostResponsePage />}
            path="/courses/:courseId/assessments/:assessmentId/question/forum_post_responses/:questionId/edit"
          />

          <Route
            element={<NewMcqMrqPage />}
            path="/courses/:courseId/assessments/:assessmentId/question/multiple_responses/new"
          />

          <Route
            element={<EditMcqMrqPage />}
            path="/courses/:courseId/assessments/:assessmentId/question/multiple_responses/:questionId/edit"
          />

          <Route
            element={<NewTextResponsePage />}
            path="courses/:courseId/assessments/:assessmentId/question/text_responses/new"
          />

          <Route
            element={<EditTextResponsePage />}
            path="/courses/:courseId/assessments/:assessmentId/question/text_responses/:questionId/edit"
          />

          <Route
            element={<NewVoicePage />}
            path="courses/:courseId/assessments/:assessmentId/question/voice_responses/new"
          />

          <Route
            element={<EditVoicePage />}
            path="/courses/:courseId/assessments/:assessmentId/question/voice_responses/:questionId/edit"
          />

          <Route element={<AccountSettings />} path="/user/profile/edit" />

          <Route element={<GlobalAnnouncementIndex />} path="/announcements" />

          <Route
            element={<AchievementsIndex />}
            path="/courses/:courseId/achievements/"
          />

          <Route
            element={<AchievementShow />}
            path="/courses/:courseId/achievements/:achievementId"
          />

          <Route
            element={<AnnouncementsIndex />}
            path="courses/:courseId/announcements"
          />

          <Route
            element={<SkillsIndex />}
            path="/courses/:courseId/assessments/skills"
          />

          <Route element={<CoursesIndex />} path="/courses" />

          <Route element={<CourseShow />} path="/courses/:courseId" />

          <Route
            element={<CommentIndex />}
            path="/courses/:courseId/comments"
          />

          <Route element={<ForumsIndex />} path="courses/:courseId/forums" />

          <Route
            element={<ForumShow />}
            path="courses/:courseId/forums/:forumId"
          />

          <Route
            element={<ForumTopicShow />}
            path="courses/:courseId/forums/:forumId/topics/:topicId"
          />

          <Route
            element={<LeaderboardIndex />}
            path="/courses/:courseId/leaderboard/"
          />

          <Route
            element={<LearningMap />}
            path="/courses/:courseId/learning_map"
          />

          <Route
            element={<FolderShow />}
            path="/courses/:courseId/materials/folders/:folderId"
          />

          <Route element={<VideosIndex />} path="courses/:courseId/videos" />
          <Route
            element={<VideoShow />}
            path="courses/:courseId/videos/:videoId"
          />
          <Route
            element={<VideoSubmissionsIndex />}
            path="courses/:courseId/videos/:videoId/submissions"
          />
          <Route
            element={<VideoSubmissionShow />}
            path="courses/:courseId/videos/:videoId/submissions/:submissionId"
          />
          <Route
            element={<VideoSubmissionEdit />}
            path="courses/:courseId/videos/:videoId/submissions/:submissionId/edit"
          />

          <Route element={<UserShow />} path="/users/:userId" />
        </Routes>
      </BrowserRouter>
    </App>
  );
};

export default RoutedApp;
