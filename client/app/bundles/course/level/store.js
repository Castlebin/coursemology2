import actionTypes from 'course/level/constants';

const initialState = {
  canManage: false,
  levels: [],
  isLoading: false,
  isSaving: false,
  message: null,
};

function isNumeric(n) {
  return Number.isFinite(parseInt(n, 10));
}

const reducer = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case actionTypes.LOAD_LEVELS_REQUEST: {
      return { ...state, isLoading: true };
    }
    case actionTypes.LOAD_LEVELS_SUCCESS: {
      const { levelData } = action;

      return {
        ...state,
        ...levelData,
        isLoading: false,
      };
    }
    case actionTypes.LOAD_LEVELS_FAILURE: {
      return { ...state, isLoading: false };
    }
    case actionTypes.UPDATE_EXP_THRESHOLD: {
      const { payload } = action;
      const { levels } = state;
      const copiedLevels = levels.slice();
      if (payload.newValue === '') {
        // Allows the textbox to be empty if the user removes all the digits.
        copiedLevels[payload.levelNumber] = '';
      } else if (isNumeric(payload.newValue)) {
        copiedLevels[payload.levelNumber] = parseInt(payload.newValue, 10);
      }

      return { ...state, levels: copiedLevels };
    }
    case actionTypes.SORT_LEVELS: {
      const { levels } = state;
      const copiedLevels = levels.slice();

      // Must specify a sort function or will get lexicographical sort.
      const sortedLevels = copiedLevels.sort((a, b) => a - b);

      return { ...state, levels: sortedLevels };
    }
    case actionTypes.ADD_LEVEL: {
      const { levels } = state;
      const copiedLevels = levels.slice();

      // Add a new level with twice the exp of the previous level.
      copiedLevels.push(levels[levels.length - 1] * 2);

      return { ...state, levels: copiedLevels };
    }
    case actionTypes.DELETE_LEVEL: {
      const { payload } = action;
      const { levels } = state;
      const copiedLevels = levels.slice();
      // Delete 1 item from the levelNumber position.
      copiedLevels.splice(payload.levelNumber, 1);

      return { ...state, levels: copiedLevels };
    }
    case actionTypes.SAVE_LEVELS: {
      return { ...state, isSaving: true };
    }
    case actionTypes.SAVE_LEVELS_SUCCESS: {
      return { ...state, isSaving: false };
    }
    case actionTypes.SAVE_LEVELS_FAILURE: {
      return { ...state, isSaving: false };
    }
    case actionTypes.SET_NOTIFICATION: {
      return { message: action.message };
    }
    default:
      return state;
  }
};

export const actions = {
  fetchLevels: () => {
    return (dispatch) => {
      dispatch({ type: actionTypes.LOAD_LEVELS_REQUEST });
      return CourseAPI.level
        .fetch()
        .then((response) => {
          dispatch({
            type: actionTypes.LOAD_LEVELS_SUCCESS,
            levelData: response.data,
          });
        })
        .catch(() => {
          dispatch({ type: actionTypes.LOAD_LEVELS_FAILURE });
        });
    };
  },

  updateExpThreshold: (levelNumber, newValue) => {
    return (dispatch) => {
      dispatch({
        type: actionTypes.UPDATE_EXP_THRESHOLD,
        payload: { levelNumber, newValue },
      });
    };
  },

  sortLevels: () => {
    return (dispatch) => {
      dispatch({ type: actionTypes.SORT_LEVELS });
    };
  },

  addLevel: () => {
    return (dispatch) => {
      dispatch({ type: actionTypes.ADD_LEVEL });
    };
  },

  deleteLevel: (levelNumber) => {
    return (dispatch) => {
      dispatch({ type: actionTypes.DELETE_LEVEL, payload: { levelNumber } });
    };
  },

  saveLevels: (levels, successMessage, failureMessage) => {
    return (dispatch) => {
      dispatch({ type: actionTypes.SAVE_LEVELS });
      return CourseAPI.level
        .save(levels)
        .then(() => {
          setNotification(successMessage)(dispatch);
          dispatch({ type: actionTypes.SAVE_LEVELS_SUCCESS });
        })
        .catch(() => {
          setNotification(failureMessage)(dispatch);
          dispatch({ type: actionTypes.SAVE_LEVELS_FAILURE });
        });
    };
  },
};

export default reducer;
