# SpaceX Portal - Complete Style Documentation

## Overview
This document contains all CSS style blocks extracted from the pages directory, organized by page for easy reference and reuse.

---

## Table of Contents
1. [Shared Styles (shared.css)](#shared-styles)
2. [Login Page Styles](#login-page-styles)
3. [Admin Panel Styles](#admin-panel-styles)
4. [User Portal Styles](#user-portal-styles)

---

## Shared Styles

### File: `pages/shared.css`

```css
/* ── Shared Theme Variables ── */
:root {
    --bg: #050505;
    --surface: #0f0f0f;
    --surface-hover: #141414;
    --card-black: rgba(8, 8, 8, 0.95);
    --border: rgba(255, 255, 255, 0.04);
    --border-bright: rgba(255, 255, 255, 0.08);
    --text: #ffffff;
    --muted: #a1a1aa;
    --accent: #ffffff;
    --success: #10b981;
    --pending: #f59e0b;
    --danger: #ef4444;
    --radius: 12px;
    --gold: #c5a059;
    --silver: #71717a;
}

html.light {
    --bg: #f2f2f2;
    --surface: #ffffff;
    --surface-hover: #f8f8f8;
    --card-black: rgba(255, 255, 255, 0.98);
    --border: rgba(0, 0, 0, 0.07);
    --border-bright: rgba(0, 0, 0, 0.14);
    --text: #0a0a0a;
    --muted: #6b7280;
    --accent: #0a0a0a;
}

/* ── Universal Reset ── */
*, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
    -webkit-font-smoothing: antialiased;
}

/* ── Shared Animations ── */
@keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
```

---

## Login Page Styles

### File: `pages/login.html` - `<style>` block

```css
body {
    font-family: 'Inter', -apple-system, sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 20px;
    line-height: 1.5;
}

/* ── Theme Toggle — exact match to user.html ── */
.theme-toggle {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    border: 1px solid var(--border-bright);
    background: rgba(255, 255, 255, 0.06);
    color: var(--muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    z-index: 200;
}
html.light .theme-toggle {
    background: rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.09);
}
.theme-toggle:hover { border-color: var(--border-bright); color: var(--text); }
.theme-toggle svg { width: 16px; height: 16px; }

/* ── Card — exact match to user.html profile-card ── */
.login-card {
    width: 90%;
    max-width: 420px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 28px;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.login-body {
    padding: 32px;
}

/* ── Logo ── */
.login-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 28px;
}
.login-logo img {
    height: 18px;
    filter: brightness(0) invert(1);
    transition: filter 0.3s;
}
html.light .login-logo img { filter: brightness(0); }
.login-logo .divider {
    width: 1px;
    height: 16px;
    background: var(--border-bright);
}
.login-logo .portal-label {
    font-size: 11px;
    font-weight: 700;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

/* ── Headings — match user.html heading style ── */
.step-heading { margin-bottom: 24px; }
.step-heading h2 {
    font-size: 24px;
    font-weight: 600;
    letter-spacing: -0.02em;
    margin-bottom: 6px;
    color: var(--text);
}
.step-heading p {
    font-size: 14px;
    color: var(--muted);
    line-height: 1.6;
}
.step-heading p strong {
    color: var(--text);
    font-weight: 600;
}

/* ── Form — match admin.html modal inputs ── */
.field { margin-bottom: 16px; }
.field label {
    display: block;
    font-size: 10px;
    font-weight: 700;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 8px;
}
.field input {
    width: 100%;
    padding: 12px 14px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    color: var(--text);
    font-family: 'Inter', -apple-system, sans-serif;
    font-size: 14px;
    font-weight: 400;
    outline: none;
    transition: border-color 0.2s;
    -webkit-appearance: none;
}
.field input::placeholder { color: #52525b; }
.field input:focus { border-color: rgba(255, 255, 255, 0.2); }
html.light .field input {
    background: rgba(0, 0, 0, 0.03);
    border-color: rgba(0, 0, 0, 0.10);
    color: var(--text);
}
html.light .field input::placeholder { color: #a1a1aa; }
html.light .field input:focus { border-color: rgba(0, 0, 0, 0.2); }

/* ── OTP Inputs ── */
.otp-group {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-bottom: 24px;
}
.otp-group input {
    width: 44px;
    height: 58px;
    flex: none;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    color: var(--text);
    font-family: 'JetBrains Mono', monospace;
    font-size: 24px;
    font-weight: 600;
    text-align: center;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    caret-color: transparent;
}
html.light .otp-group input {
    background: rgba(0, 0, 0, 0.03);
    border-color: rgba(0, 0, 0, 0.10);
}
.otp-group input:focus {
    border-color: var(--border-bright);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.04);
}
html.light .otp-group input:focus { box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05); }
.otp-group input.otp-filled { border-color: var(--border-bright); }
.otp-group input.otp-error {
    border-color: var(--danger) !important;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.08) !important;
}

/* ── Countdown ── */
.countdown-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
}
.countdown-label {
    font-size: 10px;
    font-weight: 700;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
}
.countdown-value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
    transition: color 0.3s;
}
.countdown-value.expiring { color: var(--danger); }

/* ── Messages ── */
.msg {
    font-size: 12px;
    font-weight: 600;
    text-align: center;
    margin-bottom: 14px;
    min-height: 18px;
    display: none;
    line-height: 1.5;
}
.msg.visible { display: block; }
.msg.error   { color: var(--danger); }
.msg.success { color: var(--success); }
.msg.info    { color: var(--muted); }

.resend-link { display: none; text-align: center; margin-bottom: 14px; }
.resend-link.visible { display: block; }
.resend-link a {
    font-size: 12px;
    font-weight: 600;
    color: var(--muted);
    text-decoration: underline;
    cursor: pointer;
    transition: color 0.2s;
}
.resend-link a:hover { color: var(--text); }

/* ── Buttons — exact match to user.html ── */
.btn {
    width: 100%;
    padding: 18px;
    border-radius: 14px;
    border: none;
    background: #ffffff;
    color: #000000;
    font-weight: 700;
    font-size: 15px;
    cursor: pointer;
    transition: 0.3s;
    letter-spacing: -0.01em;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}
.btn:hover:not(:disabled) { filter: brightness(0.9); transform: translateY(-1px); }
.btn:disabled { opacity: 0.3; cursor: not-allowed; transform: none; }

html.light .btn { background: #0a0a0a; color: #ffffff; }

.btn-secondary {
    background: transparent;
    color: var(--muted);
    border: 1px solid var(--border);
    margin-top: 12px;
}
html.light .btn-secondary { border-color: var(--border); }
.btn-secondary:hover:not(:disabled) { filter: none; transform: none; border-color: var(--border-bright); color: var(--text); }

.btn .loading-spinner {
    display: none;
    width: 16px; height: 16px;
    border: 2px solid rgba(0, 0, 0, 0.15);
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
}
.btn.is-loading .btn-text { display: none; }
.btn.is-loading .loading-spinner { display: inline-block; }

/* ── Divider — match user.html border style ── */
.separator {
    border: none;
    border-top: 1px solid var(--border);
    margin: 24px 0;
}

/* ── Step visibility ── */
.step { display: none; }
.step.active { display: block; }

/* ── Animations ── */
@keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Footer — match user.html section-label style ── */
.footer-note {
    text-align: center;
    font-size: 11px;
    color: #52525b;
    padding: 16px 32px 24px;
    border-top: 1px solid var(--border);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    font-weight: 700;
    font-family: 'JetBrains Mono', monospace;
}

/* ── Mobile ── */
@media (max-width: 480px) {
    body { padding: 16px; }
    .login-card { border-radius: 20px; }
    .login-body { padding: 24px 20px; }
    .login-logo { margin-bottom: 20px; }
    .step-heading { margin-bottom: 18px; }
    .step-heading h2 { font-size: 20px; }
    .otp-group { gap: 8px; margin-bottom: 18px; }
    .otp-group input { width: 40px; height: 54px; font-size: 18px; border-radius: 10px; }
    .btn { padding: 15px; font-size: 14px; }
    .footer-note { padding: 14px 20px 20px; }
    .theme-toggle { top: 12px; right: 12px; }
}

@media (max-width: 360px) {
    body { padding: 12px; }
    .login-body { padding: 20px 16px; }
    .otp-group { gap: 6px; }
    .otp-group input { width: 36px; height: 50px; font-size: 16px; }
}
```

---

## Admin Panel Styles

### File: `pages/hq-control-7x9k.html` - `<style>` block

```css
body {
    font-family: 'Inter', -apple-system, sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    line-height: 1.5;
}

/* ── Header ── */
.admin-header {
    background: #000;
    border-bottom: 1px solid var(--border);
    padding: 0 32px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
}

.admin-header-left {
    display: flex;
    align-items: center;
    gap: 16px;
}

.admin-badge {
    font-size: 9px;
    font-weight: 800;
    color: var(--danger);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    background: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.15);
    padding: 3px 10px;
    border-radius: 4px;
}

.header-status {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: #52525b;
    font-family: 'JetBrains Mono', monospace;
}

.header-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--success);
    animation: pulse-dot 2s infinite;
}

@keyframes pulse-dot {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
}

/* ── Main Layout ── */
.admin-main {
    max-width: 1100px;
    margin: 0 auto;
    padding: 40px 32px;
}

.page-title-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 32px;
    animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.page-title h1 {
    font-size: 28px;
    font-weight: 600;
    letter-spacing: -0.02em;
    margin-bottom: 4px;
}

.page-title p {
    font-size: 13px;
    color: #52525b;
}

.add-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    background: #fff;
    color: #000;
    border: none;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: -0.01em;
}

.add-btn:hover {
    filter: brightness(0.9);
    transform: translateY(-1px);
}

/* ── Stats Row ── */
.stats-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 28px;
    animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 20px 24px;
}

.stat-card .label {
    font-size: 10px;
    font-weight: 700;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 8px;
}

.stat-card .value {
    font-size: 22px;
    font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: -0.02em;
}

/* ── Table ── */
.table-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    overflow: hidden;
    animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border);
}

.table-header-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.table-header h3 {
    font-size: 14px;
    font-weight: 600;
}

.count-badge {
    font-size: 10px;
    font-weight: 700;
    color: var(--muted);
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border);
    padding: 3px 10px;
    border-radius: 6px;
    font-family: 'JetBrains Mono', monospace;
}

table {
    width: 100%;
    border-collapse: collapse;
}

thead th {
    font-size: 10px;
    font-weight: 700;
    color: #52525b;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 12px 20px;
    text-align: left;
    border-bottom: 1px solid var(--border);
}

/* ── Table Row Buttons ── */
.row-btn {
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.03em;
}

.row-btn-edit {
    background: transparent;
    color: #a1a1aa;
    border: 1px solid rgba(255,255,255,0.08);
}
.row-btn-edit:hover {
    border-color: rgba(255,255,255,0.2);
    color: #fff;
}

.row-btn-delete {
    background: transparent;
    color: #ef4444;
    border: 1px solid rgba(239,68,68,0.2);
}
.row-btn-delete:hover {
    border-color: rgba(239,68,68,0.5);
    background: rgba(239,68,68,0.05);
}

/* ── Modal ── */
.modal-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    z-index: 200;
    align-items: center;
    justify-content: center;
    padding: 20px;
    overflow-y: auto;
}

.modal {
    background: #111;
    border: 1px solid var(--border-bright);
    border-radius: 24px;
    padding: 32px;
    width: 100%;
    max-width: 480px;
    max-height: calc(100dvh - 40px);
    overflow-y: auto;
    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal h2 {
    font-size: 20px;
    font-weight: 600;
    letter-spacing: -0.02em;
    margin-bottom: 24px;
}

.form-group {
    margin-bottom: 16px;
}

.form-group label {
    display: block;
    font-size: 10px;
    font-weight: 700;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 8px;
}

.form-group input,
.form-group select {
    width: 100%;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    padding: 12px 14px;
    color: #fff;
    font-size: 14px;
    font-family: 'Inter', -apple-system, sans-serif;
    outline: none;
    transition: border-color 0.2s;
    -webkit-appearance: none;
}

.form-group input::placeholder { color: #52525b; }

.form-group input:focus,
.form-group select:focus {
    border-color: rgba(255,255,255,0.2);
}

.form-group select option {
    background: #111;
    color: #fff;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.modal-actions {
    display: flex;
    gap: 12px;
    margin-top: 24px;
}

.modal-btn {
    flex: 1;
    padding: 14px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: -0.01em;
}

.modal-btn-primary {
    background: #fff;
    color: #000;
    border: none;
}

.modal-btn-primary:hover { filter: brightness(0.9); }

.modal-btn-secondary {
    background: transparent;
    color: var(--muted);
    border: 1px solid var(--border-bright);
}

.modal-btn-secondary:hover {
    border-color: rgba(255,255,255,0.2);
    color: #fff;
}

.modal-error {
    color: var(--danger);
    font-size: 12px;
    margin-top: 12px;
    font-weight: 600;
    display: none;
}

/* ── Confirm Modal ── */
.confirm-modal {
    background: #111;
    border: 1px solid rgba(239,68,68,0.2);
    border-radius: 24px;
    padding: 32px;
    width: 100%;
    max-width: 380px;
    text-align: center;
    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.confirm-modal .icon-wrap {
    width: 48px;
    height: 48px;
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.15);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    color: var(--danger);
}

.confirm-modal h2 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
}

.confirm-modal p {
    font-size: 13px;
    color: var(--muted);
    margin-bottom: 24px;
    line-height: 1.6;
}

.confirm-actions {
    display: flex;
    gap: 10px;
}

.confirm-btn-danger {
    flex: 1;
    padding: 13px;
    border-radius: 10px;
    background: var(--danger);
    color: #fff;
    border: none;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
}

.confirm-btn-danger:hover { filter: brightness(1.1); }

.confirm-btn-cancel {
    flex: 1;
    padding: 13px;
    border-radius: 10px;
    background: transparent;
    color: var(--muted);
    border: 1px solid var(--border-bright);
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
}

.confirm-btn-cancel:hover { color: #fff; border-color: rgba(255,255,255,0.2); }

@media (max-width: 768px) {
    .admin-main { padding: 24px 16px; }
    .stats-row { grid-template-columns: repeat(2, 1fr); }
    .admin-header { padding: 0 16px; }
    .page-title-row { flex-direction: column; align-items: flex-start; gap: 16px; }
    .form-row { grid-template-columns: 1fr; }
    table { font-size: 13px; }
    .modal-overlay { align-items: flex-start; padding: 16px; }
    .modal { padding: 24px 20px; border-radius: 16px; max-height: none; }
    .modal-actions { position: sticky; bottom: 0; background: #111; padding-top: 16px; margin-top: 16px; }
}
```

---

## User Portal Styles

### File: `pages/user.html` - `<style>` block

```css
:root { --header-h: 72px; }

body {
    font-family: 'Inter', -apple-system, sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: calc(var(--header-h) + 20px) 20px 40px;
    line-height: 1.5;
}

/* ── Improved Header Layout ── */
.portal-header {
    position: fixed;
    top: 0; left: 0; right: 0;
    height: var(--header-h);
    background: rgba(5, 5, 5, 0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.header-content {
    width: 100%;
    max-width: 600px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
}

.brand-logo {
    height: 16px;
    filter: brightness(0) invert(1);
}

/* ── Dynamic Action Menu ── */
.action-menu {
    position: relative;
}

.menu-trigger {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: var(--surface);
    border: 1px solid var(--border-bright);
    color: var(--text);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 0.2s;
}

.dropdown-content {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background: #141414;
    border: 1px solid var(--border-bright);
    border-radius: 16px;
    width: 180px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    display: none;
    flex-direction: column;
    animation: slideIn 0.2s ease-out;
}

.dropdown-content.active { display: flex; }

.dropdown-item {
    padding: 14px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--muted);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: 0.2s;
    background: none;
    border: none;
    text-align: left;
    width: 100%;
}

.dropdown-item:hover {
    background: rgba(255,255,255,0.05);
    color: var(--text);
}

.dropdown-item i { width: 16px; height: 16px; }

@keyframes slideIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}

.portal-container { width: 100%; max-width: 600px; }

/* ── Improved Mobile-Ready Cards ── */
.profile-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 32px; /* Smoother Mobile Corners */
    overflow: hidden;
    margin-bottom: 24px;
    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
    animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.profile-cover {
    height: 140px;
    background: linear-gradient(to bottom, rgba(15,15,15,0) 0%, rgba(15,15,15,1) 100%),
                url('https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=800&q=80');
    background-size: cover;
    background-position: center;
    background-color: #0f0f0f;
}

.profile-content { padding: 0 24px 24px; margin-top: -48px; }

.avatar-wrap {
    position: relative;
    width: 88px; height: 88px;
    border-radius: 50%;
    background: var(--surface);
    padding: 4px;
    margin-bottom: 16px;
}

.avatar {
    width: 100%; height: 100%;
    border-radius: 50%;
    background: #1a1a1a;
    background-size: cover;
    background-position: center;
    border: 1px solid var(--border);
}

.status-indicator {
    position: absolute;
    bottom: 6px; right: 6px;
    width: 14px; height: 14px;
    background: var(--success);
    border: 3px solid var(--surface);
    border-radius: 50%;
    animation: pulse 2.5s infinite;
}

.profile-info h1 { font-size: 24px; font-weight: 600; letter-spacing: -0.02em; margin-bottom: 4px; }
.profile-info .subtitle { color: var(--muted); font-size: 14px; font-weight: 400; }
.profile-info .joined-date { color: #52525b; font-size: 12px; margin-top: 4px; font-weight: 500; }

.profile-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    border-top: 1px solid var(--border);
    padding-top: 24px;
    margin-top: 24px;
}

.stat-item span { display: block; font-size: 9px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; margin-bottom: 6px; }
.stat-item strong { font-size: 14px; font-family: 'JetBrains Mono', monospace; font-weight: 500; display: flex; align-items: center; gap: 6px; }

.section-label {
    font-size: 11px;
    font-weight: 700;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin: 40px 0 16px 4px;
}

.locked-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 32px;
}

.locked-card {
    background: var(--card-black);
    background-image: radial-gradient(circle at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 70%);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 24px;
    text-align: left;
    position: relative;
    transition: transform 0.2s cubic-bezier(0.33, 1, 0.68, 1);
    cursor: pointer;
    overflow: hidden;
}

.locked-card:active {
    transform: scale(0.98);
}

.locked-card .card-loader {
    position: absolute;
    inset: 0;
    background: rgba(5, 5, 5, 0.8);
    backdrop-filter: blur(4px);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 10;
}

.locked-card.is-loading .card-loader { display: flex; }

.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
}

.cdn-logo {
    height: 24px;
    object-fit: contain;
    opacity: 0.8;
    margin: 0;
}

.lock-status {
    font-size: 10px;
    font-weight: 800;
    color: var(--pending);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    display: flex;
    align-items: center;
    gap: 6px;
}

.locked-card h4 { 
    font-size: 17px; 
    color: rgba(255, 255, 255, 0.95);
    margin-bottom: 8px; 
    font-weight: 600;
}

.locked-card p { 
    font-size: 13px; 
    color: #71717a; 
    line-height: 1.5; 
}

.vip-badge-mini {
    display: inline-block; 
    padding: 4px 12px; 
    background: rgba(255, 255, 255, 0.03); 
    color: #a1a1aa;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 8px; 
    font-size: 10px; 
    font-weight: 700; 
    margin-top: 16px;
    text-transform: uppercase;
}

/* ── Membership Tiers ── */
.tier-header { margin-bottom: 24px; }
.tier-header h2 { font-size: 24px; font-weight: 600; letter-spacing: -0.02em; margin-bottom: 8px; }
.tier-header p { font-size: 14px; color: var(--muted); line-height: 1.6; }

.plan-item {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    margin-bottom: 16px;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    overflow: hidden;
    cursor: pointer;
}

.plan-item.explorer { opacity: 0.85; }
.plan-item.pioneer { border-color: rgba(255,255,255,0.1); }
.plan-item.vanguard { 
    background: linear-gradient(145deg, #121212, #0a0a0a);
    box-shadow: 0 0 40px rgba(197, 160, 89, 0.03);
}
.vanguard .plan-name { color: #fff; text-shadow: 0 0 15px rgba(255,255,255,0.2); }

.plan-item.selected {
    border-color: var(--accent);
    background: rgba(255,255,255,0.02);
    box-shadow: 0 0 30px rgba(255,255,255,0.08);
    transform: scale(1.02);
}

.plan-item.selected.vanguard {
    border-color: var(--gold);
    box-shadow: 0 0 40px rgba(197, 160, 89, 0.15);
}

.selection-label {
    position: absolute;
    top: 20px; right: 24px;
    font-size: 10px; font-weight: 800;
    text-transform: uppercase; letter-spacing: 0.1em;
    color: var(--success);
    display: none;
    align-items: center; gap: 4px;
}
.plan-item.selected .selection-label { display: flex; }

.plan-main-content { padding: 32px 24px; }

.plan-meta { display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px; }
.plan-name { font-weight: 700; font-size: 20px; letter-spacing: -0.02em; }

.price-container { display: flex; align-items: baseline; gap: 6px; margin-top: 4px; }
.plan-price { font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 600; color: #fff; }
.price-sub { font-size: 11px; color: var(--muted); font-weight: 500; }

.access-hint {
    font-size: 9px; font-weight: 800;
    color: var(--muted); text-transform: uppercase;
    letter-spacing: 0.05em; background: rgba(255,255,255,0.05);
    padding: 3px 8px; border-radius: 4px; width: fit-content;
    margin-top: 8px;
}

.plan-desc { font-size: 13px; color: var(--muted); font-weight: 400; margin-top: 12px; line-height: 1.5; }

.plan-details {
    max-height: 0;
    overflow: hidden;
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    background: rgba(0, 0, 0, 0.2);
}

.plan-item.expanded .plan-details { max-height: 600px; padding-bottom: 32px; border-top: 1px solid var(--border); }

.feature-list { list-style: none; padding: 24px 24px 0; }
.feature-list li { 
    font-size: 12px; 
    color: var(--muted); 
    margin-bottom: 10px; 
    display: flex; 
    gap: 12px; 
    line-height: 1.4; 
}
.feature-list li::before { content: "•"; color: rgba(255,255,255,0.3); }

.loading-spinner {
    display: none;
    width: 18px; height: 18px;
    border: 2px solid rgba(0,0,0,0.1);
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

.is-loading .btn-text { display: none; }
.is-loading .loading-spinner { display: inline-block; }

.btn {
    width: 100%; padding: 18px; border-radius: 14px; border: none;
    background: #ffffff; color: #000000; font-weight: 700; font-size: 15px;
    cursor: pointer; transition: 0.3s; letter-spacing: -0.01em;
    display: flex; align-items: center; justify-content: center; gap: 10px;
}

.btn:hover { filter: brightness(0.9); transform: translateY(-1px); }
.btn:disabled { opacity: 0.3; cursor: not-allowed; }

.btn-secondary { background: transparent; color: var(--muted); border: 1px solid var(--border); margin-top: 12px; }

/* ── Teams Button Style ── */
.teams-btn {
    background: #5b5fc7;
    color: #ffffff;
    padding: 16px;
    border-radius: 14px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
    border: none;
    width: 100%;
    margin-top: 24px;
    transition: 0.2s;
}
.teams-btn:hover { background: #4e52b1; }

.progress-container {
    width: 100%; height: 6px; background: rgba(255,255,255,0.05);
    border-radius: 10px; margin: 30px 0; overflow: hidden;
}
.progress-bar {
    width: 0%; height: 100%; background: #fff;
    transition: width 5s linear;
}

.payment-summary {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 24px;
    margin-bottom: 24px;
}
.payment-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }
.payment-row span:first-child { color: var(--muted); }
.payment-row strong { font-family: 'JetBrains Mono', monospace; display: flex; align-items: center; gap: 6px; }

@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }

.animate-spin-slow { animation: spin-slow 2s linear infinite; }

.screen { display: none; }
.screen.active { display: block; }

/* ── Light Theme (page-specific overrides) ── */
html.light .portal-header { background: rgba(242, 242, 242, 0.8); }
html.light .brand-logo { filter: brightness(0); }
html.light .dropdown-content { background: #fff; border-color: var(--border-bright); }
html.light .dropdown-item:hover { background: rgba(0,0,0,0.04); }
html.light .btn { background: #0a0a0a; color: #ffffff; }

@media (max-width: 480px) {
    .profile-card { border-radius: 24px; }
    .locked-card { border-radius: 20px; }
    .profile-info h1 { font-size: 20px; }
    .plan-name { font-size: 17px; }
}
```

---

## Summary

This documentation compiles all CSS from the SpaceX Portal pages directory including:

- **Theme variables** with dark/light mode support
- **Component styles** for headers, cards, forms, modals, and tables
- **Interactive elements** including buttons, dropdowns, and loading states
- **Animations** for smooth transitions and visual feedback
- **Responsive design** with mobile-first media queries
- **Accessibility considerations** with proper contrast and focus states

All styles use a consistent design system with shared CSS variables defined in `shared.css`.
