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

import React from 'react';
import { 
  useEnvironment,
  useFlags,
  useImsAccessToken,
  useImsOrg,
  useNavigationPath,
  useFilteredEvents,
  useTenant,
  useValidation,
} from '@assurance/plugin-bridge-provider';

const ProviderTable = () => {
  const env = useEnvironment();
  const flags = useFlags();
  const imsAccsessToken = useImsAccessToken();
  const imsOrg = useImsOrg();
  const tenant = useTenant();
  const navigation = useNavigationPath();
  const events = useFilteredEvents();
  const validation = useValidation();

  return (
    <dl style={{width: '100%', overflow: 'hidden' }}>
      <dt>Environment</dt>
      <dd>{env}</dd>
      <dt>Flags</dt>
      <dd>{JSON.stringify(flags)}</dd>
      <dt>IMS Access Token</dt>
      <dd style={{ textOverflow: 'ellipsis' }}>{imsAccsessToken}</dd>
      <dt>IMS Org</dt>
      <dd>{imsOrg}</dd>
      <dt>Tenant</dt>
      <dd>{tenant}</dd>
      <dt>Navigation</dt>
      <dd>{navigation}</dd>
      <dt>Events</dt>
      <dd>{events?.length || 0}</dd>
      <dt>Validation</dt>
      <dd>{Object.keys(validation || {}).length}</dd>
    </dl>
  )
};

export default ProviderTable;
