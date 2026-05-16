import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { glob } from 'glob';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const port = Number(process.env.PORT || 3000);
    const basePath = process.env.BASE_PATH || '/';

    const input = {
        main: path.resolve(import.meta.dirname, 'index.html'),
        ...Object.fromEntries(
            glob
                .sync('pages/**/*.html', { cwd: import.meta.dirname })
                .map(file => [
                    file.replace(/\.html$/, ''),
                    path.resolve(import.meta.dirname, file),
                ])
        ),
    };

    return {
        base: basePath,
        root: path.resolve(import.meta.dirname),
        plugins: [react()],
        define: {
            'import.meta.env.VITE_FIREBASE_API_KEY':            JSON.stringify((env.VITE_FIREBASE_API_KEY            || process.env.VITE_FIREBASE_API_KEY            || "").trim()),
            'import.meta.env.VITE_FIREBASE_AUTH_DOMAIN':        JSON.stringify((env.VITE_FIREBASE_AUTH_DOMAIN        || process.env.VITE_FIREBASE_AUTH_DOMAIN        || "").trim()),
            'import.meta.env.VITE_FIREBASE_PROJECT_ID':         JSON.stringify((env.VITE_FIREBASE_PROJECT_ID         || process.env.VITE_FIREBASE_PROJECT_ID         || "").trim()),
            'import.meta.env.VITE_FIREBASE_STORAGE_BUCKET':     JSON.stringify((env.VITE_FIREBASE_STORAGE_BUCKET     || process.env.VITE_FIREBASE_STORAGE_BUCKET     || "").trim()),
            'import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID':JSON.stringify((env.VITE_FIREBASE_MESSAGING_SENDER_ID|| process.env.VITE_FIREBASE_MESSAGING_SENDER_ID|| "").trim()),
            'import.meta.env.VITE_FIREBASE_APP_ID':             JSON.stringify((env.VITE_FIREBASE_APP_ID             || process.env.VITE_FIREBASE_APP_ID             || "").trim()),
        },
        build: {
            outDir: path.resolve(import.meta.dirname, 'dist'),
            emptyOutDir: true,
            rollupOptions: { input },
        },
        server: {
            port,
            strictPort: true,
            host: '0.0.0.0',
            allowedHosts: true,
        },
        preview: { port, host: '0.0.0.0' },
    };
});
