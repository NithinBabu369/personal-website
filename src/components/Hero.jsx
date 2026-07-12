import { motion } from 'motion/react';
import { ThemeContext } from '../App';
import { useContext, useMemo } from 'react';
import ReactGA from 'react-ga4';
import { FileText, Mail } from 'lucide-react';
import profilePicture from "./../assets/profilePicture.jpg";

function Hero() {
  const { theme } = useContext(ThemeContext);

  const handleResume = () => {
    ReactGA.event({
      category: "Resume",
      action: "View",
      label: "Resume PDF",
    });
    window.open(
      "/resume.pdf",
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleContactScroll = (e) => {
    e.preventDefault();
    document.getElementById('contact')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const nameLetters = useMemo(() => "Nithin Babu B R".split(""), []);

  return (
    <section
      id="home"
      className="min-h-[100dvh] flex items-center justify-center px-6 py-24 relative overflow-hidden bg-transparent"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.15, 1], x: [0, 80, 0], y: [0, 40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-[0.15] ${
            theme === "dark" ? "bg-[#b8f2e6]" : "bg-[#aed9e0]"
          }`}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, -60, 0], y: [0, 60, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-[0.15] ${
            theme === "dark" ? "bg-[#b8f2e6]" : "bg-[#aed9e0]"
          }`}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col-reverse lg:flex-row items-center justify-between gap-16 lg:gap-8 pt-10 lg:pt-0">
        
        {/* Left Column (Text Content) */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center lg:text-left w-full lg:w-3/5"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={`text-base md:text-lg mb-4 font-medium tracking-wide ${
              theme === "dark" ? "text-[#aed9e0]/70" : "text-[#5e6472]/60"
            }`}
          >
            Hello! I'm
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative inline-block group/name mb-6 cursor-default"
          >
            <span className={`text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight ${
              theme === "dark" ? "text-[#b8f2e6]" : "text-[#5e6472]"
            }`}>
              {nameLetters.map((char, i) => (
                <motion.span
                  key={`${char}-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.02, duration: 0.3 }}
                  className="inline-block"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </span>
            <motion.div
              className={`absolute -bottom-2 lg:left-0 left-1/2 lg:-translate-x-0 -translate-x-1/2 h-1 rounded-full ${
                theme === "dark" ? "bg-[#b8f2e6]" : "bg-[#aed9e0]"
              }`}
              initial={{ width: 0 }}
              whileHover={{ 
                width: "100%",
                transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
              }}
            />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={`text-xl md:text-2xl font-light mb-8 ${
              theme === "dark" ? "text-[#aed9e0]/90" : "text-[#5e6472]/80"
            }`}
          >
            Full Stack AI Engineer
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={`space-y-4 text-base md:text-lg leading-relaxed mb-10 ${
              theme === "dark" ? "text-[#aed9e0]" : "text-[#5e6472]"
            } opacity-90 mx-auto lg:mx-0 max-w-2xl`}
          >
            <p>
              Result-oriented Full Stack AI Engineer with an MCA. Specialized in building end-to-end web applications (using stacks like MERN) while integrating AI models, LLMs, and RAG pipelines.
            </p>
            <p>
              Adept at handling the UI, API, database, and the intelligence layer. Experienced in Agile development and deploying containerized microservices using Docker and Kubernetes on AWS and GCP environments.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start items-center"
          >
            <motion.button
              onClick={handleResume}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`group relative px-8 py-4 rounded-2xl font-semibold text-base md:text-lg transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl ${
                theme === "dark" 
                  ? "bg-[#b8f2e6] text-[#1c1c1c] hover:shadow-[#b8f2e6]/30" 
                  : "bg-[#aed9e0] text-[#5e6472] hover:shadow-[#aed9e0]/40"
              }`}
            >
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                style={{ background: theme === "dark" ? 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)' : 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)' }}
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
              />
              <span className="relative z-10 flex items-center gap-2.5">
                <FileText size={20} className="flex-shrink-0" />
                View Resume
              </span>
            </motion.button>

            <motion.a
              href="#contact"
              onClick={handleContactScroll}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`group px-8 py-4 rounded-2xl font-semibold text-base md:text-lg transition-all duration-300 border-2 ${
                theme === "dark"
                  ? "border-[#b8f2e6]/40 text-[#b8f2e6] hover:bg-[#b8f2e6]/10 hover:border-[#b8f2e6]"
                  : "border-[#5e6472]/30 text-[#5e6472] hover:bg-[#5e6472]/5 hover:border-[#5e6472]"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Mail size={20} className="flex-shrink-0" />
                Get In Touch
              </span>
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Right Column (Image Content) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.7, type: "spring", stiffness: 50, delay: 0.2 }}
          className="w-full lg:w-2/5 flex justify-center"
        >
          <motion.div
             whileHover={{ scale: 1.02 }}
             transition={{ type: "spring", stiffness: 300, damping: 20 }}
             className="relative group"
          >
            <motion.div
              className={`absolute -inset-4 rounded-full opacity-50 blur-xl ${theme === "dark" ? "bg-[#b8f2e6]" : "bg-[#aed9e0]"}`}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className={`relative w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-2 ${
              theme === "dark" ? "border-[#b8f2e6]/30 bg-[#1c1c1c]" : "border-[#aed9e0]/50 bg-white"
            }`}>
              <motion.img
                src={profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8 }}
              />
              <motion.div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                  theme === "dark" ? "bg-gradient-to-t from-[#b8f2e6]/20 to-transparent" : "bg-gradient-to-t from-[#aed9e0]/30 to-transparent"
                }`}
              />
            </div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute -top-4 -right-4 w-20 h-20 md:w-24 md:h-24 rounded-full border-4 opacity-40 ${
                theme === "dark" ? "border-[#b8f2e6]" : "border-[#aed9e0]"
              }`}
            />
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className={`absolute -bottom-6 -left-6 w-24 h-24 md:w-32 md:h-32 rounded-full border-4 opacity-30 ${
                theme === "dark" ? "border-[#b8f2e6]" : "border-[#aed9e0]"
              }`}
            />
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}

export default Hero;