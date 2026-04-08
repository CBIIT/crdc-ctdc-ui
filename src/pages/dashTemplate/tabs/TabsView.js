import React from 'react';
import TabPanel from './TabPanel';
import { tabContainers } from '../../../bento/dashboardTabData';
import { Tabs as BentoTabs }  from '@bento-core/tab';
import { customTheme } from './DefaultTabTheme';
import useDashboardTabs from '../components/dashboard-tabs-store';

const Tabs = (props) => {
  const [state, actions] = useDashboardTabs();
  const handleTabChange = (_event, value) => {
    actions.changeCurrentTab(value);
  };

  /**
  * 1. change <name> to <display> as array item
  * 2. <display> -> [tab.name, props.dashboardStats[tab.count]]
  */
  const getTabs = (tabs) => tabs.map((tab) => ({
    ...tab,
    name: tab.name,
    count: `(${props.dashboardStats[tab.count]})`,
    display: [tab.name, props.dashboardStats[tab.count]],
    clsName: `${tab.name}`.toLowerCase().replace(' ', '_'),
  }));

  return (
    <>
      <BentoTabs
        tabItems={getTabs(tabContainers)}
        currentTab={state.currentTab}
        handleTabChange={handleTabChange}
        customTheme={customTheme}
      />
      {
        tabContainers.map((tab, index) => (
          <>
            <div hidden={state.currentTab !== index}>
              <TabPanel
                {...props}
                activeFilters={{
                  order_by: tab.defaultSortField,
                  sort_direction: tab.defaultSortDirection,
                  ...props.activeFilters,
                }}
                tab={tab}
                config={tab}
                activeTab={index === state.currentTab}
              />
            </div>
          </>
        ))
      }
    </>
  );
};

export default Tabs;
