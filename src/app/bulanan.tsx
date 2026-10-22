import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StarfieldBackground from '../components/StarfieldBackground';
import { Dark } from '../constants/darkTheme';
import { useSaldoGlobal } from '../hooks/SaldoProvider';

export default function Bulanan() {
  const { riwayat, loading } = useSaldoGlobal();

  const perBulan = useMemo(() => {
    const map = new Map<string, { masuk: number; keluar: number; count: number }>();
    for (const t of riwayat) {
      const d = new Date(t.tanggal);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const cur = map.get(key) ?? { masuk: 0, keluar: 0, count: 0 };
      if (t.tipe === 'tambah') cur.masuk += t.nominal;
      else cur.keluar += t.nominal;
      cur.count += 1;
      map.set(key, cur);
    }
    return Array.from(map.entries())
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([key, val]) => ({ key, ...val }));
  }, [riwayat]);

  const namaBulan = (key: string) => {
    const [y, m] = key.split('-');
    const d = new Date(Number(y), Number(m) - 1, 1);
    return d.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
  };

  return (
    <View style={styles.container}>
      <StarfieldBackground />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={styles.topBar}>
          <Text style={styles.topBarTitle}>Pengeluaran Bulanan</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {loading ? (
            <Text style={styles.empty}>Memuat...</Text>
          ) : perBulan.length === 0 ? (
            <Text style={styles.empty}>Belum ada data transaksi.</Text>
          ) : (
            perBulan.map((b) => {
              const saldoBersih = b.masuk - b.keluar;
              return (
                <View key={b.key} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.bulan}>{namaBulan(b.key)}</Text>
                    <Text style={styles.count}>{b.count} transaksi</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.rowLabel}>Masuk</Text>
                    <Text style={[styles.rowValue, { color: Dark.success }]}>
                      + Rp {b.masuk.toLocaleString('id-ID')}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.rowLabel}>Keluar</Text>
                    <Text style={[styles.rowValue, { color: Dark.danger }]}>
                      − Rp {b.keluar.toLocaleString('id-ID')}
                    </Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.row}>
                    <Text style={styles.rowLabel}>Selisih</Text>
                    <Text
                      style={[
                        styles.rowValue,
                        { color: saldoBersih >= 0 ? Dark.primary : Dark.danger },
                      ]}
                    >
                      {saldoBersih >= 0 ? '+' : '−'} Rp{' '}
                      {Math.abs(saldoBersih).toLocaleString('id-ID')}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Dark.bg },
  topBar: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(42, 42, 58, 0.6)',
    backgroundColor: 'rgba(11, 11, 15, 0.6)',
  },
  topBarTitle: { color: Dark.text, fontSize: 18, fontWeight: '800' },
  scroll: { padding: 20, paddingBottom: 100 },
  card: {
    backgroundColor: Dark.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Dark.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bulan: { color: Dark.text, fontSize: 16, fontWeight: '800', textTransform: 'capitalize' },
  count: { color: Dark.textMuted, fontSize: 11, fontWeight: '600' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  rowLabel: { color: Dark.textMuted, fontSize: 13 },
  rowValue: { fontSize: 14, fontWeight: '700' },
  divider: { height: 1, backgroundColor: Dark.border, marginVertical: 8 },
  empty: { textAlign: 'center', color: Dark.textMuted, marginTop: 30, fontSize: 14 },
});