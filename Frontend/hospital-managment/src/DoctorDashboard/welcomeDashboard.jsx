import React from 'react';

const DoctorWelcomeDashboard = ({ doctorData }) => {
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
      title: "Create Diagnosis",
      description: "Write a new diagnosis for your patients",
      icon: "📝",
      link: "createDiagnosis",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "View Diagnoses",
      description: "Review and manage your patient diagnoses",
      icon: "🧾",
      link: "diagnoses",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "My Appointments",
      description: "Manage your upcoming patient appointments",
      icon: "🗓️",
      link: "myappointment",
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "Messages",
      description: "Communicate with patients and colleagues",
      icon: "💬",
      link: "message",
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  const medicalTips = [
    "🩺 Remember to wash hands thoroughly between patient consultations",
    "📋 Always double-check patient allergies before prescribing medication",
    "⏰ Take regular breaks to maintain focus during long consultation hours",
    "📚 Stay updated with the latest medical research and guidelines",
    "🤝 Practice active listening to better understand patient concerns"
  ];

  const randomTip = medicalTips[Math.floor(Math.random() * medicalTips.length)];

  const todayStats = {
    appointmentsToday: 8,
    patientsToday: 6,
    pendingDiagnoses: 3,
    nextAppointment: "10:30 AM"
  };

  return (
    <div className="space-y-6">

      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg p-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {getCurrentGreeting()}, Dr. {doctorData?.first_name}! 👨‍⚕️
            </h1>
            <p className="text-green-100 text-lg">
              Ready to make a difference in your patients' lives today
            </p>
            <p className="text-green-200 text-sm mt-2">
              {getCurrentDate()}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-4xl">🩺</span>
            </div>
          </div>
        </div>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
       
        <div className="lg:col-span-2 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-2xl">💡</span>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Professional Tip of the Day
              </h3>
              <p className="text-blue-700">{randomTip}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center">
          <span className="text-2xl mr-3">⚠️</span>
          <div>
            <h3 className="text-lg font-semibold text-yellow-800 mb-1">
              Important Reminders
            </h3>
            <ul className="text-yellow-700 space-y-1">
              <li>• Medical conference registration deadline: Next Friday</li>
              <li>• Monthly patient review meeting: Tomorrow at 3:00 PM</li>
              <li>• Update continuing education credits by month end</li>
            </ul>
          </div>
        </div>
      </div>

   
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <span className="text-2xl mr-3">🚨</span>
          <div>
            <h3 className="text-lg font-semibold text-red-800 mb-1">
              Emergency Protocols
            </h3>
            <p className="text-red-700 mb-2">
              For medical emergencies, follow hospital emergency protocols immediately.
            </p>
            <p className="text-red-600 text-sm">
              Emergency contact: Extension 911 | Security: Extension 333
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorWelcomeDashboard;

