'use client';

import React, { useState } from 'react';
import { useApi } from '@/context/ApiContext';
import { 
  LayoutDashboard, 
  TrendingUp, 
  TreePine, 
  Crosshair, 
  Sliders, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Layers,
  Database,
  Scale
} from 'lucide-react';

export function Sidebar() {
  const { currentTab, setCurrentTab, mockMode, activeProviderStatus } = useApi();
  const [collapsed, setCollapsed] = useState(false);

  const navigationItems = [
    {
      id: 'overview',
      name: 'Dashboard Overview',
      icon: LayoutDashboard,
      badge: 'Live',
    },
    {
      id: 'trends',
      name: 'Trend Finder',
      icon: TrendingUp,
      badge: 'Viral',
      badgeColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/40',
    },
    {
      id: 'evergreen',
      name: 'Evergreen Finder',
      icon: TreePine,
      badge: 'Stable',
      badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40',
    },
    {
      id: 'spy',
      name: 'Competitor Spy',
      icon: Crosshair,
      badge: 'Deep ASIN',
      badgeColor: 'text-purple-400 bg-purple-950/60 border-purple-800/40',
    },
    {
      id: 'trademark',
      name: 'Trademark Checker',
      icon: Scale,
      badge: 'Class 025',
      badgeColor: 'text-amber-300 bg-amber-950/60 border-amber-800/50',
    },
    {
      id: 'settings',
      name: 'API Settings',
      icon: Sliders,
      badge: activeProviderStatus === 'healthy' ? 'OK' : 'Check',
      badgeColor: activeProviderStatus === 'healthy' ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40' : 'text-amber-400 bg-amber-950/60 border-amber-800/40',
    },
  ];

  return (
    <aside
      className={`relative flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 select-none z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-950/50 flex-shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-white text-base tracking-tight truncate flex items-center gap-1.5">
                POD Analytics <span className="text-cyan-400 text-xs px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/50 font-mono">PRO</span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium truncate">
                Amazon Merch Intelligence
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        {!collapsed && (
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Research Modules
          </div>
        )}
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-950/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 transition-colors ${
                  isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />
              {!collapsed && (
                <div className="flex-1 flex items-center justify-between truncate">
                  <span className="truncate">{item.name}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                        item.badgeColor || 'text-slate-400 bg-slate-800 border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}

              {/* Tooltip when collapsed */}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-800 text-white text-xs rounded shadow-lg border border-slate-700 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                  {item.name}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* System Status Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/60">
        {!collapsed ? (
          <div className="bg-slate-950/80 rounded-lg p-3 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                Data Mode
              </span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border ${
                  mockMode
                    ? 'bg-amber-950/60 text-amber-300 border-amber-800/50'
                    : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50'
                }`}
              >
                {mockMode ? 'Mock Fast' : 'Live RapidAPI'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Failover Protection
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                Active
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-2" title={mockMode ? 'Mock Mode Active' : 'Live RapidAPI Active'}>
            <div className={`w-3 h-3 rounded-full ${mockMode ? 'bg-amber-400' : 'bg-emerald-400'} ring-4 ring-slate-800`} />
          </div>
        )}
      </div>
    </aside>
  );
}
