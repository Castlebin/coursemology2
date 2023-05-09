import { Route, Routes } from 'react-router-dom';

import StoreProvider from 'lib/components/wrappers/StoreProvider';

import LogsIndex from './pages/LogsIndex';
import SubmissionEditIndex from './pages/SubmissionEditIndex';
import SubmissionsIndex from './pages/SubmissionsIndex';
import store from './store';

const SubmissionRoutesWithStore = () => {
  const submissionsIndex =
    '/courses/:courseId/assessments/:assessmentId/submissions';
  const submissionEdit =
    '/courses/:courseId/assessments/:assessmentId/submissions/:submissionId/edit';
  const logs =
    '/courses/:courseId/assessments/:assessmentId/submissions/:submissionId/logs';

  return (
    <StoreProvider store={store}>
      <Routes>
        <Route element={<SubmissionsIndex />} exact path={submissionsIndex} />
        <Route element={<SubmissionEditIndex />} exact path={submissionEdit} />
        <Route element={<LogsIndex />} exact path={logs} />
      </Routes>
    </StoreProvider>
  );
};

export default SubmissionRoutesWithStore;
