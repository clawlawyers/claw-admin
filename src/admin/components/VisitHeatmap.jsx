import React, { useEffect, useRef, useState } from "react";
import heatmap from "heatmap.js";

const VisitHeatmap = () => {
  const heatmapRef = useRef(null);
  const heatmapInstance = useRef(null);
  const [visitData, setVisitData] = useState([]);

  // Dummy data simulating page navigation patterns
  const dummyApiData = [
    // Home to Legal GPT flows
    ...Array.from({ length: 25 }, () => ({
      userId: Math.random().toString(36).substr(2, 9),
      isAuthenticated: Math.random() > 0.5,
      sessionId: Date.now(),
      currentPath: "/gpt/legalGPT",
      previousPath: "/home",
      timestamp: Date.now(),
      referrer: "https://google.com",
      userAgent: "Mozilla/5.0 ...",
      timeSpentOnPreviousPage: Math.random() * 60000,
    })),

    // Home to Pricing flows
    ...Array.from({ length: 15 }, () => ({
      userId: Math.random().toString(36).substr(2, 9),
      isAuthenticated: Math.random() > 0.5,
      sessionId: Date.now(),
      currentPath: "/pricing",
      previousPath: "/home",
      timestamp: Date.now(),
      referrer: "https://google.com",
      userAgent: "Mozilla/5.0 ...",
      timeSpentOnPreviousPage: Math.random() * 45000,
    })),

    // Pricing to Legal GPT flows
    ...Array.from({ length: 10 }, () => ({
      userId: Math.random().toString(36).substr(2, 9),
      isAuthenticated: true,
      sessionId: Date.now(),
      currentPath: "/gpt/legalGPT",
      previousPath: "/pricing",
      timestamp: Date.now(),
      referrer: "https://google.com",
      userAgent: "Mozilla/5.0 ...",
      timeSpentOnPreviousPage: Math.random() * 30000,
    })),
  ];

  // Define page positions for visualization
  const pagePositions = {
    "/home": { x: 100, y: 300 },
    "/pricing": { x: 300, y: 150 },
    "/gpt/legalGPT": { x: 500, y: 300 },
    "/features": { x: 300, y: 450 },
    "/login": { x: 500, y: 150 },
  };

  useEffect(() => {
    if (!heatmapInstance.current) {
      heatmapInstance.current = heatmap.create({
        container: heatmapRef.current,
        radius: 50,
        maxOpacity: 0.6,
        minOpacity: 0.1,
        blur: 0.75,
        gradient: {
          ".5": "blue",
          ".8": "red",
          ".95": "white",
        },
      });
    }

    const processNavigationData = () => {
      // Group data by navigation paths
      const pathCounts = dummyApiData.reduce((acc, visit) => {
        const pathKey = `${visit.previousPath}->${visit.currentPath}`;
        acc[pathKey] = (acc[pathKey] || 0) + 1;
        return acc;
      }, {});

      // Create heatmap points along the paths
      const points = [];
      Object.entries(pathCounts).forEach(([pathKey, count]) => {
        const [fromPath, toPath] = pathKey.split("->");
        if (pagePositions[fromPath] && pagePositions[toPath]) {
          // Create points along the path
          const steps = 10;
          for (let i = 0; i < steps; i++) {
            const t = i / steps;
            const x =
              pagePositions[fromPath].x * (1 - t) + pagePositions[toPath].x * t;
            const y =
              pagePositions[fromPath].y * (1 - t) + pagePositions[toPath].y * t;
            points.push({
              x,
              y,
              value: count,
            });
          }
        }
      });

      setVisitData(dummyApiData);
      heatmapInstance.current.setData({
        max: Math.max(...Object.values(pathCounts)),
        data: points,
      });
    };

    processNavigationData();

    return () => {
      if (heatmapInstance.current) {
        heatmapInstance.current.repaint();
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center p-4">
        <h2 className="text-xl font-semibold">Navigation Flow Heatmap</h2>
        <div className="flex space-x-2">
          <span className="px-3 py-1 bg-blue-500 text-white rounded-md">
            Low Traffic
          </span>
          <span className="px-3 py-1 bg-red-500 text-white rounded-md">
            Medium Traffic
          </span>
          <span className="px-3 py-1 bg-white text-black border rounded-md">
            High Traffic
          </span>
        </div>
      </div>

      <div className="relative">
        <div
          ref={heatmapRef}
          className="w-full h-[600px] bg-black/20 rounded-lg relative"
        >
          {/* Page indicators with updated styling */}
          {Object.entries(pagePositions).map(([path, pos]) => (
            <div
              key={path}
              className="absolute bg-white px-3 py-1 rounded-full text-sm transform -translate-x-1/2 -translate-y-1/2 font-semibold text-black shadow-lg border border-gray-200"
              style={{ left: pos.x, top: pos.y }}
            >
              {path}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Navigation Statistics</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-black/10 p-4 rounded-lg">
            <p className="text-sm">Total Navigations</p>
            <p className="text-2xl font-bold">{visitData.length}</p>
          </div>
          <div className="bg-black/10 p-4 rounded-lg">
            <p className="text-sm">Most Common Path</p>
            <p className="text-2xl font-bold">/home → /gpt/legalGPT</p>
          </div>
          <div className="bg-black/10 p-4 rounded-lg">
            <p className="text-sm">Avg Navigation Time</p>
            <p className="text-2xl font-bold">
              {Math.round(
                visitData.reduce(
                  (acc, v) => acc + v.timeSpentOnPreviousPage,
                  0
                ) /
                  visitData.length /
                  1000
              )}
              s
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitHeatmap;
