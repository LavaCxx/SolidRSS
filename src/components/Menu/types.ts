export type MenuItem = {
    id?: string;
    type: string;
    icon?: string;
    title: string;
    count?: number;
    link?: string;
    href?: string;
    click?: () => void;
    isActive?: boolean;
  };