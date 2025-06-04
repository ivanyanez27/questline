import { motion } from 'framer-motion';

export function PixelClimber() {
  return (
    <div className="relative w-full h-full bg-gradient-to-b from-sky-400 to-sky-200 overflow-hidden">
      {/* Mountain Background */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute bottom-0 w-full h-3/4 bg-gradient-to-t from-emerald-800 to-emerald-600 clip-mountain" />
        <div className="absolute bottom-0 w-full h-2/3 bg-gradient-to-t from-emerald-700 to-emerald-500 clip-mountain translate-x-1/4" />
        <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-emerald-600 to-emerald-400 clip-mountain -translate-x-1/4" />
      </div>

      {/* Animated Character */}
      <motion.div
        className="absolute w-8 h-8 bg-pixel-climber"
        initial={{ x: "10%", y: "80%" }}
        animate={{
          x: ["10%", "30%", "50%", "70%", "90%"],
          y: ["80%", "60%", "40%", "30%", "20%"],
        }}
        transition={{
          duration: 4,
          ease: "linear",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Snow Caps */}
      <div className="absolute top-1/4 w-full">
        <div className="absolute w-full h-8 bg-white clip-snow opacity-90" />
        <div className="absolute w-full h-6 bg-white clip-snow translate-x-1/4 opacity-80" />
        <div className="absolute w-full h-4 bg-white clip-snow -translate-x-1/4 opacity-70" />
      </div>
    </div>
  );
}