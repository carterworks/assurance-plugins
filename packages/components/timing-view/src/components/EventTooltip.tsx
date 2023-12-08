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
import { Tooltip, TooltipTrigger, ActionButton } from "@adobe/react-spectrum";
import { Event, chooseEventLabel, getTimestampText } from "@assurance/common-utils";

type EventTooltipProps = {
  onPress: () => void;
  event: Event;
  children: React.ReactNode;
  width: number;
  height: number;
  id?: string;
}

const EventTooltip = ({ onPress, event, children, width, height, id }: EventTooltipProps) => (
  <TooltipTrigger delay={50}>
    <ActionButton
      id={id}
      onPress={onPress}
      isQuiet
      minWidth={width}
      maxWidth={width}
      width={width}
      height={height}
      UNSAFE_style={{ border: 'none' }}
    >
      {children}
    </ActionButton>
    <Tooltip>
      <div>{chooseEventLabel(event)}</div>
      <div style={{ fontSize: 11 }}>{getTimestampText(event.timestamp)}</div>
    </Tooltip>
  </TooltipTrigger>
);

export default EventTooltip;
