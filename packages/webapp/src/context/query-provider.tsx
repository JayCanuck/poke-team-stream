import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider, PersistedClient, Persister } from '@tanstack/react-query-persist-client';
import { del, get, set } from 'idb-keyval';
import { CACHETIME, IDB_STORAGE_KEY } from '../config';

// An Indexed DB persister
// Based on https://tanstack.com/query/v4/docs/react/plugins/persistQueryClient#building-a-persister
const persister = {
  persistClient: async (client: PersistedClient) => {
    await set(IDB_STORAGE_KEY, client);
  },
  restoreClient: async () => {
    return await get<PersistedClient>(IDB_STORAGE_KEY);
  },
  removeClient: async () => {
    await del(IDB_STORAGE_KEY);
  }
} as Persister;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: CACHETIME,
      staleTime: CACHETIME
    }
  }
});

interface QueryProviderProps {
  children: React.ReactNode;
}
export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => (
  <PersistQueryClientProvider client={queryClient} persistOptions={{ persister, maxAge: CACHETIME }}>
    {children}
  </PersistQueryClientProvider>
);
