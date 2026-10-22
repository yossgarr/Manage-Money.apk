import { StyleSheet, Text, View } from 'react-native';
import { Dark } from '../constants/darkTheme';
import type { Transaksi } from '../hooks/useSaldo';

type Props = { item: Transaksi };

function formatTanggal(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function TransaksiItem({ item }: Props) {
  const isMasuk = item.tipe === 'tambah';
  const warna = isMasuk ? Dark.success : Dark.danger;
  const tanda = isMasuk ? '+' : '-';

  return (
    <View style={styles.row}>
      <View style={styles.kiri}>
        <Text style={[styles.nominal, { color: warna }]}>
          {tanda} Rp {item.nominal.toLocaleString('id-ID')}
        </Text>
        <Text style={styles.keterangan}>{item.keterangan}</Text>
      </View>
      <Text style={styles.tanggal}>{formatTanggal(item.tanggal)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Dark.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Dark.border,
  },
  kiri: { flex: 1 },
  nominal: { fontSize: 16, fontWeight: '800' },
  keterangan: { color: Dark.textMuted, fontSize: 13, marginTop: 3 },
  tanggal: { color: Dark.textMuted, fontSize: 11, textAlign: 'right', marginLeft: 8 },
});