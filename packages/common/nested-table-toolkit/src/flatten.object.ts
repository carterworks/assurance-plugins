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
import { FlatDataRecord } from './types';

export default (obj: any): FlatDataRecord[] => {
  const go = (obj_, parents = [], parentsString = '') => R.chain(([k, v]) => {
    const type = R.type(v);
    if (type === 'Object' || type === 'Array') {
      return R.prepend([k, { value: '', parents, parentsString, hasChildren: true }], R.map(([k_, v_]) =>
        [k_, v_], go(v, R.append(k, parents), makePath({ key: k, parentsString }))));
    }
    return [[k, { value: v, parents, parentsString }]];
  }, R.toPairs(obj_));

  const pairs = go(obj);
  return pairs.map(([key, { value, parentsString, ...others }]) => ({ id: makePath({ key, parentsString }), recordKey: key, value, parentsString, ...others }));
};
