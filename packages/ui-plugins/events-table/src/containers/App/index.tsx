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
  PluginBridgeProvider, 
  useEnvironment,
  useFlags,
  useImsAccessToken,
  useImsOrg,
  useNavigation,
  useEvents,
  useTenant,
  useValidation,
} from '@assurance/plugin-bridge-provider';


const Inner = () => {
  const env = useEnvironment();
  const flags = useFlags();
  const imsAccsessToken = useImsAccessToken();
  const imsOrg = useImsOrg();
  const tenant = useTenant();
  const navigation = useNavigation();
  const events = useEvents();
  const validation = useValidation();

  return (
    <dl>
      <dt>Environment</dt>
      <dd>{env}</dd>
      <dt>Flags</dt>
      <dd>{JSON.stringify(flags)}</dd>
      <dt>IMS Access Token</dt>
      <dd>{imsAccsessToken}</dd>
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

const App = () => {
  return (
    <PluginBridgeProvider>
      <Inner />
    </PluginBridgeProvider>
  );
};

export default App;


