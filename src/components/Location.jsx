'use client';

import { motion } from 'framer-motion';
import { MapPin, Clock, Phone } from 'lucide-react';

export default function Location() {
  return (
    <section id="contact" className="location">
      <div className="container">
        <div className="location-grid">
          <motion.div 
            className="location-info"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <span className="section-label">Find Us</span>
              <h2 className="section-title">Visit Kalp</h2>
            </div>
            
            <div className="location-detail">
              <div className="location-icon">
                <MapPin size={24} />
              </div>
              <div className="location-detail-content">
                <h4>Address</h4>
                <p>Unit 209, 210, 211, 2nd Floor, <br/>Newa Bhakti Knowledge City, <br/>Airoli, Navi Mumbai - 400601</p>
              </div>
            </div>
            
            <div className="location-detail">
              <div className="location-icon">
                <Clock size={24} />
              </div>
              <div className="location-detail-content">
                <h4>Opening Hours</h4>
                <p>12:00 PM - 1:00 AM<br/>Monday to Sunday</p>
              </div>
            </div>
            
            <div className="location-detail">
              <div className="location-icon">
                <Phone size={24} />
              </div>
              <div className="location-detail-content">
                <h4>Contact Us</h4>
                <p>+91 98333 35005<br/>reservations@kalp.in</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="location-map"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.309440620159!2d72.98825827599026!3d19.172525281515286!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b8d7eb8f1bd5%3A0x6b80d0d4e92a2a0!2sKalp!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
