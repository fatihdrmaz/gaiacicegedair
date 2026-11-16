// Özel Günlerim kuralları — form ve ödeme sunucusu aynı kontrolleri kullanır.
export const MIN_LEAD_DAYS = 2;
export const MAX_AHEAD_DAYS = 365;

export function istanbulToday(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Istanbul' });
}

export function addDays(iso: string, n: number): string {
  const d = new Date(iso + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function dateBounds() {
  const today = istanbulToday();
  return { min: addDays(today, MIN_LEAD_DAYS), max: addDays(today, MAX_AHEAD_DAYS) };
}

type DayFields = { name: string; date: string; recipient: string; address: string; time: string };

export function dayStep1Errors(d: Pick<DayFields, 'name' | 'date'>): Record<string, string> {
  const e: Record<string, string> = {};
  const { min, max } = dateBounds();
  if (!d.name.trim()) e.name = 'Özel güne bir ad verin';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d.date)) e.date = 'Tarih seçin';
  else if (d.date < min) e.date = `En erken ${formatTr(min)} seçilebilir`;
  else if (d.date > max) e.date = `En geç ${formatTr(max)} seçilebilir`;
  return e;
}

export function dayStep2Errors(d: Pick<DayFields, 'recipient' | 'address' | 'time'>): Record<string, string> {
  const e: Record<string, string> = {};
  if (d.recipient.trim().length < 2) e.recipient = 'Alıcının adını girin';
  if (d.address.trim().length < 10) e.address = 'Açık adresi girin (mahalle, sokak, no, ilçe)';
  if (!/^\d{2}:\d{2}/.test(d.time)) e.time = 'Teslimat saati seçin';
  return e;
}

export function formatTr(iso: string): string {
  return new Date(iso + 'T12:00:00Z').toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}
