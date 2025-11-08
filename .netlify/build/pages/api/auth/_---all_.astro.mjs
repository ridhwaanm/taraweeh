import { g as getAuth } from '../../../chunks/auth_BTFUhMOl.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const ALL = async (context) => {
  const auth = getAuth();
  return auth.handler(context.request);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ALL,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
