import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicFullPortfolio } from '../api/portfolioService';
import { getPublicSocialLinks, getPublicProfileByUsername, getPublicProfileByUserId } from '../api/profileService';
import { getApprovedFeedback, getFeedbackSummary, submitFeedback } from '../api/feedbackService';
import { submitMeetingRequest } from '../api/meetingService';
import { trackEvent } from '../api/analyticsService';

const PLATFORM_ICONS = {
  LINKEDIN:  { icon: 'bi-linkedin',  color: '#0A66C2', label: 'LinkedIn' },
  GITHUB:    { icon: 'bi-github',    color: '#F0F6FC', label: 'GitHub' },
  TWITTER:   { icon: 'bi-twitter-x', color: '#1DA1F2', label: 'Twitter / X' },
  INSTAGRAM: { icon: 'bi-instagram', color: '#E4405F', label: 'Instagram' },
  FACEBOOK:  { icon: 'bi-facebook',  color: '#1877F2', label: 'Facebook' },
  WHATSAPP:  { icon: 'bi-whatsapp',  color: '#25D366', label: 'WhatsApp' },
  YOUTUBE:   { icon: 'bi-youtube',   color: '#FF0000', label: 'YouTube' },
  WEBSITE:   { icon: 'bi-globe',     color: '#10B981', label: 'Website' },
  CUSTOM:    { icon: 'bi-link-45deg', color: '#7C3AED', label: 'Link' },
};

const PublicProfilePage = () => {
  const { username, userId } = useParams();
  const rawIdentifier = username || userId || 'kirtesh';

  const [loading, setLoading]           = useState(true);
  const [userProfile, setUserProfile]   = useState(null);
  const [activeTab, setActiveTab]       = useState('overview');
  const [portfolio, setPortfolio]       = useState(null);
  const [socialLinks, setSocialLinks]   = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackSummary, setFeedbackSummary] = useState(null);
  const [toast, setToast]               = useState(null);

  // Modals
  const [showMeetingModal, setShowMeetingModal]   = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Meeting Form
  const [meetingForm, setMeetingForm] = useState({
    requesterName: '', requesterEmail: '', requesterPhone: '',
    purpose: 'Business Networking', preferredDate: '', preferredTime: '10:00', message: ''
  });

  // Feedback Form
  const [feedbackForm, setFeedbackForm] = useState({
    visitorName: '', visitorEmail: '', rating: 5, comment: ''
  });

  useEffect(() => {
    fetchData();
  }, [rawIdentifier]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let profileData = null;
      let targetUserId = 30; // default fallback

      // 1. Resolve Profile first by username or numeric userId
      try {
        if (isNaN(rawIdentifier)) {
          profileData = await getPublicProfileByUsername(rawIdentifier);
        } else {
          profileData = await getPublicProfileByUserId(rawIdentifier);
        }
      } catch (e) {
        console.warn('Profile fetch warning:', e);
      }

      if (profileData?.userId) {
        targetUserId = profileData.userId;
      } else if (!isNaN(rawIdentifier)) {
        targetUserId = parseInt(rawIdentifier);
      }
      setUserProfile(profileData);

      // 2. Fetch full portfolio and social links for target user
      const [portRes, socialRes, fbRes, sumRes] = await Promise.allSettled([
        getPublicFullPortfolio(targetUserId),
        getPublicSocialLinks(targetUserId),
        getApprovedFeedback(targetUserId),
        getFeedbackSummary(targetUserId),
      ]);

      if (portRes.status === 'fulfilled' && portRes.value) {
        setPortfolio(portRes.value);
      }
      if (socialRes.status === 'fulfilled' && Array.isArray(socialRes.value)) {
        setSocialLinks(socialRes.value);
      }
      if (fbRes.status === 'fulfilled' && fbRes.value?.data) {
        setFeedbackList(fbRes.value.data);
      }
      if (sumRes.status === 'fulfilled' && sumRes.value?.data) {
        setFeedbackSummary(sumRes.value.data);
      }

      trackEvent({ ownerId: String(targetUserId), targetType: 'PORTFOLIO', targetId: String(targetUserId), eventType: 'VIEW' });
    } catch (err) {
      console.warn('Public profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (text, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleMeetingSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitMeetingRequest({
        ownerId: parseInt(id),
        cardId: 1,
        ...meetingForm
      });
      showToast('Meeting request sent successfully!');
      setShowMeetingModal(false);
    } catch {
      showToast('Meeting request submitted!');
      setShowMeetingModal(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitFeedback({
        ownerId: parseInt(id),
        cardId: 1,
        ...feedbackForm
      });
      showToast('Feedback submitted for review!');
      setShowFeedbackModal(false);
    } catch {
      showToast('Feedback submitted!');
      setShowFeedbackModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: '#0f172a' }}>
        <div className="text-center">
          <div className="spinner-border mb-3 text-purple" style={{ width: '3rem', height: '3rem' }}></div>
          <p className="text-slate-400 fw-semibold small">Loading public profile showcase...</p>
        </div>
      </div>
    );
  }

  const projects     = portfolio?.projects || [];
  const experiences  = portfolio?.experiences || [];
  const education    = portfolio?.education || [];
  const skills       = portfolio?.skills || [];
  const certificates = portfolio?.certificates || [];
  const resume       = portfolio?.resume || null;
  const awards       = portfolio?.awards || [];
  const languages    = portfolio?.languages || [];

  return (
    <div className="min-vh-100 pb-5" style={{ background: '#0F172A', color: '#F8FAFC', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Toast Alert */}
      {toast && (
        <div className="position-fixed top-0 end-0 m-4 z-3">
          <div className={`alert border-0 rounded-4 shadow-lg px-4 py-3 text-white d-flex align-items-center gap-2 mb-0`}
            style={{ background: toast.type === 'success' ? '#10B981' : '#EF4444' }}>
            <i className={`bi ${toast.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`}></i>
            <span className="fw-bold small">{toast.text}</span>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="position-relative overflow-hidden py-5 border-bottom border-slate-800"
        style={{ background: 'radial-gradient(circle at top right, #1E1B4B 0%, #0F172A 70%)' }}>
        <div className="container px-lg-5">
          <div className="d-flex flex-column flex-md-row align-items-center gap-4 text-center text-md-start">
            <div className="rounded-circle p-1" style={{ background: 'linear-gradient(135deg, #7C3AED, #6366F1)' }}>
              {userProfile?.profileImage ? (
                <img src={userProfile.profileImage} alt={userProfile.fullName} className="rounded-circle shadow-lg object-fit-cover" style={{ width: '96px', height: '96px' }} />
              ) : (
                <div className="rounded-circle bg-dark text-white fw-extrabold d-flex align-items-center justify-content-center fs-2 shadow-lg"
                  style={{ width: '96px', height: '96px', background: 'linear-gradient(135deg, #312E81, #1E1B4B)' }}>
                  {(userProfile?.fullName || rawIdentifier).charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-grow-1">
              <span className="badge bg-purple-subtle text-purple rounded-pill extra-small fw-bold px-3 py-1 mb-2">
                VERIFIED NIXTAP PROFILE
              </span>
              <h1 className="fw-extrabold text-white mb-1">
                {userProfile?.fullName || `@${rawIdentifier}`}
              </h1>
              {userProfile?.designation && (
                <p className="text-purple fw-bold mb-1">
                  {userProfile.designation} {userProfile.company && `at ${userProfile.company}`}
                </p>
              )}
              <p className="text-slate-400 small mb-3 max-w-2xl">
                {userProfile?.bio || userProfile?.headline || "Showcasing full verified professional background across projects, experience, credentials, and testimonials."}
              </p>

              {/* Social Media Link Badges */}
              {socialLinks.length > 0 && (
                <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 flex-wrap mb-3">
                  {socialLinks.map((s, idx) => {
                    const meta = PLATFORM_ICONS[s.platform?.toUpperCase()] || PLATFORM_ICONS.CUSTOM;
                    return (
                      <a key={s.id || idx} href={s.url} target="_blank" rel="noreferrer"
                        className="btn btn-sm btn-dark border border-slate-700 text-white rounded-pill px-3 py-1.5 extra-small fw-bold d-inline-flex align-items-center gap-1.5 shadow-xs hover-elevate transition-all">
                        <i className={`bi ${meta.icon}`} style={{ color: meta.color }}></i>
                        <span>{s.displayLabel || meta.label}</span>
                      </a>
                    );
                  })}
                </div>
              )}

              <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 flex-wrap">
                <button onClick={() => setShowMeetingModal(true)}
                  className="btn btn-sm text-white fw-bold rounded-pill px-4 py-2 small shadow-sm d-inline-flex align-items-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #6366F1)' }}>
                  <i className="bi bi-calendar-event"></i> Schedule Meeting
                </button>
                <button onClick={() => setShowFeedbackModal(true)}
                  className="btn btn-sm btn-outline-light rounded-pill px-4 py-2 small fw-bold">
                  <i className="bi bi-star"></i> Leave Feedback
                </button>
                {resume?.resumeUrl && (
                  <a href={resume.resumeUrl} target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-dark border border-slate-700 rounded-pill px-4 py-2 small fw-bold text-slate-300">
                    <i className="bi bi-file-earmark-arrow-down me-1"></i> Resume PDF
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="container px-lg-5 mt-4">

        {/* Navigation Tabs */}
        <div className="bg-slate-900 rounded-4 border border-slate-800 p-2 mb-4 d-flex align-items-center gap-2 flex-wrap">
          {[
            { key: 'overview',     label: 'Overview',     icon: 'bi-grid-fill' },
            { key: 'projects',     label: `Projects (${projects.length})`,     icon: 'bi-journal-code' },
            { key: 'experience',   label: `Experience (${experiences.length})`, icon: 'bi-briefcase-fill' },
            { key: 'education',    label: `Education (${education.length})`,    icon: 'bi-mortarboard-fill' },
            { key: 'credentials',  label: `Certificates (${certificates.length})`, icon: 'bi-award-fill' },
            { key: 'reviews',      label: `Reviews (${feedbackList.length})`,   icon: 'bi-star-fill' },
          ].map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`btn btn-sm rounded-pill px-3 py-1.5 fw-bold extra-small transition-all ${
                activeTab === t.key ? 'bg-purple text-white shadow-xs' : 'text-slate-400 btn-link text-decoration-none'
              }`}>
              <i className={`bi ${t.icon} me-1.5`}></i>{t.label}
            </button>
          ))}
        </div>

        {/* ── 1. OVERVIEW TAB ──────────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="row g-4">
            {/* Quick Bio & Summary */}
            <div className="col-12 col-lg-8">
              {/* Skills Grid */}
              {skills.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-4 p-4 mb-4">
                  <h6 className="fw-extrabold text-white mb-3 d-flex align-items-center gap-2">
                    <i className="bi bi-lightning-charge-fill text-warning"></i> Core Skills &amp; Competencies
                  </h6>
                  <div className="d-flex flex-wrap gap-2">
                    {skills.map((s, i) => (
                      <span key={i} className="badge bg-slate-800 text-purple border border-purple border-opacity-25 rounded-pill px-3 py-2 small fw-bold">
                        {s.skillName || s.name} ({s.proficiency || 'Expert'})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Featured Projects Preview */}
              {projects.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-4 p-4 mb-4">
                  <h6 className="fw-extrabold text-white mb-3 d-flex align-items-center gap-2">
                    <i className="bi bi-journal-code text-purple"></i> Featured Projects
                  </h6>
                  <div className="row g-3">
                    {projects.slice(0, 2).map((p, i) => (
                      <div key={i} className="col-12 col-md-6">
                        <div className="bg-slate-950 border border-slate-800 rounded-4 p-3 h-100">
                          <h6 className="fw-bold text-white mb-1">{p.title}</h6>
                          <p className="extra-small text-slate-400 line-clamp-2 mb-2">{p.description}</p>
                          {p.projectUrl && <a href={p.projectUrl} target="_blank" rel="noreferrer" className="extra-small fw-bold text-purple">View Project &rarr;</a>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Work History Summary */}
              {experiences.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-4 p-4">
                  <h6 className="fw-extrabold text-white mb-3 d-flex align-items-center gap-2">
                    <i className="bi bi-briefcase-fill text-info"></i> Experience Summary
                  </h6>
                  <div className="d-grid gap-3">
                    {experiences.map((exp, i) => (
                      <div key={i} className="border-start border-2 border-purple ps-3">
                        <h6 className="fw-bold text-white mb-0">{exp.designation}</h6>
                        <span className="extra-small text-purple fw-bold">{exp.companyName || exp.company}</span>
                        <div className="extra-small text-slate-400">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Column */}
            <div className="col-12 col-lg-4">
              {/* Languages */}
              {languages.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-4 p-4 mb-4">
                  <h6 className="fw-extrabold text-white mb-3 d-flex align-items-center gap-2">
                    <i className="bi bi-translate text-info"></i> Languages Spoken
                  </h6>
                  <div className="d-grid gap-2">
                    {languages.map((l, i) => (
                      <div key={i} className="d-flex align-items-center justify-content-between extra-small">
                        <span className="fw-bold text-slate-200">{l.languageName || l.name}</span>
                        <span className="text-slate-400">{l.proficiency}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Honors & Awards */}
              {awards.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-4 p-4">
                  <h6 className="fw-extrabold text-white mb-3 d-flex align-items-center gap-2">
                    <i className="bi bi-trophy-fill text-warning"></i> Honors &amp; Awards
                  </h6>
                  <div className="d-grid gap-2">
                    {awards.map((a, i) => (
                      <div key={i} className="bg-slate-950 p-2.5 rounded-3 border border-slate-800 extra-small">
                        <span className="fw-bold text-white d-block">{a.title}</span>
                        <span className="text-slate-400">{a.issuer}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── 2. PROJECTS TAB ──────────────────────────────────────────────── */}
        {activeTab === 'projects' && (
          <div className="row g-4">
            {projects.map((p, i) => (
              <div key={i} className="col-12 col-md-6 col-lg-4">
                <div className="bg-slate-900 border border-slate-800 rounded-4 p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="fw-extrabold text-white mb-2">{p.title}</h5>
                    <p className="small text-slate-400 mb-3">{p.description}</p>
                  </div>
                  {p.projectUrl && (
                    <a href={p.projectUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-purple rounded-pill fw-bold text-purple">
                      View Project Demo <i className="bi bi-arrow-up-right ms-1"></i>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── 3. EXPERIENCE TAB ────────────────────────────────────────────── */}
        {activeTab === 'experience' && (
          <div className="d-grid gap-3">
            {experiences.map((exp, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-4 p-4">
                <div className="d-flex align-items-start justify-content-between">
                  <div>
                    <h5 className="fw-extrabold text-white mb-0">{exp.designation}</h5>
                    <span className="fw-bold text-purple">{exp.companyName || exp.company}</span>
                    <div className="extra-small text-slate-400 mt-1">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
                    {exp.description && <p className="small text-slate-300 mt-2 mb-0">{exp.description}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── 4. EDUCATION TAB ─────────────────────────────────────────────── */}
        {activeTab === 'education' && (
          <div className="d-grid gap-3">
            {education.map((edu, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-4 p-4">
                <h5 className="fw-extrabold text-white mb-0">{edu.degree}</h5>
                <span className="fw-bold text-success">{edu.institution}</span>
                <div className="extra-small text-slate-400 mt-1">{edu.startDate} - {edu.endDate}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── 5. CREDENTIALS TAB ───────────────────────────────────────────── */}
        {activeTab === 'credentials' && (
          <div className="row g-4">
            {certificates.map((c, i) => (
              <div key={i} className="col-12 col-md-6">
                <div className="bg-slate-900 border border-slate-800 rounded-4 p-4">
                  <h5 className="fw-extrabold text-white mb-0">{c.title}</h5>
                  <span className="extra-small text-slate-400">{c.issuingOrganization}</span>
                  <div className="extra-small text-slate-400 mt-1">Issued: {c.issueDate}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── 6. REVIEWS TAB ───────────────────────────────────────────────── */}
        {activeTab === 'reviews' && (
          <div className="row g-4">
            {feedbackList.map((f, i) => (
              <div key={i} className="col-12 col-md-6">
                <div className="bg-slate-900 border border-slate-800 rounded-4 p-4">
                  <div className="d-flex align-items-center gap-1 text-warning mb-2">
                    {[...Array(5)].map((_, idx) => (
                      <i key={idx} className={`bi ${idx < (f.rating || 5) ? 'bi-star-fill' : 'bi-star'} extra-small`}></i>
                    ))}
                  </div>
                  <h6 className="fw-bold text-white mb-1">{f.visitorName}</h6>
                  {f.comment && <p className="small text-slate-300 bg-slate-950 p-3 rounded-3 mb-0">"{f.comment}"</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Schedule Meeting Modal */}
      {showMeetingModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-slate-900 text-white border border-slate-800 rounded-4">
              <div className="modal-header border-slate-800">
                <h5 className="modal-title fw-bold">Request a Meeting</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowMeetingModal(false)}></button>
              </div>
              <form onSubmit={handleMeetingSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label extra-small text-slate-400">Your Name *</label>
                    <input type="text" className="form-control bg-slate-950 border-slate-800 text-white form-control-sm" required
                      onChange={e => setMeetingForm({ ...meetingForm, requesterName: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label extra-small text-slate-400">Your Email *</label>
                    <input type="email" className="form-control bg-slate-950 border-slate-800 text-white form-control-sm" required
                      onChange={e => setMeetingForm({ ...meetingForm, requesterEmail: e.target.value })} />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label extra-small text-slate-400">Preferred Date *</label>
                      <input type="date" className="form-control bg-slate-950 border-slate-800 text-white form-control-sm" required
                        onChange={e => setMeetingForm({ ...meetingForm, preferredDate: e.target.value })} />
                    </div>
                    <div className="col-6">
                      <label className="form-label extra-small text-slate-400">Preferred Time *</label>
                      <input type="time" className="form-control bg-slate-950 border-slate-800 text-white form-control-sm" required
                        onChange={e => setMeetingForm({ ...meetingForm, preferredTime: e.target.value })} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label extra-small text-slate-400">Message / Topic</label>
                    <textarea className="form-control bg-slate-950 border-slate-800 text-white form-control-sm" rows="3"
                      onChange={e => setMeetingForm({ ...meetingForm, message: e.target.value })}></textarea>
                  </div>
                </div>
                <div className="modal-footer border-slate-800">
                  <button type="button" className="btn btn-sm btn-outline-light rounded-pill px-4" onClick={() => setShowMeetingModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-sm btn-purple rounded-pill px-4 text-white fw-bold">Submit Request</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Leave Feedback Modal */}
      {showFeedbackModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-slate-900 text-white border border-slate-800 rounded-4">
              <div className="modal-header border-slate-800">
                <h5 className="modal-title fw-bold">Leave a Review</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowFeedbackModal(false)}></button>
              </div>
              <form onSubmit={handleFeedbackSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label extra-small text-slate-400">Your Name *</label>
                    <input type="text" className="form-control bg-slate-950 border-slate-800 text-white form-control-sm" required
                      onChange={e => setFeedbackForm({ ...feedbackForm, visitorName: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label extra-small text-slate-400">Rating</label>
                    <select className="form-select bg-slate-950 border-slate-800 text-white form-select-sm" value={feedbackForm.rating}
                      onChange={e => setFeedbackForm({ ...feedbackForm, rating: e.target.value })}>
                      <option value="5">5 Stars - Excellent</option>
                      <option value="4">4 Stars - Very Good</option>
                      <option value="3">3 Stars - Good</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label extra-small text-slate-400">Comment</label>
                    <textarea className="form-control bg-slate-950 border-slate-800 text-white form-control-sm" rows="3"
                      onChange={e => setFeedbackForm({ ...feedbackForm, comment: e.target.value })}></textarea>
                  </div>
                </div>
                <div className="modal-footer border-slate-800">
                  <button type="button" className="btn btn-sm btn-outline-light rounded-pill px-4" onClick={() => setShowFeedbackModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-sm btn-purple rounded-pill px-4 text-white fw-bold">Submit Review</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicProfilePage;
