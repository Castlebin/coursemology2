import { useState } from 'react';
import { defineMessages } from 'react-intl';
import { CloudDownload } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import { ExperiencePointsNameFilterData } from 'types/course/experiencePointsRecords';

import BackendPagination from 'lib/components/core/layouts/BackendPagination';
import Page from 'lib/components/core/layouts/Page';
import LoadingIndicator from 'lib/components/core/LoadingIndicator';
import Preload from 'lib/components/wrappers/Preload';
import useTranslation from 'lib/hooks/useTranslation';

import ExperiencePointsTable from './components/ExperiencePointsTable';
import ExperiencePointsFilter from './ExperiencePointsFilter';
import {
  ExperiencePointsData,
  fetchAllExperiencePointsRecord,
} from './operations';

const ROWS_PER_PAGE = 25 as const;

const translations = defineMessages({
  experiencePointsHistory: {
    id: 'course.users.ExperiencePointsRecords.experiencePointsHistory',
    defaultMessage: 'Experience Points History',
  },
});

const ExperiencePointsDetails = (): JSX.Element => {
  const { t } = useTranslation();

  const [pageNum, setPageNum] = useState(1);

  // For filtering
  const [selectedFilter, setSelectedFilter] = useState<{
    name: ExperiencePointsNameFilterData | null;
  }>({
    name: null,
  });

  const fetchExperienceInPage = (): ExperiencePointsData => {
    return fetchAllExperiencePointsRecord(
      selectedFilter.name ? selectedFilter.name.id : null,
      pageNum,
    );
  };

  const downloadButton = (
    <Button variant="outlined">
      <div className="flex w-fit items-center space-x-4 p-4 no-underline">
        <CloudDownload color="info" />
        <Typography color="links">Download CSV</Typography>
      </div>
    </Button>
  );

  return (
    <Preload
      render={<LoadingIndicator />}
      syncsWith={[pageNum, selectedFilter]}
      while={fetchExperienceInPage}
    >
      {(data): JSX.Element => (
        <Page
          actions={downloadButton}
          title={t(translations.experiencePointsHistory)}
          unpadded
        >
          <Page.PaddedSection>
            <ExperiencePointsFilter
              filter={data.filter}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            />
          </Page.PaddedSection>

          <BackendPagination
            handlePageChange={setPageNum}
            pageNum={pageNum}
            rowCount={data.rowCount}
            rowsPerPage={ROWS_PER_PAGE}
          />

          <ExperiencePointsTable records={data.experiencePointRecords} />
        </Page>
      )}
    </Preload>
  );
};

export default ExperiencePointsDetails;
