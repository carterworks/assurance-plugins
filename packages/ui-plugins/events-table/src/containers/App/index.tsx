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

import { ProgressCircle, Provider, defaultTheme } from "@adobe/react-spectrum";
import {
  PluginBridgeProvider,
  useEvents
} from "@assurance/plugin-bridge-provider";
import React from "react";
import { EventsTable } from "../../components/EventsTable";
import type { BridgeEvent } from "../../shared/types";

const Inner = () => {
  const events: BridgeEvent[] = useEvents();

  if (!events) {
    return <ProgressCircle aria-label="Loading…" isIndeterminate />;
  }
  if (events.length === 0) {
    return <div>No events yet</div>;
  }
  return <EventsTable events={events} maxHeight="90vh" maxWidth="100%" />;
};

const App = () => {
  return (
    <React.StrictMode>
      <Provider theme={defaultTheme}>
        <PluginBridgeProvider>
          <Inner />
        </PluginBridgeProvider>
      </Provider>
    </React.StrictMode>
  );
};

export default App;
