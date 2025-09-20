import React, { useState } from 'react';
import { motion } from 'framer-motion';

const BiomeShowcase = () => {
  const [activeScene, setActiveScene] = useState(0);

  const scenes = [
    {
      title: "Urban Metropolis",
      description: "Skyscrapers, roads, vehicles, and urban infrastructure",
      models: ["🏢 Office Buildings", "🚗 Vehicles", "🛣️ Road Systems", "🚦 Traffic Lights", "🏪 Shops", "👥 People"],
      colors: "from-blue-600 to-cyan-600",
      command: "create a city district with 20 buildings, roads connecting them, and parking lots"
    },
    {
      title: "Medieval Village",
      description: "Cottages, castles, forests, and fantasy environments",
      models: ["🏘️ Cottages", "🏰 Castles", "🌳 Trees", "🌾 Fields", "⚔️ Weapons", "🐴 Horses"],
      colors: "from-green-600 to-emerald-600",
      command: "build a medieval village with 5 cottages around a central well, surrounded by forest"
    },
    {
      title: "Sci-Fi Outpost",
      description: "Futuristic buildings, spaceships, and alien landscapes",
      models: ["🛸 Spaceships", "🏭 Facilities", "🤖 Robots", "⚡ Energy Cores", "🌌 Platforms", "🔮 Tech"],
      colors: "from-purple-600 to-pink-600",
      command: "design a space colony with landing pads, research facilities, and defense towers"
    },
    {
      title: "Natural Landscapes",
      description: "Mountains, forests, rivers, and organic environments",
      models: ["🏔️ Mountains", "🌲 Forests", "🏞️ Rivers", "🪨 Rocks", "🦋 Wildlife", "🌸 Flora"],
      colors: "from-emerald-600 to-teal-600",
      command: "create a natural park with mountains, forest paths, and a central lake"
    }
  ];

  return (
    <section
      className="py-20 px-4 relative overflow-hidden"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6)),
          url('https://pub-41ecf353ea504834b5310a7d56b37182.r2.dev/city2.jpg')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Enhanced Background overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-purple-900/40 to-black/70">
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent"></div>

        {/* Animated city silhouette - keeping for visual effect */}
        <div className="absolute bottom-0 left-0 right-0 h-24 opacity-20">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bottom-0 bg-gradient-to-t from-cyan-500/20 to-purple-500/20"
              style={{
                left: `${i * 5}%`,
                width: `${Math.random() * 3 + 1}%`,
                height: `${Math.random() * 60 + 20}px`,
              }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: i * 0.1, duration: 1 }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Build Any <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Biome</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            From bustling cities to medieval villages, sci-fi outposts to natural landscapes.
            3DAI enables unlimited scene creation with intelligent asset placement, scaling, and coordination.
          </p>
        </motion.div>

        {/* Scene type selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {scenes.map((scene, index) => (
            <motion.button
              key={index}
              onClick={() => setActiveScene(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                activeScene === index
                  ? `bg-gradient-to-br ${scene.colors} border-transparent text-white shadow-lg`
                  : 'bg-black/30 border-gray-600 text-gray-300 hover:border-purple-500'
              }`}
            >
              <div className="text-3xl mb-2">{scene.models[0].split(' ')[0]}</div>
              <div className="font-bold text-sm">{scene.title}</div>
            </motion.button>
          ))}
        </div>

        {/* Active scene showcase */}
        <motion.div
          key={activeScene}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16"
        >
          {/* Scene visualization */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-white mb-4">
              {scenes[activeScene].title}
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              {scenes[activeScene].description}
            </p>

            {/* Model grid */}
            <div className="grid grid-cols-3 gap-4">
              {scenes[activeScene].models.map((model, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.1 }}
                  className="bg-black/40 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50 text-center hover:border-purple-500/50 transition-all duration-300"
                >
                  <div className="text-2xl mb-2">{model.split(' ')[0]}</div>
                  <div className="text-xs text-gray-400">{model.split(' ').slice(1).join(' ')}</div>
                </motion.div>
              ))}
            </div>

            {/* Command example */}
            <div className="bg-gray-900/60 backdrop-blur-lg rounded-xl p-6 border border-cyan-500/30">
              <div className="text-cyan-400 font-semibold mb-2">Natural Language Command:</div>
              <code className="text-green-400 text-sm">
                "{scenes[activeScene].command}"
              </code>
            </div>
          </div>

          {/* 3D Scene Visualization */}
          <div className="relative">
            <div className="bg-black/60 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30 h-96 overflow-hidden relative">
              <div className="absolute inset-0 perspective-1000">
                <div className="absolute inset-0 transform rotateX(60deg)">
                  {/* Grid background */}
                  <div className="absolute inset-0 opacity-30"
                       style={{
                         backgroundImage: 'linear-gradient(rgba(34, 211, 238, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.3) 1px, transparent 1px)',
                         backgroundSize: '20px 20px'
                       }}>
                  </div>

                  {/* Animated scene elements */}
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute rounded-sm bg-gradient-to-t ${scenes[activeScene].colors} opacity-80`}
                      style={{
                        left: `${(i % 4) * 25 + 10}%`,
                        top: `${Math.floor(i / 4) * 30 + 20}%`,
                        width: `${Math.random() * 8 + 4}px`,
                        height: `${Math.random() * 20 + 10}px`,
                        transform: `translateZ(${Math.random() * 50}px)`
                      }}
                      initial={{ scale: 0, rotateX: 60 }}
                      animate={{ scale: 1, rotateX: 60 }}
                      transition={{ delay: i * 0.1 + 0.5, duration: 0.5 }}
                      whileHover={{ scale: 1.5 }}
                    />
                  ))}
                </div>
              </div>

              <div className="absolute bottom-4 left-4 text-cyan-400 text-xs font-mono">
                {scenes[activeScene].models.length} Model Types • Infinite Scaling • Smart Placement
              </div>
            </div>
          </div>
        </motion.div>

        {/* Capabilities showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h3 className="text-4xl font-bold text-white mb-8">
            Advanced Scene Building
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "📐", title: "Precise Positioning", desc: "10,000×10,000 coordinate grid" },
              { icon: "🔄", title: "Smart Scaling", desc: "Automatic size optimization" },
              { icon: "📚", title: "Layer Management", desc: "Complex scene hierarchies" },
              { icon: "🎯", title: "Intelligent Placement", desc: "Context-aware positioning" }
            ].map((capability, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{capability.icon}</div>
                <h4 className="text-lg font-bold text-white mb-2">{capability.title}</h4>
                <p className="text-gray-400 text-sm">{capability.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12 bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30"
          >
            <h4 className="text-2xl font-bold text-white mb-4">Example Scene Commands</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              {[
                "create a racing track with 10 cars and spectator stands",
                "build a fantasy forest with castles, villages, and magical creatures",
                "design a space station with docking bays and research facilities",
                "make a tropical island with palm trees, beaches, and huts"
              ].map((cmd, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-gray-900/60 rounded-lg p-4"
                >
                  <code className="text-cyan-300 text-sm">"{cmd}"</code>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default BiomeShowcase;