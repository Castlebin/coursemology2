interface User {
  id: number;
  name: string;
  role: 'owner' | 'manager' | 'student' | 'teaching_assistant' | 'observer';
  isPhantom: boolean;
}

interface Member {
  id: number;
  name: string;
  role: 'owner' | 'manager' | 'student' | 'teaching_assistant' | 'observer';
  isPhantom: boolean;
  groupRole: 'manager' | 'normal';
}

interface Category {
  id: number;
  name: string;
  description?: string;
}

interface Group {
  id: number;
  name: string;
  description?: string;
  members: Member[];
}

export interface GroupsState {
  isShown: boolean;
  dialogType: string;
  isDisabled: boolean;
  isFetching: boolean;
  hasFetchError: boolean;
  groupCategory: Category;
  groups: Group[];
  canManageCategory: boolean;
  canManageGroups: boolean;
  isManagingGroups: boolean;
  hasFetchUserError: boolean;
  courseUsers: User[];
  selectedGroupId: number;
  modifiedGroups: Group[];
  isUpdating: boolean;
}
