import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { enableMapSet } from 'immer';

import submissionsReducer from './bundles/course/assessment/submissions/store';
import disbursementReducer from './bundles/course/experience-points/disbursement/store';
import timelinesReducer from './bundles/course/reference-timelines/store';
import globalAnnouncementReducer from './bundles/announcements/store';
import achievementsReducer from './bundles/course/achievement/store';
import announcementsReducer from './bundles/course/announcements/store';
import skillsReducer from './bundles/course/assessment/skills/store';
import coursesReducer from './bundles/course/courses/store';
import commentsReducer from './bundles/course/discussion/topics/store';
import forumsReducer from './bundles/course/forum/store';
import leaderboardReducer from './bundles/course/leaderboard/store';
import learningMapReducer from './bundles/course/learning-map/store';
import foldersReducer from './bundles/course/material/folders/store';

enableMapSet();

const rootReducer = combineReducers({
  disbursement: disbursementReducer,
  submissions: submissionsReducer,
  timelines: timelinesReducer,
  global: combineReducers({ announcements: globalAnnouncementReducer }),
  achievements: achievementsReducer,
  announcements: announcementsReducer,
  skills: skillsReducer,
  courses: coursesReducer,
  comments: commentsReducer,
  forums: forumsReducer,
  leaderboard: leaderboardReducer,
  learningMap: learningMapReducer,
  folders: foldersReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

// TODO: Replace `AppState` and `AppDispatch` from `types/store` with these.
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
