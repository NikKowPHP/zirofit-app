import type { ApiError } from '../types';

// Custom API Error class
export class ApiFetchError extends Error implements ApiError {
  public readonly status: number;
  public readonly details?: any;
  public readonly endpoint: string;
  public readonly method: string;
  public readonly timestamp: string;
  public readonly code?: string;

  constructor(
    message: string,
    status: number,
    endpoint: string,
    method: string = 'GET',
    details?: any,
    code?: string
  ) {
    super(message);
    this.name = 'ApiFetchError';
    this.status = status;
    this.endpoint = endpoint;
    this.method = method;
    this.details = details;
    this.code = code;
    this.timestamp = new Date().toISOString();
    
    // Ensure the prototype chain is correct
    Object.setPrototypeOf(this, ApiFetchError.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      endpoint: this.endpoint,
      method: this.method,
      details: this.details,
      code: this.code,
      timestamp: this.timestamp
    };
  }
}