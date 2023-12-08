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

import React from "react";
import { Flex, View } from "@adobe/react-spectrum";
import type { Responsive, BackgroundColorValue } from "@react-types/shared";
import { selectEvents } from '@assurance/plugin-bridge-provider';
import type { Event } from "@assurance/common-utils";
import EventTooltip from './EventTooltip';
import { COLORS } from './const';
import { Branch } from '../types';

const MS_PER_PIXEL = .3;

type Chain = Event[];

const TimingVizRow = ({ size, chain }) => {
  const start = chain[0].timestamp;
  const total = chain[chain.length - 1].timestamp - start;

  // console.log(size, chain);

  return (
    <Flex gap="size-150" alignItems='center'>
      <Flex width={size} gap={1} height={50} alignItems='center'>
        {chain.map((event: Event, index) => {
          const width = index === 0 ? 6 : Math.max((event.timestamp - chain[index - 1].timestamp) * MS_PER_PIXEL, 6);
          return (
            <EventTooltip 
              event={event} 
              width={width} 
              height={30}
              onPress={() => {
                selectEvents([event.uuid]);
              }}
            >
              <View 
                backgroundColor={COLORS[index] as Responsive<BackgroundColorValue>} 
                height={30}
                minWidth={width} 
                width={width} 
                borderRadius="small" 
              />
            </EventTooltip>
          );
        })}
      </Flex>
      <div style={{ fontSize: 10 }}>{total} ms</div>
    </Flex>
  );
};

const TimingViz = ({ branch }) => {
  // flatten the tree into a list of chains
  const chains: Event[][] = [];

  const flatten = (branch: Branch, chain?: Chain) => {
    let newChain = chain ? [...chain] : [];
    newChain.push(branch.event)
    
    if (Object.keys(branch.children).length) {
      Object.values(branch.children).forEach((child) => flatten(child, newChain));
    } else {
      chains.push(newChain);
    }
  }
  flatten(branch);

  return (
    <Flex direction="column" gap="size-100" marginY="size-200">
      {chains.map((chain) => <TimingVizRow chain={chain} size={300} />)}
    </Flex>
  )

}

export default TimingViz;
