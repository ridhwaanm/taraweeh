import '@astrojs/internal-helpers/path';
import '@astrojs/internal-helpers/remote';
import { l as NOOP_MIDDLEWARE_HEADER, n as decodeKey } from './chunks/astro/server_VjCsmGoa.mjs';
import 'clsx';
import 'cookie';
import 'es-module-lexer';
import 'html-escaper';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

const codeToStatusMap = {
  // Implemented from IANA HTTP Status Code Registry
  // https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  CONTENT_TOO_LARGE: 413,
  URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  MISDIRECTED_REQUEST: 421,
  UNPROCESSABLE_CONTENT: 422,
  LOCKED: 423,
  FAILED_DEPENDENCY: 424,
  TOO_EARLY: 425,
  UPGRADE_REQUIRED: 426,
  PRECONDITION_REQUIRED: 428,
  TOO_MANY_REQUESTS: 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  VARIANT_ALSO_NEGOTIATES: 506,
  INSUFFICIENT_STORAGE: 507,
  LOOP_DETECTED: 508,
  NETWORK_AUTHENTICATION_REQUIRED: 511
};
Object.entries(codeToStatusMap).reduce(
  // reverse the key-value pairs
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///home/ridhwaanmayet/Documents/1_Projects/taraweeh/","cacheDir":"file:///home/ridhwaanmayet/Documents/1_Projects/taraweeh/node_modules/.astro/","outDir":"file:///home/ridhwaanmayet/Documents/1_Projects/taraweeh/dist/","srcDir":"file:///home/ridhwaanmayet/Documents/1_Projects/taraweeh/src/","publicDir":"file:///home/ridhwaanmayet/Documents/1_Projects/taraweeh/public/","buildClientDir":"file:///home/ridhwaanmayet/Documents/1_Projects/taraweeh/dist/","buildServerDir":"file:///home/ridhwaanmayet/Documents/1_Projects/taraweeh/.netlify/build/","adapterName":"@astrojs/netlify","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.Cy0RL60S.css"}],"routeData":{"route":"/admin/huffadh","isIndex":false,"type":"page","pattern":"^\\/admin\\/huffadh\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"huffadh","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/huffadh.astro","pathname":"/admin/huffadh","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.Cy0RL60S.css"}],"routeData":{"route":"/admin/login","isIndex":false,"type":"page","pattern":"^\\/admin\\/login\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/login.astro","pathname":"/admin/login","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.Cy0RL60S.css"}],"routeData":{"route":"/admin/recordings","isIndex":false,"type":"page","pattern":"^\\/admin\\/recordings\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"recordings","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/recordings.astro","pathname":"/admin/recordings","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.Cy0RL60S.css"}],"routeData":{"route":"/admin/venues","isIndex":false,"type":"page","pattern":"^\\/admin\\/venues\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"venues","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/venues.astro","pathname":"/admin/venues","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/admin","isIndex":true,"type":"page","pattern":"^\\/admin\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/index.astro","pathname":"/admin","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/admin/huffadh","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/huffadh\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"huffadh","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/huffadh.ts","pathname":"/api/admin/huffadh","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/admin/recordings","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/recordings\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"recordings","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/recordings.ts","pathname":"/api/admin/recordings","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/admin/soundcloud-fetch","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/soundcloud-fetch\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"soundcloud-fetch","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/soundcloud-fetch.ts","pathname":"/api/admin/soundcloud-fetch","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/admin/venues","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/venues\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"venues","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/venues.ts","pathname":"/api/admin/venues","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/admin/youtube-fetch","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/youtube-fetch\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"youtube-fetch","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/youtube-fetch.ts","pathname":"/api/admin/youtube-fetch","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/auth/[...all]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth(?:\\/(.*?))?\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"...all","dynamic":true,"spread":true}]],"params":["...all"],"component":"src/pages/api/auth/[...all].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.Cy0RL60S.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/home/ridhwaanmayet/Documents/1_Projects/taraweeh/src/pages/admin/huffadh.astro",{"propagation":"none","containsHead":true}],["/home/ridhwaanmayet/Documents/1_Projects/taraweeh/src/pages/admin/login.astro",{"propagation":"none","containsHead":true}],["/home/ridhwaanmayet/Documents/1_Projects/taraweeh/src/pages/admin/recordings.astro",{"propagation":"none","containsHead":true}],["/home/ridhwaanmayet/Documents/1_Projects/taraweeh/src/pages/admin/venues.astro",{"propagation":"none","containsHead":true}],["/home/ridhwaanmayet/Documents/1_Projects/taraweeh/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/admin/huffadh@_@astro":"pages/admin/huffadh.astro.mjs","\u0000@astro-page:src/pages/admin/login@_@astro":"pages/admin/login.astro.mjs","\u0000@astro-page:src/pages/admin/recordings@_@astro":"pages/admin/recordings.astro.mjs","\u0000@astro-page:src/pages/admin/venues@_@astro":"pages/admin/venues.astro.mjs","\u0000@astro-page:src/pages/admin/index@_@astro":"pages/admin.astro.mjs","\u0000@astro-page:src/pages/api/admin/huffadh@_@ts":"pages/api/admin/huffadh.astro.mjs","\u0000@astro-page:src/pages/api/admin/recordings@_@ts":"pages/api/admin/recordings.astro.mjs","\u0000@astro-page:src/pages/api/admin/soundcloud-fetch@_@ts":"pages/api/admin/soundcloud-fetch.astro.mjs","\u0000@astro-page:src/pages/api/admin/venues@_@ts":"pages/api/admin/venues.astro.mjs","\u0000@astro-page:src/pages/api/admin/youtube-fetch@_@ts":"pages/api/admin/youtube-fetch.astro.mjs","\u0000@astro-page:src/pages/api/auth/[...all]@_@ts":"pages/api/auth/_---all_.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_hOG0mFLt.mjs","/home/ridhwaanmayet/Documents/1_Projects/taraweeh/node_modules/unstorage/drivers/netlify-blobs.mjs":"chunks/netlify-blobs_DM36vZAS.mjs","/home/ridhwaanmayet/Documents/1_Projects/taraweeh/src/components/admin/AdminLayout":"_astro/AdminLayout.CmrtcjwS.js","/home/ridhwaanmayet/Documents/1_Projects/taraweeh/src/components/admin/RecordingsTable":"_astro/RecordingsTable.oFC-xLOr.js","/home/ridhwaanmayet/Documents/1_Projects/taraweeh/src/components/admin/VenuesTable":"_astro/VenuesTable.DWdpX_R-.js","/home/ridhwaanmayet/Documents/1_Projects/taraweeh/src/components/admin/HuffadhTable":"_astro/HuffadhTable.B1_UFUW6.js","/home/ridhwaanmayet/Documents/1_Projects/taraweeh/src/components/admin/LoginForm":"_astro/LoginForm.KqOhDjOK.js","/home/ridhwaanmayet/Documents/1_Projects/taraweeh/src/components/RecordingsPlayer":"_astro/RecordingsPlayer.DaoJ6uWI.js","@astrojs/react/client.js":"_astro/client.oq-E-Oyi.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/index.Cy0RL60S.css","/apple-touch-icon.png","/favicon-192x192.png","/favicon-32x32.png","/favicon.svg","/logo.png","/mstile-270x270.png","/_astro/AdminLayout.CmrtcjwS.js","/_astro/HuffadhTable.B1_UFUW6.js","/_astro/LoginForm.KqOhDjOK.js","/_astro/RecordingsPlayer.DaoJ6uWI.js","/_astro/RecordingsTable.oFC-xLOr.js","/_astro/VenuesTable.DWdpX_R-.js","/_astro/auth-client.Cwn5mxQH.js","/_astro/button.DZEvi3Pq.js","/_astro/client.oq-E-Oyi.js","/_astro/index.B45FT1uK.js","/_astro/index.BUuZr8oB.js","/_astro/input.Cul_lFX5.js","/_astro/jsx-runtime.D_zvdyIk.js","/_astro/label.D-RJS4w4.js","/_astro/portal.Bt2XXsn2.js"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"serverIslandNameMap":[],"key":"A0ANq/JRiH4bKLx1xFUC4ZSGIHZ4gRIiBxOIgqChI5M=","sessionConfig":{"driver":"netlify-blobs","options":{"name":"astro-sessions","consistency":"strong"}}});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = () => import('./chunks/netlify-blobs_DM36vZAS.mjs');

export { manifest };
