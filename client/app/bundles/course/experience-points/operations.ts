import { AllExperiencePointsRecords } from 'types/course/experiencePointsRecords';

import CourseAPI from 'api/course';

type Data = Promise<AllExperiencePointsRecords>;

export const fetchAllExperiencePointsRecord = async (
  pageNum: number = 1,
): Data => {
  const response = await CourseAPI.experiencePointsRecord.indexAll(pageNum);
  return response.data;
};
