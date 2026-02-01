import type { ServiceStatus } from '.';

export interface ApiError {
  error: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
  status: number;
}

export interface CreateClientRequest {
  name: string;
  phone_number: string;
  address: string;
}

export type UpdateClientRequest = Partial<CreateClientRequest>;

export interface CreateServiceRequest {
  client_id: string;
  furniture_name: string;
  fabric_name: string;
  fabric_code?: string;
  fabric_price_per_meter: number;
  fabric_meters: number;
  cost_foam: number;
  cost_labor: number;
  cost_shipping: number;
  cost_other: number;
  collection_date: string;
  status: ServiceStatus;
  derivery_date?: string;
  notes?: string;
}

export type UpdateServiceRequest = Partial<CreateServiceRequest>;
