import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import GlobalAnnouncementIndex from 'bundles/announcements/pages/GlobalAnnouncementIndex';
import AchievementShow from 'bundles/course/achievement/pages/AchievementShow';
import AchievementsIndex from 'bundles/course/achievement/pages/AchievementsIndex';
import AnnouncementsIndex from 'bundles/course/announcements/pages/AnnouncementsIndex';
import EditForumPostResponsePage from 'bundles/course/assessment/question/forum-post-responses/EditForumPostResponsePage';
import NewForumPostResponsePage from 'bundles/course/assessment/question/forum-post-responses/NewForumPostResponsePage';
import EditMcqMrqPage from 'bundles/course/assessment/question/multiple-responses/EditMcqMrqPage';
import NewMcqMrqPage from 'bundles/course/assessment/question/multiple-responses/NewMcqMrqPage';
import EditTextResponsePage from 'bundles/course/assessment/question/text-responses/EditTextResponsePage';
import NewTextResponsePage from 'bundles/course/assessment/question/text-responses/NewTextResponsePage';
import EditVoicePage from 'bundles/course/assessment/question/voice-responses/EditVoicePage';
import NewVoicePage from 'bundles/course/assessment/question/voice-responses/NewVoicePage';
import SkillsIndex from 'bundles/course/assessment/skills/pages/SkillsIndex';
import SubmissionsIndex from 'bundles/course/assessment/submissions/pages/SubmissionsIndex';
import CourseShow from 'bundles/course/courses/pages/CourseShow';
import CoursesIndex from 'bundles/course/courses/pages/CoursesIndex';
import CommentIndex from 'bundles/course/discussion/topics/pages/CommentIndex';
import UserRequests from 'bundles/course/enrol-requests/pages/UserRequests';
import DisbursementIndex from 'bundles/course/experience-points/disbursement/pages/DisbursementIndex';
import ForumShow from 'bundles/course/forum/pages/ForumShow';
import ForumsIndex from 'bundles/course/forum/pages/ForumsIndex';
import ForumTopicShow from 'bundles/course/forum/pages/ForumTopicShow';
import GroupIndex from 'bundles/course/group/pages/GroupIndex';
import GroupShow from 'bundles/course/group/pages/GroupShow';
import LeaderboardIndex from 'bundles/course/leaderboard/pages/LeaderboardIndex';
import LearningMap from 'bundles/course/learning-map/containers/LearningMap';
import Level from 'bundles/course/level/pages/Level';
import FolderShow from 'bundles/course/material/folders/pages/FolderShow';
import TimelineDesigner from 'bundles/course/reference-timelines/TimelineDesigner';
import StatisticsIndex from 'bundles/course/statistics/pages/StatisticsIndex';
import InvitationsIndex from 'bundles/course/user-invitations/pages/InvitationsIndex';
import InviteUsers from 'bundles/course/user-invitations/pages/InviteUsers';
import ExperiencePointsRecords from 'bundles/course/users/pages/ExperiencePointsRecords';
import ManageStaff from 'bundles/course/users/pages/ManageStaff';
import ManageStudents from 'bundles/course/users/pages/ManageStudents';
import PersonalTimes from 'bundles/course/users/pages/PersonalTimes';
import PersonalTimesShow from 'bundles/course/users/pages/PersonalTimesShow';
import UsersIndex from 'bundles/course/users/pages/UsersIndex';
import VideoShow from 'bundles/course/video/pages/VideoShow';
import VideosIndex from 'bundles/course/video/pages/VideosIndex';
import VideoSubmissionEdit from 'bundles/course/video/submission/pages/VideoSubmissionEdit';
import VideoSubmissionShow from 'bundles/course/video/submission/pages/VideoSubmissionShow';
import VideoSubmissionsIndex from 'bundles/course/video/submission/pages/VideoSubmissionsIndex';
import AccountSettings from 'bundles/user/AccountSettings';
import UserShow from 'bundles/users/pages/UserShow';

import App from './App';
import AppContainer from './AppContainer';
import AppIndex from './AppIndex';
import AppLoading from './AppLoading';
import CourseContainer from './CourseContainer';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppContainer />,
    loader: AppContainer.loader,
    children: [
      { index: true, element: <AppIndex /> },
      {
        path: 'courses',
        children: [
          { index: true, element: <CoursesIndex /> },
          {
            path: ':courseId',
            element: <CourseContainer />,
            loader: CourseContainer.loader,
            handle: (): string => 'Home',
            children: [
              { index: true, element: <CourseShow /> },
              {
                path: 'assessments',
                handle: 'Assessments',
                children: [
                  { index: true },
                  {
                    path: 'submissions',
                    loader: SubmissionsIndex.loader,
                    handle: SubmissionsIndex.handle,
                    element: <SubmissionsIndex />,
                  },
                  { path: 'skills', element: <SkillsIndex /> },
                  {
                    path: ':assessmentId',
                    children: [
                      {
                        path: 'question',
                        children: [
                          {
                            path: 'forum_post_responses',
                            children: [
                              {
                                path: 'new',
                                element: <NewForumPostResponsePage />,
                              },
                              {
                                path: 'edit',
                                element: <EditForumPostResponsePage />,
                              },
                            ],
                          },
                          {
                            path: 'multiple_responses',
                            children: [
                              { path: 'new', element: <NewMcqMrqPage /> },
                              { path: 'edit', element: <EditMcqMrqPage /> },
                            ],
                          },
                          {
                            path: 'text_responses',
                            children: [
                              {
                                path: 'new',
                                element: <NewTextResponsePage />,
                              },
                              {
                                path: 'edit',
                                element: <EditTextResponsePage />,
                              },
                            ],
                          },
                          {
                            path: 'voice_responses',
                            children: [
                              { path: 'new', element: <NewVoicePage /> },
                              { path: 'edit', element: <EditVoicePage /> },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                path: 'achievements',
                children: [
                  { index: true, element: <AchievementsIndex /> },
                  {
                    path: ':achievementId',
                    children: [{ index: true, element: <AchievementShow /> }],
                  },
                ],
              },
              { path: 'comments', element: <CommentIndex /> },
              { path: 'leaderboard', element: <LeaderboardIndex /> },
              { path: 'learning_map', element: <LearningMap /> },
              { path: 'levels', element: <Level /> },
              { path: 'statistics', element: <StatisticsIndex /> },
              { path: 'students', element: <ManageStudents /> },
              { path: 'staff', element: <ManageStaff /> },
              { path: 'enrol_requests', element: <UserRequests /> },
              { path: 'user_invitations', element: <InvitationsIndex /> },
              { path: 'timelines', element: <TimelineDesigner /> },
              {
                path: 'groups',
                children: [
                  { index: true, element: <GroupIndex /> },
                  { path: ':groupCategoryId', element: <GroupShow /> },
                ],
              },
              {
                path: 'forums',
                children: [
                  { index: true, element: <ForumsIndex /> },
                  {
                    path: ':forumId',
                    children: [
                      {
                        index: true,
                        element: <ForumShow />,
                      },
                      {
                        path: 'topics',
                        children: [
                          {
                            path: ':topicId',
                            element: <ForumTopicShow />,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                path: 'materials',
                children: [
                  {
                    path: 'folders',
                    children: [{ path: ':folderId', element: <FolderShow /> }],
                  },
                ],
              },
              {
                path: 'videos',
                children: [
                  {
                    index: true,
                    loader: VideosIndex.loader,
                    handle: VideosIndex.handle,
                    element: <VideosIndex />,
                  },
                  {
                    path: ':videoId',
                    children: [
                      { index: true, element: <VideoShow /> },
                      {
                        path: 'submissions',
                        children: [
                          { index: true, element: <VideoSubmissionsIndex /> },
                          {
                            path: ':submissionId',
                            children: [
                              {
                                index: true,
                                element: <VideoSubmissionShow />,
                              },
                              {
                                path: 'edit',
                                element: <VideoSubmissionEdit />,
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                path: 'announcements',
                children: [
                  {
                    index: true,
                    loader: AnnouncementsIndex.loader,
                    handle: AnnouncementsIndex.handle,
                    element: <AnnouncementsIndex />,
                  },
                ],
              },
              {
                path: 'users',
                children: [
                  { index: true, element: <UsersIndex /> },
                  {
                    path: 'disburse_experience_points',
                    element: <DisbursementIndex />,
                  },
                  { path: 'personal_times', element: <PersonalTimes /> },
                  { path: 'invite', element: <InviteUsers /> },
                  {
                    path: ':userId',
                    children: [
                      { index: true, element: <UserShow /> },
                      {
                        path: 'personal_times',
                        element: <PersonalTimesShow />,
                      },
                      {
                        path: 'experience_points_records',
                        element: <ExperiencePointsRecords />,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      { path: 'user/profile/edit', element: <AccountSettings /> },
      { path: 'users/:userId', element: <UserShow /> },
      { path: 'announcements', element: <GlobalAnnouncementIndex /> },
    ],
  },
]);

const RoutedApp = (): JSX.Element => {
  return (
    <App>
      <RouterProvider fallbackElement={<AppLoading />} router={router} />
    </App>
  );
};

export default RoutedApp;
