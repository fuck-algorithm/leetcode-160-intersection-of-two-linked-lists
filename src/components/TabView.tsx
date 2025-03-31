import React, { useState } from 'react';

interface TabProps {
  label: string;
  id: string;
  children: React.ReactNode;
}

const Tab: React.FC<TabProps> = ({ children }) => {
  return <>{children}</>;
};

interface TabViewProps {
  children: React.ReactElement<TabProps>[];
  defaultTab?: string;
}

const TabView: React.FC<TabViewProps> = ({ children, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || children[0].props.id);

  const tabs = React.Children.map(children, (child) => {
    return {
      id: child.props.id,
      label: child.props.label
    };
  });

  return (
    <div className="tab-container">
      <div className="tab-header">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {React.Children.map(children, (child) => {
          if (child.props.id === activeTab) {
            return child;
          }
          return null;
        })}
      </div>
    </div>
  );
};

export { TabView, Tab }; 