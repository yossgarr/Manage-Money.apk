import { createContext, useContext, type ReactNode } from 'react';
import { useSaldo } from './useSaldo';

type SaldoContextType = ReturnType<typeof useSaldo>;

const SaldoContext = createContext<SaldoContextType | null>(null);

export function SaldoProvider({ children }: { children: ReactNode }) {
  const value = useSaldo();
  return <SaldoContext.Provider value={value}>{children}</SaldoContext.Provider>;
}

export function useSaldoGlobal() {
  const ctx = useContext(SaldoContext);
  if (!ctx) {
    throw new Error('useSaldoGlobal harus dipakai di dalam <SaldoProvider>');
  }
  return ctx;
}