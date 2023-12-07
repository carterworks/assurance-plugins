import get from "lodash/get";
import type { BridgeEvent, BridgePayload } from "./types";

export const attemptObjectPrettyPrint = (value: string): string => {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch (e) {
    return value;
  }
}

export const timestampToDateString = (timestamp: number) =>
  `${Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    fractionalSecondDigits: 3,
    hour12: false
  } as Intl.DateTimeFormatOptions).format(timestamp)}`;

export const rotateTable = (
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
