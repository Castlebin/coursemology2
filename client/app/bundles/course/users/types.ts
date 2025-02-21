import {
  CourseUserBasicListData,
  CourseUserBasicMiniEntity,
  CourseUserData,
  CourseUserEntity,
  CourseUserListData,
  CourseUserMiniEntity,
  ManageCourseUsersPermissions,
  ManageCourseUsersSharedData,
} from 'types/course/courseUsers';
import {
  ExperiencePointsRecordListData,
  ExperiencePointsRecordMiniEntity,
  ExperiencePointsRecordSettings,
} from 'types/course/experiencePointsRecords';
import {
  PersonalTimeListData,
  PersonalTimeMiniEntity,
} from 'types/course/personalTimes';
import { TimelineData } from 'types/course/referenceTimelines';
import { EntityStore } from 'types/store';

// Action Names
export const SAVE_USER_LIST = 'course/users/SAVE_USER_LIST';
export const SAVE_USER = 'course/users/SAVE_USER';
export const SAVE_MANAGE_USER_LIST = 'course/users/SAVE_MANAGE_USER_LIST';
export const DELETE_USER = 'course/users/DELETE_USER';
export const SAVE_PERSONAL_TIME_LIST = 'course/users/SAVE_PERSONAL_TIME_LIST';
export const UPDATE_PERSONAL_TIME = 'course/users/UPDATE_PERSONAL_TIME';
export const DELETE_PERSONAL_TIME = 'course/users/DELETE_PERSONAL_TIME';
export const UPDATE_USER_OPTION = 'course/users/UPDATE_USER_OPTION';
export const DELETE_USER_OPTION = 'course/users/DELETE_USER_OPTION';
export const SAVE_EXPERIENCE_POINTS_RECORD_LIST =
  'course/users/SAVE_EXPERIENCE_POINTS_RECORD_LIST';
export const UPDATE_EXPERIENCE_POINTS_RECORD =
  'course/users/UPDATE_EXPERIENCE_POINTS_RECORD';
export const DELETE_EXPERIENCE_POINTS_RECORD =
  'course/users/DELETE_EXPERIENCE_POINTS_RECORD';

// Action Types
export interface SaveUserListAction {
  type: typeof SAVE_USER_LIST;
  userList: CourseUserListData[];
  manageCourseUsersPermissions: ManageCourseUsersPermissions;
}

export interface SaveUserAction {
  type: typeof SAVE_USER;
  user: CourseUserData;
}

export interface SaveManageUserListAction {
  type: typeof SAVE_MANAGE_USER_LIST;
  userList: CourseUserListData[];
  manageCourseUsersPermissions: ManageCourseUsersPermissions;
  manageCourseUsersData: ManageCourseUsersSharedData;
  userOptions: CourseUserBasicListData[];
  timelines?: Record<TimelineData['id'], string>;
}

export interface DeleteUserAction {
  type: typeof DELETE_USER;
  userId: number;
}

export interface SavePersonalTimeListAction {
  type: typeof SAVE_PERSONAL_TIME_LIST;
  personalTimes: PersonalTimeListData[];
}
export interface UpdatePersonalTimeAction {
  type: typeof UPDATE_PERSONAL_TIME;
  personalTime: PersonalTimeListData;
}
export interface DeletePersonalTimeAction {
  type: typeof DELETE_PERSONAL_TIME;
  personalTimeId: number;
}

export interface UpdateUserOptionAction {
  type: typeof UPDATE_USER_OPTION;
  userOption: CourseUserBasicListData;
}

export interface DeleteUserOptionAction {
  type: typeof DELETE_USER_OPTION;
  id: number;
}

export interface SaveExperiencePointsRecordListAction {
  type: typeof SAVE_EXPERIENCE_POINTS_RECORD_LIST;
  courseUserName: string;
  rowCount: number;
  experiencePointRecords: ExperiencePointsRecordListData[];
}

export interface UpdateExperiencePointsRecordAction {
  type: typeof UPDATE_EXPERIENCE_POINTS_RECORD;
  data: ExperiencePointsRecordListData;
}

export interface DeleteExperiencePointsRecordAction {
  type: typeof DELETE_EXPERIENCE_POINTS_RECORD;
  id: number;
}

export type UsersActionType =
  | SaveUserListAction
  | SaveUserAction
  | SaveManageUserListAction
  | DeleteUserAction
  | SavePersonalTimeListAction
  | UpdatePersonalTimeAction
  | DeletePersonalTimeAction
  | UpdateUserOptionAction
  | DeleteUserOptionAction
  | SaveExperiencePointsRecordListAction
  | UpdateExperiencePointsRecordAction
  | DeleteExperiencePointsRecordAction;

// State Types
export interface UsersState {
  users: EntityStore<CourseUserMiniEntity, CourseUserEntity>;
  userOptions: EntityStore<CourseUserBasicMiniEntity, CourseUserEntity>;
  permissions: ManageCourseUsersPermissions;
  manageCourseUsersData: ManageCourseUsersSharedData;
  personalTimes: EntityStore<PersonalTimeMiniEntity, PersonalTimeMiniEntity>;
  experiencePointsRecords: EntityStore<
    ExperiencePointsRecordMiniEntity,
    ExperiencePointsRecordMiniEntity
  >;
  experiencePointsRecordsSettings: ExperiencePointsRecordSettings;
  timelines?: Record<TimelineData['id'], string>;
}
