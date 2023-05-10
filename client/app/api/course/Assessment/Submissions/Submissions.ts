import {
  FetchSubmissionsData,
  SubmissionListData,
  SubmissionPermissions,
  SubmissionsMetaData,
} from 'types/course/assessment/submissions';

import BaseCourseAPI from 'api/course/Base';
import { APIResponse } from 'api/types';

export default class SubmissionsAPI extends BaseCourseAPI {
  get #urlPrefix(): string {
    return `/courses/${this.courseId}/assessments/submissions`;
  }

  /**
   * Fetches a list of achievements in a course.
   */
  index(): APIResponse<FetchSubmissionsData> {
    return this.client.get(this.#urlPrefix);
  }

  pending(isMyStudents: boolean): APIResponse<{
    submissions: SubmissionListData[];
    metaData: SubmissionsMetaData;
    permissions: SubmissionPermissions;
  }> {
    return this.client.get(`${this.#urlPrefix}/pending`, {
      params: { my_students: isMyStudents },
    });
  }

  category(categoryId: number): APIResponse<{
    submissions: SubmissionListData[];
    metaData: SubmissionsMetaData;
    permissions: SubmissionPermissions;
  }> {
    return this.client.get(this.#urlPrefix, {
      params: { category: categoryId },
    });
  }

  /**
   * Filters submissions based on params
   */
  filter(
    categoryId: number | null,
    assessmentId: number | null,
    groupId: number | null,
    userId: number | null,
    pageNum: number | null,
  ): APIResponse<{
    submissions: SubmissionListData[];
    metaData: SubmissionsMetaData;
    permissions: SubmissionPermissions;
  }> {
    return this.client.get(this.#urlPrefix, {
      params: {
        'filter[category_id]': categoryId,
        'filter[assessment_id]': assessmentId,
        'filter[group_id]': groupId,
        'filter[user_id]': userId,
        'filter[page_num]': pageNum,
      },
    });
  }

  /**
   * Filters pending submissions, used for pagination
   */
  filterPending(
    myStudents: boolean,
    pageNum: number | null,
  ): APIResponse<{
    submissions: SubmissionListData[];
    metaData: SubmissionsMetaData;
    permissions: SubmissionPermissions;
  }> {
    return this.client.get(
      `${this.#urlPrefix}/pending?my_students=${myStudents}`,
      {
        params: {
          'filter[page_num]': pageNum,
        },
      },
    );
  }
}
