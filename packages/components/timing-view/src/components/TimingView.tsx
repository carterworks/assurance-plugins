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

import * as R from 'ramda';
import React from "react";
import { Flex, View } from "@adobe/react-spectrum";
import type { Event } from "@assurance/common-utils";
import type { Branches } from "../types";


import TimingTree from './TimingTree';
import TimingViz from './TimingViz';

const PluginView = ({ events }) => {
  const eventMap = R.indexBy(R.path(['payload', 'ACPExtensionEventUniqueIdentifier']), events);
  const branches: Branches = R.reduce((acc, event) => {
    let eventPointer: Event = event;
    
    // first, lets find all the chains that end with this event
    const chain: Event[] = [];

    do {
      chain.push(eventPointer);
      eventPointer = eventPointer.payload?.ACPExtensionEventParentIdentifier ? 
        eventMap[eventPointer.payload.ACPExtensionEventParentIdentifier] : null;
    } while (eventPointer)

    chain.reverse();    

    if (chain.length <= 1) { return acc; }

    // now we'll merge these events into the tree
    const newAcc = { ...acc };
    let accPointer = newAcc;

    for (let i = 0; i < chain.length; i++) {
      const putEvent: Event = chain[i];
      const eventId: string = putEvent.payload?.ACPExtensionEventUniqueIdentifier as string;
      accPointer[eventId] = accPointer[eventId] || { event: putEvent, children: {} };
      accPointer = accPointer[eventId].children;
    }
    
    return newAcc;
  }, {}, events);

  const SIZE = 300;

  return (
    <Flex direction="column" position="relative">
      {Object.values(branches).map((branch, index) => {
        return (
          <View backgroundColor={index % 2 ? undefined : 'gray-50'}>
            <Flex gap="size-200">
              <View borderEndColor="gray-300" borderEndWidth="thin" width={SIZE + 70} flexShrink={0}>
                <TimingViz branch={branch} />
              </View>
              <View marginY="size-200">
                <TimingTree branch={branch} path={[index]} />
              </View>
            </Flex>
          </View>
        );
      })}
    </Flex>
  );
}

export default PluginView;
