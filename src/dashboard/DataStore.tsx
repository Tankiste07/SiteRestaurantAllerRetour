import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import * as api from './api';
import type { DbImage, DbMenuItem, DbWine, Meta } from './api';

interface DataState {
  meta: Meta | null;
  images: DbImage[];
  menu: DbMenuItem[];
  wines: DbWine[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const DataContext = createContext<DataState | null>(null);

export function DataStoreProvider({ children }: { children: ReactNode }) {
  const [meta, setMeta] = useState<Meta | null>(null);
  const [images, setImages] = useState<DbImage[]>([]);
  const [menu, setMenu] = useState<DbMenuItem[]>([]);
  const [wines, setWines] = useState<DbWine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setError(null);
    try {
      const [m, i, d, w] = await Promise.all([
        api.getMeta(),
        api.getImages(),
        api.getMenu(),
        api.getWines(),
      ]);
      setMeta(m);
      setImages(i);
      setMenu(d);
      setWines(w);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const value = useMemo(
    () => ({ meta, images, menu, wines, loading, error, refetch }),
    [meta, images, menu, wines, loading, error, refetch],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataState {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData doit être utilisé sous <DataStoreProvider>.');
  return ctx;
}
