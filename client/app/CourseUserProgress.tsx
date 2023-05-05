import { CircularProgress, Typography } from '@mui/material';
import StackedBadges from 'bundles/course/assessment/pages/AssessmentsIndex/StackedBadges';
import { CourseLayoutData, CourseUserProgressData } from 'types/course/courses';

interface CourseUserProgressProps {
  from: CourseUserProgressData;
}

const CourseUserProgression = (props: CourseUserProgressProps): JSX.Element => {
  const { from: data } = props;

  return (
    <section className="px-4">
      <div className="wh-20 relative">
        <CircularProgress
          className="absolute text-neutral-300"
          size="5rem"
          thickness={6}
          value={100}
          variant="determinate"
        />

        <CircularProgress
          className="absolute"
          size="5rem"
          style={{ scale: '-1 1' }}
          thickness={6}
          value={data.nextLevelPercentage}
          variant="determinate"
        />

        <div className="flex h-full w-full items-center justify-center">
          <Typography className="font-bold" color="primary" variant="h6">
            {data.level}
          </Typography>
        </div>
      </div>

      <Typography variant="body2">
        {data.nextLevelExpDelta} EXP to next level
      </Typography>

      <StackedBadges
        badges={data.recentAchievements}
        remainingCount={data.remainingAchievementsCount}
      />
    </section>
  );
};

export default CourseUserProgression;
