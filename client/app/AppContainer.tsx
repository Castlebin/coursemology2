import { Outlet } from 'react-router-dom';

import { loader } from './AppLoader';
import GlobalAnnouncements from './GlobalAnnouncements';

const AppContainer = (): JSX.Element => {
  return (
    <div className="flex h-screen flex-col">
      {/* <MasqueradeBanner as="Chen Yisheng Jonathan Lee Boon Kiat Chow" /> */}

      <GlobalAnnouncements />
      <Outlet />
    </div>
  );
};

export default Object.assign(AppContainer, { loader });
