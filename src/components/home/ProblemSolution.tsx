import React from 'react';
import { AlertTriangle, MapPin, Users, Shield } from 'lucide-react';

const ProblemSolution = () => {
  const problems = [
    {
      icon: AlertTriangle,
      title: "Outdated Trail Information",
      description: "Getting lost with unreliable maps and conditions"
    },
    {
      icon: MapPin,
      title: "Missing Hidden Gems",
      description: "Hiking the same crowded trails over and over"
    },
    {
      icon: Shield,
      title: "Safety Concerns",
      description: "Feeling unsafe on remote trails without proper support"
    }
  ];

  const solutions = [
    {
      icon: "🤖",
      title: "AI Trail Matching",
      description: "Find your perfect trail, every time",
      detail: "Intelligent recommendations based on your fitness, interests, and real-time conditions"
    },
    {
      icon: "⚡",
      title: "Live Trail Intelligence",
      description: "Real-time conditions at your fingertips",
      detail: "Weather, crowds, closures, and safety alerts updated every 15 minutes"
    },
    {
      icon: "🗺️",
      title: "3D Trail Previews",
      description: "See before you hike",
      detail: "Immersive 3D visualizations and detailed elevation profiles"
    },
    {
      icon: "🛡️",
      title: "Guardian Angel Safety",
      description: "Hike with confidence",
      detail: "Offline maps, SOS beacon, and emergency check-ins with local services"
    }
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Problems Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Tired of These Hiking Frustrations?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Traditional hiking apps leave you unprepared. GreenTrails changes everything.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {problems.map((problem, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-red-100 dark:border-red-900">
              <problem.icon className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {problem.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {problem.description}
              </p>
            </div>
          ))}
        </div>

        {/* Solutions Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-greentrail-700 dark:text-greentrail-300 mb-4">
            Here's How GreenTrails Solves Everything
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Revolutionary technology meets outdoor passion. Experience hiking like never before.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {solutions.map((solution, index) => (
            <div key={index} className="flex items-start space-x-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-greentrail-100 dark:border-greentrail-900 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-2">{solution.icon}</div>
              <div>
                <h3 className="text-xl font-semibold text-greentrail-700 dark:text-greentrail-300 mb-2">
                  {solution.title}
                </h3>
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {solution.description}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {solution.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;