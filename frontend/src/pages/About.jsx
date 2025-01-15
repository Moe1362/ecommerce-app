import React from 'react';
import { 
  Target, 
  Eye,
  Sparkles,
  ArrowRight,
  Layers,
  MousePointer
} from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen py-16 px-4 md:px-8 lg:px-16 relative overflow-hidden bg-black text-white">
      {/* Modern gradient backgrounds */}
      <div className="absolute top-0 left-0 w-96 h-96  rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBoLTQweiIvPjxwYXRoIGQ9Ik00MCAyMGgtNDBtMjAtMjB2NDAiIHN0cm9rZT0iIzMzMzMzMyIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-400">
                <MousePointer className="w-5 h-5" />
                <span className="text-sm font-medium tracking-wider uppercase">Interactive Experience</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-400 to-purple-400 bg-clip-text text-transparent">
                About Our Vision
              </h1>
              <p className="text-lg text-gray-400 leading-relaxed mt-6">
                We craft digital experiences that inspire. Our team pushes the boundaries of innovation, 
                creating solutions that transform ideas into reality.
              </p>
            </div>
          </div>

          {/* Modern 3D Card */}
          <div className="flex-1 relative group perspective-1000">
            <div className="relative rounded-2xl overflow-hidden transition-transform duration-500 group-hover:rotate-y-12">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 backdrop-blur-sm z-10"></div>
              <img 
                src="https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://fdczvxmwwjwpwbeeqcth.supabase.co/storage/v1/object/public/images/9baef561-5a7e-4b71-9681-1e9b12ec695d/50808c9f-b973-4205-8375-5739d43c58c6.png"
                alt="Innovation Concept" 
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="mt-24 grid md:grid-cols-2 gap-8">
          <div className="group">
            <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-blue-500/50 transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="p-3 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                  <Layers className="w-8 h-8 text-blue-400" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold">Innovation Hub</h3>
                  <p className="text-gray-400">Pushing boundaries with cutting-edge technology and creative solutions.</p>
                  <div className="flex items-center gap-2 text-blue-400 group-hover:translate-x-2 transition-transform">
                    <span className="text-sm font-medium">Explore More</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="group">
            <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-purple-500/50 transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="p-3 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                  <Target className="w-8 h-8 text-purple-400" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold">Future Focus</h3>
                  <p className="text-gray-400">Building tomorrow's solutions with today's breakthrough technologies.</p>
                  <div className="flex items-center gap-2 text-purple-400 group-hover:translate-x-2 transition-transform">
                    <span className="text-sm font-medium">Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;