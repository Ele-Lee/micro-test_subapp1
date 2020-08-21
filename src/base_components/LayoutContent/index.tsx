import React, { useMemo } from 'react';
// import { MicroApp } from 'umi';
// import { LoadingOutlined } from '@ant-design/icons';
import styled from 'styled-components';

import { Spin } from 'antd';
import MicroApp from '../MicroApp/index';

interface LayoutContentProps {
  appName: string;
}
const LayoutContent: React.FC<LayoutContentProps> = ({ appName }) => {
  const microDom = useMemo(
    () => (
      <MicroApp
        name={appName}
        loadingRenderCb={(d, l) => <ResetSpin spinning={l}>{d}</ResetSpin>}
      />
    ),
    [appName],
  );

  return <div style={{ position: 'relative' }}>{microDom}</div>;
};

const ResetSpin = styled(Spin)`
  .ant-spin-dot {
    margin-top: 10px !important;
  }
`;

export default LayoutContent;
