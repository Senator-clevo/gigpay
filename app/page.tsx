'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setIsLoaded(true)
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          overflow-x: hidden;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(201, 168, 76, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(201, 168, 76, 0.6);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes orb-move {
          0% {
            transform: translate(0, 0);
          }
          33% {
            transform: translate(30px, -30px);
          }
          66% {
            transform: translate(-20px, 20px);
          }
          100% {
            transform: translate(0, 0);
          }
        }

        .landing-root {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1209 50%, #0d0804 100%);
          position: relative;
          overflow: hidden;
        }

        /* Animated background orbs */
        .orb {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }

        .orb-1 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(201, 168, 76, 0.15), transparent);
          top: -100px;
          left: -100px;
          animation: orb-move 20s infinite ease-in-out;
        }

        .orb-2 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(160, 136, 255, 0.1), transparent);
          bottom: -50px;
          right: -50px;
          animation: orb-move 25s infinite ease-in-out reverse;
        }

        .orb-3 {
          width: 250px;
          height: 250px;
          background: radial-gradient(circle, rgba(0, 255, 136, 0.08), transparent);
          top: 50%;
          right: 10%;
          animation: orb-move 30s infinite ease-in-out;
        }

        /* Noise texture */
        .noise {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          opacity: 0.02;
          background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23fff" width="100" height="100"/><rect fill="%23000" width="50" height="50"/><rect fill="%23000" x="50" y="50" width="50" height="50"/></svg>');
        }

        /* Header */
        .header {
          position: relative;
          z-index: 10;
          padding: 24px 40px;
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(201, 168, 76, 0.1);
          background: rgba(15, 15, 15, 0.4);
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: 24px;
          color: #fff;
          animation: slideInLeft 0.8s ease-out;
        }

        .logo-mark {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #C9A84C, #A67C30);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(201, 168, 76, 0.3);
          animation: glow 3s ease-in-out infinite;
        }

        .nav-links {
          display: flex;
          gap: 32px;
          align-items: center;
          animation: slideInRight 0.8s ease-out;
        }

        .nav-link {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
          position: relative;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #C9A84C, #A67C30);
          transition: width 0.3s ease;
        }

        .nav-link:hover {
          color: #C9A84C;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .cta-header {
          padding: 12px 24px;
          background: linear-gradient(135deg, #C9A84C, #A67C30);
          color: #0f0f0f;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.3s cubic-bezier(0.77, 0, 0.175, 1);
          box-shadow: 0 8px 24px rgba(201, 168, 76, 0.3);
        }

        .cta-header:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(201, 168, 76, 0.4);
        }

        /* Hero Section */
        .hero {
          position: relative;
          z-index: 5;
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 40px;
          text-align: center;
        }

        .hero-content {
          max-width: 800px;
          animation: fadeInUp 1s ease-out;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: rgba(201, 168, 76, 0.1);
          border: 1px solid rgba(201, 168, 76, 0.3);
          border-radius: 50px;
          color: #C9A84C;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 24px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          animation: fadeInUp 1s ease-out 0.1s both;
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(42px, 8vw, 72px);
          font-weight: 700;
          color: #fff;
          margin-bottom: 16px;
          line-height: 1.1;
          animation: fadeInUp 1s ease-out 0.2s both;
        }

        .hero-title span {
          background: linear-gradient(135deg, #C9A84C, #A67C30, #C9A84C);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: pulse 3s ease-in-out infinite;
        }

        .hero-subtitle {
          font-size: clamp(16px, 2vw, 20px);
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 40px;
          line-height: 1.6;
          animation: fadeInUp 1s ease-out 0.3s both;
        }

        .hero-cta {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
          animation: fadeInUp 1s ease-out 0.4s both;
        }

        .btn-primary {
          padding: 18px 40px;
          background: linear-gradient(135deg, #C9A84C, #A67C30);
          color: #0f0f0f;
          border: none;
          border-radius: 20px;
          font-weight: 700;
          font-size: 16px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.77, 0, 0.175, 1);
          box-shadow: 0 12px 32px rgba(201, 168, 76, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 48px rgba(201, 168, 76, 0.4);
        }

        .btn-secondary {
          padding: 18px 40px;
          background: transparent;
          color: #fff;
          border: 2px solid rgba(201, 168, 76, 0.5);
          border-radius: 20px;
          font-weight: 700;
          font-size: 16px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          border-color: #C9A84C;
          background: rgba(201, 168, 76, 0.1);
          transform: translateY(-6px);
        }

        /* Features Section */
        .features {
          position: relative;
          z-index: 5;
          padding: 100px 40px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(36px, 6vw, 56px);
          font-weight: 700;
          color: #fff;
          text-align: center;
          margin-bottom: 60px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }

        .feature-card {
          padding: 40px 32px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(201, 168, 76, 0.1);
          border-radius: 24px;
          transition: all 0.4s cubic-bezier(0.77, 0, 0.175, 1);
          position: relative;
          overflow: hidden;
          animation: fadeInUp 1s ease-out both;
        }

        .feature-card:nth-child(1) {
          animation-delay: 0.1s;
        }

        .feature-card:nth-child(2) {
          animation-delay: 0.2s;
        }

        .feature-card:nth-child(3) {
          animation-delay: 0.3s;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201, 168, 76, 0.5), transparent);
        }

        .feature-card:hover {
          transform: translateY(-12px);
          border-color: rgba(201, 168, 76, 0.3);
          box-shadow: 0 24px 48px rgba(201, 168, 76, 0.15);
          background: rgba(255, 255, 255, 0.04);
        }

        .feature-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, rgba(201, 168, 76, 0.2), rgba(160, 136, 255, 0.2));
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          margin-bottom: 20px;
          transition: all 0.3s ease;
        }

        .feature-card:hover .feature-icon {
          transform: scale(1.1) rotate(5deg);
          background: linear-gradient(135deg, rgba(201, 168, 76, 0.3), rgba(160, 136, 255, 0.3));
        }

        .feature-title {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 12px;
        }

        .feature-desc {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.6;
        }

        /* Stats Section */
        .stats {
          position: relative;
          z-index: 5;
          padding: 80px 40px;
          background: linear-gradient(135deg, rgba(201, 168, 76, 0.05), rgba(160, 136, 255, 0.05));
          border-top: 1px solid rgba(201, 168, 76, 0.1);
          border-bottom: 1px solid rgba(201, 168, 76, 0.1);
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 40px;
          text-align: center;
        }

        .stat-item {
          animation: fadeInUp 1s ease-out both;
        }

        .stat-item:nth-child(1) {
          animation-delay: 0.1s;
        }

        .stat-item:nth-child(2) {
          animation-delay: 0.2s;
        }

        .stat-item:nth-child(3) {
          animation-delay: 0.3s;
        }

        .stat-number {
          font-family: 'Playfair Display', serif;
          font-size: 48px;
          font-weight: 700;
          background: linear-gradient(135deg, #C9A84C, #A67C30);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* CTA Section */
        .cta-section {
          position: relative;
          z-index: 5;
          padding: 100px 40px;
          text-align: center;
          max-width: 900px;
          margin: 0 auto;
        }

        .cta-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 700;
          color: #fff;
          margin-bottom: 24px;
          animation: fadeInUp 1s ease-out;
        }

        .cta-subtitle {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 40px;
          animation: fadeInUp 1s ease-out 0.1s both;
        }

        .cta-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
          animation: fadeInUp 1s ease-out 0.2s both;
        }

        /* Footer */
        .footer {
          position: relative;
          z-index: 5;
          padding: 60px 40px 40px;
          border-top: 1px solid rgba(201, 168, 76, 0.1);
          background: rgba(15, 15, 15, 0.4);
        }

        .footer-content {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 40px;
          margin-bottom: 40px;
        }

        .footer-section h3 {
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .footer-link {
          display: block;
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          font-size: 14px;
          margin-bottom: 12px;
          transition: all 0.3s ease;
        }

        .footer-link:hover {
          color: #C9A84C;
          transform: translateX(4px);
        }

        .footer-bottom {
          border-top: 1px solid rgba(201, 168, 76, 0.1);
          padding-top: 32px;
          text-align: center;
          color: rgba(255, 255, 255, 0.4);
          font-size: 13px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .header {
            padding: 16px 20px;
          }

          .header-content {
            flex-direction: column;
            gap: 16px;
          }

          .nav-links {
            flex-direction: column;
            gap: 12px;
            width: 100%;
          }

          .nav-link {
            font-size: 13px;
          }

          .hero {
            padding: 40px 20px;
            min-height: calc(100vh - 60px);
          }

          .features {
            padding: 60px 20px;
          }

          .stats {
            padding: 60px 20px;
          }

          .cta-section {
            padding: 60px 20px;
          }

          .hero-cta {
            gap: 12px;
          }

          .btn-primary,
          .btn-secondary {
            padding: 14px 28px;
            font-size: 14px;
          }
        }
      `}</style>

      <div className="landing-root">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="noise" />

        {/* Header */}
        <header className="header">
          <div className="header-content">
            <Link href="/" className="logo">
              <div className="logo-mark">
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '24px', height: '24px' }}>
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                </svg>
              </div>
              GigPay
            </Link>
            <nav className="nav-links">
              <a href="#features" className="nav-link">Features</a>
              <a href="#how-it-works" className="nav-link">How it Works</a>
              <Link href="/login" className="cta-header">Sign In</Link>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <div className="hero-badge">🚀 The Future of Freelancing</div>
            <h1 className="hero-title">
              Get Paid <span>Every Time</span> — No Excuses
            </h1>
            <p className="hero-subtitle">
              GigPay uses escrow to hold client payments safely until you deliver. No chasing. No fake alerts. No arguments. Just instant payment to your bank.
            </p>
            <div className="hero-cta">
              <Link href="/signup" className="btn-primary">
                Start Earning Today
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px' }}>
                  <path d="M7 10h12M17 6l4 4m-4 4l4-4"/>
                </svg>
              </Link>
              <a href="#features" className="btn-secondary">
                Learn More
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features">
          <h2 className="section-title">Why Choose GigPay?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h3 className="feature-title">Escrow Protection</h3>
              <p className="feature-desc">Your payment is held securely by Payaza until you deliver. Zero risk, pure confidence.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Instant Payouts</h3>
              <p className="feature-desc">Deliver your work and get paid in minutes. Your money lands directly in your bank account.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Income History</h3>
              <p className="feature-desc">Build your verified earnings profile. Access microloans and financial services designed for you.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3 className="feature-title">Client Ratings</h3>
              <p className="feature-desc">See who pays on time. Protect yourself from bad clients before you invest any work.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">Milestone Payments</h3>
              <p className="feature-desc">Split big projects into stages. Get paid 30% upfront, 40% at midpoint, 30% on delivery.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3 className="feature-title">QR Code Payments</h3>
              <p className="feature-desc">Show a QR code in person. Clients scan it, pay instantly. No links. No WhatsApp. Done.</p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="how-it-works" className="stats">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">30M+</div>
              <div className="stat-label">Gig Workers in Africa</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">₦0</div>
              <div className="stat-label">Hidden Charges</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">&lt;5 min</div>
              <div className="stat-label">Payout Time</div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="features" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
          <h2 className="section-title">How It Works</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">1️⃣</div>
              <h3 className="feature-title">Create Your Gig</h3>
              <p className="feature-desc">Write a job title, set your rate, add details. Our AI helps write a professional brief.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">2️⃣</div>
              <h3 className="feature-title">Share the Link</h3>
              <p className="feature-desc">Copy your payment link or scan the QR code. Send it to your client on WhatsApp.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">3️⃣</div>
              <h3 className="feature-title">Client Pays</h3>
              <p className="feature-desc">They click the link, pay via card, bank transfer, or USSD. Money goes into escrow.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">4️⃣</div>
              <h3 className="feature-title">You Deliver</h3>
              <p className="feature-desc">Start work confidently. The money is guaranteed. No chasing. Just deliver.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">5️⃣</div>
              <h3 className="feature-title">Get Paid</h3>
              <p className="feature-desc">Mark it delivered. Money lands in your bank instantly. Repeat forever.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎁</div>
              <h3 className="feature-title">Build Credit</h3>
              <p className="feature-desc">Every job you complete is recorded. Soon: loans, investments, financial freedom.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <h2 className="cta-title">Stop Chasing. Start Getting Paid.</h2>
          <p className="cta-subtitle">Join thousands of Nigerian freelancers who are already earning confidently with GigPay.</p>
          <div className="cta-buttons">
            <Link href="/signup" className="btn-primary">
              Create Account Free
            </Link>
            <a href="mailto:support@gigpay.app" className="btn-secondary">
              Contact Support
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <div>
              <h3>GigPay</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Escrow payments for gig workers. No risk. Just work.</p>
            </div>
            <div>
              <h3>Product</h3>
              <a href="#features" className="footer-link">Features</a>
              <a href="#how-it-works" className="footer-link">How It Works</a>
              <a href="#" className="footer-link">Pricing</a>
            </div>
            <div>
              <h3>Company</h3>
              <a href="#" className="footer-link">About</a>
              <a href="#" className="footer-link">Blog</a>
              <a href="#" className="footer-link">Careers</a>
            </div>
            <div>
              <h3>Legal</h3>
              <a href="#" className="footer-link">Privacy</a>
              <a href="#" className="footer-link">Terms</a>
              <a href="#" className="footer-link">Security</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 GigPay. Powered by Payaza. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  )
}
