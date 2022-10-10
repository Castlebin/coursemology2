import { FC } from 'react';
import { Box } from '@mui/material';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import DataTable from 'lib/components/DataTable';
import tableTranslations from 'lib/translations/table';
import { TableColumns, TableOptions } from 'types/components/DataTable';
import LinearProgressWithLabel from 'lib/components/LinearProgressWithLabel';
import { Link } from 'react-router-dom';
import { formatShortDateTime } from 'lib/moment';
import { VideoSubmissionListData } from 'types/course/videoSubmissions';
import Note from 'lib/components/Note';

interface Props extends WrappedComponentProps {
  videoSubmissions: VideoSubmissionListData[] | null;
}

const UserVideoSubmissionsTable: FC<Props> = (props) => {
  const { videoSubmissions, intl } = props;

  if (!videoSubmissions || videoSubmissions.length === 0) {
    return <Note message="This course has no video yet!" />;
  }

  const options: TableOptions = {
    download: false,
    filter: false,
    jumpToPage: true,
    pagination: true,
    print: false,
    rowsPerPage: 100,
    rowsPerPageOptions: [100],
    search: false,
    selectableRows: 'none',
    setTableProps: (): object => {
      return { size: 'small' };
    },
    // setRowProps: (_row, dataIndex, _rowIndex): Record<string, unknown> => {
    //   return {
    //     className: `course_user_${videoSubmissions[dataIndex].courseUserId}`,
    //   };
    // },
    viewColumns: false,
  };

  const columns: TableColumns[] = [
    {
      name: 'title',
      label: intl.formatMessage(tableTranslations.videoNAme),
      options: {
        alignCenter: false,
        sort: false,
      },
    },
    {
      name: 'id',
      label: intl.formatMessage(tableTranslations.status),
      options: {
        filter: false,
        sort: false,
        search: false,
        customBodyRenderLite: (dataIndex): JSX.Element => {
          const videoSubmissionUrl =
            videoSubmissions[dataIndex].videoSubmissionUrl;
          return videoSubmissionUrl ? (
            <Link to={videoSubmissionUrl}>Watched</Link>
          ) : (
            <span className="text-red-500">Has Not Started</span>
          );
        },
      },
    },
    {
      name: 'createdAt',
      label: intl.formatMessage(tableTranslations.watchedAt),
      options: {
        alignCenter: true,
        sort: false,
        search: false,
        customBodyRenderLite: (dataIndex): string => {
          const createdAt = videoSubmissions[dataIndex].createdAt!;
          return createdAt ? formatShortDateTime(createdAt) : '-';
        },
      },
    },
    {
      name: 'percentWatched',
      label: intl.formatMessage(tableTranslations.percentWatched),
      options: {
        alignCenter: false,
        sort: false,
        search: false,
        customBodyRenderLite: (dataIndex): JSX.Element => {
          const percentWatched = videoSubmissions[dataIndex].percentWatched!;
          return <LinearProgressWithLabel value={percentWatched} />;
        },
      },
    },
  ];

  return (
    <Box className="mx-0 my-3">
      <DataTable
        data={videoSubmissions}
        columns={columns}
        options={options}
        includeRowNumber
      />
    </Box>
  );
};

export default injectIntl(UserVideoSubmissionsTable);
