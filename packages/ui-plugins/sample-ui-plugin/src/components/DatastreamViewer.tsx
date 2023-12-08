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

import React from 'react';
import { EventDataViewer } from '@assurance/event-data-viewer';
import { useFilteredEvents } from '@assurance/plugin-bridge-provider';

const prepareEvents = (events) => {
  const results = (events || []).map(
    (event) => {
      const message = event.payload?.messages?.[1];
      let data: any = {};

      try {
        data = JSON.parse(message);
      } catch (e) { }

      return {
        eventId: event.uuid,
        values: data
      }
    }
  )

  return results;
};

const Timing = () => {
  const events = useFilteredEvents({
    matchers: ['payload.name==`datastream`']
  });
  return <EventDataViewer data={prepareEvents(events)} />;
};

export default Timing;
