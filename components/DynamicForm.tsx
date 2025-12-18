
import React, { useState } from 'react';
import { ActionDefinition, ActionDangerLevel } from '../types';

interface DynamicFormProps {
  action: ActionDefinition;
  onExecute: (params: Record<string, any>) => void;
  onCancel: () => void;
  isExecuting: boolean;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({ action, onExecute, onCancel, isExecuting }) => {
  const [values, setValues] = useState<Record<string, any>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExecute(values);
  };

  const getDangerColor = (level: ActionDangerLevel) => {
    switch (level) {
      case ActionDangerLevel.CRITICAL: return 'text-red-500 border-red-900/50 bg-red-900/10';
      case ActionDangerLevel.HIGH: return 'text-orange-500 border-orange-900/50 bg-orange-900/10';
      case ActionDangerLevel.MEDIUM: return 'text-yellow-500 border-yellow-900/50 bg-yellow-900/10';
      default: return 'text-blue-500 border-blue-900/50 bg-blue-900/10';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111827] border border-[#1E293B] rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-12 h-12 rounded-lg border flex items-center justify-center text-xl ${getDangerColor(action.dangerLevel)}`}>
              <i className={`fa-solid ${action.icon}`}></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-tight">{action.label}</h3>
              <p className="text-xs text-slate-400">{action.description}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {action.parameters.map((param) => (
              <div key={param.id}>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  {param.label} {param.required && <span className="text-red-500">*</span>}
                </label>
                
                {param.type === 'string' && (
                  <input
                    type="text"
                    required={param.required}
                    className="w-full bg-[#0B0F14] border border-[#1E293B] rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    onChange={(e) => setValues({ ...values, [param.id]: e.target.value })}
                  />
                )}

                {param.type === 'number' && (
                  <input
                    type="number"
                    required={param.required}
                    className="w-full bg-[#0B0F14] border border-[#1E293B] rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    onChange={(e) => setValues({ ...values, [param.id]: parseFloat(e.target.value) })}
                  />
                )}

                {param.type === 'boolean' && (
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="form-checkbox bg-[#0B0F14] border-[#1E293B] rounded text-blue-500"
                      onChange={(e) => setValues({ ...values, [param.id]: e.target.checked })}
                    />
                    <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">I confirm this manual override</span>
                  </label>
                )}

                {param.type === 'selection' && (
                  <select
                    required={param.required}
                    className="w-full bg-[#0B0F14] border border-[#1E293B] rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                    onChange={(e) => setValues({ ...values, [param.id]: e.target.value })}
                  >
                    <option value="">Select Option</option>
                    {param.options?.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}
              </div>
            ))}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                disabled={isExecuting}
                className="flex-1 py-2 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold uppercase transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isExecuting}
                className={`flex-1 py-2 rounded text-xs font-bold uppercase transition-all shadow-lg shadow-blue-500/10 ${
                  isExecuting ? 'bg-blue-600/50 cursor-wait' : 'bg-blue-600 hover:bg-blue-500'
                }`}
              >
                {isExecuting ? 'Executing...' : 'Authorize Action'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
