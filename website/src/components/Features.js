import React from 'react';
import { motion } from 'framer-motion';

const Features = () => {
  const features = [
    {
      icon: "🧠",
      title: "AI Natural Language Processing",
      description: "Converts complex scene descriptions into precise 3D coordinates and asset placement",
      tech: "Advanced NLP • Coordinate extraction • Contextual understanding",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: "📦",
      title: "Massive Asset Pipeline",
      description: "Cloudflare-backed storage system with millions of 3D models ready for instant deployment",
      tech: "Cloudflare CDN • GLTF/GLB • Metadata indexing • Auto-scaling",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: "⚡",
      title: "Real-time Scene Generation",
      description: "Sub-second scene creation with immediate visual feedback and interactive editing",
      tech: "A-Frame WebVR • WebGL acceleration • Optimized rendering",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: "🌍",
      title: "Infinite Scale Architecture",
      description: "10,000×10,000 coordinate system supporting massive open-world environments",
      tech: "Level-of-detail • Spatial partitioning • Performance optimization",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: "🔧",
      title: "Game Engine Integration",
      description: "Export directly to Unity, Unreal Engine, Godot, and other major game development platforms",
      tech: "Multi-format export • Asset bundling • Engine-specific optimization",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: "🤝",
      title: "Collaborative Scene Building",
      description: "Real-time multiplayer scene editing with version control and conflict resolution",
      tech: "WebRTC • Operational transforms • Git-like versioning",
      color: "from-teal-500 to-cyan-500"
    },
    {
      icon: "📸",
      title: "Image-to-3D Model Generation",
      description: "Transform real-world photos into detailed 3D models instantly. Capture any object and seamlessly integrate it into your scenes",
      tech: "Computer vision • Photogrammetry • AI mesh generation • Texture mapping",
      color: "from-yellow-500 to-orange-500"
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
            Revolutionary <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Features</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            3DAI combines cutting-edge AI, massive asset libraries, and professional-grade 3D rendering
            to democratize game world creation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              className="group"
            >
              <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 h-full hover:border-purple-500/50 transition-all duration-300">
                {/* Animated icon */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="text-6xl mb-6 text-center"
                >
                  {feature.icon}
                </motion.div>

                {/* Feature title */}
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-500 group-hover:bg-clip-text transition-all duration-300">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Tech stack */}
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Technology Stack
                  </div>
                  <div className="text-sm text-gray-500 font-mono">
                    {feature.tech}
                  </div>
                </div>

                {/* Animated bottom border */}
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                  className={`h-1 bg-gradient-to-r ${feature.color} mt-6 rounded-full`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Performance metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-lg rounded-3xl p-12 border border-purple-500/30">
            <h3 className="text-3xl font-bold text-white mb-8">Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-4xl font-bold text-cyan-400 mb-2"
                >
                  &lt;0.5s
                </motion.div>
                <div className="text-gray-300">Scene Generation</div>
              </div>
              <div>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-4xl font-bold text-purple-400 mb-2"
                >
                  1M+
                </motion.div>
                <div className="text-gray-300">Available Assets</div>
              </div>
              <div>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-4xl font-bold text-pink-400 mb-2"
                >
                  100M
                </motion.div>
                <div className="text-gray-300">Coordinate Precision</div>
              </div>
              <div>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-4xl font-bold text-green-400 mb-2"
                >
                  ∞
                </motion.div>
                <div className="text-gray-300">Scene Complexity</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;