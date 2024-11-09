import React, { useRef, useEffect } from 'react';
import Graph from 'react-graph-vis';
import "./GraphVisualization.css";

const GraphVisualization = ({ data }) => {
  const graphRef = useRef(null);

  const options = {
  nodes: {
    shape: "dot",
    size: 20,
    color: {
      border: "#2B7CE9",
      background: "#97C2FC",
    },
    font: {
      color: "#343434",
      size: 14, // Font size of labels
    },
  },
  edges: {
    color: "#848484",
    arrows: {
      to: { enabled: true, scaleFactor: 0.5 },
    },
    smooth: {
      type: "dynamic",
    },
  },
  layout: {
    improvedLayout: true,
  },
  physics: {
    enabled: true,
    barnesHut: {
      gravitationalConstant: -8000,
      centralGravity: 0.3,
      springLength: 95,
      springConstant: 0.04,
      damping: 0.09,
    },
  },
  interaction: {
    tooltipDelay: 200,
    hideEdgesOnDrag: true,
    hideEdgesOnZoom: true,
    dragNodes: true,
  },
};


const events = {
  select: ({ nodes, edges }) => {
    console.log("Selected nodes:", nodes);
    console.log("Selected edges:", edges);
  },
};
  return (
    <div className="graph-container">
    <Graph
      graph={data}
      options={options}
      events={events}
      style={{ width: "100%", height: "100%" }}
      // getNetwork={(network) => {
      //   graphRef.current = { network };
      // }}
    />
    </div>
  );
};

export default GraphVisualization;
