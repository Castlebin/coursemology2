import { Outlet } from 'react-router-dom';

import NotificationPopup from 'lib/containers/NotificationPopup';
import { loads } from 'lib/hooks/router/loaders';

import { loader } from './AppLoader';
import GlobalAnnouncements from './GlobalAnnouncements';

const AppContainer = (): JSX.Element => {
  return (
    <div className="flex h-screen flex-col">
      {/* <MasqueradeBanner as="Chen Yisheng Jonathan Lee Boon Kiat Chow" /> */}

      <GlobalAnnouncements />
      <Outlet />

      <NotificationPopup />
    </div>
  );
};

export default loads(AppContainer, { loader });
