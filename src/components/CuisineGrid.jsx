'use client';

import { motion } from 'framer-motion';

export default function CuisineGrid() {
  const cuisines = [
    {
      name: 'North Indian',
      desc: 'Rich gravies, aromatic spices, and tandoor perfection.',
      tag: 'Signature',
      image: '/images/food-north-indian.png',
      span: true
    },
    {
      name: 'Asian & Oriental',
      desc: 'Authentic wok-tossed flavors and delicate dim sums.',
      tag: 'Popular',
      image: '/images/food-asian.png',
      span: false
    },
    {
      name: 'Italian',
      desc: 'Wood-fired pizzas and creamy handmade pastas.',
      tag: 'Classic',
      image: '/images/food-italian.png',
      span: false
    },
    {
      name: 'Korean',
      desc: 'Vibrant BBQs and traditional fermented delicacies.',
      tag: 'Trendy',
      image: '/images/food-korean.png',
      span: false
    },
    {
      name: 'Desserts',
      desc: 'Decadent sweets to perfectly conclude your meal.',
      tag: 'Indulge',
      image: '/images/food-desserts.png',
      span: false
    }
  ];

  return (
    <section id="cuisine" className="cuisine">
      <div className="container">
        <div className="cuisine-header">
          <span className="section-label">Our Cuisines</span>
          <h2 className="section-title">A World of Flavours</h2>
          <p className="section-subtitle">
            Explore a diverse palette of globally inspired dishes crafted with passion, precision, and the finest ingredients.
          </p>
        </div>

        <div className="cuisine-grid">
          {cuisines.map((cuisine, i) => (
            <motion.div
              key={i}
              className="cuisine-card"
              style={cuisine.span ? { gridColumn: 'span 2', aspectRatio: '16/10' } : {}}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div className="cuisine-card-image">
                <img src={cuisine.image} alt={cuisine.name} />
              </div>
              <div className="cuisine-card-overlay"></div>
              <div className="cuisine-card-content">
                <h3 className="cuisine-card-name">{cuisine.name}</h3>
                <p className="cuisine-card-desc">{cuisine.desc}</p>
                <span className="cuisine-card-tag">{cuisine.tag}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
