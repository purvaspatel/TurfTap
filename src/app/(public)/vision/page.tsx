import Image from "next/image";
export default function Vision() {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-3xl mx-auto">
        <Image
          src="/TurfTapLogo.png" // Replace with your actual logo path
          alt="SportConnect Logo"
          className="h-20 w-auto mx-auto mb-6"
          width={500}
          height={500}
        />
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Building with Passion</h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          We're creating more than just a platform - we're building a community powered sports exploration experience.
          From the free playing fields, dusted courts to professional venues, we aim to build a space where real players can share their favorite playing grounds and provide genuine reviews.
          This allows new enthusiasts to discover and explore the best turfs with real, firsthand insights.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          
          
          <div className="p-6 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-700 mb-2">Discover</h3>
            <p className="text-sm text-gray-600">Explore new sports, venues, and experiences near you</p>
          </div>
          
          <div className="p-6 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-700 mb-2">Play</h3>
            <p className="text-sm text-gray-600">Turn every day into an opportunity for activity and joy</p>
          </div>
        </div>
        
        <p className="text-gray-500 italic mt-10">
          "The strength of the team is each individual member. The strength of each member is the team."
        </p>
      </div>
    );
  }