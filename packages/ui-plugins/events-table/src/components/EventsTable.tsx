import {
  ActionButton,
  Button,
  ButtonGroup,
  Cell,
  Column,
  Content,
  Dialog,
  DialogTrigger,
  Heading,
  Row,
  SpectrumTableProps,
  TableBody,
  TableHeader,
  TableView,
  View
} from "@adobe/react-spectrum";
import React from "react";
import type { BridgeEvent } from "../shared/types";
import { attemptObjectPrettyPrint, rotateTable } from "../shared/utils";

const ValueDialog = ({
  close,
  heading,
  value
}: {
  close: () => void;
  heading: string;
  value: string;
}): JSX.Element => {
  const prettyPrintedValue = attemptObjectPrettyPrint(value);
  return (
    <Dialog>
      <Heading>{heading}</Heading>
      <Content>
        <View>
          <pre>
            <code>{prettyPrintedValue}</code>
          </pre>
        </View>
      </Content>
      <ButtonGroup>
        <Button variant="primary" onPress={close}>
          Close
        </Button>
      </ButtonGroup>
    </Dialog>
  );
};

const PropertyValue = ({ children }: { children: string }): JSX.Element => {
  return (
    <pre>
      <code>{children}</code>
    </pre>
  );
};

const CellContents = ({
  propertyName,
  propertyValue
}: {
  propertyName: string;
  propertyValue: string;
}): JSX.Element => {
  // empty value or row header
  if (propertyValue === "" || propertyName === propertyValue) {
    return <>{propertyValue}</>;
  }

  return (
    <DialogTrigger>
      <ActionButton isQuiet>
        <PropertyValue>{propertyValue}</PropertyValue>
      </ActionButton>
      {close => (
        <ValueDialog
          close={close}
          heading={propertyName}
          value={propertyValue}
        />
      )}
    </DialogTrigger>
  );
};

export const EventsTable = ({
  events,
  ...props
}: { events: BridgeEvent[] } & Pick<
  SpectrumTableProps<string>,
  "maxHeight" | "maxWidth"
>): JSX.Element => {
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
            {[rowNames[rowIndex], ...row].map((cellValue, cellIndex) => (
              <Cell
                key={`row-${rowNames[rowIndex]}-cell-${cellIndex}`}
                textValue={cellValue}
              >
                <CellContents
                  propertyName={rowNames[rowIndex]}
                  propertyValue={cellValue}
                />
              </Cell>
            ))}
          </Row>
        ))}
      </TableBody>
    </TableView>
  );
};
