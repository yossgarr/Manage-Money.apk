import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

export type Barang = {
  id: string;
  nama: string;
  harga: number;
};

export type TipeTransaksi = 'tambah' | 'kurang' | 'beli';

export type Transaksi = {
  id: string;
  tipe: TipeTransaksi;
  nominal: number;
  keterangan: string;
  tanggal: string; // ISO string
};

const KEY_SALDO = '@saldo';
const KEY_BARANG = '@barang';
const KEY_RIWAYAT = '@riwayat';

export function useSaldo() {
  const [saldo, setSaldo] = useState(0);
  const [barang, setBarang] = useState<Barang[]>([]);
  const [riwayat, setRiwayat] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [s, b, r] = await Promise.all([
          AsyncStorage.getItem(KEY_SALDO),
          AsyncStorage.getItem(KEY_BARANG),
          AsyncStorage.getItem(KEY_RIWAYAT),
        ]);
        if (s) setSaldo(JSON.parse(s));
        if (b) setBarang(JSON.parse(b));
        if (r) setRiwayat(JSON.parse(r));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loading) AsyncStorage.setItem(KEY_SALDO, JSON.stringify(saldo));
  }, [saldo, loading]);

  useEffect(() => {
    if (!loading) AsyncStorage.setItem(KEY_BARANG, JSON.stringify(barang));
  }, [barang, loading]);

  useEffect(() => {
    if (!loading) AsyncStorage.setItem(KEY_RIWAYAT, JSON.stringify(riwayat));
  }, [riwayat, loading]);

  const catat = useCallback((tipe: TipeTransaksi, nominal: number, keterangan: string) => {
    const trx: Transaksi = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
      tipe,
      nominal,
      keterangan,
      tanggal: new Date().toISOString(),
    };
    setRiwayat((prev) => [trx, ...prev]);
  }, []);

  const tambahSaldo = useCallback(
    (nominal: number) => {
      if (nominal <= 0) return;
      setSaldo((prev) => prev + nominal);
      catat('tambah', nominal, 'Tambah saldo');
    },
    [catat]
  );

  const kurangiSaldo = useCallback(
    (nominal: number) => {
      if (nominal <= 0) return;
      setSaldo((prev) => prev - nominal);
      catat('kurang', nominal, 'Kurangi saldo');
    },
    [catat]
  );

  const tambahBarang = useCallback((nama: string, harga: number) => {
    const baru: Barang = { id: Date.now().toString(), nama, harga };
    setBarang((prev) => [...prev, baru]);
  }, []);

  const editBarang = useCallback((id: string, nama: string, harga: number) => {
    setBarang((prev) =>
      prev.map((b) => (b.id === id ? { ...b, nama, harga } : b))
    );
  }, []);

  const hapusBarang = useCallback((id: string) => {
    setBarang((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const beliBarang = useCallback(
    (item: Barang) => {
      setSaldo((prev) => prev - item.harga);
      catat('beli', item.harga, item.nama);
    },
    [catat]
  );

  const hapusRiwayat = useCallback(() => {
    setRiwayat([]);
  }, []);

  return {
    saldo,
    barang,
    riwayat,
    loading,
    tambahSaldo,
    kurangiSaldo,
    tambahBarang,
    editBarang,
    hapusBarang,
    beliBarang,
    hapusRiwayat,
  };
}