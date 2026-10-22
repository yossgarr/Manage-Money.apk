import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Dark } from '../constants/darkTheme';
import type { Barang } from '../hooks/useSaldo';

type Props = {
  visible: boolean;
  editing: Barang | null;
  onClose: () => void;
  onSubmit: (nama: string, harga: number) => void;
};

export default function FormBarang({ visible, editing, onClose, onSubmit }: Props) {
  const [nama, setNama] = useState('');
  const [harga, setHarga] = useState('');

  useEffect(() => {
    if (visible) {
      setNama(editing?.nama ?? '');
      setHarga(editing ? String(editing.harga) : '');
    }
  }, [visible, editing]);

  const handleSubmit = () => {
    const h = parseInt(harga, 10);
    if (!nama.trim() || isNaN(h) || h <= 0) return;
    onSubmit(nama.trim(), h);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>{editing ? 'Edit Barang' : 'Tambah Barang'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Nama barang (mis. Mie Instan)"
            placeholderTextColor={Dark.textMuted}
            value={nama}
            onChangeText={setNama}
          />
          <TextInput
            style={styles.input}
            placeholder="Harga (mis. 5000)"
            placeholderTextColor={Dark.textMuted}
            value={harga}
            onChangeText={setHarga}
            keyboardType="number-pad"
          />
          <View style={styles.row}>
            <Pressable style={[styles.btn, styles.btnBatal]} onPress={onClose}>
              <Text style={styles.btnTextMuted}>Batal</Text>
            </Pressable>
            <Pressable style={[styles.btn, styles.btnSimpan]} onPress={handleSubmit}>
              <Text style={styles.btnText}>Simpan</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Dark.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: Dark.border,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Dark.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 18, color: Dark.text },
  input: {
    backgroundColor: Dark.surfaceAlt,
    borderWidth: 1,
    borderColor: Dark.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    color: Dark.text,
    fontSize: 15,
  },
  row: { flexDirection: 'row', gap: 12, marginTop: 4 },
  btn: { flex: 1, padding: 15, borderRadius: 14, alignItems: 'center' },
  btnBatal: { backgroundColor: Dark.surfaceAlt, borderWidth: 1, borderColor: Dark.border },
  btnSimpan: { backgroundColor: Dark.primary },
  btnText: { color: '#0B0B0F', fontWeight: '800', fontSize: 15 },
  btnTextMuted: { color: Dark.textMuted, fontWeight: '700', fontSize: 15 },
});