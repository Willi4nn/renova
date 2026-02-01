import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ClientService } from '../services/api/clientService';
import { useClientStore } from './useClientStore';

jest.mock('../services/api/httpClient', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      response: { use: jest.fn() },
    },
  },
  ApiClientError: class extends Error {
    status: number;

    constructor(message: string, status: number) {
      super(message);
      this.status = status;
    }
  },
}));
jest.mock('../services/api/clientService');

describe('useClientStore', () => {
  beforeEach(() => {
    useClientStore.setState({ clients: [], isLoading: false, error: null });
    jest.clearAllMocks();
  });

  it('loads clients successfully', async () => {
    const mockData = [
      {
        id: '1',
        name: 'João',
        phone_number: '12',
        address: 'A',
        created_at: '',
      },
    ];

    jest.mocked(ClientService.getAll).mockResolvedValue(mockData);

    await useClientStore.getState().fetchClients();

    expect(useClientStore.getState().clients).toEqual(mockData);
    expect(useClientStore.getState().isLoading).toBe(false);
  });
});
