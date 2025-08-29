import React from 'react';
import { Heart, Instagram, Facebook, Twitter, MapPin, Phone, Mail, X } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showTermsModal, setShowTermsModal] = React.useState(false);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
              <a href="https://www.facebook.com/share/15Py4Ci4CV" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-olive transition-colors duration-200">
                <Facebook className="h-6 w-6" />
              </a>
            </div>
          </div>

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
            </ul>
          </div>

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
                <button 
                  onClick={() => {
                    const email = 'info@beyoubeautyhub.com';
                    
                    // Function to show notification
                    const showNotification = (message: string) => {
                      const notification = document.createElement('div');
                      notification.textContent = message;
                      notification.style.cssText = `
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        background: #505e47;
                        color: white;
                        padding: 12px 20px;
                        border-radius: 8px;
                        z-index: 99999;
                        font-size: 14px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        pointer-events: none;
                        transform: translateX(0);
                        transition: all 0.3s ease;
                      `;
                      document.body.appendChild(notification);
                      
                      // Animate in
                      requestAnimationFrame(() => {
                        notification.style.transform = 'translateX(0)';
                        notification.style.opacity = '1';
                      });
                      
                      // Remove notification after 3 seconds
                      setTimeout(() => {
                        notification.style.opacity = '0';
                        notification.style.transform = 'translateX(100%)';
                        setTimeout(() => {
                          if (document.body.contains(notification)) {
                            document.body.removeChild(notification);
                          }
                        }, 300);
                      }, 3000);
                    };
                    
                    // Try modern clipboard API first
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                      navigator.clipboard.writeText(email).then(() => {
                        showNotification('Email address copied to clipboard!');
                      }).catch(() => {
                        // Fallback for clipboard API failure
                        showNotification('Email: ' + email);
                      });
                    } else {
                      // Fallback for older browsers
                      try {
                        // Create a temporary textarea element
                        const textArea = document.createElement('textarea');
                        textArea.value = email;
                        textArea.style.position = 'fixed';
                        textArea.style.left = '-999999px';
                        textArea.style.top = '-999999px';
                        document.body.appendChild(textArea);
                        textArea.focus();
                        textArea.select();
                        
                        // Try to copy using execCommand
                        const successful = document.execCommand('copy');
                        document.body.removeChild(textArea);
                        
                        if (successful) {
                          showNotification('Email address copied to clipboard!');
                        } else {
                          showNotification('Email: ' + email);
                        }
                      } catch (err) {
                        showNotification('Email: ' + email);
                      }
                    }
                  }}
                  className="text-gray-300 text-sm hover:text-olive transition-colors duration-200 cursor-pointer"
                >
                  info@beyoubeautyhub.com
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-300 text-sm flex items-center">
              <span>© {currentYear} BeYou BeautyHub. Made with </span>
              <Heart className="h-4 w-4 text-olive mx-1 fill-current" />
              <span></span>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-300 hover:text-olive transition-colors duration-200 text-sm">
                Privacy Policy
              </a>
              <button 
                onClick={() => setShowTermsModal(true)}
                className="text-gray-300 hover:text-olive transition-colors duration-200 text-sm"
              >
                Terms of Service
              </button>
              <a href="#" className="text-gray-300 hover:text-olive transition-colors duration-200 text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Terms of Service Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[99999] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Terms of Service</h2>
              <button
                onClick={() => setShowTermsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full"
                aria-label="Close Terms of Service modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 mb-6">
                  <em>Last updated: {new Date().toLocaleDateString()}</em>
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h3>
                <p className="text-gray-700 mb-6">
                  [Placeholder text] By accessing and using BeYou BeautyHub services, you accept and agree to be bound by the terms and provision of this agreement. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Service Description</h3>
                <p className="text-gray-700 mb-6">
                  [Placeholder text] BeYou BeautyHub provides professional beauty services including but not limited to eyelash extensions, lash lifts, eyebrow shaping, and related beauty treatments. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Appointment Policy</h3>
                <p className="text-gray-700 mb-6">
                  [Placeholder text] All appointments must be booked in advance through our online booking system or by phone. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">4. Cancellation and Refund Policy</h3>
                <p className="text-gray-700 mb-6">
                  [Placeholder text] Cancellations must be made at least 24 hours in advance. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">5. Health and Safety</h3>
                <p className="text-gray-700 mb-6">
                  [Placeholder text] We maintain the highest standards of hygiene and safety. All tools are properly sanitized and we follow strict health protocols. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">6. Liability and Disclaimers</h3>
                <p className="text-gray-700 mb-6">
                  [Placeholder text] While we take every precaution to ensure your safety and satisfaction, clients acknowledge that beauty treatments carry inherent risks. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">7. Privacy and Data Protection</h3>
                <p className="text-gray-700 mb-6">
                  [Placeholder text] We respect your privacy and protect your personal information in accordance with applicable privacy laws. Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio nam libero tempore.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">8. Modifications to Terms</h3>
                <p className="text-gray-700 mb-6">
                  [Placeholder text] We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">9. Contact Information</h3>
                <p className="text-gray-700 mb-6">
                  [Placeholder text] If you have any questions about these Terms of Service, please contact us at info@beyoubeautyhub.com or call us at (571)-276-7014. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg mt-8">
                  <p className="text-sm text-gray-600">
                    <strong>Note:</strong> This is placeholder content for demonstration purposes. The actual Terms of Service should be reviewed and customized by legal professionals to ensure compliance with applicable laws and regulations.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-6">
              <button
                onClick={() => setShowTermsModal(false)}
                className="w-full bg-olive text-white py-3 rounded-lg hover:bg-warm hover:text-olive transition-colors duration-200 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;