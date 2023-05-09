import { NavLink } from 'react-router-dom';
import {
  AddCircle,
  AddCircleOutlineOutlined,
  Book,
  BookOutlined,
  Campaign,
  CampaignOutlined,
  ChatBubble,
  ChatBubbleOutlineOutlined,
  EmojiEvents,
  EmojiEventsOutlined,
  FileCopy,
  FileCopyOutlined,
  Folder,
  FolderOutlined,
  Forum,
  ForumOutlined,
  Groups,
  GroupsOutlined,
  Home,
  HomeOutlined,
  InsertChart,
  InsertChartOutlined,
  Leaderboard,
  LeaderboardOutlined,
  ManageAccounts,
  ManageAccountsOutlined,
  Map as MapIcon,
  MapOutlined,
  OfflineBolt,
  OfflineBoltOutlined,
  People,
  PeopleOutlined,
  PieChart,
  PieChartOutlined,
  Send,
  SendOutlined,
  Settings,
  SettingsOutlined,
  Stairs,
  StairsOutlined,
  SvgIconComponent,
  Upload,
  UploadOutlined,
  Videocam,
  VideocamOutlined,
  ViewTimeline,
  ViewTimelineOutlined,
} from '@mui/icons-material';
import { Badge, Typography } from '@mui/material';
import { SidebarItemData } from 'types/course/courses';

const SIDEBAR_ICONS: Record<
  SidebarItemData['icon'],
  [SvgIconComponent, SvgIconComponent]
> = {
  bullhorn: [CampaignOutlined, Campaign],
  'video-camera': [VideocamOutlined, Videocam],
  plane: [SendOutlined, Send],
  upload: [UploadOutlined, Upload],
  trophy: [EmojiEventsOutlined, EmojiEvents],
  comments: [ChatBubbleOutlineOutlined, ChatBubble],
  star: [LeaderboardOutlined, Leaderboard],
  group: [PeopleOutlined, People],
  book: [BookOutlined, Book],
  'folder-open': [FolderOutlined, Folder],
  'list-ul': [ForumOutlined, Forum],
  'pie-chart': [PieChartOutlined, PieChart],
  'user-plus': [ManageAccountsOutlined, ManageAccounts],
  'bar-chart': [InsertChartOutlined, InsertChart],
  magic: [AddCircleOutlineOutlined, AddCircle],
  clone: [FileCopyOutlined, FileCopy],
  'star-half-o': [StairsOutlined, Stairs],
  'share-alt': [GroupsOutlined, Groups],
  bolt: [OfflineBoltOutlined, OfflineBolt],
  random: [ViewTimelineOutlined, ViewTimeline],
  gear: [SettingsOutlined, Settings],
  home: [HomeOutlined, Home],
  map: [MapOutlined, MapIcon],
};

interface SidebarItemProps {
  of: SidebarItemData;
  square?: boolean;
}

const SidebarItem = (props: SidebarItemProps): JSX.Element => {
  const { of: item, square } = props;

  return (
    <NavLink
      className={({ isActive }): string =>
        `no-underline ${isActive ? 'text-primary' : 'text-inherit'}`
      }
      end
      to={item.path}
    >
      {({ isActive }): JSX.Element => {
        const Icon = SIDEBAR_ICONS[item.icon][isActive ? 1 : 0];

        return (
          <div
            className={`flex select-none items-center space-x-5 p-4 transition-transform active:scale-95 active:rounded-xl ${
              !square ? 'rounded-xl' : ''
            } ${
              isActive
                ? 'bg-primary/10 hover:bg-primary/20 active:bg-primary/30'
                : 'hover:bg-neutral-200 active:bg-neutral-300'
            }`}
            role="button"
          >
            <Badge
              badgeContent={item.unread?.toString()}
              color="primary"
              max={999}
            >
              <Icon />
            </Badge>

            <Typography
              className="overflow-hidden text-ellipsis whitespace-nowrap font-medium"
              variant="body2"
            >
              {item.label}
            </Typography>
          </div>
        );
      }}
    </NavLink>
  );
};

export default SidebarItem;
