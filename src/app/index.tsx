import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BarangItem from '../components/BarangItem';
import FormBarang from '../components/FormBarang';
import SaldoCard from '../components/SaldoCard';
import StarfieldBackground from '../components/StarfieldBackground';
import { Dark } from '../constants/darkTheme';
import { useSaldoGlobal } from '../hooks/SaldoProvider';
import type { Barang } from '../hooks/useSaldo';

export default function Home() {
  const { saldo, barang, loading, tambahSaldo, kurangiSaldo, tambahBarang, editBarang, hapusBarang, beliBarang } = useSaldoGlobal();

  const [inputSaldo, setInputSaldo] = useState('');
  const [inputKurangi, setInputKurangi] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState<Barang | null>(null);

  const handleTambahSaldo = () => {
    const n = parseInt(inputSaldo, 10);
    if (isNaN(n) || n <= 0) {
      Alert.alert('Nominal tidak valid', 'Masukkan angka lebih dari 0.');
      return;
    }
    tambahSaldo(n);
    setInputSaldo('');
  };

  const handleKurangiSaldo = () => {
    const n = parseInt(inputKurangi, 10);
    if (isNaN(n) || n <= 0) {
      Alert.alert('Nominal tidak valid', 'Masukkan angka lebih dari 0.');
      return;
    }
    kurangiSaldo(n);
    setInputKurangi('');
  };

  const handleBeli = (item: Barang) => {
    if (saldo < item.harga) {
      Alert.alert('Saldo tidak cukup', `Saldo kamu Rp ${saldo.toLocaleString('id-ID')}.`);
      return;
    }
    Alert.alert('Beli barang?', `${item.nama} — Rp ${item.harga.toLocaleString('id-ID')}`, [
      { text: 'Batal', style: 'cancel' },
      { text: 'Beli', onPress: () => beliBarang(item) },
    ]);
  };

  const openTambah = () => {
    setEditing(null);
    setFormVisible(true);
  };

  const openEdit = (item: Barang) => {
    setEditing(item);
    setFormVisible(true);
  };

  const handleSubmitForm = (nama: string, harga: number) => {
    if (editing) editBarang(editing.id, nama, harga);
    else tambahBarang(nama, harga);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <StarfieldBackground />
        <Text style={{ color: Dark.textMuted }}>Memuat data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StarfieldBackground />

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={styles.topBar}>
          <Text style={styles.topBarTitle}>Money Manager</Text>
          <View style={styles.topBarDot} />
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <Text style={styles.appSubtitle}>Kelola uangmu dengan tenang 🌙</Text>

            <SaldoCard saldo={saldo} />

            <Text style={styles.section}>Tambah Saldo</Text>
            <View style={styles.rowInput}>
              <TextInput
                style={styles.input}
                placeholder="Nominal (mis. 100000)"
                placeholderTextColor={Dark.textMuted}
                keyboardType="number-pad"
                value={inputSaldo}
                onChangeText={setInputSaldo}
              />
              <Pressable style={[styles.btn, styles.btnHijau]} onPress={handleTambahSaldo}>
                <Text style={styles.btnTextDark}>+</Text>
              </Pressable>
            </View>

            <Text style={styles.section}>Kurangi Saldo</Text>
            <View style={styles.rowInput}>
              <TextInput
                style={styles.input}
                placeholder="Nominal (mis. 20000)"
                placeholderTextColor={Dark.textMuted}
                keyboardType="number-pad"
                value={inputKurangi}
                onChangeText={setInputKurangi}
              />
              <Pressable style={[styles.btn, styles.btnMerah]} onPress={handleKurangiSaldo}>
                <Text style={styles.btnTextDark}>−</Text>
              </Pressable>
            </View>

            <View style={styles.headerRow}>
              <Text style={styles.section}>Daftar Barang</Text>
              <Pressable style={styles.btnTambahBarang} onPress={openTambah}>
                <Text style={styles.btnTambahBarangText}>+ Tambah</Text>
              </Pressable>
            </View>

            {barang.length === 0 ? (
              <Text style={styles.empty}>Belum ada barang. Tekan "+ Tambah".</Text>
            ) : (
              barang.map((item) => (
                <BarangItem
                  key={item.id}
                  item={item}
                  onBeli={handleBeli}
                  onEdit={openEdit}
                  onHapus={hapusBarang}
                />
              ))
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <FormBarang
        visible={formVisible}
        editing={editing}
        onClose={() => setFormVisible(false)}
        onSubmit={handleSubmitForm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Dark.bg },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Dark.bg,
  },
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
  topBarTitle: {
    color: Dark.text,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  topBarDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Dark.primary,
  },
  scroll: { padding: 20, paddingTop: 8, paddingBottom: 100 },
  appSubtitle: { color: Dark.textMuted, fontSize: 13, marginBottom: 20 },
  section: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
    color: Dark.text,
    letterSpacing: 0.3,
  },
  rowInput: { flexDirection: 'row', gap: 10 },
  input: {
    flex: 1,
    backgroundColor: Dark.surface,
    borderWidth: 1,
    borderColor: Dark.border,
    borderRadius: 14,
    padding: 14,
    color: Dark.text,
    fontSize: 15,
  },
  btn: {
    width: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnHijau: { backgroundColor: Dark.success },
  btnMerah: { backgroundColor: Dark.danger },
  btnTextDark: {
    color: '#0B0B0F',
    fontWeight: '900',
    fontSize: 22,
    lineHeight: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnTambahBarang: {
    backgroundColor: Dark.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  btnTambahBarangText: { color: '#0B0B0F', fontWeight: '800', fontSize: 13 },
  empty: {
    textAlign: 'center',
    color: Dark.textMuted,
    marginTop: 20,
    fontSize: 14,
  },
});