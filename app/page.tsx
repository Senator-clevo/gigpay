'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [visibleSections, setVisibleSections] = useState({})
  const containerRef = useRef(null)

  useEffect(() => {
    setIsLoaded(true)

    const handleScroll = () => {
      const sections = ['features', 'stats', 'how', 'cta']
      sections.forEach(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          const isVisible = rect.top < window.innerHeight * 0.75
          setVisibleSections(prev => ({
            ...prev,
            [section]: isVisible
          }))
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          max-width: 100%;
        }

        html, body {
          overflow-x: hidden;
          width: 100%;
          background: #faf8f5;
          scroll-behavior: smooth;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          overflow-x: hidden;
          background: #faf8f5;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-60px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(60px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-16px); }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(201, 168, 76, 0.3), 0 0 40px rgba(201, 168, 76, 0.1); }
          50% { box-shadow: 0 0 30px rgba(201, 168, 76, 0.5), 0 0 60px rgba(201, 168, 76, 0.2); }
        }

        @keyframes glowText {
          0%, 100% { text-shadow: 0 0 10px rgba(201, 168, 76, 0.3), 0 0 20px rgba(201, 168, 76, 0.1); }
          50% { text-shadow: 0 0 20px rgba(201, 168, 76, 0.6), 0 0 30px rgba(201, 168, 76, 0.3); }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 1; box-shadow: 0 0 15px rgba(201, 168, 76, 0.2); }
          50% { opacity: 0.85; box-shadow: 0 0 30px rgba(201, 168, 76, 0.4); }
        }

        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.93); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes bounce-in {
          0% { opacity: 0; transform: translateY(30px) scale(0.9); }
          60% { opacity: 1; }
          100% { transform: translateY(0) scale(1); }
        }

        @keyframes floating-icon {
          0%, 100% { transform: translateY(0px); }
          25% { transform: translateY(-8px); }
          50% { transform: translateY(-12px); }
          75% { transform: translateY(-6px); }
        }

        .orb {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          mix-blend-mode: multiply;
          z-index: 0;
        }

        .orb-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(201, 168, 76, 0.25) 0%, transparent 70%);
          top: -150px; left: -150px;
          animation: float 8s ease-in-out infinite;
        }

        .orb-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(160, 136, 100, 0.18) 0%, transparent 70%);
          bottom: -100px; right: -100px;
          animation: float 10s ease-in-out infinite 1s;
        }

        .orb-3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(180, 160, 140, 0.15) 0%, transparent 70%);
          top: 50%; right: 5%;
          animation: float 12s ease-in-out infinite 2s;
        }

        .header {
          position: relative; z-index: 50;
          padding: 28px 40px;
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(201, 168, 76, 0.15);
          background: rgba(250, 248, 245, 0.7);
          animation: fadeInDown 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .header-content {
          max-width: 1400px; margin: 0 auto;
          display: flex; align-items: center;
          justify-content: space-between; gap: 40px;
        }

        .logo {
          display: flex; align-items: center; gap: 12px;
          text-decoration: none;
          font-family: 'Syne', sans-serif; font-weight: 700; font-size: 26px;
          color: #1a1209; transition: all 0.3s ease;
        }

        .logo:hover { transform: translateX(2px); }

        .logo-mark {
          width: 44px; height: 44px;
          background: linear-gradient(135deg, #c9a84c, #a67c30);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          animation: pulse-glow 3s ease-in-out infinite;
          transition: all 0.3s ease;
        }

        .logo-mark:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 24px rgba(201, 168, 76, 0.3);
        }

        .logo-mark svg { width: 22px; height: 22px; fill: white; }

        .nav {
          display: flex; gap: 28px; align-items: center;
          animation: slideInRight 0.8s ease-out;
        }

        .nav-link {
          color: #555; text-decoration: none;
          font-size: 15px; font-weight: 500;
          transition: all 0.3s ease; position: relative;
        }

        .nav-link::after {
          content: ''; position: absolute;
          bottom: -6px; left: 0; width: 0; height: 2px;
          background: linear-gradient(90deg, #c9a84c, #a67c30);
          transition: width 0.3s ease;
        }

        .nav-link:hover { color: #c9a84c; }
        .nav-link:hover::after { width: 100%; }

        .btn-header {
          padding: 12px 26px;
          background: linear-gradient(135deg, #c9a84c, #a67c30);
          color: #fff; border-radius: 12px; text-decoration: none;
          font-weight: 600; font-size: 14px; transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(201, 168, 76, 0.25);
        }

        .btn-header:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(201, 168, 76, 0.35);
        }

        .hero {
          position: relative; z-index: 10;
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          padding: 80px 40px; text-align: center;
        }

        .hero-content {
          max-width: 900px;
          animation: fadeInUp 1s ease-out;
        }

        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 22px;
          background: rgba(201, 168, 76, 0.12);
          border: 1px solid rgba(201, 168, 76, 0.3);
          border-radius: 50px; color: #c9a84c;
          font-size: 12px; font-weight: 600; margin-bottom: 28px;
          text-transform: uppercase; letter-spacing: 0.08em;
          animation: scale-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both;
          backdrop-filter: blur(10px);
        }

        .hero-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(40px, 9vw, 84px);
          font-weight: 700; color: #1a1209;
          margin-bottom: 20px; line-height: 1.05;
          animation: fadeInUp 1s ease-out 0.2s both;
          letter-spacing: -0.02em;
        }

        .hero-title .accent {
          background: linear-gradient(135deg, #c9a84c, #a67c30);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: glowText 3s ease-in-out infinite;
        }

        .hero-subtitle {
          font-size: clamp(15px, 2.5vw, 22px);
          color: #666; margin-bottom: 48px;
          line-height: 1.7;
          animation: fadeInUp 1s ease-out 0.3s both;
          font-weight: 400;
        }

        .hero-cta {
          display: flex; gap: 18px;
          justify-content: center; flex-wrap: wrap;
          animation: fadeInUp 1s ease-out 0.4s both;
        }

        .features {
          position: relative; z-index: 10;
          padding: 120px 40px;
          max-width: 1400px; margin: 0 auto;
        }

        .section-label {
          display: inline-block;
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: #c9a84c; margin-bottom: 12px;
        }

        .section-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(32px, 7vw, 64px);
          font-weight: 700; color: #1a1209;
          margin-bottom: 60px; line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 32px;
        }

        .feature-card {
          padding: 44px 36px;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(201, 168, 76, 0.15);
          border-radius: 20px;
          transition: all 0.4s cubic-bezier(0.77, 0, 0.175, 1);
          position: relative; overflow: hidden;
          backdrop-filter: blur(10px);
          animation: fadeInUp 1s ease-out both;
        }

        .feature-card:nth-child(1) { animation-delay: 0.1s; }
        .feature-card:nth-child(2) { animation-delay: 0.2s; }
        .feature-card:nth-child(3) { animation-delay: 0.3s; }
        .feature-card:nth-child(4) { animation-delay: 0.4s; }

        .feature-card::before {
          content: ''; position: absolute;
          top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(201, 168, 76, 0.4), transparent);
        }

        .feature-card:hover {
          transform: translateY(-16px);
          border-color: rgba(201, 168, 76, 0.3);
          box-shadow: 0 32px 64px rgba(201, 168, 76, 0.15);
          background: rgba(255, 255, 255, 0.95);
        }

        .feature-icon {
          width: 70px; height: 70px;
          background: linear-gradient(135deg, rgba(201, 168, 76, 0.15), rgba(160, 136, 100, 0.1));
          border-radius: 18px;
          display: flex; align-items: center; justify-content: center;
          font-size: 36px; margin-bottom: 24px;
          transition: all 0.3s ease;
          animation: floating-icon 3s ease-in-out infinite;
        }

        .feature-card:hover .feature-icon {
          transform: scale(1.1);
          background: linear-gradient(135deg, rgba(201, 168, 76, 0.3), rgba(160, 136, 100, 0.25));
          animation: none;
        }

        .feature-title {
          font-size: 22px; font-weight: 700; color: #1a1209;
          margin-bottom: 14px; font-family: 'Syne', sans-serif;
          transition: color 0.3s ease;
        }

        .feature-card:hover .feature-title { color: #c9a84c; }

        .feature-desc {
          font-size: 15px; color: #666; line-height: 1.7;
          transition: color 0.3s ease;
        }

        .feature-card:hover .feature-desc { color: #555; }

        .stats {
          position: relative; z-index: 10;
          padding: 100px 40px;
          background: linear-gradient(135deg, rgba(201, 168, 76, 0.08), rgba(160, 136, 100, 0.06));
          border-top: 1px solid rgba(201, 168, 76, 0.15);
          border-bottom: 1px solid rgba(201, 168, 76, 0.15);
          max-width: 1400px; margin: 0 auto; border-radius: 24px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 50px; text-align: center;
        }

        .stat-item {
          animation: fadeInUp 1s ease-out both;
          transition: all 0.3s ease;
        }

        .stat-item:nth-child(1) { animation-delay: 0.1s; }
        .stat-item:nth-child(2) { animation-delay: 0.2s; }
        .stat-item:nth-child(3) { animation-delay: 0.3s; }
        .stat-item:hover { transform: scale(1.05); }

        .stat-number {
          font-family: 'Syne', sans-serif; font-size: 56px; font-weight: 700;
          background: linear-gradient(135deg, #c9a84c, #a67c30);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; margin-bottom: 10px;
          animation: glowText 2s ease-in-out infinite;
        }

        .stat-label {
          font-size: 14px; color: #666;
          text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600;
        }

        .how-section {
          position: relative; z-index: 10;
          padding: 120px 40px;
          max-width: 1400px; margin: 0 auto;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 32px;
        }

        .step-card {
          position: relative; padding: 40px 32px;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(201, 168, 76, 0.15);
          border-radius: 16px; text-align: center;
          animation: bounce-in 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          backdrop-filter: blur(10px); transition: all 0.3s ease;
        }

        .step-card:nth-child(1) { animation-delay: 0.1s; }
        .step-card:nth-child(2) { animation-delay: 0.2s; }
        .step-card:nth-child(3) { animation-delay: 0.3s; }
        .step-card:nth-child(4) { animation-delay: 0.4s; }

        .step-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 24px 48px rgba(201, 168, 76, 0.12);
          border-color: rgba(201, 168, 76, 0.25);
        }

        .step-number {
          width: 50px; height: 50px;
          background: linear-gradient(135deg, rgba(201, 168, 76, 0.25), rgba(160, 136, 100, 0.15));
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 700;
          color: #c9a84c; margin-bottom: 20px;
          margin-left: auto; margin-right: auto;
          transition: all 0.3s ease;
        }

        .step-card:hover .step-number {
          background: linear-gradient(135deg, rgba(201, 168, 76, 0.4), rgba(160, 136, 100, 0.3));
          transform: scale(1.08);
        }

        .step-title {
          font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700;
          color: #1a1209; margin-bottom: 12px; transition: color 0.3s ease;
        }

        .step-card:hover .step-title { color: #c9a84c; }
        .step-desc { font-size: 14px; color: #666; line-height: 1.6; }

        .cta-section {
          position: relative; z-index: 10;
          padding: 100px 40px; text-align: center;
          max-width: 900px; margin: 0 auto;
        }

        .cta-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(30px, 6vw, 56px);
          font-weight: 700; color: #1a1209;
          margin-bottom: 28px; line-height: 1.15;
          animation: fadeInUp 0.8s ease-out; letter-spacing: -0.01em;
        }

        .cta-desc {
          font-size: 18px; color: #666;
          margin-bottom: 40px; line-height: 1.7;
          animation: fadeInUp 0.8s ease-out 0.1s both;
        }

        .cta-buttons {
          display: flex; gap: 18px;
          justify-content: center; flex-wrap: wrap;
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .btn-primary {
          padding: 20px 44px;
          background: linear-gradient(135deg, #c9a84c, #a67c30);
          color: #fff; border: none; border-radius: 16px;
          font-weight: 700; font-size: 16px; text-decoration: none;
          display: inline-flex; align-items: center; gap: 10px;
          cursor: pointer; transition: all 0.3s cubic-bezier(0.77, 0, 0.175, 1);
          box-shadow: 0 12px 36px rgba(201, 168, 76, 0.3);
          font-family: 'Inter', sans-serif; position: relative; overflow: hidden;
        }

        .btn-primary::before {
          content: ''; position: absolute;
          top: 0; left: -100%; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .btn-primary:hover::before { left: 100%; }
        .btn-primary:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 50px rgba(201, 168, 76, 0.4);
        }

        .btn-secondary {
          padding: 20px 44px; background: transparent;
          color: #1a1209; border: 2px solid rgba(201, 168, 76, 0.4);
          border-radius: 16px; font-weight: 700; font-size: 16px;
          text-decoration: none; display: inline-flex; align-items: center; gap: 10px;
          cursor: pointer; transition: all 0.3s ease;
          font-family: 'Inter', sans-serif; position: relative;
        }

        .btn-secondary:hover {
          border-color: #c9a84c;
          background: rgba(201, 168, 76, 0.08);
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(201, 168, 76, 0.15);
        }

        .footer {
          position: relative; z-index: 10;
          padding: 80px 40px 40px;
          background: rgba(250, 248, 245, 0.5);
          border-top: 1px solid rgba(201, 168, 76, 0.15);
          max-width: 1400px; margin: 0 auto;
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 60px; margin-bottom: 60px;
          animation: fadeInUp 0.8s ease-out;
        }

        .footer-section h4 {
          font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
          color: #1a1209; margin-bottom: 20px;
          text-transform: uppercase; letter-spacing: 0.08em;
        }

        .footer-link {
          display: block; color: #666; text-decoration: none;
          font-size: 14px; margin-bottom: 12px; transition: all 0.3s ease;
        }

        .footer-link:hover { color: #c9a84c; transform: translateX(4px); }

        .footer-bottom {
          border-top: 1px solid rgba(201, 168, 76, 0.15);
          padding-top: 40px;
          display: flex; justify-content: space-between;
          align-items: center; flex-wrap: wrap;
          gap: 20px; color: #999; font-size: 13px;
        }

        /* ===== MOBILE FIXES ===== */
        @media (max-width: 768px) {
          .header { padding: 16px 20px; }
          .header-content { gap: 12px; }
          .nav { gap: 12px; }
          .nav-link { font-size: 13px; }
          .btn-header { padding: 10px 16px; font-size: 13px; }

          .hero { padding: 60px 20px; min-height: auto; }

          .features, .how-section, .cta-section { padding: 60px 20px; }

          .stats { padding: 60px 20px; margin: 0 20px; border-radius: 16px; }

          .features-grid, .steps-grid { grid-template-columns: 1fr; }

          .feature-card, .step-card { padding: 28px 20px; }

          .cta-buttons { flex-direction: column; }

          .btn-primary, .btn-secondary {
            width: 100%; justify-content: center; padding: 16px 24px;
          }

          .footer { padding: 60px 20px 40px; margin: 0; }

          .footer-content { grid-template-columns: 1fr 1fr; gap: 32px; }

          .footer-bottom { flex-direction: column; justify-content: center; text-align: center; }

          .orb-1, .orb-2, .orb-3 { display: none; }
        }
      `}</style>

      <div ref={containerRef} className="relative w-full">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>

        <header className="header">
          <div className="header-content">
            <Link href="/" className="logo">
              <div className="logo-mark">
                <svg viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                </svg>
              </div>
              GigPay
            </Link>
            <nav className="nav">
              <a href="#features" className="nav-link">Features</a>
              <a href="#how" className="nav-link">How It Works</a>
              <a href="#cta" className="nav-link">Get Started</a>
              <a href="/login" className="btn-header">Login</a>
            </nav>
          </div>
        </header>

        <section className="hero">
          <div className="hero-content">
            <div className="hero-badge">Trusted by freelancers & clients</div>
            <h1 className="hero-title">
              <span className="accent">The trust infrastructure</span> for freelance work
            </h1>
            <p className="hero-subtitle">
              Secure escrow payments that give freelancers peace of mind and clients confidence. Get paid on time, every time.
            </p>
            <div className="hero-cta">
              <Link href="/signup" className="btn-primary">Get Started</Link>
              <Link href="#features" className="btn-secondary">Learn More</Link>
            </div>
          </div>
        </section>

        <section id="features" className="features">
          <div className="section-label">Why GigPay</div>
          <h2 className="section-title">Secure escrow payments for modern gig workers</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Funds Secured Upfront</h3>
              <p className="feature-desc">Client payments are locked in escrow before you start work. Never worry about unpaid invoices again.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Instant Payouts</h3>
              <p className="feature-desc">Receive funds instantly to your bank account after project completion and approval.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Complete Transparency</h3>
              <p className="feature-desc">Track every transaction, milestone, and payment in real-time with our dashboard.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3 className="feature-title">Made for Africa</h3>
              <p className="feature-desc">Built specifically for Nigeria&apos;s growing gig economy with local payment methods.</p>
            </div>
          </div>
        </section>

        <section id="stats" className="stats">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">30M+</div>
              <div className="stat-label">Gig Workers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">₦2T+</div>
              <div className="stat-label">Annual Gig Economy</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">85%</div>
              <div className="stat-label">Payment Delays Eliminated</div>
            </div>
          </div>
        </section>

        <section id="how" className="how-section">
          <div className="section-label">The Process</div>
          <h2 className="section-title">Freelance payments, reinvented with trust</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Create Project</h3>
              <p className="step-desc">Post your project details and scope of work.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">Secure Payment</h3>
              <p className="step-desc">Client funds are held securely in escrow.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Deliver Work</h3>
              <p className="step-desc">Complete your project with confidence and security.</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3 className="step-title">Get Paid</h3>
              <p className="step-desc">Receive payment instantly after approval.</p>
            </div>
          </div>
        </section>

        <section id="cta" className="cta-section">
          <h2 className="cta-title">Africa&apos;s secure payment layer for freelancers</h2>
          <p className="cta-desc">
            GigPay helps freelancers work with confidence by securing client payments upfront and releasing funds instantly after work is delivered.
          </p>
          <div className="cta-buttons">
            <Link href="/signup" className="btn-primary">Start Earning Securely</Link>
            <Link href="/demo" className="btn-secondary">Watch Demo</Link>
          </div>
        </section>

        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Product</h4>
              <a href="#" className="footer-link">Features</a>
              <a href="#" className="footer-link">Pricing</a>
              <a href="#" className="footer-link">Security</a>
              <a href="#" className="footer-link">Updates</a>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <a href="#" className="footer-link">About</a>
              <a href="#" className="footer-link">Blog</a>
              <a href="#" className="footer-link">Careers</a>
              <a href="#" className="footer-link">Contact</a>
            </div>
            <div className="footer-section">
              <h4>Resources</h4>
              <a href="#" className="footer-link">Help Center</a>
              <a href="#" className="footer-link">Community</a>
              <a href="#" className="footer-link">API Docs</a>
              <a href="#" className="footer-link">Status</a>
            </div>
            <div className="footer-section">
              <h4>Legal</h4>
              <a href="#" className="footer-link">Privacy</a>
              <a href="#" className="footer-link">Terms</a>
              <a href="#" className="footer-link">Compliance</a>
              <a href="#" className="footer-link">Disputes</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 GigPay. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <a href="#" style={{ color: '#999', textDecoration: 'none' }}>Twitter</a>
              <a href="#" style={{ color: '#999', textDecoration: 'none' }}>LinkedIn</a>
              <a href="#" style={{ color: '#999', textDecoration: 'none' }}>Instagram</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}