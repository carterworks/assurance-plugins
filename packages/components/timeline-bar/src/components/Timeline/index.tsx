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
import { View, Flex, ActionButton, Tooltip, TooltipTrigger } from "@adobe/react-spectrum";
import { selectEvents, useFilteredEvents, useSelectedEvents } from '@assurance/plugin-bridge-provider';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { classNames } from '@react-spectrum/utils';
import { useScrollPosition, useScrollToCentered, useWindowSize } from './hooks';
import ScrubberLine from './ScrubberLine';
import CloseCircle from "@spectrum-icons/workflow/CloseCircle";

const clamp = (number, min, max) => Math.min(Math.max(number, min), max);

const EVENT_SIZE = 10;
const POPOVER_WIDTH = 250;
const POPOVER_HALF = POPOVER_WIDTH * 0.5;
const ARROW_PAD = 2;
const EXTRA_LINES = 50;
const BAR_HEIGHT = 56;

const getSelectedIndex = (selected, events) =>
  R.findIndex(
    check => check && check.uuid === (selected || {}).uuid,
    events || []
  ) || 0;

const Timeline = () => {
  const [width, setWidth] = useState(0);
  const [barPosition, setBarPosition] = useState(0);

  const outer = useRef(null);
  const bar = useRef(null);

  const events = useFilteredEvents();
  const selected = useSelectedEvents();

  useWindowSize();

  useEffect(() => {
    setWidth((outer.current as any)?.clientWidth);
  }, [outer.current]);
  useScrollPosition(({ currPos }) => {
    setBarPosition(currPos);
  }, bar);
  const eventSize = EVENT_SIZE;

  const autoScrollPos = useMemo(() => {
    let pos = 0;
    if (selected && selected[0]) {
      const firstIndex = getSelectedIndex(selected[0], events);
      pos = firstIndex * eventSize;

      // with two events or more, center between first and second event
      if (selected.length > 1) {
        const secondIndex = getSelectedIndex(selected[1], events);
        const secondPos = secondIndex * eventSize;
        pos = (
          pos < secondPos ? secondPos - pos : pos - secondPos
        ) / 2 + pos;
      }
      return pos;
    }
    return eventSize * events.length;
  }, [events, selected]);

  useScrollToCentered(autoScrollPos, bar, outer);

  const isSelected = e => e && e.uuid && R.findIndex(
    row => row && row.uuid === e.uuid, selected || []
  ) >= 0;

  const isVisible = (index) => {
    const pos = index * eventSize;
    const padding = EXTRA_LINES * eventSize;

    return barPosition + width + padding > pos && barPosition - padding < pos;
  };

  const scrubberLines = useMemo(() => events.map(
    (e, index) => isVisible(index) && (
      <ScrubberLine
        key={e.uuid}
        index={index}
        highlightColor={e.highlight}
        event={e}
        onPress={() => {
          selectEvents([e.uuid]);
        }}
        isSelected={isSelected(e)}
        eventSize={eventSize}
      />
    )
  ), [events, barPosition, width, selected]);

  return (
    <Flex gap="size-50" marginEnd={10}>
      <div 
        ref={outer}
        style={{
          height: BAR_HEIGHT,
          pointerEvents: 'none',
          width: 30,
          flexGrow: 5,
          position: 'relative',
        }}
      >
        <div 
          style={{
            position: 'absolute',
            width: '100%',
            height: BAR_HEIGHT - 2,
            overflowX: 'scroll',
            overflowY: 'hidden',
            pointerEvents: 'auto'
          }} 
          ref={bar}
        >
          {events?.length && (
            <View
              width={events.length * eventSize}
            >
              {scrubberLines}
            </View>
          )}
        </div>
      </div>
      {selected?.length ? (
        <View marginTop={8}>
          <ActionButton 
            isQuiet
            onPress={() => {
              selectEvents([]);
            }}
          >
            <CloseCircle size='S' />
          </ActionButton>
        </View>
      ) : null}       
    </Flex>
  )
};

export default Timeline;
