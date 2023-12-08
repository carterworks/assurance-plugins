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
import { selectEvents, useSelectedEvents } from '@assurance/plugin-bridge-provider';
import Xarrow from "react-xarrows";
import EventTooltip from './EventTooltip';
import { chooseEventLabel } from "@assurance/common-utils";
import type { Event } from "@assurance/common-utils";
import { COLORS } from './const';
import { Branch } from '../types';

type TimingTreeProps = {
  column?: number;
  branch: Branch;
  path: number[];
  parentEvent?: Event;
};

const pathToId = path => `TimingTree-${path.join('-')}`;

const TimingTree = ({ branch, path, parentEvent }: TimingTreeProps) => {
  const timing = parentEvent && (branch.event.timestamp - parentEvent?.timestamp);
  const selectedEvents = useSelectedEvents();
  const isSelected = ((selectedEvents || []).findIndex((check) => check.uuid === branch.event.uuid)) >= 0;

  return (
    <Flex gap="size-800" alignItems="center">
      <EventTooltip 
        event={branch.event} 
        width={150} height={50} 
        id={pathToId(path)}
        onPress={() => {
          console.log("doselect");
          selectEvents([branch.event.uuid]);
        }}
      >
        <View
          borderColor="blue-400"
          borderWidth={isSelected ? 'thicker' : undefined}
          backgroundColor={COLORS[path.length - 1] as Responsive<BackgroundColorValue>}
          borderRadius="medium" 
          paddingY="size-50"
          paddingX="size-150" 
          overflow="hidden"
          maxWidth={150}
          width={150}
          height={40}
        >
          <Flex direction="column" justifyContent="center" height="100%" gap="size-50">
            <div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', boxSizing: 'border-box' }}>
              {chooseEventLabel(branch.event)}
            </div>
            <Flex justifyContent="end" width="100%">
              <div style={{ fontSize: 10 }}>
                {timing ? `${timing} ms` : null}
              </div>
            </Flex>
          </Flex>
        </View>
      </EventTooltip>
      {path.length > 1 && (
        <Xarrow
          start={pathToId(path.slice(0, -1))}
          end={pathToId(path)}
          headSize={6}
          strokeWidth={2}
          lineColor="#666666"
          headColor="#666666"
        />
      )}
      <Flex direction={'column'} gap="size-100">
        {Object.values(branch.children).map((child, index) => (
          <TimingTree branch={child} path={[...path, index]} parentEvent={branch.event} />
        ))}
      </Flex>
    </Flex>
  );
};

export default TimingTree;
