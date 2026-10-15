// ALL YOUR CONTENT LIVES HERE. Edit text, add or remove projects, then save.
// Images: put files in /public/images and write e.g. image: 'images/my-reel.jpg'

export const profile = {
  name: 'Athena Picones',
  email: 'athenapicones04@gmail.com',
  github: 'https://github.com/athensofgreece',
  location: 'Philippines',
}

// LIGHT MODE: social media management and creatives
export const social = {
  badge: 'Open for social media VA work',
  headline: 'Short-form video and social media, handled.',
  lede: "I'm Athena, a social media and creative VA for travel, events, and tech brands. I edit your videos, run your posting, and design your graphics.",
  stats: [
    { n: '22,000+', l: 'views on one video edit' },
    { n: '10+', l: 'travel promo videos edited' },
    { n: '80+', l: 'followers grown for a community page' },
  ],
  services: [
    { title: 'Short-form video editing', text: 'Reels, TikToks, and Facebook videos cut in CapCut Pro, with hooks, captions, music, and pacing built for the scroll.' },
    { title: 'Social media management', text: 'Content planning, posting, and TikTok Live setup, so your accounts stay active and on brand.' },
    { title: 'Graphic design', text: 'Covers, logos, posters, and post templates made in Canva and Figma, following your brand guidelines.' },
  ],
  projects: [
    {
      title: 'Short-form video for a travel brand',
      client: 'A travel and tours company (Marketing and Sales Intern, 2026)', // anonymized on purpose
      need: 'Promote travel packages and support live selling on TikTok and Facebook.',
      did: 'Edited 10+ marketing videos in CapCut Pro, set up TikTok Live, and kept the company website updated after launch.',
      tools: 'CapCut Pro, TikTok Live, Facebook',
      result: '10+ videos published across two platforms. [Add views or engagement from your analytics.]',
      image: '', link: '', placeholder: 'Add your best travel reel here (blur any logos or names)',
    },
    {
      title: "Growing a community's social media",
      client: 'B1G Angono Singles Ministry (CCF Angono), Media Team Volunteer',
      need: 'Reach more young people online and promote weekly events.',
      did: 'Posted consistently and produced video content for weekly events and services.',
      tools: 'CapCut Pro, Canva, Facebook',
      result: '80+ new followers, and one video edit that reached 22,000+ views.',
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
    "I'm Athena, a Computer Science graduate (cum laude) from the Polytechnic University of the Philippines, based in Rizal.",
    'Alongside content work, I led logistics for a 500+ attendee AWS conference with a team of 8, so I stay calm under deadlines and keep details organized.',
  ],
}

// DARK MODE: automation and web development (skills in progress, shown honestly)
export const auto = {
  badge: 'Currently building my automation skills',
  headline: 'Websites that work. Workflows that run themselves.',
  lede: "I build and maintain websites today, and I'm training in Zapier, Make, Airtable, Notion, and Google Sheets automation. I'm upfront about where I am, and serious about getting there.",
  stats: [
    { n: '4', l: 'websites built and deployed' },
    { n: 'React', l: 'used on a live company site' },
    { n: '4', l: 'automation tools in training' },
  ],
  services: [
    { title: 'Website building and upkeep', status: 'Available', text: 'Responsive sites in HTML, CSS, JavaScript, and React, from Figma wireframes to live deployment, plus ongoing updates.' },
    { title: 'Workflow automation', status: 'In training', text: 'Zapier and Make scenarios that connect forms, email, and spreadsheets so repetitive tasks stop eating your day.' },
    { title: 'Airtable and Notion systems', status: 'In training', text: 'Trackers, client dashboards, and content calendars set up so your info lives in one tidy place.' },
    { title: 'Sheets and Apps Script', status: 'In training', text: 'Spreadsheet automations and small scripts that clean, sort, and move data for you.' },
  ],
  webProjects: [
    { title: 'NHFC company website', status: 'Live', stack: 'Figma, React', text: 'Led UI/UX design and front-end development from wireframes to deployment, presenting to IT, HR, and Sales stakeholders for feedback.', link: '' },
    { title: 'AWS Student Community Day page', status: 'Live', stack: 'HTML, CSS, JavaScript', text: 'Responsive event site highlighting keynotes, technical sessions, and panels.', link: 'https://athensofgreece.github.io/awsscd-webpage/' },
    { title: 'Bible Verse Generator for ADHD', status: 'Live', stack: 'HTML, CSS, JavaScript', text: 'An ADHD-friendly web app that serves verses for focus, peace, strength, and purpose with a New Verse button.', link: 'https://athensofgreece.github.io/verses_generator/' },
    { title: "Mother's Day website", status: 'Live', stack: 'HTML, CSS, JavaScript', text: 'A personal site with a structured photo gallery and heartfelt messages.', link: 'https://athensofgreece.github.io/mothers-day/' },
  ],
  // These are DEMO builds I'm working on. They are not client work.
  demos: [
    { title: 'This portfolio runs on Google Sheets', status: 'Live', steps: ['Edit a Google Sheet', 'Site fetches it', 'Page updates'], text: 'Every project and line of text on this site comes from a spreadsheet, so updates need no code. A working automation, built by me.' },
    { title: 'Lead capture to tracker', status: 'Demo in progress', steps: ['Form response', 'Airtable row', 'Email alert'], text: 'A new form submission lands in a tracker and pings you automatically.' },
    { title: 'Content calendar reminders', status: 'Demo in progress', steps: ['Google Sheet', 'Due date check', 'Notion task'], text: 'Posts due today become tasks, tying my social media work to automation.' },
    { title: 'Client onboarding flow', status: 'Planned', steps: ['New client form', 'Notion workspace', 'Welcome email'], text: 'One form sets up a client folder and sends a welcome message.' },
  ],
  roadmap: [
    { tool: 'Zapier', level: 'Learning' },
    { tool: 'Make', level: 'Learning' },
    { tool: 'Airtable', level: 'Learning' },
    { tool: 'Notion', level: 'Learning' },
    { tool: 'Google Sheets and Apps Script', level: 'Learning' },
    { tool: 'React and JavaScript', level: 'Using' },
    { tool: 'HTML and CSS', level: 'Using' },
    { tool: 'Figma', level: 'Using' },
  ],
  about: [
    "I started in social media and design, then taught myself web development because I kept wanting to fix the tools behind the content.",
    "Automation is the next step. I'm building real demo workflows now, and I'll add client results here as soon as I have them.",
  ],
}
