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

import {
  Cell,
  Column,
  ProgressCircle,
  Provider,
  Row,
  Switch,
  TableBody,
  TableHeader,
  TableView,
  View,
  DialogTrigger,
  Text,
  Dialog,
  Heading,
  Header,
  Content,
  Button,
  ButtonGroup,
  defaultTheme,
  ActionButton,
  Well,
  SpectrumTableProps
} from "@adobe/react-spectrum";
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

type EventsTable = (
  props: { events: BridgeEvent[] } & Pick<
    SpectrumTableProps<string>,
    "maxHeight" | "maxWidth"
  >
) => JSX.Element;

const SimpleTable: EventsTable = ({ events }: { events: BridgeEvent[] }) => {
  const { rowNames, columnNames, data } = rotateTable(events);
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

const ComplexTable: EventsTable = ({ events, ...props }) => {
  const { rowNames, columnNames, data } = rotateTable(events);
  return (
    <TableView {...props}>
      <TableHeader>
        {/* Leave an empty column for the row names */}
        {[" ", ...columnNames].map((columnName, columnIndex) => (
          <Column
            minWidth={columnIndex > 0 ? 300 : 150}
            allowsResizing
            key={`column-${columnIndex}`}
          >
            {columnName}
          </Column>
        ))}
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => (
          <Row key={`row-${rowIndex}`}>
            {[rowNames[rowIndex], ...row].map((cellValue, cellIndex) => {
              if (cellIndex === 0) {
                return (
                  <Cell key={`row-${rowIndex}-cell-${cellIndex}`}>
                    {cellValue}
                  </Cell>
                );
              }
              let prettyCellValue = cellValue;
              try {
                prettyCellValue = JSON.stringify(
                  JSON.parse(cellValue),
                  null,
                  2
                );
              } catch (e) {}
              return (
                <Cell
                  key={`row-${rowIndex}-cell-${cellIndex}`}
                  textValue={cellValue}
                >
                  <DialogTrigger>
                    <ActionButton isQuiet>
                      <pre>
                        <code>{cellValue}</code>
                      </pre>
                    </ActionButton>
                    {close => (
                      <Dialog>
                        <Heading>{rowNames[rowIndex]}</Heading>
                        <Content>
                          <View>
                            <pre>
                              <code>{prettyCellValue}</code>
                            </pre>
                          </View>
                        </Content>
                        <ButtonGroup>
                          <Button variant="primary" onPress={close}>
                            Close
                          </Button>
                        </ButtonGroup>
                      </Dialog>
                    )}
                  </DialogTrigger>
                </Cell>
              );
            })}
          </Row>
        ))}
      </TableBody>
    </TableView>
  );
};

const Inner = () => {
  const events: BridgeEvent[] = useEvents();
  const [useSimpleTable, setUseSimpleTable] = React.useState(false);
  if (!events) {
    return <ProgressCircle aria-label="Loading…" isIndeterminate />;
  }
  if (events.length === 0) {
    return <div>No events yet</div>;
  }
  const Table: EventsTable = useSimpleTable ? SimpleTable : ComplexTable;
  return (
    <>
      <Switch
        isEmphasized
        isSelected={useSimpleTable}
        onChange={setUseSimpleTable}
      >
        Use simple table
      </Switch>
      <Table events={events} maxHeight="90vh" maxWidth="100%" />
    </>
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
