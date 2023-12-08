/*************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2023 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 **************************************************************************/

import { MenuTrigger, ActionButton, Menu, Flex, Item, Text } from "@adobe/react-spectrum";
import { useSelectedEvents } from "@assurance/plugin-bridge-provider";
import React from "react";

import Filter from "@spectrum-icons/workflow/Filter";
import DataRefresh from "@spectrum-icons/workflow/DataRefresh";
import DataRemove from "@spectrum-icons/workflow/DataRemove";

type Actions = {
  label: string;
  action: string;
  icon?: any;
}

const FilterButtons = () => {
  const selected = useSelectedEvents();
  
  const moreActions: Actions[] = [
    { label: 'Clear session', action: 'clearSession', icon: DataRemove },
    { label: 'Restore session', action: 'restoreSession', icon: DataRefresh },
  ];

  if (selected?.length) {
    moreActions.push({ label: 'Toggle hidden', action: 'hide' });
    moreActions.push({ label: 'Toggle flag', action: 'flag' });
  }

  return (
    <Flex gap="size-100" alignItems="center">
      <MenuTrigger>
        <ActionButton isQuiet aria-label="Filter menu">
          <Filter />
        </ActionButton>
        <Menu items={moreActions}>
          {item => {
            const renderedIcon = item.icon ? <item.icon /> : null;
            return (
              <Item key={item.action}>
                {renderedIcon}
                <Text>{item.label}</Text>
              </Item>
            );
          }}
        </Menu>
      </MenuTrigger>
    </Flex>
  );
  /*
          <span className={styles.actionButtons}>
          {hasSelected && annotateWidget}
          <FilterEventsButton
            onFilterChange={onFilterChange}
            selectedFilters={selectedFilters}
          />
          <MoreAcionsButton
            onClearSession={onClearSession}
            onRestoreSession={onRestoreSession}
          />
          <CloseToolbarButton
            closed={closed}
            onToggleClose={onToggleClose}
          />
        </span>
      */
  
  return <div>FilterButtons</div>;
};

export default FilterButtons;
