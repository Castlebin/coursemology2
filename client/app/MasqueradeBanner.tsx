import { defineMessages } from 'react-intl';
import { TheaterComedy } from '@mui/icons-material';
import { Typography } from '@mui/material';

import Link from 'lib/components/core/Link';
import useTranslation from 'lib/hooks/useTranslation';

const translations = defineMessages({
  masquerading: {
    id: 'lib.components.core.banners.MasqueradeBanner.masquerading',
    defaultMessage: 'Masquerading as {as}.',
  },
  stopAndSwitchUser: {
    id: 'lib.components.core.banners.MasqueradeBanner.stopAndSwitchUser',
    defaultMessage: 'Stop and switch user',
  },
  stopMasquerading: {
    id: 'lib.components.core.banners.MasqueradeBanner.stopMasquerading',
    defaultMessage: 'Stop masquerading',
  },
});

interface MasqueradeBannerProps {
  as: string;
}

const MasqueradeBanner = (props: MasqueradeBannerProps): JSX.Element => {
  const { as: userName } = props;

  const { t } = useTranslation();

  return (
    <div className="border-only-b-fuchsia-300 flex flex-wrap items-center justify-between space-x-4 bg-fuchsia-700 px-5 py-1 text-white">
      <div className="flex items-center space-x-4">
        <TheaterComedy />

        <Typography variant="body2">
          {t(translations.masquerading, { as: userName })}
        </Typography>
      </div>

      <div className="flex items-center space-x-6">
        <Link className="text-inherit" href="#" underline="hover">
          {t(translations.stopAndSwitchUser)}
        </Link>

        <Link className="text-inherit" href="#" underline="hover">
          {t(translations.stopMasquerading)}
        </Link>
      </div>
    </div>
  );
};

export default MasqueradeBanner;
