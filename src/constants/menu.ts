import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';

import { ROLES, type UserRole } from '@/types/users.types';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type AppMenuItem = {
  label: string;
  href: '/measurements' | '/jobs' | '/users' | '/profile';
  icon: IconName;
  allowedRoles?: UserRole[];
};

export type AppMenuActionItem = {
  label: 'Logout';
  action: 'logout';
  icon: IconName;
};

export const BOTTOM_TABS = [
  { label: 'Dashboard', href: '/', icon: 'view-dashboard-outline' },
  { label: 'Customers', href: '/customers', icon: 'account-group' },
  { label: 'Orders', href: '/orders', icon: 'package-variant' },
  { label: 'More', href: '/more', icon: 'menu' },
] as const satisfies readonly { label: string; href: string; icon: IconName }[];

export const MORE_MENU_SECTIONS: readonly {
  title: string;
  items: readonly (AppMenuItem | AppMenuActionItem)[];
}[] = [
  {
    title: 'Main navigation',
    items: [
      { label: 'Measurements', href: '/measurements', icon: 'ruler' },
      { label: 'Jobs', href: '/jobs', icon: 'briefcase' },
    ],
  },
  {
    title: 'Administration',
    items: [
      {
        label: 'Users',
        href: '/users',
        icon: 'account-group',
        allowedRoles: [ROLES.SUPER_ADMIN],
      },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Profile', href: '/profile', icon: 'account-circle-outline' },
      { label: 'Logout', action: 'logout', icon: 'logout' },
    ],
  },
];

export function getMoreMenuSections(role: UserRole = ROLES.ADMIN) {
  return MORE_MENU_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) =>
        !('allowedRoles' in item) ||
        !item.allowedRoles ||
        item.allowedRoles.includes(role),
    ),
  })).filter((section) => section.items.length > 0);
}

/** Use this shared role predicate for protected navigation destinations. */
export function canAccessUsers(role: UserRole = ROLES.ADMIN) {
  return role === ROLES.SUPER_ADMIN;
}

