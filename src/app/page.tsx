import React from 'react';
import { ChevronRight, MapPin, Users, Calendar, Award, Search } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-green-600">SportSpot</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-green-600">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-green-600">How it Works</a>
            <a href="#testimonials" className="text-gray-600 hover:text-green-600">Testimonials</a>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 text-gray-600 hover:text-green-600">Log In</button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700">Sign Up</button>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-500 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Discover Local Sports Events & Communities</h1>
              <p className="text-lg mb-8">Connect with athletes, find games, and explore sports activities in your area - all powered by our community.</p>
              
              <div className="bg-white rounded-full p-2 flex items-center shadow-lg mb-8">
                <div className="flex-1 flex items-center mx-4">
                  <Search className="h-5 w-5 text-gray-400 mr-2" />
                  <input 
                    type="text" 
                    placeholder="Search for sports or events..." 
                    className="bg-transparent w-full outline-none text-gray-800"
                  />
                </div>
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full">
                  Explore
                </button>
              </div>
              
              <div className="flex items-center text-sm">
                <span>Popular:</span>
                <div className="flex ml-2 space-x-2">
                  <span className="bg-green-600/20 px-3 py-1 rounded-full">Basketball</span>
                  <span className="bg-green-600/20 px-3 py-1 rounded-full">Soccer</span>
                  <span className="bg-green-600/20 px-3 py-1 rounded-full">Tennis</span>
                </div>
              </div>
            </div>
            
            <div className="hidden md:block relative h-96">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl">
                {/* This would be an image in production */}
                <div className="h-full w-full bg-green-300/30 flex items-center justify-center">
                  <span className="text-lg">Sports community image</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6">
              <p className="text-3xl font-bold text-green-600 mb-2">10,000+</p>
              <p className="text-gray-600">Active Users</p>
            </div>
            <div className="p-6">
              <p className="text-3xl font-bold text-green-600 mb-2">500+</p>
              <p className="text-gray-600">Sports Events</p>
            </div>
            <div className="p-6">
              <p className="text-3xl font-bold text-green-600 mb-2">50+</p>
              <p className="text-gray-600">Sports Categories</p>
            </div>
            <div className="p-6">
              <p className="text-3xl font-bold text-green-600 mb-2">200+</p>
              <p className="text-gray-600">Communities</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Discover the SportSpot Experience</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our platform connects sports enthusiasts and makes finding local activities easier than ever</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Location-Based Discovery</h3>
              <p className="text-gray-600">Find sports events and communities near you with our easy-to-use location filters.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Community-Driven</h3>
              <p className="text-gray-600">Connect with like-minded athletes and join communities based on your interests.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Event Organization</h3>
              <p className="text-gray-600">Create and manage your own sports events or join existing ones with a few clicks.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section id="how-it-works" className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">How SportSpot Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Get started in just a few simple steps</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold">1</div>
              <h3 className="text-xl font-semibold mb-3">Create an Account</h3>
              <p className="text-gray-600">Sign up and create your sports profile</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold">2</div>
              <h3 className="text-xl font-semibold mb-3">Set Preferences</h3>
              <p className="text-gray-600">Choose your favorite sports and location</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold">3</div>
              <h3 className="text-xl font-semibold mb-3">Explore Events</h3>
              <p className="text-gray-600">Browse and join events that interest you</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold">4</div>
              <h3 className="text-xl font-semibold mb-3">Connect & Play</h3>
              <p className="text-gray-600">Meet new people and enjoy sports together</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section id="testimonials" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Community Says</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Join thousands of satisfied users who found their sports community</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center mr-4">
                  <span className="font-bold text-green-600">JD</span>
                </div>
                <div>
                  <h4 className="font-semibold">John Doe</h4>
                  <p className="text-sm text-gray-500">Basketball Enthusiast</p>
                </div>
              </div>
              <p className="text-gray-600">"I've found an amazing basketball community in my neighborhood. We play twice a week now thanks to SportSpot!"</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center mr-4">
                  <span className="font-bold text-green-600">SD</span>
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Davis</h4>
                  <p className="text-sm text-gray-500">Tennis Player</p>
                </div>
              </div>
              <p className="text-gray-600">"As someone new to the city, SportSpot helped me find tennis partners and events. It's been a game-changer!"</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center mr-4">
                  <span className="font-bold text-green-600">MJ</span>
                </div>
                <div>
                  <h4 className="font-semibold">Mike Johnson</h4>
                  <p className="text-sm text-gray-500">Soccer Coach</p>
                </div>
              </div>
              <p className="text-gray-600">"I organize weekly soccer games for my community. SportSpot makes it easy to manage events and find new players."</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Sports Community?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">Join thousands of sports enthusiasts already using SportSpot to connect and play</p>
          <button className="bg-white text-green-600 px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-100">
            Get Started for Free
          </button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">SportSpot</h3>
              <p className="text-sm">Connecting sports enthusiasts and communities since 2023</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-700 text-sm text-center">
            <p>© 2025 SportSpot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;