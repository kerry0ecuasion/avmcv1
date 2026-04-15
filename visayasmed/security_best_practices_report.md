# Security Best Practices Report — VisayasMed Hospital Web App

**Stack:** React 18 + TypeScript, Vite, Firebase (Auth, Firestore, Storage), Firebase Hosting
**Date:** 2026-02-20
**References:** OWASP Cheat Sheet Series, React Security Spec, General JS/TS Frontend Security Spec

---

## Executive Summary

The VisayasMed Hospital web application contains two **Critical** findings that should be remediated before any public deployment: hardcoded Firebase project credentials in source code, and an admin login page that publicly discloses the admin email address, an example password, and Firebase project internals. Additionally, the legacy `AuthContext` provides a trivially-bypassed client-side admin gate that any user can defeat from the browser console. Several medium and low findings round out the report, primarily relating to missing security headers, session token storage, and missing link protections.

---

## Critical Findings

### F-001 · REACT-CONFIG-001 · Hardcoded Firebase Credentials as Source-Code Fallbacks

- **Severity:** Critical
- **Location:** `src/firebase.ts`, lines 8–13
- **Impact:** Production Firebase API key, Auth domain, project ID, storage bucket, messaging sender ID, and app ID are hardcoded as `||` fallback literals. These values are baked into every production JS bundle, visible to anyone who opens DevTools or views page source. An attacker can use these to enumerate the project, attempt unauthorized Firestore/Storage operations (if Security Rules are misconfigured), or target the project with abuse requests.

**Evidence:**
```
apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBe7J_hf7ydhet-j9nHtqR3PB_ZCLoe5k8",
authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "visayasmed-82274.firebaseapp.com",
projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "visayasmed-82274",
...
appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:728337782027:web:02aed14260460c00513e0e",
```

**Fix:** Remove all hardcoded fallback values. The `VITE_*` environment variables are the correct mechanism; if they are missing at build time, the app should fail to start rather than silently use committed credentials. Ensure the `.env` file (with real values) is in `.gitignore` and never committed.

**Mitigation:** Regardless of this fix, ensure Firebase Security Rules for Firestore and Storage are tightly scoped so that unauthenticated access is blocked and authenticated access is limited to the minimum necessary.

---

### F-002 · SEC-INFO-001 · Admin Login Page Publicly Discloses Credentials and Project Details

- **Severity:** Critical
- **Location:** `src/components/AdminLogin.tsx`, lines 92–107
- **Impact:** Any visitor to `/admin/login` is shown: the admin email address (`admin@visayasmed.com`), an example password (`Admin@123`), and the Firebase project ID (`visayasmed-82274`). This provides an attacker with the username, a likely default password, and project context — a complete recipe for a targeted credential attack. Even if the password was changed, the email disclosure remains and aids phishing and credential stuffing.

**Evidence:**
```html
<li>Enter Email: <code>admin@visayasmed.com</code></li>
<li>Set a password (e.g., Admin@123)</li>
...
<p>Make sure you're in the correct Firebase project (visayasmed-82274)</p>
```

**Fix:** Remove the entire setup instructions block from `AdminLogin.tsx`. Move this guidance to a private internal document (e.g., a password-protected wiki or private README). The login page should show only the login form and a minimal error state.

---

## High Findings

### F-003 · REACT-AUTHZ-001 · `AuthContext` Uses Trivially Bypassed `localStorage` Flag

- **Severity:** High
- **Location:** `src/contexts/AuthContext.tsx` (lines 15, 19–22); `src/components/ProtectedRoute.tsx` (lines 9–14)
- **Impact:** `AuthContext.login()` requires no credentials — it simply calls `localStorage.setItem('isAdmin', 'true')`. Any user can run this one-liner from the browser console to satisfy `ProtectedRoute`'s check. While `App.tsx` currently routes admin pages through `ProtectedAdminRoute` (Firebase-backed), `ProtectedRoute` exists and uses this weak context. A future developer could accidentally use `ProtectedRoute` for an admin feature, resulting in a trivially broken access control.

**Evidence:**
```ts
// AuthContext.tsx
const login = () => {
  setIsAdmin(true);
  localStorage.setItem('isAdmin', 'true');  // no credential check
};

// ProtectedRoute.tsx
const { isAdmin } = useAuth();
if (!isAdmin) return <Navigate to="/" replace />;
```

**Fix:** Remove `AuthContext.tsx` and `ProtectedRoute.tsx` entirely, or clearly mark them as non-security UI helpers with a comment. All admin route protection must go through `ProtectedAdminRoute` (Firebase Auth). The `AuthProvider` wrapper in `App.tsx` should also be removed if `AuthContext` serves no purpose.

---

### F-004 · SEC-ENUM-001 · Verbose Auth Errors Enable Admin Account Enumeration

- **Severity:** High
- **Location:** `src/components/AdminLogin.tsx`, lines 25–28
- **Impact:** Distinct error messages for `auth/user-not-found` ("User not found") vs `auth/wrong-password` ("Incorrect password") tell an attacker whether a given email address has a registered account. This simplifies targeted attacks against the admin login.

**Evidence:**
```ts
if (err.code === 'auth/user-not-found') {
  errorMessage = 'User not found. Please check your email or create an account in Firebase.';
} else if (err.code === 'auth/wrong-password') {
  errorMessage = 'Incorrect password. Please try again.';
}
```

**Fix:** Collapse both conditions into a single generic message:
```ts
if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
  errorMessage = 'Invalid email or password.';
}
```

---

## Medium Findings

### F-005 · REACT-AUTH-001 · Admin Firebase Token Stored in `localStorage` via `browserLocalPersistence`

- **Severity:** Medium
- **Location:** `src/contexts/AdminAuthContext.tsx`, line 26
- **Impact:** `setPersistence(auth, browserLocalPersistence)` causes Firebase to persist the admin's ID token and refresh token in `localStorage`. Any XSS vulnerability (now or in the future) could allow an attacker to exfiltrate the admin session token and impersonate the admin. Admin sessions benefit from a shorter lifetime.

**Evidence:**
```ts
await setPersistence(auth, browserLocalPersistence);
```

**Fix:** Switch to `browserSessionPersistence` so the admin session is tied to the browser tab/window and does not survive a page refresh or new tab, limiting token lifetime:
```ts
import { browserSessionPersistence } from 'firebase/auth';
await setPersistence(auth, browserSessionPersistence);
```
If "stay logged in" is required, implement it with explicit opt-in and document the tradeoff.

---

### F-006 · REACT-CSP-001 · No Content Security Policy Configured

- **Severity:** Medium
- **Location:** `index.html` (no CSP meta tag); `firebase.json` (no `headers` section)
- **Impact:** Without a CSP, any XSS vulnerability has maximum impact — injected scripts execute without restriction, can exfiltrate data to arbitrary origins, and can load additional malicious payloads. Firebase Hosting supports response header configuration.

**Fix:** Add security headers to `firebase.json` hosting configuration:
```json
"headers": [
  {
    "source": "**",
    "headers": [
      { "key": "X-Content-Type-Options", "value": "nosniff" },
      { "key": "X-Frame-Options", "value": "DENY" },
      { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
      {
        "key": "Content-Security-Policy",
        "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.cloudfunctions.net; img-src 'self' data: https: blob:; frame-src https://www.google.com;"
      }
    ]
  }
]
```
Note: `unsafe-inline` is required for the inline theme script in `index.html` (see F-009) until that is refactored.

---

### F-007 · REACT-HEADERS-001 · No Security Headers in Firebase Hosting Config

- **Severity:** Medium
- **Location:** `firebase.json`
- **Impact:** Without `X-Content-Type-Options`, `X-Frame-Options`, and `Referrer-Policy`, the app is exposed to MIME-sniffing attacks, clickjacking, and referrer leakage. These are baseline hardening headers.

**Fix:** Covered by F-006 fix above (adding a `headers` block to `firebase.json`).

---

## Low Findings

### F-008 · JS-TABNAB-001 · `target="_blank"` Links Missing `rel="noopener noreferrer"`

- **Severity:** Low
- **Location:**
  - `src/components/StreetViewStatic.tsx`, lines 43, 84
  - `src/components/StreetViewEmbed.tsx`, line 49
  - `src/components/ChatbotFloat.tsx`, line 7
  - `src/components/Home.tsx`, line 191
- **Impact:** Without `rel="noopener noreferrer"`, a new tab opened via `target="_blank"` can access `window.opener` and redirect the originating tab to a phishing page (reverse tabnabbing). This is particularly relevant for external links.

**Fix:** Add `rel="noopener noreferrer"` to all `target="_blank"` anchor tags. Example:
```tsx
<a href={url} target="_blank" rel="noopener noreferrer">...</a>
```

---

### F-009 · JS-CSP-002 · Inline Script in `index.html` Blocks Strict CSP Adoption

- **Severity:** Low
- **Location:** `index.html`, lines 11–21
- **Impact:** The inline theme-initialization script (`<script>(function() { ... })()</script>`) requires `unsafe-inline` in any CSP `script-src` directive, which significantly weakens CSP's value against XSS. It prevents adopting a strict nonce-based policy.

**Evidence:**
```html
<script>
  (function() {
    const theme = localStorage.getItem('theme');
    ...
  })();
</script>
```

**Fix (long-term):** Move the inline script to an external file (e.g., `public/theme-init.js`) and reference it via `<script src="/theme-init.js">`. This allows removing `unsafe-inline` from `script-src` in the CSP.

**Fix (short-term):** Add a CSP hash for this exact script block so the CSP allows only this specific inline script. Calculate the SHA-256 hash of the script content and use it in the CSP: `script-src 'self' 'sha256-<hash>'`.

---

### F-010 · JS-SRI-001 · Google Fonts Loaded from CDN Without Subresource Integrity

- **Severity:** Low
- **Location:** `index.html`, lines 7–10
- **Impact:** Google Fonts CSS is loaded from `fonts.googleapis.com` without an `integrity` attribute. If the CDN were compromised or the font CSS were manipulated, malicious CSS could be delivered to users. This is a low-likelihood but non-zero risk.

**Evidence:**
```html
<link href="https://fonts.googleapis.com/css2?family=Archivo...&display=swap" rel="stylesheet">
```

**Fix:** Self-host the font files (download from Google Fonts and serve from `public/fonts/`) to eliminate the external dependency entirely. This also improves performance and privacy (no cross-origin font requests).

---

## Summary Table

| ID    | Severity | Title                                                              | File(s)                                |
|-------|----------|--------------------------------------------------------------------|----------------------------------------|
| F-001 | Critical | Hardcoded Firebase credentials in source code                      | `src/firebase.ts`                      |
| F-002 | Critical | Admin login exposes admin email, example password, project ID      | `src/components/AdminLogin.tsx`        |
| F-003 | High     | `AuthContext` uses trivially bypassed `localStorage` admin flag    | `src/contexts/AuthContext.tsx`, `src/components/ProtectedRoute.tsx` |
| F-004 | High     | Verbose auth errors enable account enumeration                     | `src/components/AdminLogin.tsx`        |
| F-005 | Medium   | Admin Firebase token stored in `localStorage`                      | `src/contexts/AdminAuthContext.tsx`    |
| F-006 | Medium   | No Content Security Policy configured                              | `index.html`, `firebase.json`          |
| F-007 | Medium   | No security headers in Firebase Hosting config                     | `firebase.json`                        |
| F-008 | Low      | `target="_blank"` links missing `rel="noopener noreferrer"`        | Multiple components                    |
| F-009 | Low      | Inline script blocks strict CSP adoption                           | `index.html`                           |
| F-010 | Low      | Google Fonts loaded from CDN without SRI                           | `index.html`                           |

---

*Report written by Verdent Security Best Practices skill. Findings are based on static source analysis; runtime behavior and Firebase Security Rules configuration were not inspected.*
