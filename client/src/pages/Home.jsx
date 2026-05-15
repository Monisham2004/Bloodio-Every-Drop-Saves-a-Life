import { Link } from 'react-router-dom';
import { Droplet, Heart, Activity, ShieldCheck, ArrowRight, Search, Users } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Save a Life, <br />
                <span className="text-primary-200">Give Blood.</span>
              </h1>
              <p className="text-lg md:text-xl text-primary-100 max-w-lg">
                Connect with local donors or register to become one. Your single donation can save up to three lives.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="bg-white text-primary-700 px-6 py-3 rounded-lg font-bold text-center hover:bg-primary-50 transition shadow-lg flex items-center justify-center gap-2">
                  <Droplet className="w-5 h-5 fill-primary-700" />
                  Become a Donor
                </Link>
                <Link to="/login" className="border-2 border-white/30 text-white px-6 py-3 rounded-lg font-bold text-center hover:bg-white/10 transition flex items-center justify-center gap-2">
                  <Search className="w-5 h-5" />
                  Find Blood
                </Link>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative w-72 h-72 lg:w-96 lg:h-96">
                <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <img 
                  src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Blood Donation" 
                  className="relative z-10 w-full h-full object-cover rounded-[2rem] shadow-2xl border-4 border-white/20"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-50 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">5k+</h3>
              <p className="text-gray-500 mt-1">Active Donors</p>
            </div>
            <div className="text-center">
              <div className="bg-green-50 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">12k+</h3>
              <p className="text-gray-500 mt-1">Lives Saved</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-50 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">1.2k</h3>
              <p className="text-gray-500 mt-1">Hospitals</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-50 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">100%</h3>
              <p className="text-gray-500 mt-1">Safe Process</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-gray-600">The donation process is simple, fast, and completely safe. Join our community today.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 font-bold text-xl mb-6">1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Register</h3>
              <p className="text-gray-600">Create an account as a donor or recipient. It takes less than 2 minutes.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition relative">
              <div className="hidden md:block absolute top-1/2 -right-4 text-gray-300">
                <ArrowRight className="w-8 h-8" />
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 font-bold text-xl mb-6">2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Connect</h3>
              <p className="text-gray-600">Recipients can search for compatible donors nearby and send requests.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 font-bold text-xl mb-6">3</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Save Life</h3>
              <p className="text-gray-600">Donors accept requests and visit the hospital to complete the donation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Heart className="w-16 h-16 text-primary-500 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to make a difference?</h2>
          <p className="text-lg text-gray-600 mb-8">Every drop counts. Join thousands of heroes who are saving lives every day.</p>
          <Link to="/register" className="inline-flex items-center gap-2 btn-primary px-8 py-4 text-lg">
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
