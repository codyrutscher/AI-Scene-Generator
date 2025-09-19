import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  const [currentCommand, setCurrentCommand] = useState(0);

  const commands = [
    '"put Cottage at 100,100 facing north"',
    '"place Hover car at 500,500 facing east"',
    '"add House in the woods at 1000,1000 facing west"',
    '"create a village with 5 cottages in a circle"',
    '"build a racing track with hovercars"'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCommand((prev) => (prev + 1) % commands.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 pt-20 relative"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)),
          url('https://pub-41ecf353ea504834b5310a7d56b37182.r2.dev/iStock-497655912.jpg')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Enhanced contrast overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Main logo/title */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-7xl md:text-9xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6 drop-shadow-2xl">
            3DAI
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-2xl md:text-4xl text-gray-300 mb-8 font-light"
        >
          AI-Powered 3D Scene Generation
        </motion.p>

        {/* Animated command examples */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mb-12"
        >
          <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-8 max-w-3xl mx-auto border border-purple-500/30">
            <p className="text-gray-400 mb-4 text-lg">Natural Language Scene Building:</p>
            <motion.div
              key={currentCommand}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-3xl font-mono text-green-400"
            >
              {commands[currentCommand]}
            </motion.div>
            <div className="mt-4 text-gray-500 text-sm">
              ↳ Creates real 3D scenes instantly with precise coordinate placement
            </div>
          </div>
        </motion.div>

        {/* Key features grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-lg rounded-xl p-6 border border-blue-500/30"
          >
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-xl font-bold text-white mb-2">Massive Scale</h3>
            <p className="text-gray-300">10,000×10,000 coordinate grid for unlimited scene complexity</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30"
          >
            <div className="text-4xl mb-4">🗣️</div>
            <h3 className="text-xl font-bold text-white mb-2">Natural Language</h3>
            <p className="text-gray-300">Speak your vision into reality with intuitive commands</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-lg rounded-xl p-6 border border-green-500/30"
          >
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-white mb-2">Real-time</h3>
            <p className="text-gray-300">Instant scene generation with immediate visual feedback</p>
          </motion.div>
        </motion.div>

        {/* Demo Video */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mb-12"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative bg-black/50 backdrop-blur-lg rounded-3xl p-4 border border-purple-500/30 shadow-2xl"
            >
              <video
                autoPlay
                loop
                playsInline
                controls
                className="w-full h-auto rounded-2xl shadow-lg"
                poster="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'><rect width='100%' height='100%' fill='%23111827'/><text x='50%' y='50%' text-anchor='middle' dy='.3em' fill='%236366f1' font-size='48' font-family='sans-serif'>🎮 3DAI Demo</text></svg>"
              >
                <source src="https://pub-41ecf353ea504834b5310a7d56b37182.r2.dev/2025-09-19_11-15-56.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Video overlay */}
              <div className="absolute top-6 left-6 bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-white text-sm font-medium">Live Demo</span>
                </div>
              </div>

              <div className="absolute bottom-6 right-6 bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-gray-300 text-sm">3DAI Scene Builder in Action</span>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="text-center text-gray-400 mt-4 text-sm"
            >
              Watch 3DAI create complex 3D scenes with natural language commands
            </motion.p>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.a
            href="https://github.com/codyrutscher/AI-Scene-Generator"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
          >
            🚀 Try 3DAI Now
          </motion.a>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-transparent border-2 border-cyan-500 text-cyan-400 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-cyan-500/10 transition-all duration-300"
          >
            📖 View Documentation
          </motion.button>
        </motion.div>

        {/* Floating stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1.5 }}
          className="mt-16 flex justify-center space-x-8 text-center"
        >
          <div>
            <div className="text-3xl font-bold text-cyan-400">10,000²</div>
            <div className="text-gray-400">Grid Scale</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-400">∞</div>
            <div className="text-gray-400">Asset Capacity</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-pink-400">&lt;1s</div>
            <div className="text-gray-400">Scene Generation</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;