'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate particles only on the client to prevent hydration mismatch
    const newParticles = Array.from({ length: 20 }).map(() => ({
      left: Math.random() * 100,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 10
    }));
    setParticles(newParticles);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section id="home" className="hero">
      <div className="hero-bg">
        <img src="/images/hero-bg.png" alt="Kalp Restaurant Interior" />
      </div>
      <div className="hero-overlay"></div>
      
      <div className="hero-particles">
        {particles.map((p, i) => (
          <div 
            key={i} 
            className="particle"
            style={{
              left: `${p.left}%`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`
            }}
          ></div>
        ))}
      </div>

      <motion.div 
        className="hero-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="hero-badge">
          <span className="hero-badge-dot"></span>
          NOW OPEN
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="hero-title">
          <span className="hero-title-accent">K</span>alp
        </motion.h1>
        
        <motion.p variants={itemVariants} className="hero-tagline">
          Where Every Flavour Tells a Story
        </motion.p>
        
        <motion.div variants={itemVariants} className="hero-actions">
          <Link href="/reserve" className="glass-button-solid">
            Reserve a Table
          </Link>
          <Link href="#cuisine" className="glass-button">
            Explore Menu
          </Link>
        </motion.div>
      </motion.div>

      <div className="hero-scroll-indicator">
        <span>Scroll</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
}
