import React from 'react';
import { Heart, Instagram, Facebook, Twitter, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Function to handle phone number click
  const handlePhoneClick = (phoneNumber: string) => {
    // Check if device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // On mobile, open phone dialer
      window.location.href = `tel:${phoneNumber}`;
    } else {
      // On desktop, copy to clipboard
      navigator.clipboard.writeText(phoneNumber).then(() => {
        // Show notification that number was copied
        const notification = document.createElement('div');
        notification.textContent = 'Phone number copied to clipboard!';
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #505e47;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          z-index: 10000;
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 3000);
      }).catch(() => {
        // Fallback if clipboard API fails
        alert('Phone number: ' + phoneNumber);
      });
    }
  };
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-800 text-warm">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-olive mb-4">BeYou BeautyHub</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Enhancing your natural beauty with professional eyelash and eyebrow services. 
              Your confidence is our passion.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/beyou_beautyhub" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-olive transition-colors duration-200">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61578572331666&mibextid=LQQJ4d" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-olive transition-colors duration-200">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-olive transition-colors duration-200">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Empty spacer for centering */}
          <div className="hidden md:block"></div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'Services', 'About', 'Gallery', 'Contact'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="text-gray-300 hover:text-olive transition-colors duration-200"
                  >
                    {item}
                  </button>
                </li>
              ))}
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-olive mt-0.5" />
                <a 
                  href="https://www.google.com/maps/place/BeYou+Beautyhub/data=!4m2!3m1!1s0x0:0x8b1970ecf4fc771f?sa=X&ved=1t:2428&ictx=111&cshid=1754622378904828"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 text-sm hover:text-olive transition-colors duration-200 cursor-pointer"
                >
                  424 Maple Ave E Suite 3<br />
                  Vienna, VA 22180
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-olive" />
                <button 
                  onClick={() => handlePhoneClick('(571)-276-7014')}
                  className="text-gray-300 text-sm hover:text-olive transition-colors duration-200 cursor-pointer"
                >
                  (571)-276-7014
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-olive" />
                <span className="text-gray-300 text-sm">info@beyoubeautyhub.com</span>
              </div>
            </div>

            <div className="mt-6">
              <h5 className="font-medium mb-2">Business Hours</h5>
              <div className="text-gray-300 text-sm space-y-1">
                <div>Tue-Thur: 10AM-7PM</div>
                <div>Saturday: 10AM-5PM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;