import { AllExperiencePointsRecords } from 'types/course/experiencePointsRecords';

import CourseAPI from 'api/course';

export type ExperiencePointsData = Promise<AllExperiencePointsRecords>;

export const fetchAllExperiencePointsRecord = async (
  studentId: number | null,
  pageNum: number = 1,
): ExperiencePointsData => {
  const response = await CourseAPI.experiencePointsRecord.indexAll(
    studentId,
    pageNum,
  );
  return response.data;
};
