
export enum UserRole {
  OPERATOR = 'OPERATOR',
  MANAGER = 'MANAGER',
  ADMINISTRATOR = 'ADMINISTRATOR',
  SYSTEM_CORE = 'SYSTEM_CORE'
}

export enum ActionDangerLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface ActionParameter {
  id: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'selection';
  required: boolean;
  options?: string[];
}

export interface ActionDefinition {
  id: string;
  type: string;
  label: string;
  description: string;
  dangerLevel: ActionDangerLevel;
  requiredRole: UserRole;
  parameters: ActionParameter[];
  icon: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userRole: UserRole;
  actionType: string;
  status: 'PENDING' | 'EXECUTED' | 'FAILED' | 'REJECTED';
  metadata: Record<string, any>;
  riskAssessment?: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  permissions: string[];
}
