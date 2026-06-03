'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const Counter = ({ from, to, duration, suffix = '' }) => {
  const [count, setCount] = useState(from);
  const nodeRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (nodeRef.current) observer.observe(nodeRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      setCount(Math.floor(progress * (to - from) + from));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [inView, from, to, duration]);

  return <span ref={nodeRef}>{count}{suffix}</span>;
};

export default function Highlights() {
  return (
    <section className="highlights">
      <div className="highlights-bg"></div>
      <div className="container">
        <div className="highlights-grid">
          <motion.div 
            className="highlight-item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="highlight-number"><Counter from={0} to={8} duration={2} suffix="+" /></div>
            <div className="highlight-label">Cuisines</div>
          </motion.div>
          
          <div className="highlight-divider"></div>

          <motion.div 
            className="highlight-item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="highlight-number">4.2</div>
            <div className="highlight-label">Rating</div>
          </motion.div>

          <div className="highlight-divider"></div>

          <motion.div 
            className="highlight-item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="highlight-number"><Counter from={0} to={879} duration={2.5} suffix="+" /></div>
            <div className="highlight-label">Reviews</div>
          </motion.div>

          <div className="highlight-divider"></div>

          <motion.div 
            className="highlight-item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="highlight-number">₹<Counter from={0} to={1800} duration={2.5} /></div>
            <div className="highlight-label">Avg for Two</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
