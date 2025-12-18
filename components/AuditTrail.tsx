
import React from 'react';
import { AuditLogEntry } from '../types';

interface AuditTrailProps {
  logs: AuditLogEntry[];
}

export const AuditTrail: React.FC<AuditTrailProps> = ({ logs }) => {
  return (
    <div className="bg-[#111827] border border-[#1E293B] rounded-lg overflow-hidden flex flex-col h-full">
      <div className="px-4 py-3 border-b border-[#1E293B] bg-[#0F172A] flex justify-between items-center">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
          <i className="fa-solid fa-clock-rotate-left mr-2"></i>
          Immutable Audit Log
        </h2>
        <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          LIVE CONNECT
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {logs.length === 0 ? (
          <div className="text-slate-500 text-xs italic text-center py-10">
            No system events recorded in the current session.
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="border-l-2 border-slate-700 pl-4 py-1 group hover:border-blue-500 transition-colors">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-mono text-slate-500">
                  {log.timestamp.toLocaleTimeString()}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  log.status === 'EXECUTED' ? 'bg-emerald-500/10 text-emerald-500' :
                  log.status === 'FAILED' ? 'bg-red-500/10 text-red-500' :
                  'bg-yellow-500/10 text-yellow-500'
                }`}>
                  {log.status}
                </span>
              </div>
              <div className="text-sm font-semibold text-slate-200">
                {log.actionType.replace(/_/g, ' ')}
              </div>
              <div className="text-[11px] text-slate-400">
                Executed by <span className="text-blue-400">{log.userId}</span> ({log.userRole})
              </div>
              {log.riskAssessment && (
                <div className="mt-2 p-2 bg-black/40 rounded border border-slate-800 text-[10px] text-slate-500 leading-relaxed">
                  <span className="text-blue-500 uppercase font-bold text-[9px] block mb-1">AI Risk Guard Assessment:</span>
                  {log.riskAssessment}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
