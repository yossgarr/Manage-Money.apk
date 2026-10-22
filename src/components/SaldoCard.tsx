import { StyleSheet, Text, View } from 'react-native';
import { Dark } from '../constants/darkTheme';

type Props = { saldo: number };

export default function SaldoCard({ saldo }: Props) {
  const negatif = saldo < 0;
  return (
    <View style={[styles.card, negatif && styles.cardNegatif]}>
      <View style={styles.glowOrb} />
      <Text style={styles.label}>SALDO KESELURUHAN</Text>
      <Text style={[styles.amount, negatif && styles.amountNegatif]}>
        Rp {saldo.toLocaleString('id-ID')}
      </Text>
      <Text style={styles.sub}>{negatif ? '⚠ Saldo minus' : '● Tersedia'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Dark.surface,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Dark.border,
    overflow: 'hidden',
    shadowColor: Dark.primary,
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  cardNegatif: { borderColor: Dark.danger, shadowColor: Dark.danger },
  glowOrb: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: Dark.glow,
  },
  label: {
    color: Dark.textMuted,
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: '600',
    marginBottom: 8,
  },
  amount: {
    color: Dark.text,
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  amountNegatif: { color: Dark.danger },
  sub: { color: Dark.success, fontSize: 12, marginTop: 10, fontWeight: '600' },
});