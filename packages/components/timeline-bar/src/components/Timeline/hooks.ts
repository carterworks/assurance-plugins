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

import { useLayoutEffect, useState, useRef } from 'react';

export function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

export function useScrollPosition(effect, element, wait = 100) {
  useRef(element);
  let throttleTimeout: any | null = null;

  const callBack = () => {
    effect({ currPos: element.current.scrollLeft });
    throttleTimeout = null;
  };

  useLayoutEffect(() => {
    const handleScroll = () => {
      throttleTimeout = throttleTimeout || setTimeout(callBack, wait);
    };

    element.current.addEventListener('scroll', handleScroll);
    return () => element.current.removeEventListener('scroll', handleScroll);
  }, []);
}

export function useScrollToCentered(position, element, outer) {
  useRef(element);
  useRef(outer);
  useLayoutEffect(() => {
    // if position isn't visible, scroll to it
    const outerWidth = outer.current.clientWidth;
    const currentScroll = element.current.scrollLeft;
    if (position < element.current.scrollLeft || position > currentScroll + outerWidth) {
      // eslint-disable-next-line no-param-reassign
      element.current.scrollLeft = position - outerWidth / 2;
    }
  }, [position]);
}
