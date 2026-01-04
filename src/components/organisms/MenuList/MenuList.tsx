/**
 * MenuList Component
 * Displays a list of menus with actions
 */

import React from 'react';
import { Typography, Button } from '@/components/atoms';
import { MenuCard } from '@/components/molecules';
import { Menu } from '@/types/menu.types';
import styles from './MenuList.module.scss';

export interface MenuListProps {
  /** Array of menus */
  menus: Menu[];
  /** Whether data is loading */
  isLoading?: boolean;
  /** Handler for creating a new menu */
  onCreateMenu: () => void;
  /** Handler for editing a menu */
  onEditMenu: (menuId: string) => void;
  /** Handler for deleting a menu */
  onDeleteMenu: (menuId: string) => void;
  /** Handler for setting a menu as default */
  onSetDefaultMenu: (menuId: string) => void;
}

export const MenuList: React.FC<MenuListProps> = ({
  menus,
  isLoading = false,
  onCreateMenu,
  onEditMenu,
  onDeleteMenu,
  onSetDefaultMenu,
}) => {
  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Typography variant="body">Loading menus...</Typography>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography variant="heading-3">Menus</Typography>
        <Button variant="primary" onClick={onCreateMenu}>
          Create New Menu
        </Button>
      </div>

      {menus.length === 0 ? (
        <div className={styles.empty}>
          <Typography variant="body" color="secondary">
            No menus created yet. Create your first menu to get started.
          </Typography>
          <Button variant="primary" onClick={onCreateMenu}>
            Create Menu
          </Button>
        </div>
      ) : (
        <div className={styles.grid}>
          {menus.map((menu) => (
            <MenuCard
              key={menu.id}
              menu={menu}
              onEdit={onEditMenu}
              onDelete={onDeleteMenu}
              onSetDefault={onSetDefaultMenu}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuList;
