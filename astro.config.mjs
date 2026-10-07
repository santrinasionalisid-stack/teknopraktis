import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://teknopraktis.my.id',
  build: {
    inlineStylesheets: 'always'
  }
});
