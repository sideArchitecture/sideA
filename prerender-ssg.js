// prerender-ssg.js
const fs = require('fs');
const path = require('path');
const https = require('https');

const OUTPUT_DIR = path.join(__dirname, 'docs');
const BASE_INDEX_PATH = path.join(OUTPUT_DIR, 'index.html');
const MANIFEST_URL = 'https://sidearchitecture.github.io/sideAImages/images/projects/manifest.json';
const BASE_DOMAIN = 'https://sidea.co.in';
const DEFAULT_IMAGE = 'https://sidearchitecture.github.io/sideAImages/images/projects/01-featured/HOSPITALITY-001-ADALI-RESORT/cover.jpg';

function fetchRemoteManifest(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          console.warn('⚠️ Could not parse remote manifest JSON, using fallback data.');
          resolve([]);
        }
      });
    }).on('error', (err) => {
      console.warn('⚠️ Network error fetching manifest for SSG:', err.message);
      resolve([]);
    });
  });
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function generateHtml(templateHtml, meta) {
  let html = templateHtml;

  // Title
  if (meta.title) {
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(meta.title)}</title>`);
  }

  // Helper to replace or inject meta tags
  const setMeta = (attrName, attrValue, content) => {
    const escapedContent = escapeHtml(content);
    const regex = new RegExp(`<meta\\s+${attrName}=["']${attrValue}["'][^>]*>`, 'i');
    const newTag = `<meta ${attrName}="${attrValue}" content="${escapedContent}">`;
    if (regex.test(html)) {
      html = html.replace(regex, newTag);
    } else {
      html = html.replace('</head>', `  ${newTag}\n</head>`);
    }
  };

  if (meta.description) {
    setMeta('name', 'description', meta.description);
    setMeta('property', 'og:description', meta.description);
    setMeta('name', 'twitter:description', meta.description);
  }

  if (meta.title) {
    setMeta('property', 'og:title', meta.title);
    setMeta('name', 'twitter:title', meta.title);
  }

  if (meta.image) {
    setMeta('property', 'og:image', meta.image);
    setMeta('name', 'twitter:image', meta.image);
  }

  if (meta.url) {
    setMeta('property', 'og:url', meta.url);
    setMeta('name', 'twitter:url', meta.url);
  }

  if (meta.ogType) {
    setMeta('property', 'og:type', meta.ogType);
  }

  return html;
}

function writeStaticPage(targetPath, content) {
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(targetPath, content, 'utf8');
}

async function runSSG() {
  console.log('🚀 Starting Static Site Generation (SSG) pre-renderer...');

  if (!fs.existsSync(BASE_INDEX_PATH)) {
    console.error(`❌ Base index.html not found at ${BASE_INDEX_PATH}. Please run 'ng build' first.`);
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(BASE_INDEX_PATH, 'utf8');

  // 1. Pre-render About Page
  const aboutHtml = generateHtml(baseHtml, {
    title: 'About SIDE A | Studio I Deal Architecture',
    description: 'Storytelling through responsive architecture, minimalism with precision, and spatial design led by Principal Architect Ar. Vijay Kumar D (SPA Delhi).',
    image: DEFAULT_IMAGE,
    url: `${BASE_DOMAIN}/about`,
    ogType: 'website'
  });
  writeStaticPage(path.join(OUTPUT_DIR, 'about', 'index.html'), aboutHtml);
  console.log('✅ Generated static route: /about');

  // 2. Pre-render Projects List Page
  const projectsHtml = generateHtml(baseHtml, {
    title: 'Selected Works & Portfolio | SIDE A Architecture',
    description: 'Explore architectural and spatial design works across residential, commercial, institutional, and hospitality sectors by SIDE A.',
    image: DEFAULT_IMAGE,
    url: `${BASE_DOMAIN}/projects`,
    ogType: 'website'
  });
  writeStaticPage(path.join(OUTPUT_DIR, 'projects', 'index.html'), projectsHtml);
  console.log('✅ Generated static route: /projects');

  // 3. Pre-render Individual Project Pages for Social Media Sharing
  const manifest = await fetchRemoteManifest(MANIFEST_URL);
  console.log(`📦 Fetched ${manifest.length} projects for static pre-rendering.`);

  let count = 0;
  for (const project of manifest) {
    const slug = project.slug || project.id;
    const slugHex = project.slugHex;
    const title = `${project.title || slug} | SIDE A Architecture`;
    const description =
      project.description ||
      project.notes ||
      `Architectural work in ${project.location || 'India'} (${project.year || ''}) designed by Studio I Deal Architecture (SIDE A).`;
    const image = project.coverImage || project.imageUrl || DEFAULT_IMAGE;
    const url = `${BASE_DOMAIN}/projects/${slug}`;

    const projectHtml = generateHtml(baseHtml, {
      title,
      description,
      image,
      url,
      ogType: 'article'
    });

    if (slug) {
      writeStaticPage(path.join(OUTPUT_DIR, 'projects', slug, 'index.html'), projectHtml);
      count++;
    }

    if (slugHex && slugHex !== slug) {
      writeStaticPage(path.join(OUTPUT_DIR, 'projects', slugHex, 'index.html'), projectHtml);
      count++;
    }
  }

  // 4. Create 404.html fallback for GitHub Pages SPA
  fs.writeFileSync(path.join(OUTPUT_DIR, '404.html'), baseHtml, 'utf8');
  console.log('✅ Created GitHub Pages SPA fallback: /404.html');

  console.log(`🎉 SSG Pre-rendering completed successfully! Generated ${count} project routes.`);
}

runSSG();
