import { combineReducers } from '@reduxjs/toolkit';

import enrolRequestsReducer from '../enrol-requests/reducers';
import invitationsReducer from '../user-invitations/reducers';
import usersReducer from './reducers';

import {
  CourseUserBasicListData,
  CourseUserData,
  CourseUserListData,
  ManageCourseUsersPermissions,
  ManageCourseUsersSharedData,
} from 'types/course/courseUsers';
import { ExperiencePointsRecordListData } from 'types/course/experiencePointsRecords';
import { PersonalTimeListData } from 'types/course/personalTimes';
import { TimelineData } from 'types/course/referenceTimelines';

import {
  DELETE_EXPERIENCE_POINTS_RECORD,
  DELETE_PERSONAL_TIME,
  DELETE_USER,
  DELETE_USER_OPTION,
  DeleteExperiencePointsRecordAction,
  DeletePersonalTimeAction,
  DeleteUserAction,
  DeleteUserOptionAction,
  SAVE_EXPERIENCE_POINTS_RECORD_LIST,
  SAVE_MANAGE_USER_LIST,
  SAVE_PERSONAL_TIME_LIST,
  SAVE_USER,
  SAVE_USER_LIST,
  SaveExperiencePointsRecordListAction,
  SaveManageUserListAction,
  SavePersonalTimeListAction,
  SaveUserAction,
  SaveUserListAction,
  UPDATE_EXPERIENCE_POINTS_RECORD,
  UPDATE_PERSONAL_TIME,
  UPDATE_USER_OPTION,
  UpdateExperiencePointsRecordAction,
  UpdatePersonalTimeAction,
  UpdateUserOptionAction,
} from './types';

const reducer = combineReducers({
  users: usersReducer,
  invitations: invitationsReducer,
  enrolRequests: enrolRequestsReducer,
});

export const actions = {
  saveUserList: (
    userList: CourseUserListData[],
    manageCourseUsersPermissions: ManageCourseUsersPermissions,
  ): SaveUserListAction => {
    return {
      type: SAVE_USER_LIST,
      userList,
      manageCourseUsersPermissions,
    };
  },

  saveManageUserList: (
    userList: CourseUserListData[],
    manageCourseUsersPermissions: ManageCourseUsersPermissions,
    manageCourseUsersData: ManageCourseUsersSharedData,
    userOptions: CourseUserBasicListData[] = [],
    timelines?: Record<TimelineData['id'], string>,
  ): SaveManageUserListAction => {
    return {
      type: SAVE_MANAGE_USER_LIST,
      userList,
      manageCourseUsersPermissions,
      manageCourseUsersData,
      userOptions,
      timelines,
    };
  },

  deleteUser: (userId: number): DeleteUserAction => {
    return {
      type: DELETE_USER,
      userId,
    };
  },

  saveUser: (user: CourseUserData): SaveUserAction => {
    return {
      type: SAVE_USER,
      user,
    };
  },

  savePersonalTimeList: (
    personalTimes: PersonalTimeListData[],
  ): SavePersonalTimeListAction => {
    return {
      type: SAVE_PERSONAL_TIME_LIST,
      personalTimes,
    };
  },

  updatePersonalTime: (
    personalTime: PersonalTimeListData,
  ): UpdatePersonalTimeAction => {
    return {
      type: UPDATE_PERSONAL_TIME,
      personalTime,
    };
  },

  deletePersonalTime: (personalTimeId: number): DeletePersonalTimeAction => {
    return {
      type: DELETE_PERSONAL_TIME,
      personalTimeId,
    };
  },

  updateUserOption: (
    userOption: CourseUserBasicListData,
  ): UpdateUserOptionAction => {
    return {
      type: UPDATE_USER_OPTION,
      userOption,
    };
  },

  deleteUserOption: (id: number): DeleteUserOptionAction => {
    return {
      type: DELETE_USER_OPTION,
      id,
    };
  },

  saveExperiencePointsRecordList: (
    courseUserName: string,
    rowCount: number,
    experiencePointRecords: ExperiencePointsRecordListData[],
  ): SaveExperiencePointsRecordListAction => {
    return {
      type: SAVE_EXPERIENCE_POINTS_RECORD_LIST,
      courseUserName,
      rowCount,
      experiencePointRecords,
    };
  },

  updateExperiencePointsRecord: (
    data: ExperiencePointsRecordListData,
  ): UpdateExperiencePointsRecordAction => {
    return {
      type: UPDATE_EXPERIENCE_POINTS_RECORD,
      data,
    };
  },

  deleteExperiencePointsRecord: (
    id: number,
  ): DeleteExperiencePointsRecordAction => {
    return {
      type: DELETE_EXPERIENCE_POINTS_RECORD,
      id,
    };
  },
};

export default reducer;
