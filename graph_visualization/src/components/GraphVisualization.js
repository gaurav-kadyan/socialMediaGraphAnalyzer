import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network';
import 'vis-network/styles/vis-network.css';

const GraphVisualization = ({ data }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const network = new Network(containerRef.current, data, {
        nodes: {
          shape: 'dot',
          size: 16,
        },
        edges: {
          arrows: { to: true },
        },
        physics: {
          enabled: true,
        },
      });
    }
  }, [data]);

  return <div ref={containerRef} style={{ height: '500px' }} />;
};

export default GraphVisualization;
