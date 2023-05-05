import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import SidebarItem from './SidebarItem';
import { SidebarItemData } from 'types/course/courses';
import { ExpandMore } from '@mui/icons-material';

interface SidebarAccordionProps {
  containing: SidebarItemData[];
  title: string;
}

const SidebarAccordion = (props: SidebarAccordionProps): JSX.Element => {
  const { containing: items, title } = props;

  return (
    <Accordion
      className="overflow-clip rounded-xl"
      defaultExpanded
      disableGutters
      elevation={0}
    >
      <AccordionSummary
        classes={{ content: 'flex flex-col m-0 p-0' }}
        className="min-h-0 space-x-2 p-4 hover:bg-neutral-200"
        expandIcon={<ExpandMore />}
      >
        <Typography>{title}</Typography>
      </AccordionSummary>

      <AccordionDetails className="p-0">
        {items?.map((item) => (
          <SidebarItem key={item.key} of={item} square />
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

export default SidebarAccordion;
