import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StarfieldBackground from '../components/StarfieldBackground';
import TransaksiItem from '../components/TransaksiItem';
import { Dark } from '../constants/darkTheme';
import { useSaldoGlobal } from '../hooks/SaldoProvider';

function kunciBulan(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function labelBulan(key: string) {
  const [y, m] = key.split('-');
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
}

export default function Riwayat() {
  const { riwayat, loading, hapusRiwayat } = useSaldoGlobal();

  // Bulan yang sedang dipilih (default: bulan sekarang)
  const [bulanAktif, setBulanAktif] = useState(() => kunciBulan(new Date()));

  // Daftar bulan yang punya transaksi, diurutkan terbaru dulu
  const daftarBulan = useMemo(() => {
    const set = new Set<string>();
    for (const t of riwayat) set.add(kunciBulan(new Date(t.tanggal)));
    return Array.from(set).sort((a, b) => (a < b ? 1 : -1));
  }, [riwayat]);

  // Pastikan bulanAktif ada di daftar, kalau tidak pakai bulan terbaru
  const bulanDipilih = daftarBulan.includes(bulanAktif)
    ? bulanAktif
    : daftarBulan[0] ?? bulanAktif;

  // Transaksi pada bulan terpilih
  const transaksiBulan = useMemo(
    () =>
      riwayat
        .filter((t) => kunciBulan(new Date(t.tanggal)) === bulanDipilih)
        .sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1)),
    [riwayat, bulanDipilih]
  );

  // Total pengeluaran bulan terpilih (hanya tipe 'beli' dan 'kurang')
  const totalKeluar = useMemo(
    () =>
      transaksiBulan
        .filter((t) => t.tipe !== 'tambah')
        .reduce((a, b) => a + b.nominal, 0),
    [transaksiBulan]
  );

  // Total pemasukan bulan terpilih (tipe 'tambah')
  const totalMasuk = useMemo(
    () =>
      transaksiBulan
        .filter((t) => t.tipe === 'tambah')
        .reduce((a, b) => a + b.nominal, 0),
    [transaksiBulan]
  );

  const konfirmasiHapus = () => {
    Alert.alert('Hapus semua riwayat?', 'Saldo tidak akan berubah.', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: hapusRiwayat },
    ]);
  };

  return (
    <View style={styles.container}>
      <StarfieldBackground />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={styles.topBar}>
          <Text style={styles.topBarTitle}>Riwayat Pengeluaran</Text>
          {riwayat.length > 0 && (
            <Pressable onPress={konfirmasiHapus}>
              <Text style={styles.clearText}>Bersihkan</Text>
            </Pressable>
          )}
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Ringkasan bulan terpilih */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>
              TOTAL PENGELUARAN · {labelBulan(bulanDipilih).toUpperCase()}
            </Text>
            <Text style={styles.summaryValue}>
              Rp {totalKeluar.toLocaleString('id-ID')}
            </Text>
            <Text style={styles.summarySub}>
              Masuk: Rp {totalMasuk.toLocaleString('id-ID')} ·{' '}
              {transaksiBulan.length} transaksi
            </Text>
          </View>

          {/* Pemilih bulan */}
          {daftarBulan.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.bulanRow}
            >
              {daftarBulan.map((key) => {
                const aktif = key === bulanDipilih;
                return (
                  <Pressable
                    key={key}
                    onPress={() => setBulanAktif(key)}
                    style={[styles.chipBulan, aktif && styles.chipBulanAktif]}
                  >
                    <Text
                      style={[styles.chipBulanText, aktif && styles.chipBulanTextAktif]}
                    >
                      {labelBulan(key)}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}

          {/* Daftar transaksi */}
          {loading ? (
            <Text style={styles.empty}>Memuat...</Text>
          ) : transaksiBulan.length === 0 ? (
            <Text style={styles.empty}>
              Belum ada pengeluaran di bulan ini.
            </Text>
          ) : (
            transaksiBulan.map((item) => <TransaksiItem key={item.id} item={item} />)
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Dark.bg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(42, 42, 58, 0.6)',
    backgroundColor: 'rgba(11, 11, 15, 0.6)',
  },
  topBarTitle: { color: Dark.text, fontSize: 18, fontWeight: '800' },
  clearText: { color: Dark.danger, fontSize: 13, fontWeight: '700' },
  scroll: { padding: 20, paddingBottom: 100 },

  summaryCard: {
    backgroundColor: Dark.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Dark.danger,
    shadowColor: Dark.danger,
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  summaryLabel: {
    color: Dark.textMuted,
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: '700',
    marginBottom: 8,
  },
  summaryValue: { color: Dark.text, fontSize: 30, fontWeight: '800' },
  summarySub: { color: Dark.textMuted, fontSize: 12, marginTop: 8 },

  bulanRow: { gap: 8, paddingBottom: 16 },
  chipBulan: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Dark.surfaceAlt,
    borderWidth: 1,
    borderColor: Dark.border,
  },
  chipBulanAktif: {
    backgroundColor: Dark.primary,
    borderColor: Dark.primary,
  },
  chipBulanText: { color: Dark.textMuted, fontSize: 12, fontWeight: '700' },
  chipBulanTextAktif: { color: '#0B0B0F' },

  empty: { textAlign: 'center', color: Dark.textMuted, marginTop: 30, fontSize: 14 },
});