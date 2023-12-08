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

const hasDigitRegex = /.*\d/;
const numericStringRegex = /(\D*)(\d+)\D*/;

const defaultSorter = (direction, a, b) => (a < b ? -1 : a > b ? 1 : 0) * direction;

export default R.curry((sortBy, direction, a, b) => {
  const aSort = a[sortBy];
  const bSort = b[sortBy];

  const aParents = a.parentsString;
  const bParents = b.parentsString;

  if (aParents === bParents) {
    return keySorter(direction, aSort, bSort);
  }

  const aPath = makePath({ key: aSort, parentsString: aParents });
  const bPath = makePath({ key: bSort, parentsString: bParents });
  if (R.indexOf(bPath, aPath) === 0) {
    return 1;
  }

  if (R.indexOf(aPath, bPath) === 0) {
    return -1;
  }

  let aCommon;
  let bCommon;
  let depth = 0;

  do {
    aCommon = a.parents[depth] || aSort;
    bCommon = b.parents[depth] || bSort;
    depth++;
  } while (aCommon === bCommon);

  return keySorter(direction, aCommon, bCommon);
});

const numericStringSorter = (direction, a, b) => {
  const aMatches = a.match(numericStringRegex);
  const bMatches = b.match(numericStringRegex);
  return (!aMatches || !bMatches || aMatches[1] !== bMatches[1]) ? defaultSorter(direction, a, b)
    : (+aMatches[2] - +bMatches[2]) * direction;
};

const keySorter = R.curry((direction, a, b) => (hasDigitRegex.test(a) && hasDigitRegex.test(b)
  ? numericStringSorter(direction, a, b)
  : defaultSorter(direction, a, b)
));
