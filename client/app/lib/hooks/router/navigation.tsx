import { useLocation, useNavigation } from 'react-router-dom';

export const useIsNavigationLoading = (): boolean => {
  const location = useLocation();
  const navigation = useNavigation();

  const isSameLocation = location.pathname === navigation.location?.pathname;
  return isSameLocation && navigation.state === 'loading';
};
