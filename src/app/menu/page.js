'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { menuData } from '@/data/menuData';

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredMenu, setFilteredMenu] = useState([]);
  
  // Get unique categories from data
  const categories = ['All', ...Array.from(new Set(menuData.map(item => item.category)))];

  useEffect(() => {
    if (activeCategory === 'All') {
      // Group by category for "All" view to show category headers
      setFilteredMenu(menuData);
    } else {
      setFilteredMenu(menuData.filter(item => item.category === activeCategory));
    }
  }, [activeCategory]);

  // Group items by category for the split scroll layout
  const renderMenuItems = () => {
    let sections = [];
    
    if (activeCategory === 'All') {
      const activeCategories = categories.filter(c => c !== 'All');
      activeCategories.forEach(cat => {
        const catItems = filteredMenu.filter(item => item.category === cat);
        if (catItems.length > 0) {
          sections.push(renderCategorySection(cat, catItems));
        }
      });
    } else {
      sections.push(renderCategorySection(activeCategory, filteredMenu));
    }

    return sections;
  };

  const renderCategorySection = (catName, items) => {
    return (
      <div key={`section-${catName}`} className="menu-category-section">
        {/* Sticky Left Sidebar */}
        <div className="menu-category-sticky">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2>{catName}</h2>
            <div className="menu-category-meta">
              <span>{items.length} Curated Items</span>
            </div>
          </motion.div>
        </div>

        {/* Scrolling Right Column (Staggered Items) */}
        <div className="menu-category-items">
          {items.map((item, index) => (
            <motion.div
              key={`${item.name}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="menu-item-staggered"
            >
              <div className="menu-item-header">
                <h3 className="menu-item-name">{item.name}</h3>
                <span className="menu-item-price-tag">₹{item.price}</span>
              </div>
              
              {item.description && (
                <p className="menu-item-desc">{item.description}</p>
              )}
              
              <div className="menu-item-bottom">
                <span className="menu-item-subcategory">{item.subCategory}</span>
                <div className="menu-item-badges">
                  {item.isVeg ? (
                    <span className="badge-veg" title="Vegetarian"></span>
                  ) : (
                    <span className="badge-nonveg" title="Non-Vegetarian"></span>
                  )}
                  {item.price > 550 && <span className="badge-special">CHEF'S SPECIAL</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <main className="menu-page">
      <Navbar />
      
      {/* Menu Header */}
      <section className="menu-header-section">
        <div className="container">
          <motion.div 
            className="menu-header-content"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label">Gastronomy</span>
            <h1 className="section-title">The Culinary Canvas</h1>
            <div className="menu-ornament">
              <div className="menu-ornament-line"></div>
              <div className="menu-ornament-diamond"></div>
              <div className="menu-ornament-line"></div>
            </div>
            <p className="section-subtitle mx-auto" style={{ marginTop: '24px' }}>
              Explore our meticulously curated menu featuring a fusion of global flavors, authentic spices, and modern culinary techniques.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sticky Category Filter */}
      <div className="menu-filter-wrapper">
        <div className="container">
          <div className="menu-filters">
            {categories.map((category) => (
              <button
                key={category}
                className={`menu-filter-btn ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Split Scroll Showcase Layout */}
      <section className="menu-showcase">
        <div className="container">
          <AnimatePresence>
            {renderMenuItems()}
          </AnimatePresence>
          
          {filteredMenu.length === 0 && (
            <div className="empty-menu">
              <p>No items found in this category.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
