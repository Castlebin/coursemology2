export interface LevelsState {
  canManage: boolean;
  levels: number[];
  isLoading: boolean;
  isSaving: boolean;
  message: string | null;
}
