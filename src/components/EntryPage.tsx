import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import SpinnerPage from './SpinnerPage';
import '../css/EntryPage.css';

const FacebookIcon = () => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg> );
const XIcon = () => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg> );
const YouTubeIcon = () => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg> );
const LinkedinIcon = () => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg> );
const InstagramIcon = () => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> );
const TikTokIcon = () => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.85-.38-6.75-1.77-2.06-1.52-3.05-3.87-2.9-6.33.03-1.22.28-2.45.75-3.57.95-2.22 3.02-3.78 5.31-4.14 1.16-.18 2.34-.15 3.5-.14.02 1.54-.01 3.08.01 4.63-.03 1.48-.35 2.96-.94 4.32-.59 1.35-1.47 2.53-2.65 3.42-1.22.92-2.73 1.36-4.22 1.25-.09-.01-.17-.02-.26-.04-1.11-.08-2.14-.51-2.93-1.3-.82-.82-1.32-1.88-1.4-3.02-.03-.33-.05-.66-.06-.99V1.98c1.31-.01 2.61-.01 3.91-.01.07 1.45.54 2.89 1.48 4.02 1.01 1.21 2.48 1.83 4.02 1.83v-4.01c-.89.01-1.78-.19-2.62-.57-.79-.35-1.5-.83-2.1-1.42z"></path></svg> );
const RedDotLogo = () => ( <svg width="50" height="50" viewBox="0 0 100 100"><defs><radialGradient id="redDotGradient" cx="50%" cy="50%" r="50%" fx="65%" fy="35%"><stop offset="0%" style={{stopColor: '#FF5555', stopOpacity: 1}} /><stop offset="100%" style={{stopColor: '#CC0000', stopOpacity: 1}} /></radialGradient></defs><circle cx="50" cy="50" r="48" fill="url(#redDotGradient)" /></svg> );

const EntryPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState<number>(0);
  const DEFAULT_ACTIVE_STEP = 0;

  const handleSignUpClick = () => navigate('/signup');
  const handleSignInClick = () => navigate('/login');

  return (
    <>
    <div className="entry-page-root">
      <div className="page-container">
        <header>
          <div className="main-title-container">
            <h1 className="main-title">GET READY TO START</h1>
          </div>
        </header>

        <main>
          <section className="steps-container">
            
            <div 
              className={`step-card ${activeStep === 1 ? 'active' : ''}`}
              onMouseEnter={() => setActiveStep(1)}
              onMouseLeave={() => setActiveStep(DEFAULT_ACTIVE_STEP)}
              onClick={handleSignUpClick}
              style={{ cursor: 'pointer' }} 
            >
              <span className="step-number">01.</span>
              <p className="step-description">COMPLETE THE SIGN UP</p>
            </div>

            {/* 02. SIGN IN STEP */}
            <div 
              className={`step-card ${activeStep === 2 ? 'active' : ''}`}
              onMouseEnter={() => setActiveStep(2)}
              onMouseLeave={() => setActiveStep(DEFAULT_ACTIVE_STEP)}
              onClick={handleSignInClick} 
              style={{ cursor: 'pointer' }}
            >
              <span className="step-number">02.</span>
              <p className="step-description">RUN THE SIGN IN</p>
            </div>

            <div 
              className={`step-card ${activeStep === 3 ? 'active' : ''}`}
              onMouseEnter={() => setActiveStep(3)}
              onMouseLeave={() => setActiveStep(DEFAULT_ACTIVE_STEP)}
            >
              <span className="step-number">03.</span>
              <p className="step-description">CONGRATS!🥳🤩🎉🎉</p>
            </div>
          </section>

          <p className="retry-text">
            İçeride eğlence var.  <a href="#" onClick={(e) => { e.preventDefault(); handleSignInClick(); }}>İnanmıyorsanız deneyin</a>.
          </p>

          <section className="awards-section">
            <div className="award-item">
              <div className="rating-score">4.7<span>/5.0</span></div>
              <div className="award-text">2.2M Değerlendirme</div>
            </div>
            <div className="award-item"><RedDotLogo /><div className="award-text">Red Doooot Ödülü</div></div>
            <div className="award-item"><SpinnerPage /><div className="award-text">eLse Tasarım Ödülü</div></div>
          </section>
        </main>
      </div>
      
      <footer className="page-footer">
        <div className="footer-left">
          <span>CampusLink topluluğuna katılın</span>
          <div className="social-links">
            <a href="#" className="social-icon" aria-label="Facebook"><FacebookIcon/></a>
            <a href="#" className="social-icon" aria-label="X"><XIcon/></a>
            <a href="#" className="social-icon" aria-label="YouTube"><YouTubeIcon/></a>
            <a href="#" className="social-icon" aria-label="LinkedIn"><LinkedinIcon/></a>
            <a href="#" className="social-icon" aria-label="Instagram"><InstagramIcon/></a>
            <a href="#" className="social-icon" aria-label="TikTok"><TikTokIcon/></a>
          </div>
        </div>
        <div className="footer-center">Bu ekran Opera GX download ekranından esinlenilmiştir.</div>
      </footer>
      </div>
    </>
  );
};

export default EntryPage;