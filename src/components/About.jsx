'use client';

import { motion } from 'framer-motion';
import { Wine, Music, Users, Heart } from 'lucide-react';
import Link from 'next/link';

export default function About() {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="about-grid">
          
          <motion.div 
            className="about-image-wrapper"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <img src="/images/food-north-indian.png" alt="North Indian Cuisine" />
            <div className="about-image-overlay"></div>
            <div className="about-image-badge">
              <div className="glass-panel">
                <div className="badge-rating">4.2</div>
                <div className="badge-text">879+ Reviews<br/>on Zomato</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="about-content"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div>
              <span className="section-label">Our Story</span>
              <h2 className="section-title">A Culinary Journey Through Asia and Beyond</h2>
              <p className="section-subtitle">
                Located in the heart of Newa Bhakti Knowledge City, Airoli, Kalp offers a premium dining experience that transcends boundaries. Our masterful chefs curate an exquisite menu featuring authentic North Indian, Asian, Oriental, Korean, and Italian delicacies. Experience a luxurious ambiance where culinary artistry meets unmatched hospitality.
              </p>
            </div>

            <div className="about-features">
              <div className="about-feature">
                <div className="about-feature-icon">
                  <Wine size={20} />
                </div>
                <span className="about-feature-text">Full Bar Available</span>
              </div>
              <div className="about-feature">
                <div className="about-feature-icon">
                  <Music size={20} />
                </div>
                <span className="about-feature-text">Low-intensity Music</span>
              </div>
              <div className="about-feature">
                <div className="about-feature-icon">
                  <Users size={20} />
                </div>
                <span className="about-feature-text">Large Group Seating</span>
              </div>
              <div className="about-feature">
                <div className="about-feature-icon">
                  <Heart size={20} />
                </div>
                <span className="about-feature-text">Kid Friendly</span>
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <Link href="/about" className="glass-button">
                Read Our Full Story
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
