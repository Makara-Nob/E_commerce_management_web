import {
  Bell,
  Home,
  Inbox,
  Settings,
  Users,
  LucideIcon,
  Database,
  LayoutGrid,
  Tag,
  Truck,
  Image,
  Package,
  Megaphone,
  CaravanIcon,
} from "lucide-react";

export const ROUTES = {
  AUTH: {
    LOGIN: "/login",
  },
  DASHBOARD: {
    INDEX: "/admin",
    MESSAGES: "/admin/messages",
    CALENDAR: "/admin/calendar",
    SETTINGS: "/admin/settings",
    SECURITY: "/admin/security",
    NOTIFICATIONS: "/admin/notifications",
    USERS: "/admin/users",
    USER_ROLES: "/admin/users/roles",
    PROFILE: "/admin/profile",
    BUSINESS: "/admin/business",
    NEW_OWNER: "/admin/new-owner",
    MANAGE_BUSINESS: "/admin/manage-business",
    SUBSCRIPTION_PLAN: "/admin/subscription-plan",
    MY_BUSINESS: "/admin/my-business",
    SUBSCRIPTION: "/admin/subscription",
    MY_SUBSCRIPTION: "/admin/my-subscription",
    EXCHANGE_RATE: "/admin/exchange-rate",
    PAYMENT: "/admin/payment",
    PRODUCTS: "/admin/products",
    PRODUCT_NEW: "/admin/products/new",
    PRODUCT_DETAIL: (id: string) => `/admin/products/${id}`,
    PRODUCT_EDIT: (id: string) => `/admin/products/${id}/edit`,
    CATEGORIES: "/admin/categories",
    BRANDS: "/admin/brands",
    SUPPLIERS: "/admin/suppliers",
    BANNERS: "/admin/banners",
    PROMOTIONS: "/admin/promotions",
    ORDERS: "/admin/shipping",
  },
} as const;

type Subroute = {
  title: string;
  href: string;
  icon?: LucideIcon;
};

type SidebarItem = {
  title: string;
  href?: string;
  icon?: LucideIcon;
  image?: string;
  section?: string;
  subroutes?: Subroute[];
};

export const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: ROUTES.DASHBOARD.INDEX,
    icon: Home,
  },
  {
    title: "Master Data",
    section: "Master Data",
    icon: Database,
    subroutes: [
      {
        title: "Categories",
        href: ROUTES.DASHBOARD.CATEGORIES,
        icon: LayoutGrid,
      },
      {
        title: "Brands",
        href: ROUTES.DASHBOARD.BRANDS,
        icon: Tag,
      },
      {
        title: "Suppliers",
        href: ROUTES.DASHBOARD.SUPPLIERS,
        icon: Truck,
      },
      {
        title: "Banners",
        href: ROUTES.DASHBOARD.BANNERS,
        icon: Image,
      },
    ],
  },
  {
    title: "Users",
    href: ROUTES.DASHBOARD.USERS,
    icon: Users,
  },

  {
    title: "Product",
    href: ROUTES.DASHBOARD.PRODUCTS,
    icon: Package,
  },
  {
    title: "Orders",
    href: ROUTES.DASHBOARD.ORDERS,
    icon: CaravanIcon,
  },
  {
    title: "Promotions",
    href: ROUTES.DASHBOARD.PROMOTIONS,
    icon: Megaphone,
  },
  {
    title: "Messages",
    href: ROUTES.DASHBOARD.MESSAGES,
    icon: Inbox,
  },
  {
    title: "Settings",
    href: ROUTES.DASHBOARD.SETTINGS,
    icon: Settings,
  },
  {
    title: "Notifications",
    href: ROUTES.DASHBOARD.NOTIFICATIONS,
    icon: Bell,
  },
];
