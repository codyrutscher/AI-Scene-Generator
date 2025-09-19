import React from 'react';
import { motion } from 'framer-motion';
import Hero from './components/Hero';
import Features from './components/Features';
import BiomeShowcase from './components/BiomeShowcase';
import Demo from './components/Demo';
import Roadmap from './components/Roadmap';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Infinite 3D Grid Background */}
      <div className="infinite-grid">
        <div className="grid-container"></div>
      </div>

      <div className="relative">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-70"
              initial={{
                x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : Math.random() * 1920,
                y: typeof window !== 'undefined' ? Math.random() * window.innerHeight : Math.random() * 1080,
              }}
              animate={{
                x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : Math.random() * 1920,
                y: typeof window !== 'undefined' ? Math.random() * window.innerHeight : Math.random() * 1080,
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10">
          <Hero />
          <Features />
          <BiomeShowcase />
          <Demo />
          <Roadmap />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;