import React, { lazy, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSchool, FaUsers, FaChartBar, FaRegClock } from "react-icons/fa";
import Marquee from "react-fast-marquee";
import LazyLoad from 'react-lazy-load';

const Home = () => {

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <LazyLoad offset={100} once>
      <section
        className="relative flex-col w-full h-screen bg-[var(--color-primary)] bg-[url('/assets/images/hero-bg.jpg')] bg-cover bg-blend-overlay text-white flex items-center justify-center text-center px-4 py-20"
      >
        <motion.h1
          className="text-6xl font-bold mb-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to Absenin
        </motion.h1>
        <motion.p
          className="text-xl mb-10 max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          A modern, efficient school attendance system for students, teachers, and staff.
        </motion.p>
        <motion.a
          href="/login"
          className="px-8 py-4 rounded-full text-white bg-[var(--color-accent)] hover:bg-[var(--color-hover)] shadow-lg transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.a>

        {/* Animated Background Circle */}
        <motion.div
          className="mt-20 w-80 h-80 bg-[var(--color-secondary)] rounded-full blur-3xl opacity-30 absolute z-[-1]"
          initial={{ scale: 0 }}
          animate={{ scale: 1.5 }}
          transition={{ duration: 1 }}
        />
      </section>
    </LazyLoad>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            className="text-4xl font-bold text-[var(--color-primary)] mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Features
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div
              className="bg-[var(--color-secondary)] text-white p-8 rounded-xl shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <FaSchool className="text-6xl mb-4" />
              <h3 className="text-2xl font-semibold mb-2">School Management</h3>
              <p>Manage student attendance across various classes and departments with ease.</p>
            </motion.div>
            <motion.div
              className="bg-[var(--color-accent)] text-white p-8 rounded-xl shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <FaUsers className="text-6xl mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Multi-User Access</h3>
              <p>Allow students, teachers, and administrators to have customized access levels.</p>
            </motion.div>
            <motion.div
              className="bg-[var(--color-info)] text-white p-8 rounded-xl shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <FaChartBar className="text-6xl mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Real-time Reports</h3>
              <p>View attendance data and generate reports instantly, making decision-making easy.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-10 px-12 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-[var(--color-primary)] mb-10">
            Our Partners
          </h2>
          <Marquee
            gradient={true}
            speed={50}
          >
            <img src="/assets/images/image.png" alt="Partner 1" className="h-24 mx-12 filter grayscale drop-shadow-xl hover:grayscale-0" />
            <img src="/assets/images/image.png" alt="Partner 2" className="h-24 mx-12 filter grayscale drop-shadow-xl hover:grayscale-0" />
            <img src="/assets/images/image.png" alt="Partner 3" className="h-24 mx-12 filter grayscale drop-shadow-xl hover:grayscale-0" />
            <img src="/assets/images/image.png" alt="Partner 4" className="h-24 mx-12 filter grayscale drop-shadow-xl hover:grayscale-0" />
            <img src="/assets/images/image.png" alt="Partner 5" className="h-24 mx-12 filter grayscale drop-shadow-xl hover:grayscale-0" />

            <img src="/assets/images/image.png" alt="Partner 1" className="h-24 mx-12 filter grayscale drop-shadow-xl hover:grayscale-0" />
            <img src="/assets/images/image.png" alt="Partner 2" className="h-24 mx-12 filter grayscale drop-shadow-xl hover:grayscale-0" />
            <img src="/assets/images/image.png" alt="Partner 3" className="h-24 mx-12 filter grayscale drop-shadow-xl hover:grayscale-0" />
            <img src="/assets/images/image.png" alt="Partner 4" className="h-24 mx-12 filter grayscale drop-shadow-xl hover:grayscale-0" />
            <img src="/assets/images/image.png" alt="Partner 5" className="h-24 mx-12 filter grayscale drop-shadow-xl hover:grayscale-0" />
            
          </Marquee>
        </div>
      </section>

            {/* Testimonials Section */}
        <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            className="text-4xl font-bold text-[var(--color-primary)] mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            What Our Users Say
          </motion.h2>
          <div className="flex flex-col items-center space-y-10 md:space-y-0 md:flex-row md:space-x-12">
            <motion.div
              className="bg-gray-200 p-8 rounded-xl shadow-lg max-w-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <p className="text-lg italic mb-4">"This system has transformed the way we handle attendance in our school. It's so easy and fast!"</p>
              <p className="font-semibold">John Doe</p>
              <p className="text-sm text-gray-500">Teacher</p>
            </motion.div>
            <motion.div
              className="bg-gray-200 p-8 rounded-xl shadow-lg max-w-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <p className="text-lg italic mb-4">"As a student, I love how I can easily check my attendance status in real-time."</p>
              <p className="font-semibold">Jane Smith</p>
              <p className="text-sm text-gray-500">Student</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-8 bg-[var(--color-primary)] text-white text-center">
        <p>&copy; 2025 Absenin. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
