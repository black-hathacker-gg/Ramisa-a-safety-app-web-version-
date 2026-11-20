export const androidRepository = 'https://github.com/black-hathacker-gg/Ramisa';
export const demoRelease = androidRepository + '/releases/tag/v1.0-demo';

export const sections = [
  {
    id: 'pitch', title: 'The pitch',
    items: [
      ['Problem', 'When someone feels unsafe, finding a trusted contact and sharing a location can take several steps. Language barriers, limited data, and mandatory signup can add friction.'],
      ['Solution', 'RAMISA is a Bangla and English Android safety prototype. Users can open it as guests, prepare trusted contacts, check in on journeys, and review an SOS before sending it.'],
      ['Audience and opportunity', 'Women, girls, students, commuters, and families in Bangladesh are the initial audience. The next step is to validate how they use safety tools in low-connectivity settings.'],
      ['Alternatives and advantage', 'A phone dialer and messaging app already help people reach contacts. RAMISA brings preparedness, location sharing, and opt-in on-device audio classification into one workflow.'],
      ['Pilot and sustainability', 'Start with supervised usability sessions and explore a campus pilot. A revenue model and institutional distribution are hypotheses to test after the pilot.'],
    ],
  },
  {
    id: 'features', title: 'Feature status',
    items: [
      ['Available in the Android demo', 'Guest mode, Bangla and English UI, YAMNet speech replay, SOS review, journey check-ins, and the MapLibre safety map. Selected street-map regions can be downloaded for offline viewing.'],
      ['Requires setup', 'SMS requires contacts, permissions and cellular service. Online accounts and community posting require Supabase. Example map incidents are illustrative.'],
      ['Preview', 'Bluetooth mesh and volunteer matching are previews.'],
      ['Planned validation', 'Physical-device microphone tests, carrier SMS delivery, false prompts per listening hour, missed detections, and time to confirm SOS.'],
    ],
  },
  {
    id: 'architecture', title: 'Architecture and data flow',
    flow: ['Opt-in microphone', '16 kHz audio windows', 'YAMNet on Android', 'Alert gate', 'User confirmation', 'SOS review'],
    items: [
      ['Android', 'Kotlin and Jetpack Compose handle the interface. MediaPipe Tasks Audio runs the bundled TensorFlow Lite classifier on the phone. Android APIs supply location and handle SMS.'],
      ['Map and online services', 'MapLibre Native fetches OpenFreeMap tiles based on OpenStreetMap. Supabase Auth handles optional accounts. Supabase Postgres can store community messages. React and Vite power the Vercel site.'],
      ['API boundaries', 'The site exposes GET /api/docs for the public documentation and release status when published. Android uses Supabase Auth and PostgREST over HTTPS for online features. Threat Guard has no hosted inference endpoint.'],
      ['Data and privacy', 'Threat Guard audio is processed in memory. Guest profile and trusted-contact details stay on the device. A confirmed SOS can include current or last available coordinates. The repository includes row-level security policies for community messages.'],
    ],
  },
  {
    id: 'validation', title: 'AI and validation',
    items: [
      ['Model and decision rule', 'YAMNet classifies 521 acoustic categories. A Screaming score of at least 0.65 in two consecutive live windows can show a 15-second prompt. Ignoring or cancelling the prompt sends nothing. Replay cannot reach the live alert gate.'],
      ['Reproducible checks', 'Five Android emulator tests passed, including automated coverage of guest navigation, on-device audio inference, and SOS behavior. The navigation smoke test opened all 24 tools.'],
      ['Performance and next steps', 'The APK bundles a 4.1 MB model. Local CPU inference avoids hosted inference calls and can run without internet. Measure false prompts, missed detections, and time to reach SOS during a consented physical-device pilot.'],
    ],
  },
  {
    id: 'team', title: 'Team and contributors',
    items: [
      ['Abdullah Al Rafi Mahmud', 'Founder, RAMISA', '/PHOTO-2026-09-03-21-44-32.jpg'],
    ],
  },
  {
    id: 'changelog', title: 'Release and changelog',
    items: [
      ['v1.0-demo', 'Android judging build with the updated interface, on-device Threat Guard replay, SOS review, and offline map-region downloads.'],
    ],
  },
];
