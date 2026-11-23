// @ts-check
import { defineConfig } from 'astro/config';

// כשהמאגר ב-GitHub ייפתח, לעדכן כאן:
//   site – הכתובת של החשבון, למשל https://<שם-החשבון>.github.io
//   base – שם המאגר, למשל /bekeshev-lakezev
export default defineConfig({
  site: 'https://tompachter-hub.github.io',
  base: '/bekeshev-lakezev',
  trailingSlash: 'ignore',
});
