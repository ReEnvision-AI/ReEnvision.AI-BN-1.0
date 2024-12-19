import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, Activity, Thermometer, AlertCircle } from 'lucide-react';
//import { useChattyStore } from '../../../store/useChattyStore';

export function ResourceMonitor() {
  //const { systemStats } = useChattyStore();
  const [metrics, setMetrics] = useState({
    cpu: 0,
    memory: 0,
    temperature: 0,
    requests: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate resource metrics
      setMetrics({
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        temperature: 40 + Math.random() * 20,
        requests: Math.floor(Math.random() * 100),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-64 border-l border-gray-800 p-4">
      <h3 className="text-sm font-medium text-gray-400 mb-4">System Monitor</h3>

      <div className="space-y-4">
        {/* CPU Usage */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Cpu className="w-4 h-4" />
              <span>CPU Usage</span>
            </div>
            <span className="text-sm text-gray-400">{metrics.cpu.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${metrics.cpu}%` }} />
          </div>
        </div>

        {/* Memory Usage */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <HardDrive className="w-4 h-4" />
              <span>Memory</span>
            </div>
            <span className="text-sm text-gray-400">{metrics.memory.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${metrics.memory}%` }} />
          </div>
        </div>

        {/* Temperature */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Thermometer className="w-4 h-4" />
              <span>Temperature</span>
            </div>
            <span className="text-sm text-gray-400">{metrics.temperature.toFixed(1)}°C</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`
                h-full transition-all duration-300
                ${metrics.temperature > 80 ? 'bg-red-500' : metrics.temperature > 60 ? 'bg-yellow-500' : 'bg-blue-500'}
              `}
              style={{ width: `${(metrics.temperature / 100) * 100}%` }}
            />
          </div>
        </div>

        {/* Request Rate */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Activity className="w-4 h-4" />
              <span>Requests/min</span>
            </div>
            <span className="text-sm text-gray-400">{metrics.requests}</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${(metrics.requests / 100) * 100}%` }}
            />
          </div>
        </div>

        {metrics.temperature > 80 && (
          <div className="p-3 bg-red-500/10 text-red-400 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p className="text-xs">High temperature warning</p>
          </div>
        )}
      </div>
    </div>
  );
}
