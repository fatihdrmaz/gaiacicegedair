'use client';

import { useEffect, useState } from 'react';
import { Icons } from '@/components/shared/icons';

type TweakState = {
  accent: string;
  fontpair: string;
  heroVariant: string;
  serviceVariant: string;
  b2cVariant: string;
};

const DEFAULTS: TweakState = {
  accent: 'green',
  fontpair: 'noto',
  heroVariant: 'slideshow',
  serviceVariant: 'image-card',
  b2cVariant: 'wizard',
};

export function TweaksPanel() {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<TweakState>(DEFAULTS);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if ((e.data as any)?.type === '__activate_edit_mode')   setVisible(true);
      if ((e.data as any)?.type === '__deactivate_edit_mode') setVisible(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  useEffect(() => {
    const b = document.body;
    b.dataset.accent = current.accent;
    b.dataset.fontpair = current.fontpair;
    b.dataset.heroVariant = current.heroVariant;
    b.dataset.serviceVariant = current.serviceVariant;
    b.dataset.b2cVariant = current.b2cVariant;
  }, [current]);

  const update = (patch: Partial<TweakState>) => {
    const next = { ...current, ...patch };
    setCurrent(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*');
  };

  if (!visible) return null;

  const accents = [
    { id: 'green',  name: 'Yeşil',  color: '#3e5c4a' },
    { id: 'haki',   name: 'Haki',   color: '#5c5e3f' },
    { id: 'toprak', name: 'Toprak', color: '#7b5e19' },
  ];
  const fonts = [
    { id: 'editorial', name: 'Cormorant · Work Sans' },
    { id: 'fraunces',  name: 'Fraunces · Work Sans' },
    { id: 'noto',      name: 'Noto Serif · Work Sans' },
  ];
  const heroes = [
    { id: 'slideshow', name: 'Slayt Hero' },
    { id: 'split',     name: 'Bölünmüş Hero' },
    { id: 'editorial', name: 'Editöryal Hero' },
  ];
  const services = [
    { id: 'image-card',        name: 'Görsel Kart' },
    { id: 'editorial-list',    name: 'Editöryal Liste' },
    { id: 'interactive-hover', name: 'Hover Vitrin' },
  ];

  return (
    <div style={{
      position: 'fixed', right: 20, bottom: 100, zIndex: 150,
      width: 300, background: 'var(--paper)',
      border: '1px solid var(--line)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      padding: 22, fontFamily: 'var(--font-body)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 500 }}>Tweaks</span>
        <Icons.Settings size={16} />
      </div>

      <Block label="Renk Vurgusu">
        <div style={{ display: 'flex', gap: 8 }}>
          {accents.map(a => (
            <button key={a.id} onClick={() => update({ accent: a.id })} style={{
              flex: 1, padding: '10px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              border: `1px solid ${current.accent === a.id ? 'var(--ink)' : 'var(--line)'}`,
              background: 'transparent', cursor: 'pointer',
            }}>
              <span style={{ width: 18, height: 18, borderRadius: '50%', background: a.color }} />
              <span style={{ fontSize: 11 }}>{a.name}</span>
            </button>
          ))}
        </div>
      </Block>

      <Block label="Font Eşleşmesi">
        {fonts.map(f => (
          <Radio key={f.id} checked={current.fontpair === f.id} label={f.name} onClick={() => update({ fontpair: f.id })} />
        ))}
      </Block>

      <Block label="Hero Varyantı">
        {heroes.map(h => (
          <Radio key={h.id} checked={current.heroVariant === h.id} label={h.name} onClick={() => update({ heroVariant: h.id })} />
        ))}
      </Block>

      <Block label="Hizmet Kartı">
        {services.map(s => (
          <Radio key={s.id} checked={current.serviceVariant === s.id} label={s.name} onClick={() => update({ serviceVariant: s.id })} />
        ))}
      </Block>
    </div>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-40)', marginBottom: 8 }}>{label}</div>
      {children}
    </div>
  );
}

function Radio({ checked, label, onClick }: { checked: boolean; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
      cursor: 'pointer', background: 'transparent', textAlign: 'left',
    }}>
      <span style={{
        width: 14, height: 14, borderRadius: '50%',
        border: `1.5px solid ${checked ? 'var(--accent)' : 'var(--ink-20)'}`,
        background: checked ? 'var(--accent)' : 'transparent',
        boxShadow: checked ? 'inset 0 0 0 2px var(--paper)' : 'none',
      }} />
      <span style={{ fontSize: 13 }}>{label}</span>
    </button>
  );
}
