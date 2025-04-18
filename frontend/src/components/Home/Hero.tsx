
import { Star } from 'lucide-react'; // Import Star icon from lucide-react

const Hero = () => {
  return (
    <div className="bg-transparent  text-white pt-4 pb-12"> {/* Dark background, white text, padding */}
      <div className="container mx-auto px-4 text-center"> 
        <div className="bg-green-800 text-white text-xs inline-flex items-center rounded-full px-3 py-1 mb-6">
          <span className="mr-2">•</span> Over 500+ jobs added this week 
        </div>

        <h1 className="text-4xl font-bold mb-4">Find Your Next Career Move</h1>
        <h1 className="text-4xl font-bold mb-8">with Samarthanam</h1>

        <div className="flex justify-center mb-4">
          {/* Replace with actual profile pictures from internet */}
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVvcGxlJTIwcG9ydHJhaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=100&q=60" alt="Profile 1" className="rounded-full w-10 h-10 mx-1 object-cover" />
          <img src="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVvcGxlJTIwcG9ydHJhaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=100&q=60" alt="Profile 5" className="rounded-full w-10 h-10 mx-1 object-cover bg-top-right" />
          <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBlb3BsZSUyMHBvcnRyYWl0fGVufDB8fDB8fHww&auto=format&fit=crop&w=100&q=60" alt="Profile 2" className="rounded-full w-10 h-10 mx-1 object-cover " />

          <img src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHBlb3BsZSUyMHBvcnRyYWl0fGVufDB8fDB8fHww&auto=format&fit=crop&w=100&q=60" alt="Profile 4" className="rounded-full w-10 h-10 mx-1 object-cover" />
          <img src="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVvcGxlJTIwcG9ydHJhaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=100&q=60" alt="Profile 5" className="rounded-full w-10 h-10 mx-1 object-cover bg-top-right" />
        </div>

        <div className="flex justify-center mb-8">
          <Star className="text-yellow-400 w-6 h-6 mx-1" />
          <Star className="text-yellow-400 w-6 h-6 mx-1" />
          <Star className="text-yellow-400 w-6 h-6 mx-1" />
          <Star className="text-yellow-400 w-6 h-6 mx-1" />
          <Star className="text-yellow-400 w-6 h-6 mx-1" />
        </div>

        <p className="text-lg mb-4">Loved by 100,000+ professionals</p>

        <p className="text-sm text-gray-400 max-w-2xl mx-auto">
          Join hundreds of professionals who have found their dream jobs through Samarthanam. With over 3,000 active jobs and global opportunities, your next career move is just a click away.
        </p>
      </div>
    </div>
  );
};

export default Hero;