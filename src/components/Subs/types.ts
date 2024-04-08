export type SubItem = {
    id: string;
    type: string;
    title: string;
    link?: string;
    description?: string;
    content?: string;
    href?: string;
    pubDate?: string;

    isRead:false,
    isLater:false,
  feedId: string;
  isActive?: boolean;
  };