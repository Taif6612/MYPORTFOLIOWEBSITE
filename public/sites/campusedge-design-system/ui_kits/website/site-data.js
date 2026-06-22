/* CampusEdge website — demo content. Plain JS, attached to window. */
window.SITE = {
  nav: ['Home', 'Programs', 'Admissions', 'Faculty', 'Campus Life', 'News', 'Contact'],

  programs: [
    { title: 'Engineering', degree: 'B.Eng', duration: '4 Years', icon: 'fa-solid fa-gears', tag: 'Engineering',
      img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&q=80',
      blurb: 'Civil, mechanical and electrical engineering with hands-on labs.' },
    { title: 'Computer Science', degree: 'B.Sc', duration: '4 Years', icon: 'fa-solid fa-microchip', tag: 'Technology',
      img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
      blurb: 'Algorithms, AI and systems with a placement year in industry.' },
    { title: 'Business Administration', degree: 'BBA', duration: '3 Years', icon: 'fa-solid fa-chart-line', tag: 'Business',
      img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',
      blurb: 'Strategy, finance and entrepreneurship for global markets.' },
    { title: 'Architecture', degree: 'B.Arch', duration: '5 Years', icon: 'fa-solid fa-compass-drafting', tag: 'Design',
      img: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&q=80',
      blurb: 'Design studios, sustainability and the built environment.' },
    { title: 'Arts & Humanities', degree: 'B.A', duration: '3 Years', icon: 'fa-solid fa-feather', tag: 'Arts',
      img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80',
      blurb: 'Literature, history and philosophy that shape culture.' },
    { title: 'Health Sciences', degree: 'B.Sc', duration: '4 Years', icon: 'fa-solid fa-heart-pulse', tag: 'Health',
      img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80',
      blurb: 'Clinical training, public health and biomedical research.' },
    { title: 'Law', degree: 'LL.B', duration: '4 Years', icon: 'fa-solid fa-scale-balanced', tag: 'Law',
      img: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80',
      blurb: 'Constitutional, corporate and international legal practice.' },
    { title: 'Social Sciences', degree: 'B.A', duration: '3 Years', icon: 'fa-solid fa-users-between-lines', tag: 'Social',
      img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80',
      blurb: 'Economics, sociology and politics for a changing world.' },
  ],

  admissions: [
    { n: '01', title: 'Application Submission', icon: 'fa-solid fa-file-lines', desc: 'Complete the online form and upload transcripts.' },
    { n: '02', title: 'Entrance Evaluation', icon: 'fa-solid fa-pen-ruler', desc: 'Sit the aptitude assessment for your faculty.' },
    { n: '03', title: 'Interview', icon: 'fa-solid fa-comments', desc: 'Meet faculty for a conversation about your goals.' },
    { n: '04', title: 'Admission Decision', icon: 'fa-solid fa-envelope-circle-check', desc: 'Receive your offer within two weeks.' },
    { n: '05', title: 'Enrollment', icon: 'fa-solid fa-graduation-cap', desc: 'Confirm your place and join orientation week.' },
  ],

  why: [
    { icon: 'fa-solid fa-award', title: 'Accredited Programs', desc: 'Internationally recognised degrees across every faculty.' },
    { icon: 'fa-solid fa-handshake-angle', title: 'Industry Partnerships', desc: '300+ partner organisations for placements and research.', accent: true },
    { icon: 'fa-solid fa-building-columns', title: 'Modern Campus', desc: 'Smart classrooms, maker spaces and a 24/7 library.' },
    { icon: 'fa-solid fa-flask-vial', title: 'Research Opportunities', desc: 'Undergraduate research from your very first year.' },
    { icon: 'fa-solid fa-hand-holding-dollar', title: 'Scholarship Programs', desc: 'Merit and need-based awards up to full tuition.' },
    { icon: 'fa-solid fa-briefcase', title: 'Career Development', desc: 'Dedicated coaching, fairs and a global alumni network.' },
  ],

  campus: [
    { title: 'Student Clubs', icon: 'fa-solid fa-people-group', img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=700&q=80', span: 'wide' },
    { title: 'Sports Facilities', icon: 'fa-solid fa-basketball', img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80' },
    { title: 'Innovation Labs', icon: 'fa-solid fa-lightbulb', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80' },
    { title: 'Central Library', icon: 'fa-solid fa-book-open-reader', img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&q=80' },
    { title: 'Student Housing', icon: 'fa-solid fa-house-chimney', img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80' },
    { title: 'Events & Activities', icon: 'fa-solid fa-calendar-star', img: 'https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?w=700&q=80', span: 'wide' },
  ],

  faculty: [
    { name: 'Dr. Amara Okafor', role: 'Professor of Robotics', department: 'Engineering', qualification: 'Ph.D, MIT', research: 'Autonomous Systems & Control',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80' },
    { name: 'Prof. Daniel Reyes', role: 'Chair of Computer Science', department: 'Technology', qualification: 'Ph.D, Stanford', research: 'Machine Learning & NLP',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&q=80' },
    { name: 'Dr. Mei Lin', role: 'Professor of Public Health', department: 'Health Sciences', qualification: 'M.D, Ph.D', research: 'Epidemiology & Policy',
      photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&q=80' },
    { name: 'Prof. Idris Haddad', role: 'Dean of Architecture', department: 'Design', qualification: 'M.Arch, AA London', research: 'Sustainable Urbanism',
      photo: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=500&q=80' },
  ],

  research: [
    { icon: 'fa-solid fa-microscope', k: 'Research Centers', v: '24', d: 'Dedicated institutes from AI to climate science.' },
    { icon: 'fa-solid fa-file-lines', k: 'Publications / yr', v: '1,800+', d: 'Peer-reviewed work in leading journals.' },
    { icon: 'fa-solid fa-industry', k: 'Industry Collabs', v: '120', d: 'Joint R&D with global enterprises.' },
    { icon: 'fa-solid fa-rocket', k: 'Innovation Projects', v: '350', d: 'Student & faculty ventures funded annually.' },
  ],

  stories: [
    { name: 'Sofia Marchetti', position: 'Product Lead', org: 'Northwind Robotics', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
      quote: 'CampusEdge gave me a research foundation and a network that opened every door.' },
    { name: 'Jamal Bright', position: 'Founder & CEO', org: 'Lumen Health', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      quote: 'I built my first prototype in the innovation lab. Two years later it was a company.' },
    { name: 'Priya Anand', position: 'Architect', org: 'Studio Meridian', img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80',
      quote: 'The design studios pushed me to think bigger than I imagined possible.' },
  ],

  events: [
    { date: { d: '12', m: 'SEP' }, title: 'Autumn Open House', type: 'Open House', icon: 'fa-solid fa-door-open', place: 'Main Quad' },
    { date: { d: '28', m: 'SEP' }, title: 'Global Career Fair', type: 'Career Fair', icon: 'fa-solid fa-briefcase', place: 'Sports Arena' },
    { date: { d: '09', m: 'OCT' }, title: 'AI & Society Seminar', type: 'Seminar', icon: 'fa-solid fa-brain', place: 'Auditorium B' },
    { date: { d: '21', m: 'OCT' }, title: 'Design Thinking Workshop', type: 'Workshop', icon: 'fa-solid fa-pen-nib', place: 'Innovation Lab' },
  ],

  testimonials: [
    { who: 'Final-year Student', name: 'Leah Thompson', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
      text: 'The faculty genuinely invest in you. I never felt like just a number here.' },
    { who: 'Alumna, Class of 2019', name: 'Carlos Mendez', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
      text: 'My degree opened international doors I never thought possible.' },
    { who: 'Parent', name: 'Fatima Al-Rashid', img: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80',
      text: 'Knowing my daughter is supported academically and personally means everything.' },
  ],

  news: [
    { cat: 'Research', title: 'CampusEdge team unveils breakthrough in solid-state batteries', img: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=700&q=80', date: 'Jun 14, 2026', featured: true },
    { cat: 'Achievement', title: 'Robotics squad wins the International Autonomy Challenge', img: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&q=80', date: 'Jun 02, 2026' },
    { cat: 'Campus', title: 'New net-zero science building opens its doors', img: 'https://images.unsplash.com/photo-1562774053-701939374585?w=500&q=80', date: 'May 27, 2026' },
    { cat: 'Students', title: 'Spring hackathon draws 900 builders across 12 countries', img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&q=80', date: 'May 19, 2026' },
  ],

  faqs: [
    { q: 'What are the admission requirements?', a: 'A completed secondary diploma, official transcripts, and a personal statement. Some programs also require an entrance evaluation and interview.' },
    { q: 'How much is tuition?', a: 'Tuition varies by program, from $9,800–$14,500 per year. Detailed fee schedules are included in the prospectus and reviewed annually.' },
    { q: 'Do you offer scholarships?', a: 'Yes — merit, need-based and athletic awards cover up to 100% of tuition. Over 40% of our students receive some form of financial aid.' },
    { q: 'What campus facilities are available?', a: 'A 24/7 library, innovation and maker labs, sports arena, health centre, and modern student housing — all within a connected campus.' },
    { q: 'Can international students apply?', a: 'Absolutely. Our Global Office supports visa guidance, airport pickup, housing and a dedicated orientation for students from 80+ countries.' },
  ],
};
