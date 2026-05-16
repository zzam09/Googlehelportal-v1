import { useState, useRef, useEffect, useCallback } from 'react';

// ─── SpaceX Email Template (mirrors your api/email-template.js) ───────────────
function buildEmailHTML({ title, mainMessage, buttonText, buttonUrl, heroImage }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="color-scheme" content="light dark">
  <title>${title}</title>
  <style>
    html,body{margin:0 auto!important;padding:0!important;height:100%!important;width:100%!important}
    *{-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;box-sizing:border-box}
    table,td{mso-table-lspace:0pt!important;mso-table-rspace:0pt!important}
    img{-ms-interpolation-mode:bicubic;max-width:100%;height:auto;display:block}
    .heading-technical{font-family:'Arial Black',sans-serif;text-transform:uppercase;letter-spacing:2px}
    .body-technical{font-family:'Helvetica Neue',Helvetica,Arial,sans-serif}
    .bg-main{background-color:#ffffff!important}
    .text-primary{color:#000000!important}
    .text-secondary{color:#555555!important}
    .border-accent{border:1px solid #000000!important}
    .btn-bg{background-color:#000000!important}
    .btn-text{color:#ffffff!important}
    @media(prefers-color-scheme:dark){
      .bg-main{background-color:#000000!important}
      .text-primary{color:#ffffff!important}
      .text-secondary{color:#86868B!important}
      .border-accent{border:1px solid #ffffff!important}
      .btn-bg{background-color:#ffffff!important}
      .btn-text{color:#000000!important}
    }
    @media screen and (max-width:600px){
      .email-container{width:100%!important}
      .mobile-padding{padding-left:20px!important;padding-right:20px!important}
    }
  </style>
</head>
<body class="bg-main" style="margin:0;padding:0!important;">
  <center class="bg-main" style="width:100%;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="email-container bg-main" style="margin:0 auto;">
      <tr>
        <td style="padding:40px;" class="mobile-padding">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td align="left" class="heading-technical text-primary" style="font-size:20px;font-weight:900;">SPACEX</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:0 40px;" class="mobile-padding">
          <img src="${heroImage}" width="520" alt="SpaceX Mission" style="width:100%;border:0;" />
        </td>
      </tr>
      <tr>
        <td style="padding:40px;" class="mobile-padding">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td class="heading-technical text-primary" style="font-size:24px;font-weight:bold;padding-bottom:16px;">${title}</td>
            </tr>
            <tr>
              <td class="body-technical text-secondary" style="font-size:15px;line-height:24px;padding-bottom:32px;">${mainMessage}</td>
            </tr>
            <tr>
              <td align="left">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td class="btn-bg border-accent" style="padding:14px 30px;text-align:center;">
                      <a href="${buttonUrl}" class="heading-technical btn-text" style="font-size:12px;font-weight:bold;text-decoration:none;">${buttonText}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:60px 40px 40px 40px;border-top:1px solid #333333;" class="mobile-padding">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td class="heading-technical text-secondary" style="font-size:11px;padding-bottom:12px;" align="center">© 2026 SPACEX. ALL RIGHTS RESERVED.</td>
            </tr>
            <tr>
              <td class="heading-technical" style="font-size:11px;padding-bottom:12px;" align="center">
                <a href="#" class="text-primary" style="text-decoration:none;">UNSUBSCRIBE</a>
                <span style="padding:0 8px;color:#555555;">•</span>
                <a href="#" class="text-primary" style="text-decoration:none;">PRIVACY</a>
              </td>
            </tr>
            <tr>
              <td class="heading-technical" style="font-size:11px;color:#555555;" align="center">HAWTHORNE, CALIFORNIA</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>`;
}

// ─── Built-in Templates ────────────────────────────────────────────────────────
const TEMPLATES = [
  {
    id: 'blank',
    label: '✦ Blank',
    subject: '',
    title: '',
    message: '',
    buttonText: 'LEARN MORE',
    buttonUrl: '#',
    heroImage: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'welcome',
    label: '🚀 Welcome',
    subject: 'Welcome to the Fleet',
    title: 'Welcome to the Fleet, {name}',
    message: 'Access granted. Your SpaceX Member Portal is now online. Use it to schedule your next private meeting, find local meetups, or access exclusive member documents.',
    buttonText: 'ACCESS PORTAL',
    buttonUrl: 'https://spacexmembership-5cdc3.firebaseapp.com/pages/login.html',
    heroImage: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'event',
    label: '📅 Event Invitation',
    subject: 'You\'re Invited — Private Event',
    title: 'Exclusive Event Invitation',
    message: 'You have been selected for an exclusive private event. This is a closed gathering for verified members only. Please confirm your attendance using the link below.',
    buttonText: 'CONFIRM ATTENDANCE',
    buttonUrl: '#',
    heroImage: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'announcement',
    label: '📢 Announcement',
    subject: 'Mission Update',
    title: 'Mission Update',
    message: 'We have an important update to share with all verified members. Please review the details below and take any necessary action.',
    buttonText: 'VIEW UPDATE',
    buttonUrl: '#',
    heroImage: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'followup',
    label: '🔁 Follow-up',
    subject: 'Following Up — Action Required',
    title: 'Action Required',
    message: 'This is a follow-up regarding your recent application. We need you to complete a few remaining steps to finalize your membership status.',
    buttonText: 'COMPLETE NOW',
    buttonUrl: '#',
    heroImage: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=1200&q=80',
  },
];

// ─── Draft Storage (localStorage as JSON) ─────────────────────────────────────
const DRAFT_KEY = 'mailops_drafts';

function loadDrafts() {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]');
  } catch { return []; }
}

function saveDrafts(drafts) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts));
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@300;400;500&display=swap');

  :root {
    --background: oklch(0.14 0 0);
    --foreground: oklch(0.99 0 0);
    --card: oklch(0.20 0 0);
    --card-foreground: oklch(0.99 0 0);
    --primary: oklch(0.92 0 0);
    --primary-foreground: oklch(0.20 0 0);
    --secondary: oklch(0.27 0 0);
    --secondary-foreground: oklch(0.99 0 0);
    --muted: oklch(0.27 0 0);
    --muted-foreground: oklch(0.71 0 0);
    --border: oklch(1.00 0 0 / 10%);
    --input: oklch(1.00 0 0 / 15%);
    --ring: oklch(0.56 0 0);
    --destructive: oklch(0.70 0.19 22.23);
    --radius: 0.625rem;
    --gold: #c9a84c;
    --gold-dim: oklch(1.00 0 0 / 20%);
    --font: 'Geist Mono', 'Courier New', monospace;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

  body {
    background: var(--background);
    color: var(--foreground);
    font-family: var(--font);
    min-height: 100dvh;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
  }

  /* ── Layout ── */
  .app { display: flex; flex-direction: column; min-height: 100dvh; max-width: 680px; margin: 0 auto; }

  /* ── Header ── */
  .header {
    position: sticky; top: 0; z-index: 20;
    background: var(--background);
    border-bottom: 1px solid var(--border);
    padding: 14px 16px;
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
  }
  .header-brand { display: flex; flex-direction: column; gap: 1px; }
  .header-eyebrow { font-size: 9px; letter-spacing: 0.3em; color: var(--muted-foreground); text-transform: uppercase; }
  .header-title { font-size: 18px; font-weight: 500; letter-spacing: 0.15em; color: var(--gold); text-transform: uppercase; }
  .header-actions { display: flex; align-items: center; gap: 8px; }

  /* ── Tabs ── */
  .tabs { display: flex; border-bottom: 1px solid var(--border); background: var(--background); position: sticky; top: 57px; z-index: 19; }
  .tab {
    flex: 1; padding: 11px 8px; font-family: var(--font); font-size: 11px; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--muted-foreground); background: transparent;
    border: none; cursor: pointer; border-bottom: 2px solid transparent;
    transition: all 0.15s; display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .tab.active { color: var(--foreground); border-bottom-color: var(--gold); }
  .tab:hover:not(.active) { color: var(--foreground); }

  /* ── Content ── */
  .content { flex: 1; padding: 16px; display: flex; flex-direction: column; gap: 12px; }

  /* ── Card ── */
  .card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: var(--radius); overflow: hidden;
  }
  .card-section { padding: 14px 16px; border-bottom: 1px solid var(--border); }
  .card-section:last-child { border-bottom: none; }

  /* ── Label ── */
  .label { font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--muted-foreground); margin-bottom: 6px; display: block; }

  /* ── Input ── */
  .input {
    width: 100%; background: var(--input); border: 1px solid var(--border);
    border-radius: calc(var(--radius) - 2px); color: var(--foreground);
    font-family: var(--font); font-size: 13px; padding: 10px 12px;
    outline: none; transition: border-color 0.15s;
  }
  .input:focus { border-color: var(--ring); }
  .input::placeholder { color: var(--muted-foreground); }

  /* ── Textarea ── */
  .textarea {
    width: 100%; background: var(--input); border: 1px solid var(--border);
    border-radius: calc(var(--radius) - 2px); color: var(--foreground);
    font-family: var(--font); font-size: 13px; padding: 10px 12px;
    outline: none; transition: border-color 0.15s; resize: vertical;
    min-height: 140px; line-height: 1.7;
  }
  .textarea:focus { border-color: var(--ring); }
  .textarea::placeholder { color: var(--muted-foreground); }

  /* ── Select ── */
  .select {
    width: 100%; background: var(--input); border: 1px solid var(--border);
    border-radius: calc(var(--radius) - 2px); color: var(--foreground);
    font-family: var(--font); font-size: 13px; padding: 10px 12px;
    outline: none; cursor: pointer; -webkit-appearance: none; appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 12px center;
    padding-right: 36px;
  }
  .select:focus { border-color: var(--ring); }

  /* ── Buttons ── */
  .btn {
    font-family: var(--font); font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;
    border-radius: calc(var(--radius) - 2px); border: none; cursor: pointer;
    transition: all 0.15s; display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    padding: 10px 16px; white-space: nowrap;
  }
  .btn-primary {
    background: var(--primary); color: var(--primary-foreground);
    font-weight: 500;
  }
  .btn-primary:active { opacity: 0.85; transform: scale(0.98); }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  .btn-secondary {
    background: var(--secondary); color: var(--secondary-foreground);
    border: 1px solid var(--border);
  }
  .btn-secondary:active { opacity: 0.75; }

  .btn-ghost {
    background: transparent; color: var(--muted-foreground);
    border: 1px solid transparent; padding: 8px 12px;
  }
  .btn-ghost:hover { color: var(--foreground); border-color: var(--border); }

  .btn-danger {
    background: transparent; color: var(--destructive);
    border: 1px solid transparent; padding: 8px 10px; font-size: 10px;
  }
  .btn-danger:hover { border-color: var(--destructive); }

  .btn-gold {
    background: linear-gradient(135deg, #c9a84c, #8a6520);
    color: #0a0a0b; font-weight: 600;
    box-shadow: 0 0 20px oklch(0.65 0.15 85 / 20%);
  }
  .btn-gold:active:not(:disabled) { transform: scale(0.97); }
  .btn-gold:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  /* ── Footer bar ── */
  .footer-bar {
    position: sticky; bottom: 0; background: var(--background);
    border-top: 1px solid var(--border);
    padding: 12px 16px; display: flex; align-items: center;
    justify-content: space-between; gap: 10px;
    padding-bottom: max(12px, env(safe-area-inset-bottom));
  }

  /* ── Status badge ── */
  .badge {
    font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase;
    padding: 4px 10px; border-radius: 2px; border: 1px solid var(--border);
    color: var(--muted-foreground);
  }
  .badge.sending { color: var(--gold); border-color: #c9a84c44; animation: blink 1s infinite; }
  .badge.sent { color: oklch(0.70 0.16 160); border-color: oklch(0.70 0.16 160 / 30%); }
  .badge.error { color: var(--destructive); border-color: oklch(0.70 0.19 22 / 30%); }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.4} }

  /* ── Draft list ── */
  .draft-item {
    padding: 14px 16px; border-bottom: 1px solid var(--border); cursor: pointer;
    transition: background 0.1s; display: flex; align-items: flex-start; gap: 10px;
  }
  .draft-item:last-child { border-bottom: none; }
  .draft-item:hover { background: var(--secondary); }
  .draft-meta { flex: 1; min-width: 0; }
  .draft-subject { font-size: 13px; color: var(--foreground); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 3px; }
  .draft-to { font-size: 11px; color: var(--muted-foreground); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .draft-date { font-size: 10px; color: var(--muted-foreground); flex-shrink: 0; }
  .draft-empty { padding: 40px 16px; text-align: center; color: var(--muted-foreground); font-size: 12px; letter-spacing: 0.1em; }

  /* ── Preview ── */
  .preview-frame {
    width: 100%; border: none; border-radius: calc(var(--radius) - 2px);
    background: #fff; min-height: 400px;
  }

  /* ── Toast ── */
  .toast {
    position: fixed; bottom: 80px; left: 50%;
    transform: translateX(-50%) translateY(16px);
    background: var(--card); border: 1px solid var(--border);
    color: var(--foreground); font-size: 11px; letter-spacing: 0.08em;
    padding: 10px 18px; border-radius: var(--radius);
    opacity: 0; transition: all 0.25s; pointer-events: none;
    white-space: nowrap; z-index: 999;
  }
  .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
  .toast.success { color: oklch(0.70 0.16 160); border-color: oklch(0.70 0.16 160 / 30%); }
  .toast.error { color: var(--destructive); border-color: oklch(0.70 0.19 22 / 30%); }

  /* ── Row utils ── */
  .row { display: flex; gap: 8px; align-items: center; }
  .row-between { display: flex; gap: 8px; align-items: center; justify-content: space-between; }

  /* ── Preview toggle ── */
  .preview-toggle { width: 100%; padding: 10px 16px; background: var(--secondary); border: none; border-top: 1px solid var(--border); color: var(--muted-foreground); font-family: var(--font); font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; transition: color 0.15s; }
  .preview-toggle:hover { color: var(--foreground); }
`;

// ─── Main Component ────────────────────────────────────────────────────────────
export default function MailComposer() {
  const [tab, setTab] = useState('compose');
  const [drafts, setDrafts] = useState(loadDrafts);

  // Compose fields
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [buttonText, setButtonText] = useState('LEARN MORE');
  const [buttonUrl, setButtonUrl] = useState('#');
  const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=1200&q=80');
  const [showPreview, setShowPreview] = useState(false);
  const [editingDraftId, setEditingDraftId] = useState(null);

  const [status, setStatus] = useState('idle');
  const [toast, setToast] = useState({ show: false, msg: '', type: '' });

  const iframeRef = useRef(null);

  const showToast = (msg, type = 'default') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };

  // Apply template
  const applyTemplate = (id) => {
    const t = TEMPLATES.find(t => t.id === id);
    if (!t) return;
    setSubject(t.subject);
    setTitle(t.title);
    setMessage(t.message);
    setButtonText(t.buttonText);
    setButtonUrl(t.buttonUrl);
    setHeroImage(t.heroImage);
  };

  // Preview HTML
  const previewHTML = buildEmailHTML({ title, mainMessage: message, buttonText, buttonUrl, heroImage });

  useEffect(() => {
    if (showPreview && iframeRef.current) {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (doc) { doc.open(); doc.write(previewHTML); doc.close(); }
    }
  }, [showPreview, previewHTML]);

  // Save draft
  const saveDraft = () => {
    const draft = {
      id: editingDraftId || Date.now().toString(),
      to, subject, title, message, buttonText, buttonUrl, heroImage,
      savedAt: new Date().toISOString(),
    };
    const updated = editingDraftId
      ? drafts.map(d => d.id === editingDraftId ? draft : d)
      : [draft, ...drafts];
    setDrafts(updated);
    saveDrafts(updated);
    setEditingDraftId(draft.id);
    showToast('Draft saved', 'success');
  };

  // Load draft
  const loadDraft = (draft) => {
    setTo(draft.to); setSubject(draft.subject); setTitle(draft.title);
    setMessage(draft.message); setButtonText(draft.buttonText);
    setButtonUrl(draft.buttonUrl); setHeroImage(draft.heroImage);
    setEditingDraftId(draft.id);
    setTab('compose');
    showToast('Draft loaded');
  };

  // Delete draft
  const deleteDraft = (id, e) => {
    e.stopPropagation();
    const updated = drafts.filter(d => d.id !== id);
    setDrafts(updated);
    saveDrafts(updated);
    if (editingDraftId === id) setEditingDraftId(null);
    showToast('Draft deleted');
  };

  // Clear form
  const clearForm = () => {
    setTo(''); setSubject(''); setTitle(''); setMessage('');
    setButtonText('LEARN MORE'); setButtonUrl('#');
    setHeroImage('https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=1200&q=80');
    setEditingDraftId(null); setShowPreview(false);
  };

  // Send
  const handleSend = async () => {
    if (!to.trim()) return showToast('Recipient required', 'error');
    if (!subject.trim()) return showToast('Subject required', 'error');
    if (!message.trim()) return showToast('Message body required', 'error');

    setStatus('sending');
    try {
      const html = buildEmailHTML({ title, mainMessage: message, buttonText, buttonUrl, heroImage });
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: to.trim(), subject: subject.trim(), message: html }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
      setStatus('sent');
      showToast('Transmission sent ✓', 'success');
      // Remove from drafts if it was a draft
      if (editingDraftId) {
        const updated = drafts.filter(d => d.id !== editingDraftId);
        setDrafts(updated); saveDrafts(updated);
      }
      clearForm();
      setTimeout(() => setStatus('idle'), 4000);
    } catch (e) {
      setStatus('error');
      showToast(e.message, 'error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const statusLabel = { idle: 'Ready', sending: 'Sending...', sent: 'Sent ✓', error: 'Failed' };
  const statusClass = { idle: '', sending: 'sending', sent: 'sent', error: 'error' };

  return (
    <>
      <style>{css}</style>
      <div className="app">

        {/* Header */}
        <header className="header">
          <div className="header-brand">
            <span className="header-eyebrow">Operations</span>
            <span className="header-title">MailOps</span>
          </div>
          <div className="header-actions">
            <span className={`badge ${statusClass[status]}`}>{statusLabel[status]}</span>
            <button className="btn btn-ghost" onClick={clearForm} title="New message">+ New</button>
          </div>
        </header>

        {/* Tabs */}
        <nav className="tabs">
          <button className={`tab ${tab === 'compose' ? 'active' : ''}`} onClick={() => setTab('compose')}>
            ✦ Compose {editingDraftId ? '•' : ''}
          </button>
          <button className={`tab ${tab === 'drafts' ? 'active' : ''}`} onClick={() => setTab('drafts')}>
            ◫ Drafts {drafts.length > 0 ? `(${drafts.length})` : ''}
          </button>
          <button className={`tab ${tab === 'preview' ? 'active' : ''}`} onClick={() => { setTab('preview'); setShowPreview(true); }}>
            ◎ Preview
          </button>
        </nav>

        {/* ── Compose Tab ── */}
        {tab === 'compose' && (
          <>
            <div className="content">

              {/* Template picker */}
              <div className="card">
                <div className="card-section">
                  <label className="label">Template</label>
                  <select className="select" onChange={e => applyTemplate(e.target.value)} defaultValue="blank">
                    {TEMPLATES.map(t => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Recipients */}
              <div className="card">
                <div className="card-section">
                  <label className="label">To</label>
                  <input className="input" type="email" value={to} onChange={e => setTo(e.target.value)} placeholder="recipient@domain.com" inputMode="email" autoComplete="email" />
                </div>
                <div className="card-section">
                  <label className="label">Subject</label>
                  <input className="input" type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Email subject line" />
                </div>
              </div>

              {/* Content */}
              <div className="card">
                <div className="card-section">
                  <label className="label">Email Title</label>
                  <input className="input" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Displayed as heading in email" />
                </div>
                <div className="card-section">
                  <label className="label">Message Body</label>
                  <textarea className="textarea" value={message} onChange={e => setMessage(e.target.value)} placeholder="Write your message here..." rows={6} />
                </div>
              </div>

              {/* Button */}
              <div className="card">
                <div className="card-section">
                  <label className="label">Call-to-Action Button</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input className="input" type="text" value={buttonText} onChange={e => setButtonText(e.target.value)} placeholder="Button text" style={{ flex: 1 }} />
                    <input className="input" type="url" value={buttonUrl} onChange={e => setButtonUrl(e.target.value)} placeholder="https://..." style={{ flex: 2 }} />
                  </div>
                </div>
                <div className="card-section">
                  <label className="label">Hero Image URL</label>
                  <input className="input" type="url" value={heroImage} onChange={e => setHeroImage(e.target.value)} placeholder="https://..." />
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="footer-bar">
              <button className="btn btn-secondary" onClick={saveDraft}>◫ Save Draft</button>
              <button className="btn btn-gold" onClick={handleSend} disabled={status === 'sending'}>
                {status === 'sending' ? 'Transmitting...' : 'Transmit →'}
              </button>
            </div>
          </>
        )}

        {/* ── Drafts Tab ── */}
        {tab === 'drafts' && (
          <div className="content" style={{ padding: 0 }}>
            <div className="card" style={{ margin: 16 }}>
              {drafts.length === 0 ? (
                <div className="draft-empty">No drafts saved yet</div>
              ) : (
                drafts.map(draft => (
                  <div key={draft.id} className="draft-item" onClick={() => loadDraft(draft)}>
                    <div className="draft-meta">
                      <div className="draft-subject">{draft.subject || '(No subject)'}</div>
                      <div className="draft-to">To: {draft.to || '—'}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                      <span className="draft-date">
                        {new Date(draft.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <button className="btn btn-danger" onClick={e => deleteDraft(draft.id, e)}>✕</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── Preview Tab ── */}
        {tab === 'preview' && (
          <div className="content">
            <div className="card">
              <div className="card-section">
                <div className="row-between" style={{ marginBottom: 0 }}>
                  <span className="label" style={{ marginBottom: 0 }}>Live Preview — SpaceX Theme</span>
                  <span style={{ fontSize: 10, color: 'var(--muted-foreground)', letterSpacing: '0.1em' }}>
                    {subject || '(no subject)'}
                  </span>
                </div>
              </div>
              <iframe
                ref={iframeRef}
                className="preview-frame"
                title="Email Preview"
                sandbox="allow-same-origin"
                style={{ height: 500 }}
              />
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setTab('compose')}>
              ← Back to Compose
            </button>
          </div>
        )}

      </div>

      {/* Toast */}
      <div className={`toast ${toast.show ? 'show' : ''} ${toast.type}`}>{toast.msg}</div>
    </>
  );
}
