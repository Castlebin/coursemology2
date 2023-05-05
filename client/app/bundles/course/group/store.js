import { applyMiddleware, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';

import actionTypes, { dialogTypes } from './constants';
import { sortByName } from './utils/sort';

import CourseAPI from 'api/course';
import { setNotification } from 'lib/actions';
import { setReactHookFormError } from 'lib/helpers/react-hook-form-helper';
import { getCourseId } from 'lib/helpers/url-helpers';

const initialState = {
  isShown: false,
  dialogType: dialogTypes.CREATE_CATEGORY,
  isDisabled: false,
  isFetching: false,
  hasFetchError: false,
  groupCategory: null,
  groups: [],
  canManageCategory: false,
  canManageGroups: false,
  isManagingGroups: false,
  hasFetchUserError: false,
  courseUsers: [],
  selectedGroupId: -1,
  modifiedGroups: [],
  isUpdating: false,
};

const reducer = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case actionTypes.CREATE_CATEGORY_FORM_SHOW: {
      return {
        ...state,
        isShown: true,
        dialogType: dialogTypes.CREATE_CATEGORY,
      };
    }
    case actionTypes.UPDATE_CATEGORY_FORM_SHOW: {
      return {
        ...state,
        isShown: true,
        dialogType: dialogTypes.UPDATE_CATEGORY,
      };
    }
    case actionTypes.CREATE_GROUP_FORM_SHOW: {
      return {
        ...state,
        isShown: true,
        dialogType: dialogTypes.CREATE_GROUP,
      };
    }
    case actionTypes.UPDATE_GROUP_FORM_SHOW: {
      return {
        ...state,
        isShown: true,
        dialogType: dialogTypes.UPDATE_GROUP,
      };
    }
    case actionTypes.DIALOG_CANCEL: {
      return { ...state, isShown: false };
    }
    case actionTypes.SET_IS_DISABLED_TRUE:
    case actionTypes.CREATE_CATEGORY_REQUEST:
    case actionTypes.UPDATE_CATEGORY_REQUEST:
    case actionTypes.CREATE_GROUP_REQUEST:
    case actionTypes.UPDATE_GROUP_REQUEST: {
      return { ...state, isDisabled: true };
    }
    case actionTypes.CREATE_CATEGORY_SUCCESS: {
      return {
        ...state,
        isShown: false,
        isDisabled: false,
      };
    }
    case actionTypes.UPDATE_CATEGORY_SUCCESS: {
      return {
        ...state,
        isShown: false,
        isDisabled: false,
        groupCategory: action.groupCategory,
      };
    }
    case actionTypes.SET_IS_DISABLED_FALSE:
    case actionTypes.CREATE_CATEGORY_FAILURE:
    case actionTypes.UPDATE_CATEGORY_FAILURE:
    case actionTypes.CREATE_GROUP_FAILURE:
    case actionTypes.UPDATE_GROUP_FAILURE: {
      return {
        ...state,
        isDisabled: false,
      };
    }
    case actionTypes.MANAGE_GROUPS_START: {
      return { ...state, isManagingGroups: true };
    }
    case actionTypes.MANAGE_GROUPS_END: {
      return {
        ...state,
        isManagingGroups: false,
        selectedGroupId: -1,
        modifiedGroups: [],
      };
    }
    case actionTypes.FETCH_USERS_SUCCESS: {
      const newCourseUsers = [...action.courseUsers];
      newCourseUsers.sort(sortByName);
      return { ...state, courseUsers: newCourseUsers };
    }
    case actionTypes.FETCH_USERS_FAILURE: {
      return { ...state, hasFetchUserError: true };
    }
    case actionTypes.SET_SELECTED_GROUP_ID: {
      return { ...state, selectedGroupId: action.selectedGroupId };
    }
    case actionTypes.MODIFY_GROUP: {
      const newModifiedGroups = [
        ...state.modifiedGroups.filter((g) => g.id !== action.group.id),
        action.group,
      ];
      newModifiedGroups.sort(sortByName);
      return { ...state, modifiedGroups: newModifiedGroups };
    }
    case actionTypes.UPDATE_GROUP_MEMBERS_REQUEST: {
      return { ...state, isUpdating: true };
    }
    case actionTypes.UPDATE_GROUP_MEMBERS_SUCCESS:
    case actionTypes.UPDATE_GROUP_MEMBERS_FAILURE: {
      return { ...state, isUpdating: false };
    }
    case actionTypes.FETCH_GROUPS_REQUEST: {
      return { ...state, isFetching: true };
    }
    case actionTypes.FETCH_GROUPS_SUCCESS: {
      const newGroups = [...action.groups];
      newGroups.sort(sortByName);
      return {
        ...state,
        groupCategory: action.groupCategory,
        groups: newGroups,
        isFetching: false,
        canManageCategory: action.canManageCategory,
        canManageGroups: action.canManageGroups,
      };
    }
    case actionTypes.FETCH_GROUPS_FAILURE: {
      return {
        ...state,
        isFetching: false,
        hasFetchError: true,
      };
    }
    case actionTypes.UPDATE_GROUP_SUCCESS: {
      const index = state.modifiedGroups.findIndex(
        (g) => g.id === action.group.id,
      );
      const newModifiedGroups = state.modifiedGroups.splice();
      if (index !== -1) {
        newModifiedGroups[index] = {
          ...newModifiedGroups[index],
          name: action.group.name,
          description: action.group.description,
        };
      }
      newModifiedGroups.sort(sortByName);

      const filteredGroups = state.groups.filter(
        (g) => g.id !== action.group.id,
      );
      const newGroups = [...filteredGroups, action.group];
      newGroups.sort(sortByName);
      return {
        ...state,
        isShown: false,
        isDisabled: false,
        groups: newGroups,
        modifiedGroups: newModifiedGroups,
      };
    }
    case actionTypes.CREATE_GROUP_SUCCESS: {
      const newGroups = [...state.groups, ...action.groups];
      newGroups.sort(sortByName);
      return {
        ...state,
        isShown: false,
        isDisabled: false,
        groups: newGroups,
      };
    }
    case actionTypes.DELETE_GROUP_SUCCESS: {
      const newGroups = state.groups.filter((g) => g.id !== action.id);
      const newModifiedGroups = state.modifiedGroups.filter(
        (g) => g.id !== action.id,
      );
      if (state.selectedGroupId === action.id) {
        return {
          ...state,
          selectedGroupId: -1,
          groups: newGroups,
          modifiedGroups: newModifiedGroups,
        };
      }
      return { ...state, groups: newGroups, modifiedGroups: newModifiedGroups };
    }
    default:
      return state;
  }
};

export const actions = {
  createCategory: (
    { name, description },
    successMessage,
    failureMessage,
    setError,
  ) => {
    return (dispatch) => {
      dispatch({ type: actionTypes.CREATE_CATEGORY_REQUEST });

      return CourseAPI.groups
        .createCategory({ name, description })
        .then((response) => {
          dispatch({
            type: actionTypes.CREATE_CATEGORY_SUCCESS,
          });
          setNotification(successMessage)(dispatch);
          setTimeout(() => {
            if (response.data && response.data.id) {
              window.location = `/courses/${getCourseId()}/groups/${
                response.data.id
              }`;
            }
          }, 200);
        })
        .catch((error) => {
          dispatch({
            type: actionTypes.CREATE_CATEGORY_FAILURE,
          });
          setNotification(failureMessage)(dispatch);

          if (error.response && error.response.data) {
            setReactHookFormError(setError, error.response.data.errors);
          }
        });
    };
  },

  updateCategory: (
    id,
    { name, description },
    successMessage,
    failureMessage,
    setError,
  ) => {
    return (dispatch) => {
      dispatch({ type: actionTypes.UPDATE_CATEGORY_REQUEST });

      return CourseAPI.groups
        .updateCategory(id, { name, description })
        .then((response) => {
          dispatch({
            type: actionTypes.UPDATE_CATEGORY_SUCCESS,
            groupCategory: response.data,
          });
          setNotification(successMessage)(dispatch);
        })
        .catch((error) => {
          dispatch({
            type: actionTypes.UPDATE_CATEGORY_FAILURE,
          });
          setNotification(failureMessage)(dispatch);

          if (error.response && error.response.data) {
            setReactHookFormError(setError, error.response.data.errors);
          }
        });
    };
  },

  deleteCategory: (id, successMessage, failureMessage) => {
    return (dispatch) =>
      CourseAPI.groups
        .deleteCategory(id)
        .then((response) => {
          setNotification(successMessage)(dispatch);
          setTimeout(() => {
            if (response.data && response.data.id) {
              window.location = `/courses/${getCourseId()}/groups`;
            }
          }, 200);
        })
        .catch(() => {
          setNotification(failureMessage)(dispatch);
        });
  },

  fetchGroupData: (groupCategoryId) => {
    return (dispatch) => {
      dispatch({ type: actionTypes.FETCH_GROUPS_REQUEST });
      return CourseAPI.groups
        .fetch(groupCategoryId)
        .then((response) => {
          dispatch({
            type: actionTypes.FETCH_GROUPS_SUCCESS,
            groupCategory: response.data.groupCategory,
            groups: response.data.groups,
            canManageCategory: response.data.canManageCategory,
            canManageGroups: response.data.canManageGroups,
          });
        })
        .catch(() => {
          dispatch({ type: actionTypes.FETCH_GROUPS_FAILURE });
        });
    };
  },

  fetchCourseUsers: (groupCategoryId) => {
    return (dispatch) =>
      CourseAPI.groups
        .fetchCourseUsers(groupCategoryId)
        .then((response) => {
          dispatch({
            type: actionTypes.FETCH_USERS_SUCCESS,
            courseUsers: response.data.courseUsers,
          });
        })
        .catch(() => {
          dispatch({ type: actionTypes.FETCH_USERS_FAILURE });
        });
  },

  createGroups: (id, groupData, getCreatedGroupsMessage, setError) => {
    return (dispatch) => {
      dispatch({ type: actionTypes.CREATE_GROUP_REQUEST });
      return CourseAPI.groups
        .createGroups(id, groupData)
        .then((response) => {
          dispatch({
            type: actionTypes.CREATE_GROUP_SUCCESS,
            groups: response.data.groups,
          });
          setNotification(
            getCreatedGroupsMessage(response.data.groups, response.data.failed),
          )(dispatch);
        })
        .catch((error) => {
          dispatch({ type: actionTypes.CREATE_GROUP_FAILURE });
          setNotification(getCreatedGroupsMessage(0, groupData.groups.length))(
            dispatch,
          );

          if (error.response && error.response.data) {
            setReactHookFormError(setError, error.response.data.errors);
          }
        });
    };
  },

  updateGroup: (
    categoryId,
    groupId,
    { name, description },
    successMessage,
    failureMessage,
    setError,
  ) => {
    return (dispatch) => {
      dispatch({ type: actionTypes.UPDATE_GROUP_REQUEST });

      return CourseAPI.groups
        .updateGroup(categoryId, groupId, { name, description })
        .then((response) => {
          dispatch({
            type: actionTypes.UPDATE_GROUP_SUCCESS,
            group: response.data.group,
          });
          setNotification(successMessage)(dispatch);
        })
        .catch((error) => {
          dispatch({
            type: actionTypes.UPDATE_GROUP_FAILURE,
          });
          setNotification(failureMessage)(dispatch);

          if (error.response && error.response.data) {
            setReactHookFormError(setError, error.response.data.errors);
          }
        });
    };
  },

  deleteGroup: (categoryId, groupId, successMessage, failureMessage) => {
    return (dispatch) =>
      CourseAPI.groups
        .deleteGroup(categoryId, groupId)
        .then((response) => {
          setNotification(successMessage)(dispatch);
          dispatch({
            type: actionTypes.DELETE_GROUP_SUCCESS,
            id: response.data.id,
          });
        })
        .catch(() => {
          setNotification(failureMessage)(dispatch);
        });
  },

  updateGroupMembers: (
    categoryId,
    groupData, // {groups: []}
    successMessage,
    failureMessage,
  ) => {
    return (dispatch) => {
      dispatch({ type: actionTypes.UPDATE_GROUP_MEMBERS_REQUEST });

      return CourseAPI.groups
        .updateGroupMembers(categoryId, groupData)
        .then((response) => {
          setNotification(successMessage)(dispatch);
          dispatch({ type: actionTypes.UPDATE_GROUP_MEMBERS_SUCCESS });
          setTimeout(() => {
            if (response.data && response.data.id) {
              window.location = `/courses/${getCourseId()}/groups/${
                response.data.id
              }`;
            }
          }, 200);
        })
        .catch(() => {
          dispatch({ type: actionTypes.UPDATE_GROUP_MEMBERS_FAILURE });
          setNotification(failureMessage)(dispatch);
        });
    };
  },
};

export default reducer;
