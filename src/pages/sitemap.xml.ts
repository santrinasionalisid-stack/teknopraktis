import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../data/site';
export const prerender=true;
const esc=(value:string)=>value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
export const GET:APIRoute=async()=>{const articles=await getCollection('articles',({data})=>!data.draft);const categories=[...new Set(articles.map((a)=>a.data.categorySlug))];const staticUrls=['/','/artikel/','/tentang/',
    '/redaksi/','/kontak/','/kebijakan-privasi/','/disclaimer/','/pedoman-redaksi/'];const urls=[...staticUrls.map((path)=>({loc:`${SITE.url}${path}`})),...categories.map((slug)=>({loc:`${SITE.url}/kategori/${slug}/`})),...articles.map((article)=>({loc:`${SITE.url}/artikel/${article.data.slug}/`,lastmod:(article.data.updatedAt??article.data.publishedAt).toISOString()}))];const body=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(({loc,lastmod})=>`  <url><loc>${esc(loc)}</loc>${lastmod?`<lastmod>${lastmod}</lastmod>`:''}</url>`).join('\n')}\n</urlset>`;return new Response(body,{headers:{'Content-Type':'application/xml; charset=utf-8'}});};
