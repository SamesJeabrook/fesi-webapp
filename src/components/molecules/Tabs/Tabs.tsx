import React from 'react';
import styles from './Tabs.module.scss';

export interface TabProps {
  tabKey: string;
  children: React.ReactNode;
}

export const Tab: React.FC<TabProps> = ({ tabKey, children }) => {
  return <>{children}</>;
};

export interface TabConfig {
  key: string;
  label: string;
  hidden?: boolean;
}

export interface TabsProps {
  tabs: TabConfig[];
  activeTab: string;
  onTabChange: (key: string) => void;
  children: React.ReactNode;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange, children, className }) => {
  // Filter out hidden tabs
  const visibleTabs = tabs.filter(tab => !tab.hidden);

  return (
    <div className={className ? `${styles.tabs} ${className}` : styles.tabs}>
      <div className={styles.tabList}>
        {visibleTabs.map(tab => (
          <button
            key={tab.key}
            className={
              tab.key === activeTab
                ? `${styles.tab} ${styles.active}`
                : styles.tab
            }
            onClick={() => onTabChange(tab.key)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.tabPanel}>
        {/* Render only the Tab child for the active tab */}
        {React.Children.map(children, child => {
          if (!React.isValidElement(child)) return null;
          // Only render Tab components with matching tabKey
          if (child.type === Tab && child.props.tabKey === activeTab) {
            return child;
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default Tabs;
