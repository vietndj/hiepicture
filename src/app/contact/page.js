import { getBio } from '@/lib/content';
import Image from 'next/image';

export const metadata = {
  title: 'Bio & Contact | HIEPICTURE',
};

export default function ContactPage() {
  const bio = getBio();

  return (
    <div className="bio-contact-page">
      <div className="bio-container">
        {/* Left Column: Portrait & Contact Info */}
        <div className="bio-portrait-col">
          <div className="portrait-wrap">
            <Image
              src={bio.photo || "/artist-hiep.jpg"}
              alt={bio.name || "HIEP"}
              width={400}
              height={400}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              priority
            />
          </div>

          <div className="contact-info-block">
            <div className="contact-field-label">EMAIL :</div>
            <a href={`mailto:${bio.email}`} className="contact-field-value">{bio.email}</a>

            <div className="contact-field-label" style={{ marginTop: '1.5rem' }}>PHONE :</div>
            <a href={`tel:${bio.phone}`} className="contact-field-value">{bio.phone}</a>
          </div>
        </div>

        {/* Right Area: 3 Equal Columns */}
        <div className="bio-content-grid">
          {/* Column 1: Occupation & Logo Branding */}
          <div className="bio-col">
            <div className="bio-section">
              <h3 className="bio-section-title">Occupation</h3>
              <ul className="bio-list">
                {bio.occupation?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="bio-section" style={{ marginTop: '2.5rem' }}>
              <h3 className="bio-section-title">Logo & branding</h3>
              <ul className="bio-list">
                {bio.logoAndBranding?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 2: Arts & Design */}
          <div className="bio-col">
            <div className="bio-section">
              <h3 className="bio-section-title">Arts & Design</h3>
              <ul className="bio-list">
                {bio.artsAndDesign?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 3: Tutoring & Academic Head, Typography */}
          <div className="bio-col">
            <div className="bio-section">
              <h3 className="bio-section-title">Tutoring & being Academic head</h3>
              <ul className="bio-list">
                {bio.tutoringAndAcademic?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="bio-section" style={{ marginTop: '2.5rem' }}>
              <h3 className="bio-section-title">Typography</h3>
              <ul className="bio-list">
                {bio.typography?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
