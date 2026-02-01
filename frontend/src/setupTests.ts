Object.defineProperty(globalThis, 'import', {
  value: { meta: { env: { VITE_API_URL: 'http://localhost:3333/api' } } },
  writable: true,
});

import '@testing-library/jest-dom';
