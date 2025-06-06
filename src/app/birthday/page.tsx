import Image from "next/image";

export default function BirthdayPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 dark:from-pink-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Animated Header */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent animate-pulse">
            🎉
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white animate-bounce">
            Happy Birthday
          </h2>
          <h3 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
            RAHUL!
          </h3>
        </div>

        {/* Birthday Message */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 leading-relaxed">
            🎂 Wishing you a day filled with happiness and a year filled with joy! 🎈
          </p>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mt-4">
            May all your dreams come true and may you have many more birthdays to celebrate! ✨
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="flex justify-center space-x-4 text-4xl md:text-6xl">
          <span className="animate-bounce delay-100">🎈</span>
          <span className="animate-bounce delay-200">🎂</span>
          <span className="animate-bounce delay-300">🎁</span>
          <span className="animate-bounce delay-400">🎊</span>
          <span className="animate-bounce delay-500">🥳</span>
        </div>

        {/* Birthday Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-gradient-to-br from-pink-400 to-red-400 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
            <h4 className="text-2xl font-bold">Another Year</h4>
            <p className="text-lg opacity-90">Of Awesome!</p>
          </div>
          <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
            <h4 className="text-2xl font-bold">More Memories</h4>
            <p className="text-lg opacity-90">To Create!</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-400 to-purple-400 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
            <h4 className="text-2xl font-bold">New Adventures</h4>
            <p className="text-lg opacity-90">Await!</p>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="pt-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <span>← Back to Home</span>
          </a>
        </div>

        {/* Floating Balloons */}
        <div className="fixed top-10 left-10 animate-bounce text-4xl">🎈</div>
        <div className="fixed top-20 right-10 animate-bounce delay-300 text-4xl">🎈</div>
        <div className="fixed bottom-10 left-20 animate-bounce delay-500 text-4xl">🎈</div>
        <div className="fixed bottom-20 right-20 animate-bounce delay-700 text-4xl">🎈</div>
      </div>
    </div>
  );
} 