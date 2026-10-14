import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Sandbox-only overrides, gated on BASE44_PREVIEW_MODE === '1'.
 * Outside the preview these settings are absent and Vite keeps its defaults.
 *
 * - allowedHosts: the preview proxy forwards Host: <port>-<sandbox id>.<sandbox host domain>.
 *   The sandbox id rotates, so we allow the whole subdomain wildcard.
 *   (Vite also appends __VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS, which the platform sets.)
 * - hmr: the preview is served over HTTPS on port 443, so the HMR socket must be wss on 443.
 * - watch.usePolling: the source arrives through a bind mount; polling makes reloads reliable.
 */
const isPreview = process.env.BASE44_PREVIEW_MODE === '1';
const sandboxHost = process.env.BASE44_SANDBOX_HOST_DOMAIN;

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    ...(isPreview && sandboxHost ? { allowedHosts: [`.${sandboxHost}`] } : {}),
    ...(isPreview ? { hmr: { protocol: 'wss', clientPort: 443 } } : {}),
    ...(isPreview ? { watch: { usePolling: true, interval: 300 } } : {}),
  },
});
