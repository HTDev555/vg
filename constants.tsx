
import React from 'react';
import { ActionDefinition, ActionDangerLevel, UserRole } from './types';

export const SYSTEM_ACTIONS: ActionDefinition[] = [
  {
    id: 'act_001',
    type: 'APPROVE_PAYMENT',
    label: 'Approve Strategic Payment',
    description: 'Release high-value funds to pre-authorized vendors.',
    dangerLevel: ActionDangerLevel.HIGH,
    requiredRole: UserRole.MANAGER,
    icon: 'fa-file-invoice-dollar',
    parameters: [
      { id: 'amount', label: 'Transaction Amount', type: 'number', required: true },
      { id: 'vendor_id', label: 'Vendor Identifier', type: 'string', required: true },
      { id: 'auth_code', label: 'Internal Auth Code', type: 'string', required: true }
    ]
  },
  {
    id: 'act_002',
    type: 'GRANT_SYSTEM_ACCESS',
    label: 'Provision System Access',
    description: 'Grant temporary elevated privileges to an external auditor.',
    dangerLevel: ActionDangerLevel.MEDIUM,
    requiredRole: UserRole.ADMINISTRATOR,
    icon: 'fa-user-shield',
    parameters: [
      { id: 'target_user', label: 'Target User Email', type: 'string', required: true },
      { id: 'duration_hours', label: 'Access Duration (Hours)', type: 'number', required: true },
      { id: 'environment', label: 'Environment', type: 'selection', required: true, options: ['STAGING', 'PRODUCTION', 'LEGACY'] }
    ]
  },
  {
    id: 'act_003',
    type: 'DELETE_RESOURCE',
    label: 'Purge Critical Resource',
    description: 'Irreversible deletion of encrypted dataset from cold storage.',
    dangerLevel: ActionDangerLevel.CRITICAL,
    requiredRole: UserRole.ADMINISTRATOR,
    icon: 'fa-trash-can',
    parameters: [
      { id: 'resource_id', label: 'Global Resource ID', type: 'string', required: true },
      { id: 'confirm_purge', label: 'Acknowledge Data Loss', type: 'boolean', required: true }
    ]
  },
  {
    id: 'act_004',
    type: 'ROTATE_KEYS',
    label: 'Rotate Root Credentials',
    description: 'Force immediate rotation of all system-level API keys.',
    dangerLevel: ActionDangerLevel.CRITICAL,
    requiredRole: UserRole.ADMINISTRATOR,
    icon: 'fa-key',
    parameters: [
      { id: 'reason', label: 'Rotation Reason', type: 'string', required: true }
    ]
  },
  {
    id: 'act_005',
    type: 'REBOOT_CORE',
    label: 'Initiate Core Reset',
    description: 'Restart the primary decision engine orchestrator.',
    dangerLevel: ActionDangerLevel.MEDIUM,
    requiredRole: UserRole.OPERATOR,
    icon: 'fa-power-off',
    parameters: [
      { id: 'safe_mode', label: 'Execute in Safe Mode', type: 'boolean', required: true }
    ]
  }
];

export const ATLAS_COLORS = {
  bg: '#0B0F14',
  surface: '#111827',
  primary: '#2563EB',
  success: '#16A34A',
  danger: '#7F1D1D',
  border: '#1E293B'
};
