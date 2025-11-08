import { renderers } from './renderers.mjs';
import { s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CvSoi7hX.mjs';
import { manifest } from './manifest_BPKj8FZd.mjs';
import { createExports } from '@astrojs/netlify/ssr-function.js';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin/huffadh.astro.mjs');
const _page2 = () => import('./pages/admin/login.astro.mjs');
const _page3 = () => import('./pages/admin/recordings.astro.mjs');
const _page4 = () => import('./pages/admin/venues.astro.mjs');
const _page5 = () => import('./pages/admin.astro.mjs');
const _page6 = () => import('./pages/api/admin/huffadh.astro.mjs');
const _page7 = () => import('./pages/api/admin/recordings.astro.mjs');
const _page8 = () => import('./pages/api/admin/soundcloud-fetch.astro.mjs');
const _page9 = () => import('./pages/api/admin/venues.astro.mjs');
const _page10 = () => import('./pages/api/admin/youtube-fetch.astro.mjs');
const _page11 = () => import('./pages/api/auth/_---all_.astro.mjs');
const _page12 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/admin/huffadh.astro", _page1],
    ["src/pages/admin/login.astro", _page2],
    ["src/pages/admin/recordings.astro", _page3],
    ["src/pages/admin/venues.astro", _page4],
    ["src/pages/admin/index.astro", _page5],
    ["src/pages/api/admin/huffadh.ts", _page6],
    ["src/pages/api/admin/recordings.ts", _page7],
    ["src/pages/api/admin/soundcloud-fetch.ts", _page8],
    ["src/pages/api/admin/venues.ts", _page9],
    ["src/pages/api/admin/youtube-fetch.ts", _page10],
    ["src/pages/api/auth/[...all].ts", _page11],
    ["src/pages/index.astro", _page12]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "ff1a58f7-c411-4881-b011-9db2be472819"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
