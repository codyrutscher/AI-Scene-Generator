import React from 'react';
import { motion } from 'framer-motion';

const Roadmap = () => {
  const phases = [
    {
      phase: "Phase 1",
      title: "Asset Accumulation",
      status: "In Progress",
      timeline: "Q1 2024",
      description: "Building the world's largest 3D asset database",
      tasks: [
        "Cloudflare bucket infrastructure",
        "Automated asset scraping pipelines",
        "Metadata extraction and indexing",
        "Quality assurance and categorization",
        "1M+ assets target"
      ],
      color: "border-cyan-500 bg-cyan-500/10",
      statusColor: "text-cyan-400 bg-cyan-400/20"
    },
    {
      phase: "Phase 2",
      title: "GameLogic Engine",
      status: "Planning",
      timeline: "Q2-Q3 2024",
      description: "Advanced AI scene generation and game engine integration",
      tasks: [
        "Advanced natural language processing",
        "Physics simulation integration",
        "Unity/Unreal export pipelines",
        "Real-time collaborative editing",
        "Performance optimization for massive scenes"
      ],
      color: "border-purple-500 bg-purple-500/10",
      statusColor: "text-purple-400 bg-purple-400/20"
    },
    {
      phase: "Phase 3",
      title: "AI Scene Generation",
      status: "Future",
      timeline: "Q4 2024",
      description: "Fully autonomous scene creation from complex descriptions",
      tasks: [
        "GPT-4 integration for scene understanding",
        "Procedural environment generation",
        "Smart asset selection algorithms",
        "Narrative-driven scene creation",
        "Multi-modal input (text, voice, sketches)"
      ],
      color: "border-pink-500 bg-pink-500/10",
      statusColor: "text-pink-400 bg-pink-400/20"
    }
  ];

  return (
    <section
      className="py-20 px-4 relative"
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
      {/* Enhanced background overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-purple-900/40 to-black/70"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Development <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Roadmap</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our ambitious journey to revolutionize 3D scene creation through AI and massive asset accumulation
          </p>
        </motion.div>

        <div className="space-y-8">
          {phases.map((phase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`relative bg-black/40 backdrop-blur-lg rounded-2xl p-8 border ${phase.color}`}
            >
              {/* Phase indicator */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="text-3xl font-bold text-white mr-4">{phase.phase}</div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{phase.title}</h3>
                    <p className="text-gray-300">{phase.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${phase.statusColor}`}>
                    {phase.status}
                  </span>
                  <span className="text-gray-400 font-mono">{phase.timeline}</span>
                </div>
              </div>

              {/* Tasks */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {phase.tasks.map((task, taskIndex) => (
                  <motion.div
                    key={taskIndex}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 + taskIndex * 0.1 }}
                    className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50"
                  >
                    <div className="flex items-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ delay: index * 0.2 + taskIndex * 0.1 + 0.3 }}
                        className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mr-3"
                      />
                      <span className="text-gray-300 text-sm">{task}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Progress indicator */}
              <motion.div
                className="mt-6"
                initial={{ width: 0 }}
                whileInView={{ width: index === 0 ? '75%' : index === 1 ? '25%' : '5%' }}
                transition={{ duration: 1.5, delay: index * 0.2 + 0.5 }}
              >
                <div className="h-2 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full"></div>
                <div className="text-xs text-gray-400 mt-2">
                  {index === 0 ? '75% Complete' : index === 1 ? '25% Complete' : '5% Complete'}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Vision statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-lg rounded-3xl p-12 border border-purple-500/30">
            <h3 className="text-3xl font-bold text-white mb-6">Our Vision</h3>
            <p className="text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
              "GameLogic will democratize 3D world creation, enabling anyone to build complex game environments
              through natural language. By accumulating massive asset libraries and leveraging AI, we're creating
              the future of game development where imagination is the only limit."
            </p>
            <div className="mt-6 text-purple-400 font-semibold">
              — The GameLogic Team
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Roadmap;