import { ComponentType } from "react";
import * as icons from "react-icons/md";

export type GmailItem = {
  id: string;
  name: string;
  icon: ComponentType;
  unread?: number;
  readOnly: boolean;
  children?: GmailItem[];
  collapsed?: boolean;
};

export const gmailData: GmailItem[] = [
  {
    id: "1",
    name: "Inbox",
    unread: 1,
    readOnly: true,
    icon: icons.MdInbox,
    collapsed: true,
  },
  {
    id: "2",
    name: "Starred",
    unread: 0,
    readOnly: true,
    icon: icons.MdStarOutline,
    collapsed: true,
  },
  {
    id: "3",
    name: "Snoozed",
    unread: 0,
    readOnly: true,
    icon: icons.MdAccessTime,
    collapsed: true,
  },
  {
    id: "4",
    name: "Sent",
    unread: 0,
    readOnly: true,
    icon: icons.MdSend,
    collapsed: true,
  },
  {
    id: "5",
    name: "Drafts",
    unread: 14,
    readOnly: true,
    icon: icons.MdOutlineDrafts,
    collapsed: true,
  },
  {
    id: "6",
    name: "Spam",
    unread: 54,
    readOnly: true,
    icon: icons.MdOutlineReportGmailerrorred,
    collapsed: true,
  },
  {
    id: "7",
    name: "Important",
    unread: 0,
    readOnly: true,
    icon: icons.MdLabelImportantOutline,
    collapsed: true,
  },
  {
    id: "8",
    name: "Chats",
    unread: 0,
    readOnly: true,
    icon: icons.MdOutlineChat,
    collapsed: true,
  },
  {
    id: "9",
    name: "Scheduled",
    unread: 0,
    readOnly: true,
    icon: icons.MdOutlineScheduleSend,
    collapsed: true,
  },
  {
    id: "10",
    name: "All Mail",
    unread: 0,
    readOnly: true,
    icon: icons.MdOutlineMail,
    collapsed: true,
  },
  {
    id: "11",
    name: "Trash",
    unread: 0,
    readOnly: true,
    icon: icons.MdOutlineDelete,
    collapsed: true,
  },
  {
    id: "12",
    name: "Categories",
    icon: icons.MdOutlineLabel,
    readOnly: true,
    collapsed: false,
    children: [
      {
        id: "13",
        name: "Social",
        unread: 946,
        readOnly: false,
        icon: icons.MdPeopleOutline,
        collapsed: true,
      },
      {
        id: "14",
        name: "Updates",
        unread: 4580,
        readOnly: false,
        icon: icons.MdOutlineInfo,
        collapsed: true,
      },
      {
        id: "15",
        name: "Forums",
        unread: 312,
        readOnly: false,
        icon: icons.MdChatBubbleOutline,
        collapsed: true,
        children: [
          {
            id: "15-1",
            name: "Github",
            readOnly: false,
            icon: icons.MdSocialDistance,
            collapsed: true,
          },
        ],
      },
      {
        id: "16",
        name: "Promotions",
        unread: 312,
        readOnly: false,
        icon: icons.MdOutlineLocalOffer,
        collapsed: true,
      },
    ],
  },
];
