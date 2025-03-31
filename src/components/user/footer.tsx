import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, Instagram, Twitter, Facebook, Youtube } from "lucide-react";

export default function Footer() {
  // these are hardcoded sports categories and cities
  const sportsCategories = [
    { name: "Football", url: "/explore/football" },
    { name: "Cricket", url: "/explore/cricket" },
    { name: "Basketball", url: "/explore/basketball" },
    { name: "Tennis", url: "/explore/tennis" },
    { name: "Badminton", url: "/explore/badminton" }
  ];

  const popularCities = [
    { name: "Ahmedabad", url: "/city/ahmedabad" },
    
  ];

  // Main navigation links
  const mainLinks = [
    { name: "Explore", url: "/sports" },
    { name: "Our Vision", url: "/vision" },
    { name: "Top Contributors", url: "/top-contributors" }
  ];

  // Support links
  const supportLinks = [
    { name: "Help", url: "/help" },

  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image 
                src="/TurfTapLogo.png" 
                alt="SportSpot Logo" 
                width={40} 
                height={40} 
                className="h-10 w-10"
              />
              <span className="text-xl font-bold text-green-400">Turf Tap</span>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              A community powered sports turfs and ground exploration platform.
            </p>
            <div className="flex flex-col space-y-2 mt-6">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-green-400" />
                <span className="text-sm">purvaspatel1241@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-green-400" />
                <span className="text-sm">+91 87805 60746</span>
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <Link href="https://instagram.com" className="text-gray-400 hover:text-green-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="https://twitter.com" className="text-gray-400 hover:text-green-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="https://facebook.com" className="text-gray-400 hover:text-green-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="https://youtube.com" className="text-gray-400 hover:text-green-400 transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-400">Quick Links</h3>
            <ul className="space-y-2">
              {mainLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.url} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-400">Explore Sports</h3>
            <ul className="space-y-2">
              {sportsCategories.map((sport) => (
                <li key={sport.name}>
                  <Link 
                    href={sport.url} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {sport.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-green-400">Popular Cities</h3>
              <ul className="space-y-2">
                {popularCities.map((city) => (
                  <li key={city.name}>
                    <Link 
                      href={city.url}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {city.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-green-400">Support</h3>
              <ul className="space-y-2">
                {supportLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.url} 
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} TurfTap
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-500">
              Designed and Developed with ❤️ by <a href="/createdby">Purva</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}