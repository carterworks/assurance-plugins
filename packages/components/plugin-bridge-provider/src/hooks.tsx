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

import { useContext, useMemo, Context } from "react";
import * as kit from "@adobe/griffon-toolkit";
import {
  EventContext,
  NavigationContext,
  SelectedEventContext,
  SettingsContext,
  ValidationContext
} from "./Contexts";
import type {
  BridgeEvents,
  BridgeSelectedEvents,
  BridgeSettings,
  BridgeValidation,
  EventFilterConfig
} from "./types";
import extractFilteredEvents from "./utils/extract.filtered.events";
import extractClientEvents from "./utils/extract.client.events";
import extractSelectedClients from "./utils/extract.selected.clients";

function checkContext<T = unknown>(context: T | null, check = true) {
  if (context && Object.keys(context).length === 0 && check) {
    throw new Error(
      "Plugin bridge hooks must be used within a PluginBridgeProvider"
    );
  }
  return context;
}

export const useEnvironment = (check = true) => {
  const context = checkContext<BridgeSettings>(
    useContext(SettingsContext),
    check
  );
  return context?.env;
};

export const useFlags = (check = true) => {
  const context = checkContext<BridgeSettings>(
    useContext(SettingsContext),
    check
  );

  return useMemo(() => {
    return {
      showColumnSettings: context?.showColumnSettings,
      showReleaseNotes: context?.showReleaseNotes,
      showTimeline: context?.showTimeline
    };
  }, [
    context?.showColumnSettings,
    context?.showReleaseNotes,
    context?.showTimeline
  ]);
};

export const useImsAccessToken = (check = true) => {
  const context = checkContext(useContext(SettingsContext), check);
  return context?.imsAccessToken;
};

export const useImsOrg = (check = true) => {
  const context = checkContext(useContext(SettingsContext), check);
  return context?.imsOrg;
};

export const useTenant = (check = true) => {
  const context = checkContext(useContext(SettingsContext), check);
  return context?.tenant;
};

export const useNavigationPath = (check = true) => {
  const context = checkContext(useContext(NavigationContext), check);
  return context?.path;
};

export const useNavigationFilters = (check = true) => {
  const context = checkContext(useContext(NavigationContext), check);
  return context?.filters;
};

export const useFilteredEvents = (
  config: EventFilterConfig = {
    sorted: true,
    filtered: false,
    hideLogs: false,
    ignoreFilters: [],
    matchers: [],
    validations: false
  },
  check = true
) => {
  const context = checkContext(useContext(EventContext), check);
  const validation = useContext(ValidationContext);
  const navigation = useContext(NavigationContext);

  return useMemo(() => {
    return extractFilteredEvents(
      config,
      context?.events,
      navigation?.filters,
      validation?.validation
    );
  }, [context?.events, navigation?.filters, validation?.validation]);
};

export const useEvents = (check = true) => {
  const context = checkContext(useContext(EventContext), check);
  return context?.events;
};

export const useSelectedEvents = (check = true) => {
  const context = checkContext(useContext(SelectedEventContext), check);
  return context?.selected;
};

export const useValidation = (check = true) => {
  const context = checkContext(useContext(ValidationContext), check);
  return context?.validation;
};

export const useClients = (check = true) => {
  const events = useFilteredEvents({
    sorted: true,
    filtered: true,
    ignoreFilters: ["clients"]
  });

  return useMemo(() => {
    return extractClientEvents(events);
  }, [events]);
};

export const useSelectedClients = (check = true) => {
  const clients = useClients(check);
  const filters = useNavigationFilters(check);

  return extractSelectedClients(clients, filters);
};
