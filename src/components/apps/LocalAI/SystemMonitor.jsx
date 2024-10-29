import { useEffect, useState } from 'react';
import { Cpu, Memory, HardDrive, Activity } from 'lucide-react';

export function SystemMonitor() {
  const [metrics, setMetrics] = useState({
    cpu: 0,
    memory: 0,
    requests: 0,
    latency: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate metrics updates
      setMetrics({
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        requests: Math.floor(Math.random() * 100),
        latency: Math.random() * 1000
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const MetricCard = ({ icon: Icon, title, value, unit, color }) => (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-5 h-5 ${color}`} />
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="text-2xl font-bold">
        {typeof value === 'number' ? value.toFixed(1) : value}
        <span className="text-sm text-gray-400 ml-1">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          icon={Cpu}
          title="CPU Usage"
          value={metrics.cpu}
          unit="%"
          color="text-blue-400"
        />
        <MetricCard
          icon={Memory}
          title="Memory Usage"
          value={metrics.memory}
          unit="%"
          color="text-green-400"
        />
        <MetricCard
          icon={Activity}
          title="Requests/min"
          value={metrics.requests}
          unit="req/min"
          color="text-yellow-400"
        />
        <MetricCard
          icon={HardDrive}
          title="Avg. Latency"
          value={metrics.latency}
          unit="ms"
          color="text-purple-400"
        />
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="font-medium mb-4">System Logs</h3>
        <div className="bg-gray-900 rounded-lg p-4 h-[200px] overflow-auto font-mono text-sm">
          <div className="text-green-400">[INFO] System initialized successfully</div>
          <div className="text-blue-400">[DEBUG] Loading model into memory...</div>
          <div className="text-yellow-400">[WARN] High memory usage detected</div>
          <div className="text-red-400">[ERROR] Failed to load custom model</div>
        </div>
      </div>
    </div>
  );
}