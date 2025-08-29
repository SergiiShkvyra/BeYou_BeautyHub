import React from 'react';
import { Heart, Instagram, Facebook, Twitter, MapPin, Phone, Mail, X } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showTermsModal, setShowTermsModal] = React.useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = React.useState(false);
  const [showCookieModal, setShowCookieModal] = React.useState(false);

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

          {/* Logo */}
          <div className="flex justify-center lg:justify-end">
            <img
              src="/images/logoPSD-2.png"
              alt="BeYou BeautyHub Logo"
              className="h-24 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-200"
              loading="lazy"
              decoding="async"
            />
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
              <button 
                onClick={() => setShowPrivacyModal(true)}
                className="text-gray-300 hover:text-olive transition-colors duration-200 text-sm"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => setShowTermsModal(true)}
                className="text-gray-300 hover:text-olive transition-colors duration-200 text-sm"
              >
                Terms of Service
              </button>
              <button 
                onClick={() => setShowCookieModal(true)}
                className="text-gray-300 hover:text-olive transition-colors duration-200 text-sm"
              >
                Cookie Policy
              </button>
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

                 <p className="text-gray-700 mb-6">
                 Welcome to beyoubeautyhub.com ! By using our website and services, you agree to the following terms. Please read them carefully.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Services</h3>
                <p className="text-gray-700 mb-6">
                  Our Site allows you to browse, book, and purchase beauty services and related products. By placing a booking or purchase, you confirm that the information you provide is accurate and complete.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Payments</h3>
                <p className="text-gray-700 mb-6">
                  All prices are listed in dollar of the United States of America. Payments must be made in full at the time of booking or checkout. We reserve the right to refuse or cancel any order if fraud or unauthorized activity is suspected.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Appointments & Cancellations</h3>
                <p className="text-gray-700 mb-6">
                  • You can book services through our Site at available times.
 • If you need to cancel or reschedule, please do so at least 24 hours in advance.
 • Late cancellations or missed appointments may result in a fee.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">4. Use of the Site</h3>
                <p className="text-gray-700 mb-6">
                  You agree not to use our Site for any unlawful purpose, or in any way that may harm, disable, or disrupt its functionality.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">5. Intellectual Property</h3>
                <p className="text-gray-700 mb-6">
                  All content on this Site (text, images, logos, branding) belongs to beyoubeautyhub.com unless otherwise stated. You may not copy, reproduce, or distribute it without our permission.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">6. Limitation of Liability</h3>
                <p className="text-gray-700 mb-6">
                  We strive to provide accurate information and high-quality services, but we are not responsible for:
 • technical issues, errors, or interruptions of the Site;
 • damages resulting from misuse of our services or products.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">7. Changes to Terms</h3>
                <p className="text-gray-700 mb-6">
                  We may update these Terms of Service from time to time. Updated terms will be posted on this page and take effect immediately upon posting.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">8. Contact Us</h3>
                <p className="text-gray-700 mb-6">
                  If you have questions about these Terms, please contact us at info@beyoubeautyhub.com.
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

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[99999] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Privacy Policy</h2>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full"
                aria-label="Close Privacy Policy modal"
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

                <p className="text-gray-700 mb-6">
                  TODO: 
                  At BeYou BeautyHub, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or use our services.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h3>
                <p className="text-gray-700 mb-6">
                  We may collect the following types of information:
                  <br />• <strong>Personal Information:</strong> Name, email address, phone number, and appointment preferences when you book services or contact us.
                  <br />• <strong>Usage Data:</strong> Information about how you interact with our website, including pages visited and time spent.
                  <br />• <strong>Device Information:</strong> Browser type, operating system, and IP address for security and optimization purposes.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h3>
                <p className="text-gray-700 mb-6">
                  We use your information to:
                  <br />• Provide and improve our beauty services
                  <br />• Schedule and manage appointments
                  <br />• Communicate with you about services, appointments, and promotions
                  <br />• Ensure the security and functionality of our website
                  <br />• Comply with legal obligations
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Information Sharing</h3>
                <p className="text-gray-700 mb-6">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                  <br />• With service providers who help us operate our business (e.g., appointment scheduling platforms)
                  <br />• When required by law or to protect our rights and safety
                  <br />• With your explicit consent
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">4. Data Security</h3>
                <p className="text-gray-700 mb-6">
                  We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">5. Cookies and Tracking</h3>
                <p className="text-gray-700 mb-6">
                  Our website may use cookies and similar technologies to enhance your browsing experience, analyze website traffic, and personalize content. You can control cookie settings through your browser preferences.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">6. Your Rights</h3>
                <p className="text-gray-700 mb-6">
                  You have the right to:
                  <br />• Access, update, or delete your personal information
                  <br />• Opt-out of marketing communications
                  <br />• Request information about how your data is used
                  <br />• File a complaint with relevant data protection authorities
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">7. Third-Party Links</h3>
                <p className="text-gray-700 mb-6">
                  Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review their privacy policies.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">8. Children's Privacy</h3>
                <p className="text-gray-700 mb-6">
                  Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">9. Changes to This Policy</h3>
                <p className="text-gray-700 mb-6">
                  We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last updated" date. We encourage you to review this policy periodically.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">10. Contact Us</h3>
                <p className="text-gray-700 mb-6">
                  If you have any questions about this Privacy Policy or how we handle your personal information, please contact us at:
                  <br />• Email: info@beyoubeautyhub.com
                  <br />• Phone: (571)-276-7014
                  <br />• Address: 424 Maple Ave E Suite 3, Vienna, VA 22180
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg mt-8">
                  <p className="text-sm text-gray-600">
                    <strong>Note:</strong> This is placeholder content for demonstration purposes. The actual Privacy Policy should be reviewed and customized by legal professionals to ensure compliance with applicable privacy laws and regulations such as GDPR, CCPA, and other relevant data protection requirements.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-6">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="w-full bg-olive text-white py-3 rounded-lg hover:bg-warm hover:text-olive transition-colors duration-200 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Policy Modal */}
      {showCookieModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[99999] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Cookie Policy</h2>
              <button
                onClick={() => setShowCookieModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full"
                aria-label="Close Cookie Policy modal"
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

                <p className="text-gray-700 mb-6">
                  TODO: 
                  This Cookie Policy explains how BeYou BeautyHub uses cookies and similar technologies when you visit our website. We want to be transparent about how we collect and use data to improve your browsing experience.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">1. What Are Cookies?</h3>
                <p className="text-gray-700 mb-6">
                  Cookies are small text files that are stored on your device when you visit a website. They help websites remember information about your visit, such as your preferred language and other settings, which can make your next visit easier and the site more useful to you.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Types of Cookies We Use</h3>
                <p className="text-gray-700 mb-6">
                  <strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly. They enable basic functions like page navigation, access to secure areas, and form submissions.
                  <br /><br />
                  <strong>Performance Cookies:</strong> These cookies collect information about how visitors use our website, such as which pages are visited most often. This data helps us improve how our website works.
                  <br /><br />
                  <strong>Functionality Cookies:</strong> These cookies allow the website to remember choices you make (such as your preferred language or region) and provide enhanced, more personal features.
                  <br /><br />
                  <strong>Analytics Cookies:</strong> We use these cookies to understand how our website is being used and to analyze traffic patterns to improve user experience.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Third-Party Cookies</h3>
                <p className="text-gray-700 mb-6">
                  We may use third-party services that place cookies on your device, including:
                  <br />• <strong>Google Analytics:</strong> To analyze website traffic and user behavior
                  <br />• <strong>Booking Platform:</strong> To enable appointment scheduling functionality
                  <br />• <strong>Social Media Platforms:</strong> To enable social sharing features
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">4. Managing Your Cookie Preferences</h3>
                <p className="text-gray-700 mb-6">
                  You can control and manage cookies in several ways:
                  <br />• <strong>Browser Settings:</strong> Most web browsers allow you to control cookies through their settings preferences
                  <br />• <strong>Opt-Out Tools:</strong> You can opt-out of certain third-party cookies through industry opt-out tools
                  <br />• <strong>Cookie Banner:</strong> When available, use our cookie consent banner to manage your preferences
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">5. Browser-Specific Instructions</h3>
                <p className="text-gray-700 mb-6">
                  <strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data
                  <br />
                  <strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data
                  <br />
                  <strong>Safari:</strong> Preferences → Privacy → Manage Website Data
                  <br />
                  <strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">6. Impact of Disabling Cookies</h3>
                <p className="text-gray-700 mb-6">
                  Please note that disabling certain cookies may affect the functionality of our website. Essential cookies are necessary for basic website operations, while other cookies enhance your browsing experience but are not strictly necessary.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">7. Cookie Retention</h3>
                <p className="text-gray-700 mb-6">
                  <strong>Session Cookies:</strong> These are temporary cookies that are deleted when you close your browser
                  <br />
                  <strong>Persistent Cookies:</strong> These remain on your device for a set period or until you delete them manually
                  <br />
                  We regularly review and delete unnecessary cookies to minimize data collection.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">8. Updates to This Policy</h3>
                <p className="text-gray-700 mb-6">
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. Please check this page periodically for updates.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">9. Contact Us</h3>
                <p className="text-gray-700 mb-6">
                  If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
                  <br />• Email: info@beyoubeautyhub.com
                  <br />• Phone: (571)-276-7014
                  <br />• Address: 424 Maple Ave E Suite 3, Vienna, VA 22180
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg mt-8">
                  <p className="text-sm text-gray-600">
                    <strong>Note:</strong> This is placeholder content for demonstration purposes. The actual Cookie Policy should be reviewed and customized by legal professionals to ensure compliance with applicable privacy laws and regulations such as GDPR, CCPA, and other relevant data protection requirements.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-6">
              <button
                onClick={() => setShowCookieModal(false)}
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