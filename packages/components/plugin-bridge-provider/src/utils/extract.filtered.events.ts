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

import * as kit from '@adobe/griffon-toolkit';
import * as R from 'ramda';
import { logEvent } from '@adobe/griffon-toolkit-common';
import sortEvents from './event.sort';
import { Events, EventFilterConfig, ValidationRecords } from '../types';

export const parseFilters = (shouldFilter, filters, ignoreFilters) => {
  if (!shouldFilter) { return {}; }
  let useFilters = filters;
  if (ignoreFilters && ignoreFilters.length) {
    R.forEach(
      (without) => { useFilters = R.dissoc(without, useFilters); },
      ignoreFilters
    );
  }
  return useFilters;
};

export const parseCustomMatchers = (matchers) => {
  let useFilters = {};
  let customCount = 0;

  R.forEach(
    (matcher) => {
      useFilters = R.assoc(
        `custom${++customCount}`,
        matcher,
        useFilters
      );
    },
    matchers || []
  );
  return useFilters;
};

export const parseHideLogs = (hideLogs) => {
  if (!hideLogs) { return {}; }
  return { hideLogs: kit.not(logEvent.matcher) };
};

export default (
  config: EventFilterConfig,
  events: Events | undefined,
  filters,
  validation?: ValidationRecords
) => {
  let results = events || [];

  const filtersData = {
    ...parseFilters(config.filtered, filters, config.ignoreFilters),
    ...parseCustomMatchers(config.matchers),
    ...parseHideLogs(config.hideLogs)
  };

  if (Object.keys(filtersData).length) {
    results = kit.filterData(filtersData, results);
  }
  if (config.sorted) {
    results = sortEvents(results);
  }
  if (config.validations) {
    results = R.map(event => R.assoc('validation', validation?.[event.uuid], event), results);
  }
  return results;
}
