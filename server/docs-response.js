import { demoRelease, sections } from './docs-content.js';

const jsonHeaders = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
let checkedRelease;
let refreshAfter = 0;

export function docsAvailable(env, now = Date.now()) {
  if (env.RAMISA_DOCS_ENABLED && env.RAMISA_DOCS_ENABLED !== 'true') return false;
  const start = env.RAMISA_DOCS_START ? Date.parse(env.RAMISA_DOCS_START) : -Infinity;
  const end = env.RAMISA_DOCS_END ? Date.parse(env.RAMISA_DOCS_END) : Infinity;
  return now >= start && now < end;
}

async function releaseStatus() {
  if (Date.now() < refreshAfter) return checkedRelease;
  try {
    const response = await fetch('https://api.github.com/repos/black-hathacker-gg/Ramisa/releases/tags/v1.0-demo', {
      headers: { Accept: 'application/vnd.github+json' },
      signal: AbortSignal.timeout(2500),
    });
    if (!response.ok) throw new Error('GitHub release lookup failed');
    const release = await response.json();
    checkedRelease = {
      tag: release.tag_name,
      publishedAt: release.published_at,
      apkAvailable: Array.isArray(release.assets) && release.assets.some((asset) =>
        asset.state === 'uploaded' && asset.name === 'RAMISA-handoff-test.apk'),
      checkedAt: new Date().toISOString(),
    };
    refreshAfter = Date.now() + 300_000;
    return checkedRelease;
  } catch {
    refreshAfter = Date.now() + 30_000;
    return checkedRelease;
  }
}

export async function getDocsResponse(method, env = process.env) {
  if (method !== 'GET') return { status: 405, headers: { ...jsonHeaders, Allow: 'GET' }, body: {} };
  if (!docsAvailable(env)) return { status: 404, headers: jsonHeaders, body: {} };
  let videoUrl = '/docs-assets/ramisa-demo.mp4';
  try {
    const candidate = new URL(env.RAMISA_DOCS_VIDEO_URL ?? '');
    if (candidate.protocol === 'https:') videoUrl = candidate.href;
  } catch {
    // Use the bundled demo when no external video is configured.
  }
  return {
    status: 200, headers: jsonHeaders,
    body: { sections, demoRelease, videoUrl, release: await releaseStatus() },
  };
}
