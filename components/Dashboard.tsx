import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Activity, Clock, Cpu, Layers } from 'lucide-react';

const data = [
  { name: '10s', fps: 58, latency: 15 },
  { name: '20s', fps: 60, latency: 16 },
  { name: '30s', fps: 55, latency: 18 },
  { name: '40s', fps: 59, latency: 15 },
  { name: '50s', fps: 60, latency: 14 },
  { name: '60s', fps: 57, latency: 17 },
];

const StatCard: React.FC<{ label: string; value: string; sub: string; icon: React.ElementType; color: string }> = ({ label, value, sub, icon: Icon, color }) => (
  <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-slate-500 text-sm font-medium">{label}</p>
        <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg bg-opacity-10 ${color.replace('text-', 'bg-')}`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
    </div>
    <p className="text-xs text-slate-500">{sub}</p>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-950">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-slate-400 mt-1">Overview of PyVisionLab performance and recent activity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Avg FPS" value="58.4" sub="Target: 60 FPS" icon={Activity} color="text-green-500" />
          <StatCard label="Pipeline Nodes" value="12" sub="3 Active Pipelines" icon={Layers} color="text-blue-500" />
          <StatCard label="Avg Latency" value="16.2ms" sub="Processing time per frame" icon={Clock} color="text-orange-500" />
          <StatCard label="CPU Usage" value="24%" sub="Python Process (Main)" icon={Cpu} color="text-purple-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-lg font-semibold text-white mb-6">Real-time Performance</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                    itemStyle={{ color: '#f1f5f9' }}
                  />
                  <Line type="monotone" dataKey="fps" stroke="#22c55e" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="latency" stroke="#f97316" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-4">
                {[
                    { text: 'Completed Challenge: Stabilization', time: '2 mins ago', color: 'bg-green-500' },
                    { text: 'New Custom Node Created', time: '15 mins ago', color: 'bg-purple-500' },
                    { text: 'Pipeline "Motion Track" saved', time: '1 hour ago', color: 'bg-blue-500' },
                    { text: 'Performance dip detected', time: '2 hours ago', color: 'bg-orange-500' },
                ].map((item, i) => (
                    <div key={i} className="flex gap-3">
                        <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 opacity-80 ${item.color}`} />
                        <div>
                            <p className="text-sm text-slate-300">{item.text}</p>
                            <p className="text-xs text-slate-500">{item.time}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-auto pt-6">
                <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
                    <p className="text-xs text-slate-400 mb-2 font-bold">TIP OF THE DAY</p>
                    <p className="text-sm text-slate-300">Use "frame-by-frame" mode in the debugger to analyze rapid movements in your Optical Flow pipelines.</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;