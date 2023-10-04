import { FC } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { TableBody, TableCell, TableHead } from '@mui/material';
import { AllExperiencePointsRecordListData } from 'types/course/experiencePointsRecords';

import TableContainer from 'lib/components/core/layouts/TableContainer';
import tableTranslations from 'lib/translations/table';

import ExperiencePointsTableRow from './ExperiencePointsTableRow';

interface Props extends WrappedComponentProps {
  records: AllExperiencePointsRecordListData[];
}

const ExperiencePointsTable: FC<Props> = (props) => {
  const { intl, records } = props;

  return (
    <TableContainer dense variant="bare">
      <TableHead>
        <TableCell>{intl.formatMessage(tableTranslations.updatedAt)}</TableCell>
        <TableCell>{intl.formatMessage(tableTranslations.name)}</TableCell>
        <TableCell>{intl.formatMessage(tableTranslations.updater)}</TableCell>
        <TableCell>{intl.formatMessage(tableTranslations.reason)}</TableCell>
        <TableCell className="max-md:!hidden text-right">
          {intl.formatMessage(tableTranslations.experiencePointsAwarded)}
        </TableCell>
      </TableHead>

      <TableBody>
        {records.map((record) => (
          <ExperiencePointsTableRow key={record.id} record={record} />
        ))}
      </TableBody>
    </TableContainer>
  );
};

export default injectIntl(ExperiencePointsTable);
