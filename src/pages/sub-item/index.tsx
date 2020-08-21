import React from 'react';

interface IndexProps {}
const Index: React.FC<IndexProps> = props => {
  console.log('%celelee test:', 'background:#000;color:#fff', props.routes);
  return <div>111</div>;
};
export default Index;
