
import React, { useState, useMemo, useEffect } from 'react';
import { User, UserRole, ActionDefinition, AuditLogEntry, ActionDangerLevel } from './types';
import { SYSTEM_ACTIONS, ATLAS_COLORS } from './constants';
import { HexIcon } from './components/HexIcon';
import { DynamicForm } from './components/DynamicForm';
import { AuditTrail } from './components/AuditTrail';
import { assessActionRisk } from './geminiService';

const App: React.FC = () => {
  // Simulation of current session user
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'user_9921',
    name: 'Cmdr. J. Sterling',
    role: UserRole.ADMINISTRATOR,
    permissions: ['*']
  });

  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [activeAction, setActiveAction] = useState<ActionDefinition | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [systemStatus, setSystemStatus] = useState<'IDLE' | 'BUSY' | 'ALERT'>('IDLE');

  // Server-Driven Filtering: Front-end only renders what it is authorized for
  const availableActions = useMemo(() => {
    const roleHierarchy = {
      [UserRole.OPERATOR]: 0,
      [UserRole.MANAGER]: 1,
      [UserRole.ADMINISTRATOR]: 2,
      [UserRole.SYSTEM_CORE]: 3,
    };

    return SYSTEM_ACTIONS.filter(action => {
      const userLevel = roleHierarchy[currentUser.role];
      const requiredLevel = roleHierarchy[action.requiredRole];
      return userLevel >= requiredLevel;
    });
  }, [currentUser.role]);

  const handleExecute = async (params: Record<string, any>) => {
    if (!activeAction) return;
    
    setIsExecuting(true);
    setSystemStatus('BUSY');

    // Simulate AI Risk Assessment (Gemini Layer)
    const riskAssessment = await assessActionRisk(activeAction.type, params);

    // Simulate Network Latency
    await new Promise(resolve => setTimeout(resolve, 1800));

    const newLog: AuditLogEntry = {
      id: `log_${Date.now()}`,
      timestamp: new Date(),
      userId: currentUser.name,
      userRole: currentUser.role,
      actionType: activeAction.type,
      status: 'EXECUTED',
      metadata: params,
      riskAssessment
    };

    setLogs(prev => [newLog, ...prev]);
    setIsExecuting(false);
    setActiveAction(null);
    setSystemStatus('IDLE');
  };

  const getDangerBorder = (level: ActionDangerLevel) => {
    switch (level) {
      case ActionDangerLevel.CRITICAL: return 'hover:border-red-600/50 group-hover:text-red-500';
      case ActionDangerLevel.HIGH: return 'hover:border-orange-600/50 group-hover:text-orange-500';
      case ActionDangerLevel.MEDIUM: return 'hover:border-yellow-600/50 group-hover:text-yellow-500';
      default: return 'hover:border-blue-600/50 group-hover:text-blue-500';
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 max-w-[1600px] mx-auto gap-6">
      {/* Header Control Bar */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#111827] border border-[#1E293B] p-4 rounded-xl shadow-lg">
        <div className="flex items-center gap-3">
          <HexIcon size={40} color={ATLAS_COLORS.primary} />
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase text-white leading-none">
              ATLAS <span className="text-blue-500">CONTROL</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mt-1">
              Genesis Protocol v4.0.21
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-500 uppercase">System Integrity</span>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${systemStatus === 'IDLE' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-orange-500 animate-pulse'}`}></span>
              <span className="text-xs font-mono font-bold">{systemStatus}</span>
            </div>
          </div>
          
          <div className="h-10 w-[1px] bg-[#1E293B]"></div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white leading-tight">{currentUser.name}</p>
              <p className="text-[10px] text-blue-400 font-mono uppercase tracking-tighter">{currentUser.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-400">
              <i className="fa-solid fa-user-tie"></i>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Action Panel */}
        <section className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-1">Available Directives</h2>
              <p className="text-xs text-slate-500">Only validated executable actions are currently visible.</p>
            </div>
            <div className="flex gap-2">
              {Object.values(UserRole).map(role => (
                <button
                  key={role}
                  onClick={() => setCurrentUser({ ...currentUser, role })}
                  className={`text-[9px] px-2 py-1 rounded border uppercase font-bold transition-all ${
                    currentUser.role === role 
                      ? 'bg-blue-600 border-blue-500 text-white' 
                      : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {availableActions.map((action) => (
              <button
                key={action.id}
                onClick={() => setActiveAction(action)}
                className={`group relative bg-[#111827] border border-[#1E293B] p-5 rounded-xl text-left transition-all duration-300 transform active:scale-95 flex flex-col justify-between h-44 ${getDangerBorder(action.dangerLevel)}`}
              >
                <div>
                  <div className={`mb-3 flex items-center justify-between`}>
                    <i className={`fa-solid ${action.icon} text-lg text-slate-400 group-hover:text-blue-400 transition-colors`}></i>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${
                      action.dangerLevel === ActionDangerLevel.CRITICAL ? 'border-red-900 text-red-500' :
                      action.dangerLevel === ActionDangerLevel.HIGH ? 'border-orange-900 text-orange-500' :
                      'border-slate-800 text-slate-500'
                    }`}>
                      {action.dangerLevel}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1 uppercase tracking-tight group-hover:text-blue-400 transition-colors">
                    {action.label}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                    {action.description}
                  </p>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-slate-600 bg-black/30 px-2 py-0.5 rounded">{action.type}</span>
                  <span className="text-[10px] font-bold uppercase text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    Execute <i className="fa-solid fa-chevron-right ml-1"></i>
                  </span>
                </div>
              </button>
            ))}
          </div>

          {availableActions.length === 0 && (
            <div className="bg-red-950/20 border border-red-900/50 p-12 rounded-xl text-center">
              <i className="fa-solid fa-lock text-4xl text-red-900 mb-4"></i>
              <h3 className="text-red-500 font-bold uppercase tracking-widest">Access Restricted</h3>
              <p className="text-xs text-red-900/80 mt-2">Your current clearance level allows for no automated directives.</p>
            </div>
          )}
        </section>

        {/* Audit / Intelligence Sidebar */}
        <aside className="lg:col-span-4 flex flex-col">
          <AuditTrail logs={logs} />
        </aside>
      </main>

      {/* Dynamic Form Overlay */}
      {activeAction && (
        <DynamicForm 
          action={activeAction} 
          onCancel={() => setActiveAction(null)}
          onExecute={handleExecute}
          isExecuting={isExecuting}
        />
      )}

      {/* Persistent Footer */}
      <footer className="mt-auto border-t border-[#1E293B] pt-4 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 font-mono uppercase tracking-widest">
        <div className="flex items-center gap-4 mb-2 sm:mb-0">
          <span>SECURE_SHELL: ON</span>
          <span>LATENCY: 12ms</span>
          <span>NODES: 4/4</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="status-pulse text-emerald-500">ALL SYSTEMS NOMINAL</span>
          <span>© 2024 ATLAS CONTROL TECHNOLOGIES</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
