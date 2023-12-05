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

import React, { useEffect } from "react";
import {
  ConnectionContext,
  EventContext,
  NavigationContext,
  SelectedEventContext,
  SettingsContext,
  ValidationContext
} from "./Contexts";
import type {
  BridgeConnections,
  BridgeEvents,
  BridgeNavigation,
  BridgeSelectedEvents,
  BridgeSettings,
  BridgeValidation
} from "./types";
import extractNavigation from "./utils/extract.navigation";

export type PluginBridgeProviderProps = {
  children?: React.ReactNode;
};

const PluginBridgeProvider = ({ children }: PluginBridgeProviderProps) => {
  const [bridgeConnections, setBridgeConnections] =
    React.useState<BridgeConnections | null>(null);
  const [bridgeNavigation, setBridgeNavigation] =
    React.useState<BridgeNavigation | null>(null);
  const [bridgeEvents, setBridgeEvents] =
    React.useState<BridgeEvents | null>(null);
  const [bridgeSelectedEvents, setBridgeSelectedEvents] =
    React.useState<BridgeSelectedEvents | null>(null);
  const [bridgeSettings, setBridgeSettings] =
    React.useState<BridgeSettings | null>(null);
  const [bridgeValidation, setBridgeValidation] =
    React.useState<BridgeValidation | null>(null);

  useEffect(() => {
    window.pluginBridge.register({
      init(options) {
        setBridgeSettings(options);
      },
      navigateTo(navigation) {
        setBridgeNavigation(extractNavigation(navigation));
      },
      receiveConnections(connections) {
        setBridgeConnections(connections);
      },
      receiveEvents(events) {
        setBridgeEvents({ events });
      },
      receivePlugins(plugins) {},
      receiveSelectedEvents(selected) {
        setBridgeSelectedEvents({ selected });
      },
      receiveSession(session) {},
      receiveSettings(settings) {
        setBridgeSettings(settings);
      },
      receiveValidation(validation) {
        setBridgeValidation({ validation });
      }
    });
  }, [window.pluginBridge]);

  if (!bridgeSettings) {
    return null;
  }

  const contexts = [
    { context: SettingsContext, value: bridgeSettings },
    { context: NavigationContext, value: bridgeNavigation },
    { context: ConnectionContext, value: bridgeConnections },
    { context: EventContext, value: bridgeEvents },
    { context: SelectedEventContext, value: bridgeSelectedEvents },
    { context: ValidationContext, value: bridgeValidation }
  ];

  let Result: React.ReactElement | null = null;
  contexts.forEach(({ context, value }) => {
    const Renderer = context.Provider;
    if (Result == null) {
      Result = (
        <Renderer value={value as any}>{children}</Renderer>
      ) as React.ReactElement;
    } else {
      Result = (
        <Renderer value={value as any}>{Result}</Renderer>
      ) as React.ReactElement;
    }
  });

  return Result;
};

export default PluginBridgeProvider;
