import React, { useState } from 'react';
import Tabs, { TabConfig } from './Tabs';

export default {
  title: 'Molecules/Tabs',
  component: Tabs,
};

const tabConfigs: TabConfig[] = [
  { key: 'tab1', label: 'Tab One' },
  { key: 'tab2', label: 'Tab Two' },
  { key: 'tab3', label: 'Tab Three', hidden: false },
];

export const Default = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  const [showTab3, setShowTab3] = useState(true);

  const tabs = tabConfigs.map(tab =>
    tab.key === 'tab3' ? { ...tab, hidden: !showTab3 } : tab
  );

  return (
    <div style={{ maxWidth: 500 }}>
      <button onClick={() => setShowTab3(s => !s)} style={{ marginBottom: 16 }}>
        Toggle Tab Three
      </button>
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
        <div tabKey="tab1">Content for Tab One</div>
        <div tabKey="tab2">Content for Tab Two</div>
        <div tabKey="tab3">Content for Tab Three</div>
      </Tabs>
      <button onClick={() => setActiveTab('tab2')} style={{ marginTop: 16 }}>
        Programmatically Switch to Tab Two
      </button>
    </div>
  );
};
