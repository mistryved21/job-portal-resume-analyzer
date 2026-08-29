import React from 'react';
import { Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Footer Top Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-2xl font-bold">YourCompany</div>
          <div className="flex space-x-6">
            <a href="#" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
              <Facebook className="h-6 w-6 text-white hover:text-[#6A38C2]" />
            </a>
            <a href="#" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
              <Twitter className="h-6 w-6 text-white hover:text-[#6A38C2]" />
            </a>
          </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h5 className="font-semibold mb-4">Company</h5>
            <ul>
              <li><a href="#" className="hover:text-[#6A38C2]">About Us</a></li>
              <li><a href="#" className="hover:text-[#6A38C2]">Careers</a></li>
              <li><a href="#" className="hover:text-[#6A38C2]">Blog</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Resources</h5>
            <ul>
              <li><a href="#" className="hover:text-[#6A38C2]">Help Center</a></li>
              <li><a href="#" className="hover:text-[#6A38C2]">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#6A38C2]">Terms & Conditions</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Support</h5>
            <ul>
              <li><a href="#" className="hover:text-[#6A38C2]">Contact Us</a></li>
              <li><a href="#" className="hover:text-[#6A38C2]">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Subscribe</h5>
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-2 rounded-full text-black"
            />
            <button className="mt-4 w-full bg-[#6A38C2] text-white py-2 rounded-full">
              Subscribe
            </button>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-center mt-10">
          <p>&copy; {new Date().getFullYear()} YourCompany. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
