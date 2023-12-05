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
import get from "lodash/get";
import React from "react";

type BridgePayload = Record<string, unknown>;

interface BridgeEvent {
  uuid: string;
  eventNumber: number;
  clientId: string;
  timestamp: number;
  vendor: string;
  type: string;
  payload: BridgePayload;
  annotations: unknown[];
  _internal_adb_props: Record<string, string>;
}

// For this table, the number of columns is dynamic: each event is a column,
// and the rows are:
// - uuid
// - eventNumber
// - timestamp
// - vendor
// and then each key in the payload is also a row.
// So we need to create the columns dynamically.

const timestampToDateString = (timestamp: number) =>
  `${Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    fractionalSecondDigits: 3,
    hour12: false
  } as Intl.DateTimeFormatOptions).format(timestamp)}`;

const rotateTable = (
  events?: BridgeEvent[]
): { columnNames: string[]; rowNames: string[]; data: string[][] } => {
  if (!events || events.length === 0) {
    return { columnNames: [], rowNames: [], data: [] };
  }
  const sortedEvents = [...events].sort((a, b) => a.timestamp - b.timestamp);

  const createSimpleGetter = (prop: string) => (event: BridgeEvent) => {
    const value = get(event, prop);
    if (value === null || value === undefined) {
      return "";
    }
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    return value;
  };

  const payloadRowsSet = new Set<keyof BridgePayload>();
  sortedEvents.forEach(event => {
    Object.keys(event.payload).forEach(key => payloadRowsSet.add(key));
  });

  const rowDefinitions: {
    name: string;
    getter: (event: BridgeEvent) => string;
  }[] = [
    {
      name: "timestamp",
      getter: event => timestampToDateString(event.timestamp)
    },
    { name: "vendor", getter: createSimpleGetter("vendor") },
    ...Array.from(payloadRowsSet).map(payloadKey => ({
      name: payloadKey,
      getter: createSimpleGetter(`payload.${payloadKey}`)
    }))
  ];
  const columnNames = sortedEvents.map(event => event.uuid);
  const rowNames = rowDefinitions.map(rowDef => rowDef.name);
  const data = rowDefinitions.map(({ getter }) =>
    sortedEvents.map(e => getter(e))
  );

  return { columnNames, rowNames, data };
};

const SimpleTable = ({ events }: { events: BridgeEvent[] }) => {
  const { rowNames, columnNames, data } = rotateTable(events);
  console.log("CARTER <SimpleTable>", { rowNames, columnNames, data });
  return (
    <table>
      <thead>
        <tr>
          <th />
          {columnNames.map((columnName, columnIndex) => (
            <th key={`column-${columnIndex}`}>{columnName}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={`row-${rowIndex}`}>
            <th scope="row">{rowNames[rowIndex]}</th>
            {row.map((cellValue, cellIndex) => {
              const key = `row-${rowIndex}-cell-${cellIndex}`;
              if (rowIndex === 0) {
                return <th key={key}>{cellValue}</th>;
              }
              return <td key={key}>{cellValue}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const SpectrumTable = ({ events }: { events: BridgeEvent[] }) => {
  return <div>TODO: {events} length</div>;
};

const Inner = () => {
  const events: BridgeEvent[] = useEvents();
  const [useSpectrum, setUseSpectrum] = React.useState(false);
  if (!events) {
    return <ProgressCircle aria-label="Loading…" isIndeterminate />;
  }
  if (events.length === 0) {
    return <div>No events yet</div>;
  }
  if (useSpectrum) {
    return (
      <div>
        <button type="button" onClick={() => setUseSpectrum(!useSpectrum)}>
          Use simple table
        </button>
        <SpectrumTable events={events} />
      </div>
    );
  }
  return (
    <div>
      <button type="button" onClick={() => setUseSpectrum(!useSpectrum)}>
        Use spectrum table
      </button>
      <SimpleTable events={events} />
    </div>
  );
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
