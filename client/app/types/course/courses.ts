import { Permissions } from 'types';

import { AchievementBadgeData } from './assessment/assessments';
import { TodoData } from './lesson-plan/todos';
import { AnnouncementListData, AnnouncementMiniEntity } from './announcements';
import { CourseUserListData, CourseUserRoles } from './courseUsers';
import { NotificationData } from './notifications';

export type CoursePermissions = Permissions<'canCreate' | 'isCurrentUser'>;

export type CourseDataPermissions = Permissions<
  'isCurrentCourseUser' | 'canManage'
>;

export interface CourseListData {
  id: number;
  title: string;
  description: string;
  logoUrl: string;
  startAt: string;
}

export interface CourseData extends CourseListData {
  // Either this exists
  registrationInfo?: {
    isDisplayCodeForm: boolean;
    isInvited: boolean;
    enrolRequestId: number | null;
    isEnrollable: boolean;
  };
  instructors?: CourseUserListData[];
  // ---
  // Or this exists
  currentlyActiveAnnouncements?: AnnouncementListData[];
  assessmentTodos?: TodoData[];
  videoTodos?: TodoData[];
  surveyTodos?: TodoData[];
  // ---
  notifications: NotificationData[];
  permissions: CourseDataPermissions;
}

export interface CourseMiniEntity {
  id: number;
  title: string;
  description: string;
  logoUrl: string;
  startAt: string;
}

export interface CourseEntity extends CourseMiniEntity {
  // Either this exists
  registrationInfo?: {
    isDisplayCodeForm: boolean;
    isInvited: boolean;
    enrolRequestId: number | null;
    isEnrollable: boolean;
  };
  instructors?: CourseUserListData[];
  // ---
  // Or this exists
  currentlyActiveAnnouncements: AnnouncementMiniEntity[];
  assessmentTodos: TodoData[];
  videoTodos: TodoData[];
  surveyTodos: TodoData[];
  // ---
  notifications: NotificationData[];
  permissions: CourseDataPermissions;
}

export interface NewCourseFormData {
  title: string;
  description: string;
}

export interface SidebarItemData {
  key: string;
  label: string;
  path: string;
  icon: string;
  unread?: number;
}

export interface CourseUserProgressData {
  level?: number;
  exp?: number;
  nextLevelPercentage?: number;
  nextLevelExpDelta?: number;
  recentAchievements?: AchievementBadgeData[];
  remainingAchievementsCount?: number;
}

export interface CourseLayoutData {
  courseName: string;
  courseLogoUrl: string;
  courseUserUrl: string;
  userName: string;
  courseUserName?: string;
  courseUserRole?: CourseUserRoles;
  userAvatarUrl?: string;
  sidebar?: SidebarItemData[];
  adminSidebar?: SidebarItemData[];
  manageEmailSubscriptionUrl?: string;
  hasNotifications?: boolean;
  progress?: CourseUserProgressData;
}
