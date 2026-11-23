// ALL YOUR CONTENT LIVES HERE. Edit text, add or remove projects, then save.
// Images: put files in /public/images and write e.g. image: 'images/my-reel.jpg'

export const profile = {
  name: 'Lei Picones',
  email: 'athenapicones04@gmail.com',
  github: 'https://github.com/athensofgreece',
  location: 'Philippines',
}

// LIGHT MODE: social media management and creatives
export const social = {
  badge: 'Open for social media VA work',
  headline: 'Short-form video and social media, handled.',
  lede: 'I help travel, event, and tech brands scale their presence with high-converting short-form video editing, content strategy, and creative social media management.',
  stats: [
    { n: '22,000+', l: 'views on one video edit' },
    { n: '10+', l: 'travel promo videos edited' },
    { n: '80+', l: 'followers gained from one reel' },
  ],
  services: [
    { title: 'Short-form video editing', text: 'Reels, TikToks, and Facebook videos cut in CapCut Pro, with hooks, captions, music, and pacing built for the scroll.' },
    { title: 'Social Media Management', text: 'Content planning, posting, and TikTok Live setup, so your accounts stay active and on brand.' },
    { title: 'Graphic Design', text: 'Covers, logos, posters, and post templates made in Canva and Figma, following your brand guidelines.' },
    { title: 'Social Media Reporting', text: 'Track content performance, review engagement, and identify opportunities to improve future posts.' },
  ],
  projects: [
    {
      title: 'Short-form video for a travel brand',
      client: 'A travel and tours company (Marketing and Sales Intern, 2026)', // anonymized on purpose
      need: 'Promote travel packages and support live selling on TikTok and Facebook.',
      did: 'Edited 10+ marketing videos in CapCut Pro, set up TikTok Live, and kept the company website updated after launch.',
      tools: 'CapCut Pro, TikTok Live, Facebook',
      result: '10+ videos published across two platforms.',
      image: '', link: '', placeholder: 'Add your best travel reel here (blur any logos or names)',
    },
    {
      title: "Growing a community's social media",
      client: 'B1G Angono Singles Ministry (CCF Angono), Media Team Volunteer',
      need: 'Reach more young people online and promote weekly events.',
      did: 'Posted consistently and produced video content for weekly events and services.',
      tools: 'CapCut Pro, Canva, Facebook',
      result: 'One video edit reached 22,000+ views and brought in 80+ new followers.',
      image: '', link: '', placeholder: 'Add a screenshot of the 22,000+ view video here',
    },
    {
      title: 'Brand and design work',
      client: 'GNC Digitals, Graphic Designer (Part-Time, 2023)',
      need: 'A consistent look across digital and print.',
      did: 'Designed the company logo, Facebook covers, and publication materials, shaped by audience research.',
      tools: 'Canva',
      result: 'A full set of on-brand digital and print materials.',
      image: '', link: '', placeholder: 'Add your logo, covers, and print designs here',
    },
    {
      title: 'Campaign content and messaging',
      client: 'SAMASA CCIS, Propaganda Committee (2024-2025)',
      need: 'Messages that reach the student body during election season.',
      did: "Wrote campaign messaging and designed social media posts that matched the organization's goals.",
      tools: 'Canva, Facebook',
      result: "Consistent election content across the student community's channels.",
      image: '', link: '', placeholder: 'Add a few election posters or posts here',
    },
  ],
  tools: ['CapCut Pro', 'Canva', 'Figma', 'TikTok Live', 'Facebook', 'Google Workspace', 'Microsoft Office'],
  about: [
    "I'm Lei, a Computer Science graduate (Cum Laude) from the Polytechnic University of the Philippines, based in Rizal.",
    'Alongside content work, I led logistics for a 500+ attendee AWS conference with a team of 8, so I stay calm under deadlines and keep details organized.',
  ],
}

// DARK MODE: automation and web development (skills in progress, shown honestly)
export const auto = {
  badge: 'Open to junior web developer roles',
  headline: 'Websites that work. Workflows that run themselves.',
  lede: "I build and maintain websites today, and I'm training in Zapier, Make, Airtable, Notion, and Google Sheets automation. I'm upfront about where I am, and serious about getting there.",
  stats: [
    { n: '4', l: 'websites built and deployed' },
    { n: 'React', l: 'used on a live company site' },
    { n: '4', l: 'automation tools in training' },
  ],
  services: [
    { title: 'Website building and upkeep', status: 'Available', text: 'Responsive sites in HTML, CSS, JavaScript, and React, from Figma wireframes to live deployment, plus ongoing updates.' },
    { title: 'Workflow automation', status: 'Demo in Progress', text: 'Zapier and Make scenarios that connect forms, email, and spreadsheets so repetitive tasks stop eating your day.' },
    { title: 'Airtable and Notion systems', status: 'Demo in Progress', text: 'Trackers, client dashboards, and content calendars set up so your info lives in one tidy place.' },
    { title: 'Sheets and Apps Script', status: 'Demo in Progress', text: 'Spreadsheet automations and small scripts that clean, sort, and move data for you.' },
  ],
  webProjects: [
    { title: 'Event photobooth', status: 'On GitHub', stack: 'Node.js, Express, Nodemailer', text: 'A kiosk photobooth for live events. Guests take a photo strip and it is emailed to them, even when the venue Wi-Fi drops.', link: 'https://github.com/athensofgreece/event-photobooth', image: 'images/photobooth-screenshot.png' },
    { title: 'NHFC company website', status: 'Live', stack: 'Figma, React', text: 'Led UI/UX design and front-end development from wireframes to deployment, presenting to IT, HR, and Sales stakeholders for feedback.', link: '' },
    { title: 'AWS Student Community Day page', status: 'Live', stack: 'HTML, CSS, JavaScript', text: 'Responsive event site highlighting keynotes, technical sessions, and panels.', link: 'https://athensofgreece.github.io/awsscd-webpage/' },
    { title: 'Bible Verse Generator for ADHD', status: 'Live', stack: 'HTML, CSS, JavaScript', text: 'An ADHD-friendly web app that serves verses for focus, peace, strength, and purpose with a New Verse button.', link: 'https://athensofgreece.github.io/verses_generator/' },
    { title: 'Pomodoro Timer', status: 'Live', stack: 'HTML, CSS, JavaScript', text: 'A dark, neon focus timer with a task list, a 4-session cycle, ambient sounds, and a daily goal and streak.', link: 'https://athensofgreece.github.io/pomodoro-timer/', image: 'images/timer-screenshot.png' },
  ],
  // These are DEMO builds I'm working on. They are not client work.
  demos: [
    { title: 'This portfolio runs on Google Sheets', status: 'Live', steps: ['Edit a Google Sheet', 'Site fetches it', 'Page updates'], text: 'Every project and line of text on this site comes from a spreadsheet, so updates need no code. A working automation, built by me.' },
    { title: 'Lead capture to tracker', status: 'Proof of Concept', steps: ['Form response', 'Airtable row', 'Email alert'], text: 'A new form submission lands in a tracker and pings you automatically.' },
    { title: 'Content calendar reminders', status: 'Proof of Concept', steps: ['Google Sheet', 'Due date check', 'Notion task'], text: 'Posts due today become tasks, tying my social media work to automation.' },
    { title: 'Client onboarding flow', status: 'Planned', steps: ['New client form', 'Notion workspace', 'Welcome email'], text: 'One form sets up a client folder and sends a welcome message.' },
  ],
  roadmap: [
    { tool: 'Zapier', level: 'Learning' },
    { tool: 'Make', level: 'Learning' },
    { tool: 'Airtable', level: 'Learning' },
    { tool: 'Notion', level: 'Using' },
    { tool: 'Google Sheets and Apps Script', level: 'Using' },
    { tool: 'React and JavaScript', level: 'Using' },
    { tool: 'HTML and CSS', level: 'Using' },
    { tool: 'Figma', level: 'Using' },
  ],
  about: [
    "I started in social media and design, then taught myself web development because I kept wanting to fix the tools behind the content.",
    "Automation is the next step. I'm building real demo workflows now, and I'll add client results here as soon as I have them.",
  ],
}

// Experience cards are editable through the "experience" Google Sheets tab.
export const experience = [
  { title: 'Marketing and Sales Intern', company: 'Sole Explorer Travel and Tours', date: 'Apr — May 2026', description: 'Maintained the post-launch company website, resolved admin-side bugs, configured TikTok Live, hosted twice-weekly live selling sessions, and produced promotional videos for TikTok and Facebook.', highlight: 'Approximately 40K interactions in a single live selling session · 10+ marketing videos' },
  { title: 'Fraud Specialist Customer Service Representative', company: 'Foundever — Capital One', date: 'Sep 2025 — Jan 2026', description: 'Handled fraud-related customer concerns through account review, identity verification, account authentication, and cross-team coordination to help protect customers from unauthorized access and transactions.', highlight: '40–60 calls per day, depending on call duration and queue volume' },
  { title: 'Junior Front-End Developer Intern', company: 'New Horizon Finance Corporation', date: 'Jul — Aug 2025', description: 'Designed and developed a seven-page company website, including a loan calculator and pensioner information form, from Figma wireframes through deployment. Presented iterations and incorporated feedback from IT, HR, and Sales.', highlight: '7-page website · Wireframes to deployment' },
]

// Leadership, volunteering, and event cards are editable through "leadership_events".
export const leadershipEvents = [
  { title: 'AWS Student Community Day Mega Manila 2025', company: 'AWS Student Builders Group PUP · Lead Logistics', date: 'Sep 17, 2025', description: 'Directed event logistics for a flagship tech conference, managing venue setup, registration support, materials distribution, and on-site coordination. Supervised a logistics team of 8, coordinated vendors and venue staff, handled contingencies, and managed attendee materials.', highlight: '500+ attendees · 6+ speakers · Led logistics team of 8' },
  { title: 'Solar Power Hackathon', company: 'Lead Usher · Arthaland Tower, BGC, Taguig', date: 'Aug 18, 2025', description: 'Led a team of 7 ushers, overseeing team deployment, shift assignments, and on-site guest flow throughout the hackathon.', highlight: 'Team leadership · Usher deployment · Guest flow' },
  { title: 'AWS Community Day Philippines 2024', company: 'Usher · Arthaland Tower, BGC, Taguig', date: 'Sep 21–22, 2024', description: 'Managed attendee flow, crowd control, and guest inquiries throughout the two-day conference with 6+ speakers.', highlight: 'Two-day conference · Guest and attendee support' },
  { title: 'AWS Student Community Day 2024', company: 'AWS Student Builders Group PUP · Lead Usher', date: 'Apr 17, 2024', description: 'Spearheaded usher operations for a one-day flagship conference with 800+ attendees. Coordinated volunteer schedules, briefings, on-the-day reassignment, and VIP speaker movement between sessions, panels, and networking areas.', highlight: '800+ attendees · 6+ speakers · VIP speaker handling' },
  { title: 'DBM ICT Week 2024 — Full Throttle: Digital Transformation', company: 'Usher & Club Representative · AWS Cloud Club PUP Manila', date: 'Feb 21, 2024', description: 'Represented the club, engaged with sponsors, booths, public figures, and attendees, and liaised with event organizers on booth logistics and delegate schedules.', highlight: 'Engaged with 15+ sponsors and booths' },
]
