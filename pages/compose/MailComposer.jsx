import { useState, useRef, useEffect } from 'react';

const TOOLBAR = [
  { cmd: 'bold',          label: 'B',   style: { fontWeight: 700 } },
  { cmd: 'italic',        label: 'I',   style: { fontStyle: 'italic' } },
  { cmd: 'underline',     label: 'U',   style: { textDecoration: 'underline' } },
  { cmd: 'strikeThrough', label: 'S',   style: { textDecoration: 'line-through' } },
];

const ALIGNS = [
  { cmd: 'justifyLeft',   label: '▤' },
  { cmd: 'justifyCenter', label: '▥' },
  { cmd: 'justifyRight',  label: '▦' },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400&family=Crimson+Pro:ital,wght@0,300;0,400;1,300&display=swap');

  :root {
    --bg:       #0a0a0b;
    --surface:  #111114;
    --border:   #1e1e22;
    --gold:     #c9a84c;
    --gold-dim: #7a6230;
    --text:     #e2d9c8;
    --muted:    #555560;
    --error:    #e05c5c;
    --success:  #5cbf8a;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Mono', monospace;
    min-height: 100vh;
    min-height: 100dvh;
  }

  .app {
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    max-width: 680px;
    margin: 0 auto;
    padding: 0 0 env(safe-area-inset-bottom, 20px);
  }

  /* ── Header ── */
  .header {
    padding: 20px 20px 16px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    background: var(--bg);
    z-index: 10;
  }

  .logo {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .logo-eyebrow {
    font-size: 9px;
    letter-spacing: 0.35em;
    color: var(--gold-dim);
    text-transform: uppercase;
  }

  .logo-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    letter-spacing: 0.12em;
    color: var(--gold);
    line-height: 1;
  }

  .status-pill {
    font-size: 10px;
    letter-spacing: 0.15em;
    padding: 4px 10px;
    border-radius: 2px;
    text-transform: uppercase;
    transition: all 0.3s;
  }
  .status-pill.idle    { color: var(--muted); border: 1px solid var(--border); }
  .status-pill.sending { color: var(--gold); border: 1px solid var(--gold-dim); animation: pulse 1s infinite; }
  .status-pill.sent    { color: var(--success); border: 1px solid #2d6b4a; }
  .status-pill.error   { color: var(--error); border: 1px solid #6b2d2d; }

  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

  /* ── Fields ── */
  .fields {
    border-bottom: 1px solid var(--border);
  }

  .field-row {
    display: flex;
    align-items: center;
    padding: 0 20px;
    border-bottom: 1px solid var(--border);
  }
  .field-row:last-child { border-bottom: none; }

  .field-label {
    font-size: 9px;
    letter-spacing: 0.3em;
    color: var(--muted);
    text-transform: uppercase;
    width: 52px;
    flex-shrink: 0;
  }

  .field-input {
    flex: 1;
    background: transparent;
    border: none;
    color: var(--text);
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    padding: 14px 0;
    outline: none;
    letter-spacing: 0.02em;
  }
  .field-input::placeholder { color: var(--muted); }
  .field-input:focus { color: #fff; }

  /* ── Toolbar ── */
  .toolbar {
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 8px 16px;
    border-bottom: 1px solid var(--border);
    background: #0d0d10;
    overflow-x: auto;
    scrollbar-width: none;
    flex-wrap: nowrap;
  }
  .toolbar::-webkit-scrollbar { display: none; }

  .t-btn {
    background: transparent;
    border: 1px solid transparent;
    color: var(--muted);
    border-radius: 3px;
    width: 32px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 13px;
    font-family: 'DM Mono', monospace;
    flex-shrink: 0;
    transition: all 0.15s;
    -webkit-user-select: none;
    user-select: none;
  }
  .t-btn:active, .t-btn.active {
    background: #c9a84c18;
    border-color: var(--gold-dim);
    color: var(--gold);
  }

  .t-divider {
    width: 1px;
    height: 18px;
    background: var(--border);
    flex-shrink: 0;
    margin: 0 4px;
  }

  .t-select {
    background: #0d0d10;
    border: 1px solid var(--border);
    color: var(--muted);
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    padding: 4px 6px;
    border-radius: 3px;
    flex-shrink: 0;
    outline: none;
    cursor: pointer;
    -webkit-appearance: none;
  }

  /* ── Editor ── */
  .editor-wrap {
    flex: 1;
    position: relative;
    min-height: 240px;
  }

  .editor {
    min-height: 240px;
    padding: 20px;
    color: var(--text);
    font-family: 'Crimson Pro', Georgia, serif;
    font-size: 16px;
    line-height: 1.8;
    outline: none;
    caret-color: var(--gold);
  }

  .editor:empty::before {
    content: attr(data-placeholder);
    color: var(--muted);
    pointer-events: none;
    font-style: italic;
  }

  /* ── Footer ── */
  .footer {
    padding: 14px 20px;
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    position: sticky;
    bottom: 0;
    background: var(--bg);
  }

  .error-msg {
    font-size: 11px;
    color: var(--error);
    flex: 1;
    letter-spacing: 0.03em;
  }

  .send-btn {
    background: linear-gradient(135deg, #c9a84c 0%, #8a6520 100%);
    border: none;
    color: #0a0a0b;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 16px;
    letter-spacing: 0.2em;
    padding: 11px 28px;
    border-radius: 2px;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.2s;
    -webkit-user-select: none;
    user-select: none;
  }
  .send-btn:active:not(:disabled) {
    transform: scale(0.97);
    opacity: 0.85;
  }
  .send-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  /* ── Toast ── */
  .toast {
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text);
    font-size: 12px;
    letter-spacing: 0.08em;
    padding: 10px 20px;
    border-radius: 3px;
    opacity: 0;
    transition: all 0.3s;
    pointer-events: none;
    white-space: nowrap;
    z-index: 100;
  }
  .toast.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  .toast.success { border-color: #2d6b4a; color: var(--success); }
  .toast.error   { border-color: #6b2d2d; color: var(--error); }

  /* ── Decoration ── */
  .corner-mark {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 120px;
    height: 120px;
    background: radial-gradient(circle at 100% 100%, #c9a84c08, transparent 70%);
    pointer-events: none;
  }
`;

export default function MailComposer() {
  const [to, setTo]           = useState('');
  const [subject, setSubject] = useState('');
  const [status, setStatus]   = useState('idle');
  const [toast, setToast]     = useState({ show: false, msg: '', type: '' });
  const editorRef = useRef(null);

  // Register SW for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  const exec = (cmd, val = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
  };

  const showToast = (msg, type) => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: '', type: '' }), 3200);
  };

  const handleSend = async () => {
    const message = editorRef.current?.innerHTML || '';
    const plainText = editorRef.current?.innerText?.trim() || '';

    if (!to.trim())       return showToast('Recipient required', 'error');
    if (!subject.trim())  return showToast('Subject required', 'error');
    if (!plainText)       return showToast('Message is empty', 'error');

    setStatus('sending');
    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: to.trim(), subject: subject.trim(), message }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Error ${res.status}`);

      setStatus('sent');
      setTo(''); setSubject('');
      if (editorRef.current) editorRef.current.innerHTML = '';
      showToast('Transmission sent ✓', 'success');
      setTimeout(() => setStatus('idle'), 4000);
    } catch (e) {
      setStatus('error');
      showToast(e.message, 'error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const statusLabel = { idle: 'Ready', sending: 'Transmitting', sent: 'Sent', error: 'Failed' };

  return (
    <>
      <style>{css}</style>
      <div className="app">

        {/* Header */}
        <header className="header">
          <div className="logo">
            <span className="logo-eyebrow">Operations Center</span>
            <span className="logo-name">MailOps</span>
          </div>
          <span className={`status-pill ${status}`}>{statusLabel[status]}</span>
        </header>

        {/* Fields */}
        <div className="fields">
          <div className="field-row">
            <span className="field-label">To</span>
            <input
              className="field-input"
              type="email"
              value={to}
              onChange={e => setTo(e.target.value)}
              placeholder="recipient@domain.com"
              autoComplete="email"
              inputMode="email"
            />
          </div>
          <div className="field-row">
            <span className="field-label">Subject</span>
            <input
              className="field-input"
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Message subject"
            />
          </div>
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          {TOOLBAR.map(({ cmd, label, style }) => (
            <button key={cmd} className="t-btn" style={style} onMouseDown={e => { e.preventDefault(); exec(cmd); }} title={cmd}>
              {label}
            </button>
          ))}

          <div className="t-divider" />

          {ALIGNS.map(({ cmd, label }) => (
            <button key={cmd} className="t-btn" onMouseDown={e => { e.preventDefault(); exec(cmd); }} title={cmd}>
              {label}
            </button>
          ))}

          <div className="t-divider" />

          <button className="t-btn" onMouseDown={e => { e.preventDefault(); exec('insertUnorderedList'); }} title="Bullet list">•≡</button>
          <button className="t-btn" onMouseDown={e => { e.preventDefault(); exec('insertOrderedList'); }} title="Numbered list">1≡</button>

          <div className="t-divider" />

          <select
            className="t-select"
            defaultValue="3"
            onChange={e => exec('fontSize', e.target.value)}
          >
            <option value="1">XS</option>
            <option value="2">SM</option>
            <option value="3">MD</option>
            <option value="4">LG</option>
            <option value="5">XL</option>
          </select>

          <div className="t-divider" />

          <button className="t-btn" onMouseDown={e => { e.preventDefault(); exec('removeFormat'); }} title="Clear format" style={{ fontSize: 11 }}>CLR</button>
        </div>

        {/* Editor */}
        <div className="editor-wrap">
          <div
            ref={editorRef}
            className="editor"
            contentEditable
            suppressContentEditableWarning
            data-placeholder="Compose your message..."
            spellCheck
          />
        </div>

        {/* Footer */}
        <footer className="footer">
          <div style={{ flex: 1 }} />
          <button
            className="send-btn"
            onClick={handleSend}
            disabled={status === 'sending'}
          >
            {status === 'sending' ? 'Sending...' : 'Transmit →'}
          </button>
        </footer>

      </div>

      {/* Toast */}
      <div className={`toast ${toast.show ? 'show' : ''} ${toast.type}`}>
        {toast.msg}
      </div>

      <div className="corner-mark" />
    </>
  );
}
