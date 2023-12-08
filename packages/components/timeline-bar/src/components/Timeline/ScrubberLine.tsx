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

import { Flex, View, TooltipTrigger, Tooltip, ActionButton } from '@adobe/react-spectrum';
import { chooseEventLabel, getTimestampText } from "@assurance/common-utils";
import React from 'react';
import type { Event } from '@assurance/common-utils';

const BOX_HEIGHT = 16;
const SCRUBBER_LINE_HEIGHT = 24;

const ScrubberLine = ({
  highlightColor,
  onPress,
  event,
  isSelected,
  eventSize,
  index
}) => (
  <View
    position="absolute"
    left={eventSize * index}
    width={eventSize}
    height={SCRUBBER_LINE_HEIGHT + 4}
    top={0}
  >
    {!((index + 1) % 5) && (
      <View 
        data-testid="scrubber-tick"
        backgroundColor="gray-400"
        position="absolute"
        height={SCRUBBER_LINE_HEIGHT}
        top={12}
        width={2}
        left="calc(50% - 1px)"
      />
    )}
    {!((index + 1) % 25) && (
      <View 
        position="absolute"
        top={0}
        left="50%"
        UNSAFE_style={{ fontSize: '8px', transform: 'translateX(-50%)' }}
      >
        {index + 1}
      </View>
    )}
    <View marginTop={16}>
      <TooltipTrigger delay={50}>
        <ActionButton
          onPress={onPress}
          isQuiet
          width="100%"
          minWidth="100%"
          height={BOX_HEIGHT}
          UNSAFE_style={{ border: 'none' }}
        >
          <View
            backgroundColor={isSelected ? 'blue-400' : highlightColor || 'gray-300'}
            position="absolute"
            height={BOX_HEIGHT}
            width="100%"
          >
            <View
              height={BOX_HEIGHT}
              width="100%"
              backgroundColor="gray-50"
              borderColor={'gray-400'}
              borderWidth="thin"
              UNSAFE_style={{
                opacity: .2,
                fontWeight: 'bold',
                fontSize: 11,
                userSelect: 'none',
              }}
            >
              <Flex
                alignItems="center"
                justifyContent="center"
              >
                {event.hidden ? 'X' : event.important ? '!' : ''}
              </Flex>
            </View>
          </View>
        </ActionButton>
        <Tooltip>
          <div>{chooseEventLabel(event)}</div>
          <div style={{ fontSize: 11 }}>{getTimestampText(event.timestamp)}</div>
        </Tooltip>
      </TooltipTrigger>
    </View>
  </View>
);

export default ScrubberLine;
