export interface MenuItemImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface MenuItem {
  id: string | number;
  title: string;
  link: string;
  submenu?: MenuItem[];
  image?: string | MenuItemImage;
  imageStyle?: boolean;
  description?: string;
  badge?: string;
  badgeColor?: string;
  icon?: string | React.ReactNode;
  order?: number;
  isActive?: boolean;
  disabled?: boolean;
  level?: number;
  parentId?: string | number | null;
}

export interface MenuProps {
  items: MenuItem[];
  className?: string;
  activePath?: string;
  onItemClick?: (item: MenuItem) => void;
}

export interface MenuState {
  activeItemId: string | number | null;
  openSubmenus: (string | number)[];
  activePath: string;
}
