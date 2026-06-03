'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      
      {/* About Hero Section */}
      <section className="about-page-hero">
        <div className="hero-bg">
          <img src="/images/hero-bg.png" alt="Kalp Heritage" />
        </div>
        <div className="about-hero-overlay"></div>
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-label">Our Heritage</span>
          <h1 className="hero-title">The <span className="hero-title-accent">Soul</span> of Kalp</h1>
          <p className="hero-tagline">Crafting culinary masterpieces that bridge tradition and modernity.</p>
        </motion.div>
      </section>

      {/* The Story Timeline */}
      <section className="about section" style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="section-label">The Journey</span>
            <h2 className="section-title">How It All Began</h2>
          </div>
          
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <motion.div 
                className="timeline-content glass-panel"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="timeline-year">2018</div>
                <h3 className="cuisine-card-name" style={{ marginBottom: '12px' }}>The Vision</h3>
                <p className="section-subtitle" style={{ fontSize: '0.9rem' }}>
                  Born out of a profound love for diverse Asian and Indian flavors, the founders of Kalp envisioned a space where dining was not just about eating, but about experiencing culinary art.
                </p>
              </motion.div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <motion.div 
                className="timeline-content glass-panel"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="timeline-year">2020</div>
                <h3 className="cuisine-card-name" style={{ marginBottom: '12px' }}>Curating the Menu</h3>
                <p className="section-subtitle" style={{ fontSize: '0.9rem' }}>
                  Our master chefs embarked on a journey across India, Korea, and Italy to source authentic recipes and premium ingredients, formulating a menu that honors tradition.
                </p>
              </motion.div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <motion.div 
                className="timeline-content glass-panel"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="timeline-year">2023</div>
                <h3 className="cuisine-card-name" style={{ marginBottom: '12px' }}>Grand Opening in Airoli</h3>
                <p className="section-subtitle" style={{ fontSize: '0.9rem' }}>
                  Kalp officially opened its doors at Newa Bhakti Knowledge City, introducing Navi Mumbai to an unprecedented, premium multi-cuisine dining experience.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Culinary Philosophy */}
      <section className="cuisine" style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="about-grid">
            <motion.div 
              className="about-content"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="section-label">Our Philosophy</span>
              <h2 className="section-title">Ingredients Speak Louder Than Words</h2>
              <p className="section-subtitle">
                At Kalp, we believe that exceptional food begins with exceptional ingredients. From the robust spices of North India to the delicate aromatics of Oriental cuisine, our kitchen uses only the freshest, ethically sourced produce. Every dish is a testament to authenticity, prepared with passion and served with unparalleled hospitality.
              </p>
            </motion.div>
            
            <motion.div 
              className="about-image-wrapper"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img src="/images/food-asian.png" alt="Culinary Art" />
              <div className="about-image-overlay"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Chefs */}
      <section className="highlights" style={{ padding: '80px 0' }}>
        <div className="highlights-bg"></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center' }}>
            <span className="section-label">The Masters</span>
            <h2 className="section-title">Meet Our Chefs</h2>
          </div>
          
          <div className="team-grid">
            <motion.div 
              className="team-card glass-panel"
              style={{ padding: '40px 20px' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="team-image">
                <img src="/images/food-north-indian.png" alt="Chef" />
              </div>
              <h3 className="team-name">Arjun Kapoor</h3>
              <div className="team-role">Head Chef - Indian Cuisine</div>
            </motion.div>
            
            <motion.div 
              className="team-card glass-panel"
              style={{ padding: '40px 20px' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="team-image">
                <img src="/images/food-korean.png" alt="Chef" />
              </div>
              <h3 className="team-name">Mei Lin</h3>
              <div className="team-role">Executive Chef - Oriental</div>
            </motion.div>
            
            <motion.div 
              className="team-card glass-panel"
              style={{ padding: '40px 20px' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="team-image">
                <img src="/images/food-italian.png" alt="Chef" />
              </div>
              <h3 className="team-name">Marco Rossi</h3>
              <div className="team-role">Specialist - Italian</div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
