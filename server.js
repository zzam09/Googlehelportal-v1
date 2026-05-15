
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, onSnapshot, updateDoc, doc, limit } from 'firebase/firestore';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Firebase Config
const firebaseConfig = {
    apiKey:            process.env.VITE_FIREBASE_API_KEY,
    authDomain:        process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId:         process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket:     process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId:             process.env.VITE_FIREBASE_APP_ID,
};

const fbApp = initializeApp(firebaseConfig);
const db = getFirestore(fbApp);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Load welcome template helper
async function sendWelcomeEmail(name, email, docId) {
    console.log(`[Email Service] Attempting to send welcome email to ${email}`);
    try {
        const { getEmailTemplate } = await import(`file://${path.join(__dirname, 'api', 'email-template.js')}`);
        
        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        if (!RESEND_API_KEY) {
            console.error('[Email Service] RESEND_API_KEY missing');
            return;
        }

        const html = getEmailTemplate({
            title: `Welcome to the Fleet, ${name || 'Space Voyager'}`,
            mainMessage: "Access granted. Your [SpaceX/Tesla] Member Portal is now online. Use it to schedule your next private meeting, find local meetups, or access exclusive member documents and more.",
            buttonText: "ACCESS PORTAL",
            buttonUrl: "https://spacexmembership-5cdc3.firebaseapp.com/pages/login.html"
        });

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'SpaceX Operations <onboarding@resend.dev>',
                to: [email],
                subject: 'Welcome to the SpaceX Fleet',
                html: html,
            }),
        });

        if (response.ok) {
            console.log(`[Email Service] Email sent successfully to ${email}`);
            await updateDoc(doc(db, 'members', docId), { welcomeEmailSent: true });
        } else {
            const err = await response.json();
            console.error('[Email Service] Resend error:', err);
        }
    } catch (error) {
        console.error('[Email Service] Error:', error);
    }
}

// Watch for new members in Firestore
console.log('[Firestore Service] Starting member watch...');
const membersCol = collection(db, 'members');
// We listen for any member where welcomeEmailSent is false or missing
// Note: onSnapshot will trigger for existing docs too, so we'll catch anyone who hasn't been emailed yet.
onSnapshot(membersCol, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
        if (change.type === "added" || change.type === "modified") {
            const m = change.doc.data();
            if (m.email && !m.welcomeEmailSent && m.status === 'ACTIVE') {
                 sendWelcomeEmail(m.name, m.email, change.doc.id);
            }
        }
    });
});

// API Route: Send Welcome Email Manual Trigger
app.post('/api/send-welcome-email', async (req, res) => {
    try {
        const handlerPath = path.join(__dirname, 'api', 'send-welcome-email', 'index.js');
        if (fs.existsSync(handlerPath)) {
            const { default: handler } = await import(`file://${handlerPath}`);
            return handler(req, res);
        } else {
            return res.status(404).json({ error: 'API handler not found' });
        }
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// For development: Proxy or serve static
// In this platform, we usually run the dev server or serve build.
// If we are in "dev" mode, we might want to leverage Vite's middleware.
// But for the sake of working "out of the box" in both:

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
} else {
    // In dev, usually Vite runs on 3000. 
    // If we want both, we can use vite as middleware.
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'custom',
    });
    app.use(vite.middlewares);
    
    app.use('*', async (req, res, next) => {
        const url = req.originalUrl;
        try {
            let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
            template = await vite.transformIndexHtml(url, template);
            res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        } catch (e) {
            vite.ssrFixStacktrace(e);
            next(e);
        }
    });
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
