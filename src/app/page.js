'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import CuisineGrid from '@/components/CuisineGrid';
import Ambience from '@/components/Ambience';
import Highlights from '@/components/Highlights';
import Location from '@/components/Location';
import Footer from '@/components/Footer';

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Small delay to show the loading animation
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main>
      <div className={`page-loader ${loaded ? 'loaded' : ''}`}>
        <div className="loader-text">Kalp<span>.</span></div>
      </div>
      
      <Navbar />
      <Hero />
      <About />
      <CuisineGrid />
      <Ambience />
      <Highlights />
      <Location />
      <Footer />
    </main>
  );
}
