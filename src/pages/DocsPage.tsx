import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUpRight, FileDown, Github, Search } from 'lucide-react';
import './docs.css';

type DocSection = {
  id: string;
  title: string;
  items: [title: string, detail: string, image?: string][];
  flow?: string[];
};

type Documentation = {
  sections: DocSection[];
  demoRelease: string;
  videoUrl?: string;
  release?: { tag: string; publishedAt: string; apkAvailable: boolean; checkedAt: string };
};

function downloadMarkdown(docs: Documentation) {
  const sections = docs.sections.map(({ title, items, flow }) => [
    '## ' + title,
    flow?.join(' → '),
    ...items.map(([heading, description]) => '### ' + heading + '\n\n' + description),
  ].filter(Boolean).join('\n\n'));
  const markdown = ['# RAMISA', '[Android demo](' + docs.demoRelease + ')', ...sections].join('\n\n');
  const url = URL.createObjectURL(new Blob([markdown], { type: 'text/markdown;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'ramisa-docs.md';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function DocsPage() {
  const [docs, setDocs] = useState<Documentation | null>(null);
  const [status, setStatus] = useState<'loading' | 'missing' | 'error' | 'ready'>('loading');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    document.title = 'RAMISA | Project documentation';
    async function loadDocs() {
      try {
        const response = await fetch('/api/docs', { signal: controller.signal });
        if (response.status === 404) {
          setStatus('missing');
          return;
        }
        if (!response.ok) throw new Error('Documentation request failed');
        setDocs(await response.json());
        setStatus('ready');
      } catch {
        if (!controller.signal.aborted) setStatus('error');
      }
    }
    void loadDocs();
    return () => {
      controller.abort();
      document.title = 'RAMISA | Safety for Women & Children';
    };
  }, []);

  useEffect(() => {
    if (status !== 'ready' || !location.hash) return;
    document.getElementById(location.hash.slice(1))?.scrollIntoView();
  }, [status]);

  if (!docs || status !== 'ready') {
    return <div className="landing-wrap docs-empty" role="status"><h1>
      {status === 'missing' ? 'Documentation is not available' : status === 'error' ? 'Documentation could not load' : 'Loading documentation…'}
    </h1>{status === 'error' && <button type="button" onClick={() => location.reload()}>Try again</button>}</div>;
  }

  const query = search.trim().toLowerCase();
  const sections = docs.sections.filter((section) =>
    [section.title, ...(section.flow ?? []), ...section.items.flat()].join(' ').toLowerCase().includes(query));

  return (
    <div className="ramisa-docs">
      <section className="landing-wrap docs-hero">
        <div className="docs-hero-copy">
          <p className="docs-kicker">RAMISA PROJECT DOCUMENTATION</p>
          <h1>Personal safety, within reach.</h1>
          <p>A Bangla and English Android prototype that helps people prepare for unsafe situations and reach trusted contacts. Threat Guard runs audio AI on the phone and leaves the SOS decision with the user.</p>
          <div className="docs-actions">
            <a className="landing-button landing-button-primary" href={docs.demoRelease}>Get the Android demo <ArrowUpRight size={17} aria-hidden="true" /></a>
            <a className="landing-button docs-button" href="#demo">Demo walkthrough <ArrowDown size={16} aria-hidden="true" /></a>
          </div>
          <div className="docs-status">
            <span aria-hidden="true" />
            {docs.release?.apkAvailable ? 'APK available on GitHub' : 'Android demo release'}
            {docs.release?.tag && <strong>{docs.release.tag}</strong>}
          </div>
        </div>
        <figure className="docs-preview">
          <img src="/docs-assets/threat-guard.png" alt="RAMISA Threat Guard screen showing an on-device audio classification" />
          <figcaption>Threat Guard running on Android</figcaption>
        </figure>
      </section>

      <div className="landing-wrap docs-layout">
        <nav className="docs-sidebar" aria-label="Documentation sections">
          <label className="docs-search"><Search size={17} aria-hidden="true" /><input type="search" placeholder="Find a section" aria-label="Search documentation" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
          {!query && <a href="#demo">Demo walkthrough</a>}
          {sections.map((section) => <a key={section.id} href={'#' + section.id}>{section.title}</a>)}
          <div className="docs-tools">
            <button onClick={() => downloadMarkdown(docs)} type="button"><FileDown size={16} aria-hidden="true" /> Markdown</button>
            <button onClick={() => window.print()} type="button"><FileDown size={16} aria-hidden="true" /> Print / PDF</button>
          </div>
        </nav>
        <div className="docs-content">
          {!query && <section id="demo" className="docs-section">
            <h2>Demo walkthrough</h2>
            <ol className="docs-steps">
              <li>Download <strong>RAMISA-handoff-test.apk</strong> under Assets on the GitHub release and install it on Android.</li>
              <li>Open RAMISA and tap <strong>Continue as guest</strong>. Try the Bangla language switch or open the safety map.</li>
              <li>Go to <strong>Tools → AI Threat Guard → Replay speech sample</strong> to see local inference without starting the microphone.</li>
              <li>Open <strong>SOS review</strong> to inspect the recipient and location checks. Exit the review to avoid sending an SMS during the demo.</li>
            </ol>
            <div className="docs-links">
              <a href="/docs-assets/ramisa-project-summary.pdf"><FileDown size={16} aria-hidden="true" /> One-page summary</a>
              <a href="https://github.com/black-hathacker-gg/Ramisa"><Github size={16} aria-hidden="true" /> Android source</a>
              {docs.videoUrl && <a href={docs.videoUrl}>Watch the demo <ArrowUpRight size={16} aria-hidden="true" /></a>}
            </div>
          </section>}
          {query && <p className="docs-search-result" role="status">{sections.length ? sections.length + (sections.length === 1 ? ' matching section' : ' matching sections') : 'No sections match this search.'}</p>}
          {sections.map(({ id, title, items, flow }) => <section className="docs-section" id={id} key={id}>
            <h2>{title}</h2>
            {flow && <ol className="docs-flow" aria-label="Threat Guard data flow">{flow.map((step) => <li key={step}>{step}</li>)}</ol>}
            <div className="docs-items">{items.map(([heading, detail, image]) => <div className={image ? 'docs-person' : undefined} key={heading}>
              {image && <img src={image} width="72" height="72" loading="lazy" alt="" />}
              <div><h3>{heading}</h3><p>{detail}</p></div>
            </div>)}</div>
            {id === 'changelog' && docs.release && <p className="docs-release-note">GitHub release status checked {new Date(docs.release.checkedAt).toLocaleString('en-GB', { timeZone: 'Asia/Dhaka' })} Bangladesh time.</p>}
          </section>)}
        </div>
      </div>
    </div>
  );
}
