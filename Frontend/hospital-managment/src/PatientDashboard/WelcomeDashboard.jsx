import React from 'react';

const WelcomeDashboard = ({ user }) => {
  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const quickActions = [
    {
      title: "Book Appointment",
      description: "Schedule a new appointment with your doctor",
      icon: "🕒",
      link: "appointment",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "View Diagnoses",
      description: "Check your medical diagnoses and reports",
      icon: "🧾",
      link: "diagnoses",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "My Appointments",
      description: "View and manage your upcoming appointments",
      icon: "🗓️",
      link: "myappointment",
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "Messages",
      description: "Communicate with your healthcare providers",
      icon: "💬",
      link: "message",
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  const healthTips = [
    "💧 Stay hydrated - drink at least 8 glasses of water daily",
    "🚶‍♂️ Take a 30-minute walk to boost your cardiovascular health",
    "🥗 Include more fruits and vegetables in your diet",
    "😴 Aim for 7-9 hours of quality sleep each night",
    "🧘‍♀️ Practice mindfulness or meditation for mental wellness"
  ];

  const randomTip = healthTips[Math.floor(Math.random() * healthTips.length)];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {getCurrentGreeting()}, {user?.first_name}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              Welcome back to your health dashboard
            </p>
            <p className="text-blue-200 text-sm mt-2">
              {getCurrentDate()}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-4xl">👨‍⚕️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className={`${action.color} text-white rounded-lg p-6 shadow-md transition-all duration-200 transform hover:scale-105 cursor-pointer`}
              onClick={() => window.location.hash = `#${action.link}`}
            >
              <div className="text-3xl mb-3">{action.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
              <p className="text-sm opacity-90">{action.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Health Stats and Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Tip */}
        <div className="lg:col-span-2 bg-green-50 border-l-4 border-green-500 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-2xl">💡</span>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Daily Health Tip
              </h3>
              <p className="text-green-700">{randomTip}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <span className="text-2xl mr-3">🚨</span>
          <div>
            <h3 className="text-lg font-semibold text-red-800 mb-1">
              Emergency Contact
            </h3>
            <p className="text-red-700 mb-2">
              For medical emergencies, call 911 or visit your nearest emergency room.
            </p>
            <p className="text-red-600 text-sm">
              For non-emergency questions, use the message feature to contact your healthcare provider.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeDashboard;

