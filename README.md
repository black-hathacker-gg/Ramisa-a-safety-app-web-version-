# RAMISA website

Run `npm install` and `npm run dev`. Open `/docs` for the public project showcase. Run `npm run lint` and `npm run build` before deploying. Vite also serves the docs API in local preview, so `npm run preview` exercises the production bundle.

## Publish the project showcase

The Vercel function at `/api/docs` serves the documentation and reads APK availability from GitHub Releases. Successful status checks are reused for five minutes. If GitHub rate limits the lookup and there's no previous result, the page still offers the release link and omits the verification time.

The showcase is public by default. An administrator with Vercel project access can set these server-only project environment variables and redeploy. Existing deployments keep the environment values they were built with.

| Variable | Purpose |
| --- | --- |
| `RAMISA_DOCS_ENABLED` | Set to `false` to turn off the documentation API. Use `true` to enable it. |
| `RAMISA_DOCS_START` | Optional publication start (inclusive), for example `2026-12-26T07:00:00+06:00`. |
| `RAMISA_DOCS_END` | Optional publication end (exclusive). Use an ISO 8601 date and time with an explicit offset. |
| `RAMISA_DOCS_VIDEO_URL` | Optional public HTTPS video URL. Overrides the included three-minute demo file. |

Edit the pitch, engineering notes, feature status, and public team information in `server/docs-content.js`. Track review and revision history through GitHub. The release lookup uses public information. The page has no connection to private account, contact, location, or event data. The independently public APK, PDF, and video remain shareable when the docs page is off.
