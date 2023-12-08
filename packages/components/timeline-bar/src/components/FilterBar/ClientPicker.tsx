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

import React, { useMemo } from "react";
import { Flex, Item, Picker, Text } from "@adobe/react-spectrum";
import { filterToHash } from '@adobe/griffon-toolkit';
import * as R from 'ramda';
import { 
  navigateTo,
  useClients, 
  useNavigationFilters,
  useNavigationPath,
  useSelectedClients, 
} from "@assurance/plugin-bridge-provider";
import { event as rootEvent } from '@adobe/griffon-toolkit-common';
import { clientInfoIos, clientInfoAndroid } from '@adobe/griffon-toolkit-aep-mobile';
import Devices from "@spectrum-icons/workflow/Devices";
import Phone from "@spectrum-icons/workflow/DevicePhone";

const getClientIcon = type => (type === 'all'
  ? <Devices size="S" /> : <Phone size="S" />);

const getType = client => (clientInfoIos.isMatch(client)
  ? 'ios' : clientInfoAndroid.isMatch(client) ? 'android' : null);

const getIosLabel = client =>
  clientInfoIos.getDeviceName(client)
  || clientInfoIos.getModel(client)
  || clientInfoIos.getDeviceType(client);
const getAndroidLabel = client =>
  clientInfoAndroid.getDeviceName(client)
  || clientInfoAndroid.getDeviceType(client);

const getLabel = client =>
  (clientInfoIos.isMatch(client) ? getIosLabel(client)
    : clientInfoAndroid.isMatch(client) ? getAndroidLabel(client)
      : null);

const prepareClientForUI = client => ({
  clientId: rootEvent.getClientId(client),
  label: getLabel(client),
  type: getType(client),
  timestamp: client.timestamp
});


const ClientPicker = () => {
  const clients = useClients();
  const selectedClients = useSelectedClients();
  const filters = useNavigationFilters();
  const path = useNavigationPath();

  const prepared = useMemo(() => clients.map(prepareClientForUI), [clients]);

  const mapSelected = useMemo(() =>
    selectedClients.map(
      id => R.find(R.propEq(id, 'clientId'), prepared)
    ),
    [prepared, selectedClients]
  )

  if (clients.length === 0) {
    return <span>Unknown client</span>
  }

  if (clients.length === 1) {
    return (
      <Flex gap="size-100">
        {getClientIcon(mapSelected[0].type)}
        <Text>{mapSelected[0].label}</Text>
      </Flex>
    );
  }

  const options = [
    {
      clientId: 'all',
      label: 'All Clients',
      type: 'all'
     },
    ...prepared    
  ];
  
  return (
    <Picker 
      aria-label="Client" 
      labelPosition="side" 
      isQuiet
      items={options}
      selectedKey={selectedClients.length === clients.length ? 'all' : mapSelected[0].clientId}
      onSelectionChange={(selected) => {
        const output = {
          ...filters,
          clients: selected === 'all' ? undefined : rootEvent.makeClientFilter([selected])
        };

        const newPath = `${path}#${filterToHash(output)}`;
        navigateTo(newPath);
      }}
    >
      {(item) => 
        <Item key={item.clientId} textValue={item.label}>
          {getClientIcon(item.type)}
          <Text>{item.label}</Text>
        </Item>
      }
    </Picker>
  );
};

export default ClientPicker;
