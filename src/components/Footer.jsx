'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand-name">Kalp<span>.</span></div>
            <p className="footer-brand-desc">
              A premium dining experience in Navi Mumbai, bringing you a symphony of global flavours curated by masterful chefs.
            </p>
          </div>
          
          <div>
            <h4 className="footer-column-title">Explore</h4>
            <div className="footer-links">
              <Link href="#home">Home</Link>
              <Link href="#about">About Us</Link>
              <Link href="#cuisine">Menu</Link>
              <Link href="/reserve">Reservations</Link>
              <Link href="/#contact">Location</Link>
            </div>
          </div>
          
          <div>
            <h4 className="footer-column-title">Our Cuisines</h4>
            <div className="footer-links">
              <Link href="#cuisine">North Indian</Link>
              <Link href="#cuisine">Asian & Oriental</Link>
              <Link href="#cuisine">Italian</Link>
              <Link href="#cuisine">Korean</Link>
              <Link href="#cuisine">Desserts</Link>
            </div>
          </div>
          
          <div>
            <h4 className="footer-column-title">Connect</h4>
            <div className="footer-links">
              <a href="tel:+919833335005">+91 98333 35005</a>
              <a href="mailto:reservations@kalp.in">reservations@kalp.in</a>
              <a href="#contact">Newa Bhakti Knowledge City</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-copyright">
            &copy; {new Date().getFullYear()} Kalp Restaurant. All rights reserved.
          </div>
          <div className="footer-socials">
            <a href="#" className="footer-social-link" aria-label="Mail">
              <Mail size={18} />
            </a>
            <a href="#" className="footer-social-link" aria-label="Phone">
              <Phone size={18} />
            </a>
            <a href="#" className="footer-social-link" aria-label="Location">
              <MapPin size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
