import React from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';

const features = [
  {
    icon: 'bi-credit-card-2-front-fill',
    title: 'Digital Business Cards',
    description: 'Design beautiful digital cards with custom themes. Add your photo, company logo, cover image, and personal branding — no app install needed for recipients.',
    color: 'primary',
  },
  {
    icon: 'bi-hand-index-thumb-fill',
    title: 'NFC Tap Sharing',
    description: 'Link your card to an NFC tag and share your contact details with a single tap. Works with every modern smartphone — no app required on either end.',
    color: 'info',
  },
  {
    icon: 'bi-qr-code-scan',
    title: 'QR Code Scanning',
    description: 'Every card gets its own scannable QR code. Print it on your resume, business cards, posters, or presentations and track every scan.',
    color: 'success',
  },
  {
    icon: 'bi-link-45deg',
    title: 'Personal Public URL',
    description: 'Get a memorable public link (nixtap/c/your-name) to your profile page. Share it via email, WhatsApp, LinkedIn DMs, or your social bios.',
    color: 'warning',
  },
  {
    icon: 'bi-graph-up-arrow',
    title: 'Performance Analytics',
    description: 'Know exactly who viewed your card, how they found you (NFC, QR, or direct link), and where your viewers are located. Real-time dashboards with insights.',
    color: 'danger',
  },
  {
    icon: 'bi-calendar-check-fill',
    title: 'Meeting Scheduler',
    description: 'Let prospects and contacts book time with you directly from your card. No more back-and-forth emails — they pick a slot, you both get a calendar invite.',
    color: 'secondary',
  },
  {
    icon: 'bi-chat-square-heart-fill',
    title: 'Testimonials & Feedback',
    description: 'Collect ratings and written testimonials from people you connect with. Showcase 5-star reviews publicly on your card to build trust instantly.',
    color: 'pink',
  },
  {
    icon: 'bi-journal-code',
    title: 'Full Portfolio Showcase',
    description: 'Turn your card into a mini-website. Add projects, work history, education, skills, certificates, awards, languages, and downloadable resumes.',
    color: 'indigo',
  },
  {
    icon: 'bi-person-lines-fill',
    title: 'Profiles & Social Links',
    description: 'Connect all your social profiles, websites, and contact channels in one place. LinkedIn, GitHub, Twitter/X, Dribbble, email, phone — all discoverable.',
    color: 'purple',
  },
];

const shareSteps = [
  {
    step: '01',
    icon: 'bi-person-bounding-box',
    title: 'Create Your Card',
    description: 'Sign up in 30 seconds and build your first digital business card with your photo, role, company, and contact info.',
  },
  {
    step: '02',
    icon: 'bi-wrench-adjustable-circle',
    title: 'Customize & Add Content',
    description: 'Pick a theme, add your portfolio, link your socials, upload a resume, and connect your NFC tag or QR code.',
  },
  {
    step: '03',
    icon: 'bi-share-fill',
    title: 'Share Anywhere',
    description: 'Tap via NFC, scan a QR, send your public URL, or print your code. Every interaction is automatically tracked in your dashboard.',
  },
  {
    step: '04',
    icon: 'bi-diagram-2-fill',
    title: 'Grow Your Network',
    description: 'See analytics, get meeting requests, receive testimonials, and convert every handshake into a lasting professional connection.',
  },
];

const useCases = [
  {
    icon: 'bi-briefcase-fill',
    title: 'Professionals & Freelancers',
    description: 'Stop handing out paper cards. Send clients to your branded page with portfolio, testimonials, and one-click scheduling.',
  },
  {
    icon: 'bi-mortarboard-fill',
    title: 'Students & Graduates',
    description: 'Stand out at job fairs. A single QR on your resume lets recruiters see your projects, skills, and full story instantly.',
  },
  {
    icon: 'bi-megaphone-fill',
    title: 'Founders & Sales Teams',
    description: 'Track which events and connections drive the most meetings. Know your best-performing cards and optimize outreach.',
  },
  {
    icon: 'bi-buildings-fill',
    title: 'Companies & Teams',
    description: 'Onboard every employee with branded digital cards. Maintain consistency across the organization, always.',
  },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Product Designer',
    initials: 'PS',
    quote: 'I replaced 500 paper cards with one NFC tag at a conference. I got 4x more meetings booked directly from my Nixtap card.',
    rating: 5,
  },
  {
    name: 'Arjun Mehta',
    role: 'Founder, StackHub',
    initials: 'AM',
    quote: 'The analytics are insane. I can tell exactly which investor scanned my QR and booked a follow-up. Supercharges every pitch.',
    rating: 5,
  },
  {
    name: 'Sarah Chen',
    role: 'Senior Software Engineer',
    initials: 'SC',
    quote: 'My portfolio lives on my card now. Recruiters tap it, see my GitHub, projects, and book a chat — all in under a minute.',
    rating: 5,
  },
];

const Home = () => {
  const getColorClasses = (color) => {
    const map = {
      primary: 'bg-primary-subtle text-primary',
      info: 'bg-info-subtle text-info',
      success: 'bg-success-subtle text-success',
      warning: 'bg-warning-subtle text-warning-emphasis',
      danger: 'bg-danger-subtle text-danger',
      secondary: 'bg-secondary-subtle text-secondary-emphasis',
      pink: 'bg-pink-100 text-pink',
      indigo: 'bg-indigo-100 text-indigo',
      teal: 'bg-teal-100 text-teal',
      dark: 'bg-dark text-white',
      purple: 'bg-purple-100 text-purple',
      orange: 'bg-orange-100 text-orange',
    };
    return map[color] || map.primary;
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <PublicNavbar />

      <main className="flex-grow-1">
        {/* Hero Section */}
        <section className="py-5 py-md-6 py-lg-7 position-relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #FAF8FF 0%, #FFFFFF 100%)' }}>
          {/* Floating Background Accent Shapes */}
          <div className="position-absolute" style={{ top: '10%', left: '4%', width: '120px', height: '120px', borderRadius: '50%', background: '#F3E8FF', opacity: 0.6, filter: 'blur(30px)', zIndex: 0 }}></div>
          <div className="position-absolute" style={{ bottom: '15%', right: '5%', width: '160px', height: '160px', borderRadius: '50%', background: '#FEF3C7', opacity: 0.7, filter: 'blur(40px)', zIndex: 0 }}></div>

          <div className="container position-relative" style={{ zIndex: 1 }}>
            <div className="row align-items-center g-5">
              <div className="col-lg-7">
                {/* Badge Pills */}
                <div className="d-flex flex-wrap gap-2 mb-4">
                  <span className="floating-tag bg-pastel-lavender text-purple">
                    <i className="bi bi-sparkles text-purple"></i> Smart NFC & QR Tech
                  </span>
                  <span className="floating-tag bg-pastel-soft-yellow text-dark">
                    <i className="bi bi-lightning-charge-fill text-warning"></i> #InstantShare
                  </span>
                  <span className="floating-tag bg-pastel-cyan text-info">
                    <i className="bi bi-shield-check text-info"></i> #NoAppRequired
                  </span>
                </div>

                <h1 className="fw-extrabold display-3 mb-4 text-dark lh-tight" style={{ letterSpacing: '-0.03em' }}>
                  The best place to <span className="text-purple accent-underline me-2">learn, share</span> and <span className="text-warning accent-underline">connect</span> for professionals
                </h1>

                <p className="lead text-secondary mb-5 fs-5 pe-lg-4" style={{ color: '#475569' }}>
                  Discover thousands of instant tap & scan interactions. Create a stunning digital business card, book client meetings seamlessly, and track your audience in real-time.
                </p>

                <div className="d-flex flex-wrap align-items-center gap-3 mb-5">
                  <Link
                    to="/register"
                    className="btn bg-pastel-purple text-white fw-bold px-5 py-3.5 rounded-pill shadow-lg d-inline-flex align-items-center gap-3 fs-6"
                    style={{ background: '#7C3AED' }}
                  >
                    <span>Get started</span>
                    <span className="bg-white text-purple rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px', color: '#7C3AED' }}>
                      <i className="bi bi-arrow-up-right fw-bold"></i>
                    </span>
                  </Link>

                  <a
                    href="#how"
                    className="btn bg-white text-dark fw-bold px-4 py-3.5 rounded-pill border border-slate-200 shadow-sm d-inline-flex align-items-center gap-2"
                  >
                    <i className="bi bi-play-circle-fill text-purple fs-5"></i>
                    <span>See How It Works</span>
                  </a>
                </div>

                {/* Micro Metric Highlights */}
                <div className="d-flex flex-wrap gap-4 gap-md-5 pt-3 border-top border-slate-100">
                  <div>
                    <div className="fs-3 fw-extrabold text-dark d-flex align-items-center gap-2">
                      <span className="p-2 rounded-circle bg-pastel-lavender text-purple d-inline-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', fontSize: '0.9rem' }}>
                        <i className="bi bi-hand-index-thumb"></i>
                      </span>
                      NFC
                    </div>
                    <div className="text-muted small fw-semibold">Instant Phone Tap</div>
                  </div>
                  <div>
                    <div className="fs-3 fw-extrabold text-dark d-flex align-items-center gap-2">
                      <span className="p-2 rounded-circle bg-pastel-soft-yellow text-warning d-inline-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', fontSize: '0.9rem' }}>
                        <i className="bi bi-qr-code"></i>
                      </span>
                      QR Code
                    </div>
                    <div className="text-muted small fw-semibold">Scan Anywhere</div>
                  </div>
                  <div>
                    <div className="fs-3 fw-extrabold text-dark d-flex align-items-center gap-2">
                      <span className="p-2 rounded-circle bg-pastel-cyan text-info d-inline-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', fontSize: '0.9rem' }}>
                        <i className="bi bi-graph-up-arrow"></i>
                      </span>
                      Analytics
                    </div>
                    <div className="text-muted small fw-semibold">Realtime Stats</div>
                  </div>
                </div>
              </div>

              {/* Hero Image Mock / Interactive Card (Image 1 side visual style) */}
              <div className="col-lg-5">
                <div className="position-relative">
                  {/* Floating badges tags */}
                  <div className="position-absolute" style={{ top: '-25px', left: '10%', zIndex: 3 }}>
                    <span className="floating-tag bg-pastel-purple text-white shadow-md">#happy</span>
                  </div>
                  <div className="position-absolute" style={{ top: '-15px', right: '5%', zIndex: 3 }}>
                    <span className="floating-tag bg-pastel-yellow text-dark shadow-md">#enjoy</span>
                  </div>
                  <div className="position-absolute" style={{ bottom: '20px', left: '-20px', zIndex: 3 }}>
                    <span className="floating-tag bg-pastel-rose text-danger shadow-md">#funny</span>
                  </div>

                  {/* Main Preview Card Shell */}
                  <div className="card-pastel-feature bg-white shadow-xl border-0 p-4" style={{ borderRadius: '32px' }}>
                    <div className="d-flex align-items-center justify-content-between mb-4">
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded-circle bg-pastel-purple text-white fw-bold d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px', fontSize: '1.25rem' }}>
                          JD
                        </div>
                        <div>
                          <h5 className="fw-bold text-dark mb-0">John Doe</h5>
                          <span className="badge bg-pastel-lavender text-purple rounded-pill small">Senior Developer</span>
                        </div>
                      </div>
                      <span className="p-2 bg-pastel-soft-yellow text-dark rounded-circle">
                        <i className="bi bi-patch-check-fill fs-5 text-warning"></i>
                      </span>
                    </div>

                    <div className="bg-light p-3 rounded-4 mb-4">
                      <div className="d-flex align-items-center justify-content-between small text-muted mb-2">
                        <span>Digital Business Card</span>
                        <span className="fw-bold text-success"><i className="bi bi-circle-fill fs-6 me-1" style={{ fontSize: '8px' }}></i> Active</span>
                      </div>
                      <div className="fw-bold text-dark fs-6 mb-1">nixtap.me/c/john-doe</div>
                      <div className="small text-secondary">Bangalore, India · Tech & Product</div>
                    </div>

                    <div className="d-flex gap-2 mb-4">
                      <div className="flex-grow-1 p-2 bg-pastel-lavender rounded-3 text-center">
                        <i className="bi bi-linkedin text-purple fs-5"></i>
                      </div>
                      <div className="flex-grow-1 p-2 bg-pastel-cyan rounded-3 text-center">
                        <i className="bi bi-github text-info fs-5"></i>
                      </div>
                      <div className="flex-grow-1 p-2 bg-pastel-soft-yellow rounded-3 text-center">
                        <i className="bi bi-globe2 text-warning fs-5"></i>
                      </div>
                      <div className="flex-grow-1 p-2 bg-pastel-rose rounded-3 text-center">
                        <i className="bi bi-envelope-fill text-danger fs-5"></i>
                      </div>
                    </div>

                    <div className="p-3 bg-dark text-white rounded-4 d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-qr-code-scan fs-4 text-warning"></i>
                        <div className="small">
                          <div className="fw-bold leading-tight">Instant QR & NFC</div>
                          <div className="text-white-50 extra-small">Tap to view live profile</div>
                        </div>
                      </div>
                      <span className="btn btn-sm bg-white text-dark rounded-pill fw-bold">Tap</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Features Section (Image 1 inspired 3D pastel cards grid) */}
        <section id="features" className="py-5 py-md-6 py-lg-7" style={{ background: '#FAF8FF' }}>
          <div className="container">
            <div className="mb-5 text-start">
              <span className="floating-tag bg-white text-purple border border-slate-200 mb-2">Platform Power</span>
              <h2 className="fw-extrabold display-4 text-dark mb-2">
                Our <span className="text-purple text-handwriting">interactive</span> features
              </h2>
              <p className="text-secondary fs-5">
                Discover modern tools designed to make your networking effortless, trackable, and fun.
              </p>
            </div>

            <div className="row g-4">
              {/* Feature 1: Quiz/Cards */}
              <div className="col-12 col-md-6 col-lg-4">
                <div className="card-pastel-feature bg-pastel-lavender text-dark h-100 d-flex flex-column justify-content-between" style={{ minHeight: '280px' }}>
                  <div className="deco-concentric-rings"></div>
                  <div>
                    <div className="p-3 rounded-circle bg-white text-purple d-inline-flex align-items-center justify-content-center mb-4 shadow-sm" style={{ width: '48px', height: '48px' }}>
                      <i className="bi bi-credit-card-2-front-fill fs-4"></i>
                    </div>
                    <h3 className="fw-extrabold mb-2 text-dark">Digital Business Cards</h3>
                    <p className="text-secondary small mb-0">
                      Design rich digital business cards with custom branding, photo avatars, and social links — no app install needed.
                    </p>
                  </div>
                  <div className="pt-4">
                    <span className="badge bg-white text-purple rounded-pill fw-bold px-3 py-1.5 small">Custom Themes</span>
                  </div>
                </div>
              </div>

              {/* Feature 2: Creative Activities / NFC */}
              <div className="col-12 col-md-6 col-lg-4">
                <div className="card-pastel-feature bg-pastel-purple text-white h-100 d-flex flex-column justify-content-between" style={{ minHeight: '280px' }}>
                  <div className="deco-dot-grid"></div>
                  <div>
                    <div className="p-3 rounded-circle bg-white text-purple d-inline-flex align-items-center justify-content-center mb-4 shadow-sm" style={{ width: '48px', height: '48px' }}>
                      <i className="bi bi-hand-index-thumb-fill fs-4"></i>
                    </div>
                    <h3 className="fw-extrabold mb-2 text-white">NFC Tap & Share</h3>
                    <p className="text-white-50 small mb-0">
                      Program your NFC card or sticker with a single click. Recipients simply touch their phone to save your profile.
                    </p>
                  </div>
                  <div className="pt-4">
                    <span className="badge bg-white text-dark rounded-pill fw-bold px-3 py-1.5 small">One Touch</span>
                  </div>
                </div>
              </div>

              {/* Feature 3: Learn with Games / Analytics */}
              <div className="col-12 col-md-6 col-lg-4">
                <div className="card-pastel-feature bg-pastel-yellow text-dark h-100 d-flex flex-column justify-content-between" style={{ minHeight: '280px' }}>
                  <div className="deco-dot-grid"></div>
                  <div>
                    <div className="p-3 rounded-circle bg-white text-dark d-inline-flex align-items-center justify-content-center mb-4 shadow-sm" style={{ width: '48px', height: '48px' }}>
                      <i className="bi bi-graph-up-arrow fs-4"></i>
                    </div>
                    <h3 className="fw-extrabold mb-2 text-dark">Real-Time Analytics</h3>
                    <p className="text-dark-50 small mb-0" style={{ color: '#334155' }}>
                      Track card views, scan locations, clicked social links, and meeting conversions with interactive telemetry.
                    </p>
                  </div>
                  <div className="pt-4">
                    <span className="badge bg-dark text-white rounded-pill fw-bold px-3 py-1.5 small">Live Telemetry</span>
                  </div>
                </div>
              </div>

              {/* Feature 4: QR Code Studio */}
              <div className="col-12 col-md-6 col-lg-4">
                <div className="card-pastel-feature bg-pastel-cyan text-dark h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="p-3 rounded-circle bg-white text-info d-inline-flex align-items-center justify-content-center mb-4 shadow-sm" style={{ width: '48px', height: '48px' }}>
                      <i className="bi bi-qr-code-scan fs-4"></i>
                    </div>
                    <h4 className="fw-bold mb-2">QR Code Studio</h4>
                    <p className="text-secondary small mb-0">High-resolution scannable QR codes for your resume, email signatures, or print media.</p>
                  </div>
                </div>
              </div>

              {/* Feature 5: Portfolio Showcase */}
              <div className="col-12 col-md-6 col-lg-4">
                <div className="card-pastel-feature bg-pastel-mint text-dark h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="p-3 rounded-circle bg-white text-success d-inline-flex align-items-center justify-content-center mb-4 shadow-sm" style={{ width: '48px', height: '48px' }}>
                      <i className="bi bi-journal-code fs-4"></i>
                    </div>
                    <h4 className="fw-bold mb-2">Portfolio Showcase</h4>
                    <p className="text-secondary small mb-0">Showcase your featured projects, work history, skills, certificates, and downloadable CV.</p>
                  </div>
                </div>
              </div>

              {/* Feature 6: Meeting Scheduler */}
              <div className="col-12 col-md-6 col-lg-4">
                <div className="card-pastel-feature bg-pastel-rose text-dark h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="p-3 rounded-circle bg-white text-danger d-inline-flex align-items-center justify-content-center mb-4 shadow-sm" style={{ width: '48px', height: '48px' }}>
                      <i className="bi bi-calendar-check-fill fs-4"></i>
                    </div>
                    <h4 className="fw-bold mb-2">Meeting Scheduler</h4>
                    <p className="text-secondary small mb-0">Let contacts pick a time slot directly on your card without back-and-forth emails.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how" className="py-5 py-md-6 py-lg-7 bg-white">
          <div className="container">
            <div className="text-center mb-5 mx-auto" style={{ maxWidth: '640px' }}>
              <span className="floating-tag bg-pastel-lavender text-purple mb-3">Simple Process</span>
              <h2 className="fw-extrabold display-4 text-dark mb-3">
                How <span className="text-purple">Nixtap</span> Works
              </h2>
              <p className="text-secondary fs-5">
                From creating your card to growing your network in 4 easy steps.
              </p>
            </div>

            <div className="row g-4">
              {[
                { step: '01', title: 'Create Card', desc: 'Sign up and create your digital card with contact details and bio.', color: '#7C3AED', bg: '#F3E8FF' },
                { step: '02', title: 'Add Content', desc: 'Link your social channels, portfolio items, and calendar scheduler.', color: '#D97706', bg: '#FEF3C7' },
                { step: '03', title: 'Tap & Share', desc: 'Share via NFC tap, QR code scan, or custom public web link.', color: '#2563EB', bg: '#E0E7FF' },
                { step: '04', title: 'Track Stats', desc: 'Watch real-time analytics and convert viewers into booked meetings.', color: '#059669', bg: '#D1FAE5' },
              ].map((item, index) => (
                <div key={index} className="col-12 col-md-6 col-lg-3">
                  <div className="p-4 rounded-4 text-center h-100 border border-slate-100 shadow-sm" style={{ background: '#FAF8FF' }}>
                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle fw-extrabold fs-4 mb-4" style={{ width: '64px', height: '64px', background: item.bg, color: item.color }}>
                      {item.step}
                    </div>
                    <h4 className="fw-bold text-dark mb-2">{item.title}</h4>
                    <p className="text-secondary small mb-0">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial & Creator Showcase (Image 1 teacher avatar section style) */}
        <section id="testimonials" className="py-5 py-md-6 py-lg-7" style={{ background: '#7C3AED' }}>
          <div className="container text-white">
            <div className="text-center mb-5 mx-auto" style={{ maxWidth: '680px' }}>
              <h2 className="fw-extrabold display-4 mb-3" style={{ color: '#ffffff' }}>
                We aim to help professionals <span className="text-warning text-handwriting">discover the joy</span> of effortless networking.
              </h2>
            </div>

            <div className="row g-4 justify-content-center">
              {[
                { name: 'Kristin Watson', role: 'Software Architect', bg: '#FEF3C7', color: '#D97706', avatar: 'KW' },
                { name: 'Jenny Wilson', role: 'Product Designer', bg: '#CFFAFE', color: '#0284C7', avatar: 'JW' },
                { name: 'Jacob Jones', role: 'Growth Strategist', bg: '#FFE4E6', color: '#DB2777', avatar: 'JJ' },
                { name: 'Savannah Nguyen', role: 'Marketing Lead', bg: '#D1FAE5', color: '#059669', avatar: 'SN' },
              ].map((person, i) => (
                <div key={i} className="col-6 col-md-3 text-center">
                  <div className="p-3">
                    <div className="mx-auto rounded-circle d-flex align-items-center justify-content-center fw-extrabold display-6 mb-3 shadow-lg" style={{ width: '96px', height: '96px', background: person.bg, color: person.color }}>
                      {person.avatar}
                    </div>
                    <h5 className="fw-bold text-white mb-1">{person.name}</h5>
                    <div className="text-white-50 small">{person.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-5 bg-dark text-white">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-md-6">
              <div className="d-flex align-items-center gap-2 fw-bold fs-4 mb-2">
                <span className="p-2 rounded-circle bg-pastel-purple text-white d-inline-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', fontSize: '0.9rem' }}>
                  <i className="bi bi-layers-half"></i>
                </span>
                <span>Nixtap</span>
              </div>
              <p className="text-muted small mb-0">The modern microservice digital card platform for smart professionals.</p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="d-flex flex-wrap justify-content-md-end gap-3 small text-muted">
                <Link to="/login" className="text-white-50 text-decoration-none">Sign In</Link>
                <Link to="/register" className="text-white-50 text-decoration-none">Register</Link>
                <Link to="/dashboard" className="text-white-50 text-decoration-none">Dashboard</Link>
              </div>
              <div className="text-muted extra-small mt-3">&copy; {new Date().getFullYear()} Nixtap. All rights reserved.</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
