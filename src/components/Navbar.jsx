'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-inner">
          <Link href="/" className="navbar-logo">
            Kalp<span>.</span>
          </Link>
          
          <div className="navbar-links">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/menu">Menu</Link>
            <Link href="/reserve">Reserve</Link>
            <Link href="/#contact">Contact</Link>
            <Link href="/reserve" className="glass-button navbar-cta">
              Book a Table
            </Link>
          </div>

          <div 
            className={`navbar-toggle ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'active' : ''}`}>
        <Link href="/" onClick={toggleMobileMenu}>Home</Link>
        <Link href="/about" onClick={toggleMobileMenu}>About</Link>
        <Link href="/menu" onClick={toggleMobileMenu}>Menu</Link>
        <Link href="/reserve" onClick={toggleMobileMenu}>Reserve</Link>
        <Link href="/#contact" onClick={toggleMobileMenu}>Contact</Link>
      </div>
    </>
  );
}
