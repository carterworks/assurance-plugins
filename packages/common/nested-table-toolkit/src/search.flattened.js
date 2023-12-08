/*
 * ************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *   Copyright 2023 Adobe Systems Incorporated
 *   All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and are protected by all applicable intellectual property
 * laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 * ************************************************************************
 */

import * as R from 'ramda';
import makePath from './make.path';
import startsWithString from './starts.with.string';
import { PATH_DELIMITER } from './const';

export default R.curry(({
  keys = ['value', 'key'],
  search
}, flat) => {
  if (!search) { return flat; }
  const matchedPaths = [];

  R.forEach(data =>
    R.forEach(
      (key) => {
        const value = data[key] === undefined ? '' : data[key];
        if (value.toString().toLowerCase().includes(search.toLowerCase())) {
          matchedPaths.push(makePath(data));
        }
      },
      keys
    ),
  flat);

  return R.reject(
    (data) => {
      const check = makePath(data);
      for (let i = 0; i < matchedPaths.length; ++i) {
        if (startsWithString(matchedPaths[i], check)) {
          return false;
        }
        const split = matchedPaths[i].split(PATH_DELIMITER);
        for (let j = 0; j < split.length - 1; ++j) {
          if (split.slice(0, j + 1).join(PATH_DELIMITER) === check) {
            return false;
          }
        }
      }
      return true;
    },
    flat
  );
});
