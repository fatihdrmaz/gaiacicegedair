'use client';

// Shared UI primitives
import { useState, useEffect, useRef } from 'react';
import { FloralImage } from '@/components/site/images';

export { FloralImage };

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  icon,
  iconRight,
  style,
  ...rest
}: any) {
  const sizes: any = {
    sm: { padding: '9px 18px', fontSize: 12, letterSpacing: '0.18em' },
    md: { padding: '14px 28px', fontSize: 12.5, letterSpacing: '0.22em' },
    lg: { padding: '18px 38px', fontSize: 13, letterSpacing: '0.24em' },
  };
  const base: any = {
    ...sizes[size],
    textTransform: 'uppercase',
    fontWeight: 500,
    borderRadius: 999,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    transition: 'all 0.25s ease',
    cursor: 'pointer',
    border: '1px solid transparent',
    fontFamily: 'var(--font-body)',
  };
  const variants: any = {
    primary: { background: 'var(--accent)', color: 'var(--paper)', borderColor: 'var(--accent)' },
    secondary: { background: 'var(--accent-soft)', color: 'var(--accent-deep)' },
    inverted: { background: 'var(--ink)', color: 'var(--paper)' },
    outlined: { background: 'transparent', color: 'var(--ink)', borderColor: 'var(--ink)' },
    outlinedAccent: { background: 'transparent', color: 'var(--accent)', borderColor: 'var(--accent)' },
    ghost: { background: 'transparent', color: 'var(--ink)' },
    white: { background: 'var(--paper)', color: 'var(--ink)', borderColor: 'transparent' },
  };
  return (
    <button
      onClick={onClick}
      {...rest}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={(e: any) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={(e: any) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {icon}
      {children}
      {iconRight}
    </button>
  );
}

export function Field({ label, children, required, hint, span = 1 }: any) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 8, gridColumn: `span ${span}` }}>
      <span style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500, color: 'var(--ink-60)' }}>
        {label}
        {required && <span style={{ color: 'var(--accent)', marginLeft: 4 }}>·</span>}
      </span>
      {children}
      {hint && <span style={{ fontSize: 12, color: 'var(--ink-40)' }}>{hint}</span>}
    </label>
  );
}

const inputStyle: any = {
  border: 'none',
  borderBottom: '1px solid var(--line)',
  background: 'transparent',
  padding: '10px 2px',
  fontSize: 15,
  fontFamily: 'var(--font-body)',
  color: 'var(--ink)',
  outline: 'none',
  transition: 'border-color 0.2s',
};

export function Input(props: any) {
  return (
    <input
      {...props}
      style={{ ...inputStyle, ...(props.style || {}) }}
      onFocus={(e: any) => (e.target.style.borderBottomColor = 'var(--accent)')}
      onBlur={(e: any) => (e.target.style.borderBottomColor = 'var(--line)')}
    />
  );
}

export function TextArea(props: any) {
  return (
    <textarea
      {...props}
      rows={props.rows || 3}
      style={{ ...inputStyle, resize: 'vertical', ...(props.style || {}) }}
      onFocus={(e: any) => (e.target.style.borderBottomColor = 'var(--accent)')}
      onBlur={(e: any) => (e.target.style.borderBottomColor = 'var(--line)')}
    />
  );
}

export function Select({ options, ...props }: any) {
  return (
    <select
      {...props}
      style={{
        ...inputStyle,
        appearance: 'none',
        cursor: 'pointer',
        background: `linear-gradient(45deg, transparent 48%, var(--ink-60) 48% 52%, transparent 52%), linear-gradient(-45deg, transparent 48%, var(--ink-60) 48% 52%, transparent 52%)`,
        backgroundSize: '6px 6px, 6px 6px',
        backgroundPosition: 'right 6px top 18px, right 12px top 18px',
        backgroundRepeat: 'no-repeat',
        paddingRight: 30,
        ...(props.style || {}),
      }}
    >
      {options.map((o: any, i: number) =>
        typeof o === 'string' ? (
          <option key={i} value={o}>
            {o}
          </option>
        ) : (
          <option key={i} value={o.value}>
            {o.label}
          </option>
        )
      )}
    </select>
  );
}

export function SectionTitle({ eyebrow, title, subtitle, align = 'left', maxWidth = 560 }: any) {
  return (
    <div
      style={{
        textAlign: align,
        maxWidth,
        marginLeft: align === 'center' ? 'auto' : 0,
        marginRight: align === 'center' ? 'auto' : 0,
      }}
    >
      {eyebrow && (
        <div
          style={{
            color: 'var(--accent)',
            marginBottom: 18,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            justifyContent: align === 'center' ? 'center' : 'flex-start',
          }}
        >
          <span style={{ width: 32, height: 1, background: 'var(--accent)' }} />
          <span className="overline">{eyebrow}</span>
        </div>
      )}
      <h2
        className="serif"
        style={{
          fontSize: 'clamp(34px, 4.5vw, 62px)',
          lineHeight: 1.05,
          fontWeight: 400,
          letterSpacing: '-0.01em',
          color: 'var(--ink)',
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p style={{ marginTop: 20, fontSize: 17, color: 'var(--ink-60)', lineHeight: 1.65 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function Divider({ dotted }: any) {
  return (
    <div
      style={{
        height: 1,
        background: dotted ? 'transparent' : 'var(--line)',
        borderTop: dotted ? '1px dashed var(--line)' : 'none',
      }}
    />
  );
}

// Scroll-reveal hook
export function useReveal(): [any, boolean] {
  const ref = useRef<any>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, shown];
}

export function Reveal({ children, delay = 0, y = 20 }: any) {
  const [ref, shown] = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : `translateY(${y}px)`,
        transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

export function Modal({ open, onClose, children, maxWidth = 720 }: any) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--paper)',
          maxWidth,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          borderRadius: 8,
          padding: 32,
        }}
      >
        {children}
      </div>
    </div>
  );
}
