// Nodebox initialization states
export const NodeboxStatus = {
  INITIALIZING: 'initializing',
  READY: 'ready',
  ERROR: 'error',
  DESTROYED: 'destroyed'
};

// Error types for better error handling
export const NodeboxErrorType = {
  TIMEOUT: 'timeout',
  INITIALIZATION: 'initialization',
  RUNTIME: 'runtime',
  NETWORK: 'network'
};

export class NodeboxError extends Error {
  constructor(message, type, originalError = null) {
    super(message);
    this.name = 'NodeboxError';
    this.type = type;
    this.originalError = originalError;
  }
}