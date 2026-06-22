import React from 'react';

/** Labelled text field / textarea with focus ring. */
export function Input({ label, type = 'text', icon = null, hint, textarea = false, id, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const fieldId = id || 'fld-' + Math.random().toString(36).slice(2, 8);
  const Field = textarea ? 'textarea' : 'input';
  return (
    <label htmlFor={fieldId} style={{ display: 'flex', flexDirection: 'column', gap: 7, width: '100%' }}>
      {label && (
        <span style={{
          fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)',
          fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)',
        }}>{label}</span>
      )}
      <span style={{
        display: 'flex', alignItems: textarea ? 'flex-start' : 'center', gap: 10,
        padding: textarea ? '12px 16px' : '0 16px',
        height: textarea ? 'auto' : 50,
        background: 'var(--surface-page)',
        border: '1px solid ' + (focus ? 'var(--focus-ring)' : 'var(--border-default)'),
        borderRadius: 'var(--radius-md)',
        boxShadow: focus ? 'var(--shadow-focus)' : 'none',
        transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
      }}>
        {icon && <i className={icon} style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: textarea ? 4 : 0 }} />}
        <Field
          id={fieldId}
          type={textarea ? undefined : type}
          rows={textarea ? 4 : undefined}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          {...rest}
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)',
            color: 'var(--text-strong)', resize: textarea ? 'vertical' : undefined,
            padding: textarea ? 0 : '14px 0', minHeight: textarea ? 88 : undefined,
            ...(rest.style || {}),
          }}
        />
      </span>
      {hint && <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{hint}</span>}
    </label>
  );
}
