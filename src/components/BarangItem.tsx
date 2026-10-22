import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Dark } from '../constants/darkTheme';
import type { Barang } from '../hooks/useSaldo';

type Props = {
  item: Barang;
  onBeli: (item: Barang) => void;
  onEdit: (item: Barang) => void;
  onHapus: (id: string) => void;
};

export default function BarangItem({ item, onBeli, onEdit, onHapus }: Props) {
  const konfirmasiHapus = () => {
    Alert.alert('Hapus barang?', `"${item.nama}" akan dihapus.`, [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: () => onHapus(item.id) },
    ]);
  };

  return (
    <View style={styles.row}>
      <Pressable style={styles.info} onPress={() => onBeli(item)}>
        <Text style={styles.nama}>{item.nama}</Text>
        <Text style={styles.harga}>Rp {item.harga.toLocaleString('id-ID')}</Text>
      </Pressable>
      <View style={styles.actions}>
        <Pressable style={[styles.chip, styles.chipEdit]} onPress={() => onEdit(item)}>
          <Text style={styles.chipText}>Edit</Text>
        </Pressable>
        <Pressable style={[styles.chip, styles.chipHapus]} onPress={konfirmasiHapus}>
          <Text style={styles.chipText}>Hapus</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: Dark.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Dark.border,
  },
  info: { flex: 1 },
  nama: { fontSize: 16, fontWeight: '700', color: Dark.text },
  harga: { fontSize: 13, color: Dark.primary, marginTop: 3, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  chipEdit: { backgroundColor: Dark.surfaceAlt, borderWidth: 1, borderColor: Dark.primary },
  chipHapus: { backgroundColor: Dark.surfaceAlt, borderWidth: 1, borderColor: Dark.danger },
  chipText: { color: Dark.text, fontSize: 12, fontWeight: '700' },
});