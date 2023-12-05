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

import type { Event, GenericObject } from '@assurance/common-utils';

type PluginBridge = {
  register: (plugin: PluginBridgeConfig) => void;
  annotateEvent: (event: any) => Promise<void>;
  annotateSession: (session: any) => Promise<void>;
  deletePlugin: (uuid: string) => Promise<void>;
  flushConnection: (namespace: string, context: any) => Promise<void>;
  navigateTo: (path: string) => Promise<void>;
  selectEvents: (events: any) => Promise<void>;
  sendCommand: (command: any) => Promise<void>;
  uploadPlugin: (contents: any) => Promise<void>;
}

declare global {
  interface Window { pluginBridge: PluginBridge; }
}

export type PluginBridgeConfig = {
  init: (options: BridgeSettings) => void;
  navigateTo: (navigation: string) => void;
  receiveConnections: (connections: any) => void;
  receiveEvents: (events: any[]) => void;
  receivePlugins: (plugins: any) => void;
  receiveSelectedEvents: (events: any) => void;
  receiveSession: (session: any) => void;
  receiveSettings: (settings: any) => void;
  receiveValidation: (validation: any) => void;
};

export type Events = Event[];

export type Filters = {
  clients?: string[];
}

export type BridgeConnections = {
  connections: GenericObject[];
}

export type BridgeEvent = {
  uuid: string;
  eventNumber: number;
  clientId: string;
  timestamp: number;
  vendor: string;
  type: string;
  payload: GenericObject;
  annotations: unknown[];
  _internal_adb_props: Record<string, string>;
};

export type BridgeEvents = {
  events?: Events;
};

export type BridgeNavigation = {
  path: string;
  filters: Filters;
}

export type BridgeSelectedEvents = {
  selected?: BridgeEvent[];
}

export type BridgeSettings = {
  env: string;
  imsAccessToken: string;
  imsOrg: string;
  showColumnSettings: boolean;
  showReleaseNotes: boolean;
  showTimeline: boolean;
  tenant: string;
}

export type BridgeValidation = {
  validation: ValidationRecords;
};

export type ValidationResult = {
  events: string[],
  message: string,
  result: string;
};

export type ValidationRecord = {
  category: string,
  container: string,
  description: string,
  displayName: string,
  icon: string,
  level: string,
  namespace: string,
  orgId: string,
  results: ValidationResult,
  type: string,
};

export type ValidationRecords = Record<string, ValidationRecord>;


export type EventFilterConfig = {
  sorted?: boolean;
  filtered?: boolean;
  hideLogs?: boolean;
  ignoreFilters?: string[];
  matchers?: string[];
  validations?: boolean;
};
