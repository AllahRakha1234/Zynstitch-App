import type { ComponentProps } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { ROLES, type UserRole } from '@/types/users.types';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type AppMenuItem = {
  label: string;
  href: '/customers' | '/measurements' | '/orders' | '/jobs' | '/users' | '/profile';
  icon: IconName;
  allowedRoles?: UserRole[];
};

/** Mirrors Tailor-Track `SideBarMenu`. */
export const APP_MENU: AppMenuItem[] = [
  { label: 'Customers', href: '/customers', icon: 'account-group' },
  { label: 'Measurements', href: '/measurements', icon: 'human-male-height' },
  { label: 'Orders', href: '/orders', icon: 'clipboard-list' },
  { label: 'Jobs', href: '/jobs', icon: 'briefcase' },
  {
    label: 'Users',
    href: '/users',
    icon: 'account-cog',
    allowedRoles: [ROLES.SUPER_ADMIN],
  },
];

export function getAllowedMenu(role: UserRole = ROLES.ADMIN) {
  return APP_MENU.filter((item) => {
    if (!item.allowedRoles) return true;
    return item.allowedRoles.includes(role);
  });
}
