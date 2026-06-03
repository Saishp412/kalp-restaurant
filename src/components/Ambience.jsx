'use client';

import { motion } from 'framer-motion';

export default function Ambience() {
  const images = [
    "https://b.zmtcdn.com/data/pictures/2/20855492/e9fdda4f1a43b6266a6b1f8e6c4b08e1.jpg",
    "https://b.zmtcdn.com/data/pictures/2/20855492/c79ae395accf7036366fdef17d2f511d.jpg",
    "https://b.zmtcdn.com/data/pictures/2/20855492/d5d367e5c92c8778ac1961129d683af0.jpg",
    "https://b.zmtcdn.com/data/pictures/2/20855492/a1bafe0e26f7e40fc54ffbbe902542ca.jpg"
  ];

  return (
    <section id="ambience" className="ambience-section">
      <div className="container">
        <div className="ambience-header">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label">Experience</span>
            <h2 className="section-title">An Elegant Ambience</h2>
            <p className="section-subtitle mx-auto" style={{ marginTop: '20px' }}>
              Step into a space where modern aesthetics meet warm, inviting undertones. Whether it's a cozy family dinner or a vibrant celebration, Kalp sets the perfect mood.
            </p>
          </motion.div>
        </div>

        <div className="ambience-gallery">
          {images.map((src, idx) => (
            <motion.div
              key={idx}
              className={`ambience-card ambience-item-${idx + 1}`}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <div className="ambience-img-wrapper">
                <img src={src} alt={`Kalp Restaurant Ambience ${idx + 1}`} />
                <div className="ambience-overlay"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
