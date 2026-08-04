import { getBio } from '@/lib/content';
import Timeline from '@/components/Timeline';
import Link from 'next/link';

export const revalidate = 60;

export const metadata = {
  title: 'Contact & Bio | HIEPICTURE',
  description: 'Get in touch with HIEP — Visual Artist & Designer based in Ho Chi Minh City.',
};

export default async function ContactPage() {
  const bio = getBio();

  return (
    <div className="contact-section">
      <div className="contact-grid">
        {/* Contact Info */}
        <div className="contact-column">
          <div className="contact-tag">GET IN TOUCH</div>

          <div className="contact-field">
            <div className="contact-label">EMAIL</div>
            <a href={`mailto:${bio.email}`} className="contact-val">{bio.email}</a>
          </div>

          <div className="contact-field">
            <div className="contact-label">PHONE</div>
            <span className="contact-val">{bio.phone}</span>
          </div>

          <div className="contact-field">
            <div className="contact-label">LOCATION</div>
            <span className="contact-val">{bio.location}</span>
          </div>

          {bio.socialLinks && typeof bio.socialLinks === 'object' && (
            <div className="contact-field">
              <div className="contact-label">SOCIAL</div>
              <div className="social-links">
                {Object.entries(bio.socialLinks).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-val"
                    style={{ marginRight: '1.5rem', textTransform: 'capitalize' }}
                  >
                    {platform}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* About */}
        <div className="contact-column">
          <div className="contact-tag">ABOUT</div>
          <div className="about-text">
            {bio.about?.split('\n\n').map((paragraph, i) => (
              <p key={i} style={{ color: 'rgba(255,255,255,.65)', lineHeight: 1.8, marginBottom: '1rem', fontSize: '15px' }}>
                {paragraph}
              </p>
            ))}
          </div>

          {bio.skills && (
            <>
              <div className="contact-tag" style={{ marginTop: '2rem' }}>SKILLS</div>
              <div className="skills-list">
                {bio.skills.map(skill => (
                  <span key={skill} className="skill-tag">{skill}</span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Timeline */}
        <div className="contact-column">
          <div className="contact-tag">EXPERIENCE</div>
          {bio.timeline && <Timeline items={bio.timeline} />}

          {bio.education && (
            <>
              <div className="contact-tag" style={{ marginTop: '2rem' }}>EDUCATION</div>
              {bio.education.map((edu, i) => (
                <div key={i} className="contact-field">
                  <div className="contact-label">{edu.year}</div>
                  <span className="contact-val">{edu.institution}</span>
                  <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '12px', marginTop: '4px' }}>{edu.degree}</p>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
