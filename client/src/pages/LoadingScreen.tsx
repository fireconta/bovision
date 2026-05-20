import { motion } from 'framer-motion';

const LoadingScreen = ({ message = 'Carregando...' }: { message?: string }) => {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[9998]">
      {/* Animated Grid */}
      <div className="relative w-32 h-32 mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 border border-accent/30 rounded-lg"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-2 border border-cyan-400/30 rounded-lg"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-4xl">🐄</div>
        </motion.div>
      </div>

      {/* Loading Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <h2 className="text-xl font-bold mb-2">
          <span className="text-accent">BOVISION</span>
          <span className="text-cyan-400"> AI</span>
        </h2>
        <p className="text-sm text-gray-400 mb-4">{message}</p>

        {/* Dots Animation */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                repeat: Infinity,
              }}
              className="w-2 h-2 bg-accent rounded-full"
            />
          ))}
        </div>
      </motion.div>

      {/* Scanning Lines */}
      <div className="absolute bottom-20 w-48 h-12 border border-accent/20 rounded-lg overflow-hidden">
        <motion.div
          animate={{ y: [0, 48] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-full h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent"
        />
      </div>
    </div>
  );
};

export default LoadingScreen;
