import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Demo = () => {
  const [activeDemo, setActiveDemo] = useState(0);

  const demoScenes = [
    {
      title: "Village Creation",
      command: "create a medieval village with 3 cottages, 1 well at the center, and a forest around",
      result: "→ Places 3 cottages at calculated positions\n→ Adds well at village center\n→ Surrounds with tree assets\n→ Automatically spaces buildings",
      stats: "4 models • 15 coordinates • 2.3s generation"
    },
    {
      title: "Racing Track",
      command: "build a racing circuit with 5 hovercars, start line at 100,100, track goes east then loops back",
      result: "→ Creates curved track geometry\n→ Places 5 hovercars at start line\n→ Adds finish line markers\n→ Optimizes for racing gameplay",
      stats: "12 models • 50+ coordinates • 1.8s generation"
    },
    {
      title: "City District",
      command: "design an urban district with office buildings, roads, and parking lots at coordinates 2000-3000",
      result: "→ Generates grid-based city layout\n→ Places buildings with proper spacing\n→ Creates road network\n→ Adds urban details",
      stats: "25+ models • 200+ coordinates • 3.1s generation"
    }
  ];

  return (
    <section
      className="py-20 px-4 relative"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6)),
          url('https://pub-41ecf353ea504834b5310a7d56b37182.r2.dev/city1.jpg')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Enhanced background overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-purple-900/40 to-black/70"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            See 3DAI in <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Action</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Watch how natural language commands instantly create complex 3D scenes with precise positioning and intelligent asset placement.
          </p>
        </motion.div>

        {/* Demo selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {demoScenes.map((scene, index) => (
            <motion.button
              key={index}
              onClick={() => setActiveDemo(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeDemo === index
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {scene.title}
            </motion.button>
          ))}
        </div>

        {/* Active demo display */}
        <motion.div
          key={activeDemo}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Input/Command side */}
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 border border-cyan-500/30">
            <h3 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center">
              <span className="mr-3">💬</span>
              Natural Language Input
            </h3>

            <div className="bg-gray-900/80 rounded-xl p-6 font-mono">
              <div className="text-green-400 mb-2">$ gamelogic:</div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, delay: 0.5 }}
                className="text-white text-lg leading-relaxed overflow-hidden"
              >
                "{demoScenes[activeDemo].command}"
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
                className="mt-4 text-yellow-400 text-sm"
              >
                ⚡ Processing natural language...
              </motion.div>
            </div>

            <div className="mt-6 p-4 bg-blue-900/30 rounded-xl">
              <div className="text-blue-300 font-semibold mb-2">Generation Stats:</div>
              <div className="text-gray-300 text-sm">{demoScenes[activeDemo].stats}</div>
            </div>
          </div>

          {/* Output/Result side */}
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30">
            <h3 className="text-2xl font-bold text-purple-400 mb-6 flex items-center">
              <span className="mr-3">🎮</span>
              3D Scene Output
            </h3>

            {/* Simulated 3D viewport */}
            <div className="bg-gray-900/80 rounded-xl p-6 h-64 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>

              {/* Grid visualization */}
              <div className="absolute inset-0 opacity-30">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="absolute border-t border-gray-600" style={{top: `${i * 10}%`, width: '100%'}} />
                ))}
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="absolute border-l border-gray-600 h-full" style={{left: `${i * 10}%`}} />
                ))}
              </div>

              {/* Animated scene elements */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 3, duration: 0.5 }}
                className="absolute top-1/3 left-1/4 w-4 h-4 bg-cyan-400 rounded-sm"
              />
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 3.2, duration: 0.5 }}
                className="absolute top-1/2 right-1/3 w-3 h-3 bg-purple-400 rounded-sm"
              />
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 3.4, duration: 0.5 }}
                className="absolute bottom-1/3 left-1/2 w-5 h-5 bg-pink-400 rounded-sm"
              />

              <div className="absolute bottom-4 left-4 text-green-400 text-xs font-mono">
                ✓ Scene generated successfully
              </div>
            </div>

            <div className="mt-6 space-y-2 text-sm text-gray-300">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 3.5 }}
                className="font-mono whitespace-pre-line"
              >
                {demoScenes[activeDemo].result}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Command examples */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <h3 className="text-3xl font-bold text-white mb-8">More Command Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "put Cottage at 50,50 facing north",
              "create a forest with 10 trees randomly placed",
              "build a parking lot with 8 cars in neat rows",
              "place 3 houses along a curved road",
              "add street lights every 20 units on main road",
              "create a battle scene with tanks and barriers"
            ].map((cmd, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-lg p-4 border border-gray-600/30"
              >
                <code className="text-cyan-300 text-sm">"{cmd}"</code>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Demo;