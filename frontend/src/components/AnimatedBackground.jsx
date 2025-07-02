const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Background Image */}
      <div
        className="w-full h-full animate-sky-pan opacity-30"
        style={{
          backgroundImage: "url('/assets/background_2.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "cover",
          backgroundPosition: "0 0",
        }}
      />

      {/* Optional Neon Blobs */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-cyberPurple opacity-30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-neonBlue opacity-20 rounded-full blur-2xl" />
    </div>
  );
};

export default AnimatedBackground;
