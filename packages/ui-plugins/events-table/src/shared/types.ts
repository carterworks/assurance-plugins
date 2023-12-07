export type BridgePayload = Record<string, unknown>;

export interface BridgeEvent {
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
