import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer
      className="py-16 px-4 border-t border-gray-800/50 relative"
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

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Build the Future?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join the 3DAI revolution and start creating 3D worlds with just your words.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <motion.a
              href="https://github.com/codyrutscher/AI-Scene-Generator"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-purple-500/25 transition-all duration-300 inline-block"
            >
              🚀 Get Started on GitHub
            </motion.a>
            <motion.a
              href="mailto:codyrutscher@gmail.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-cyan-500 text-cyan-400 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-cyan-500/10 transition-all duration-300 inline-block"
            >
              💬 Contact Us
            </motion.a>
          </div>
        </motion.div>

        {/* Links grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Demo</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Roadmap</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4">Developers</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="https://github.com/codyrutscher/AI-Scene-Generator" className="hover:text-cyan-400 transition-colors">GitHub Repository</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">API Documentation</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Asset Pipeline</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Contributing</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Tutorials</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Asset Library</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Community</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4">Connect</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="mailto:codyrutscher@gmail.com" className="hover:text-cyan-400 transition-colors">Email</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Discord</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="border-t border-gray-800/50 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <div className="text-gray-400 mb-4 md:mb-0">
            © 2024 3DAI. Built with Claude Code. Open source and AI-powered.
          </div>

          <div className="flex items-center space-x-6">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="text-2xl"
            >
              🤖
            </motion.div>
            <span className="text-gray-400 text-sm">Powered by AI</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;