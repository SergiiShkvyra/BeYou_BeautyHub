import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Calendar, MessageSquare } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will contact you soon to schedule your appointment.');
    setFormData({ name: '', email: '', phone: '', service: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Book Your Appointment</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to enhance your natural beauty? Get in touch with us today
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Get In Touch</h3>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Phone className="h-6 w-6 text-olive mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Phone</h4>
                  <button 
                    onClick={() => handlePhoneClick('(571)-276-7014')}
                    className="text-gray-600 hover:text-olive transition-colors duration-200 cursor-pointer"
                  >
                    (571)-276-7014
                  </button>
                  <p className="text-sm text-gray-500">Call or text us anytime</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="h-6 w-6 text-olive mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Email</h4>
                  <p className="text-gray-600">hello@bellabeautystudio.com</p>
                  <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <MapPin className="h-6 w-6 text-olive mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Location</h4>
                  <a 
                    href="https://www.google.com/maps/place/BeYou+Beautyhub/data=!4m2!3m1!1s0x0:0x8b1970ecf4fc771f?sa=X&ved=1t:2428&ictx=111&cshid=1754622378904828"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-olive transition-colors duration-200 cursor-pointer"
                  >
                    424 Maple Ave E Suite 3<br />Vienna, VA 22180
                  </a>
                  <p className="text-sm text-gray-500">Free parking available</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Clock className="h-6 w-6 text-olive mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Hours</h4>
                  <p className="text-gray-600">
                    Tue-Thur: 10:00 AM - 7:00 PM<br />
                    Saturday: 10:00 AM - 5:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 space-y-4">
              <button 
                onClick={() => window.open('https://www.fresha.com/a/be-you-beauty-hub-vienna-424-maple-avenue-east-gt6tu55b', '_blank')}
                className="w-full bg-olive text-white py-3 rounded-full hover:bg-warm hover:text-olive transition-colors duration-200 font-semibold flex items-center justify-center space-x-2"
              >
                <Calendar className="h-5 w-5" />
                <span>Book Online</span>
              </button>
              <button 
                onClick={() => {
                  const phoneNumber = '5712767014'; // Clean phone number for SMS URL
                  const formattedNumber = '(571)-276-7014'; // Formatted for display
                  const userAgent = navigator.userAgent.toLowerCase();
                  
                  // Enhanced Android detection and handling
                  const isAndroid = /android/.test(userAgent);
                  const isIOS = /iphone|ipad|ipod/.test(userAgent);
                  const isMobile = isAndroid || isIOS || /mobile/.test(userAgent);
                  
                  if (isMobile) {
                    try {
                      if (isAndroid) {
                        // Android-specific handling with multiple fallbacks
                        // Try different SMS URL schemes for better Android compatibility
                        const smsUrls = [
                          `sms:${phoneNumber}`,
                          `sms:${formattedNumber}`,
                          `smsto:${phoneNumber}`,
                          `mms:${phoneNumber}`
                        ];
                        
                        // Try the first URL scheme
                        let smsOpened = false;
                        
                        // Create a hidden link and click it (more reliable on Android)
                        const link = document.createElement('a');
                        link.href = smsUrls[0];
                        link.style.display = 'none';
                        document.body.appendChild(link);
                        
                        // Set up a timeout to check if SMS app opened
                        const timeout = setTimeout(() => {
                          if (!smsOpened) {
                            // If first attempt failed, try alternative methods
                            try {
                              // Try direct window.location approach
                              window.location.href = smsUrls[1];
                            } catch (error) {
                              // Final fallback - show instructions
                              alert(`Please text us at: ${formattedNumber}\n\nIf your messaging app didn't open automatically, you can manually open your SMS app and send a message to this number.`);
                            }
                          }
                          document.body.removeChild(link);
                        }, 1000);
                        
                        // Attempt to open SMS app
                        link.click();
                        smsOpened = true;
                        clearTimeout(timeout);
                        
                      } else if (isIOS) {
                        // iOS devices - use sms: scheme (works reliably on iOS)
                        window.location.href = `sms:${phoneNumber}`;
                      } else {
                        // Other mobile devices
                        window.location.href = `sms:${phoneNumber}`;
                      }
                    } catch (error) {
                      // Enhanced error handling with helpful message
                      alert(`Unable to open messaging app automatically.\n\nPlease manually text us at: ${formattedNumber}\n\nYou can copy this number and paste it into your messaging app.`);
                      
                      // Try to copy number to clipboard as backup
                      if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(formattedNumber).catch(() => {
                          // Clipboard failed, but we already showed the alert with the number
                        });
                      }
                    }
                  } else {
                    // Desktop devices - copy to clipboard and show instructions
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                      navigator.clipboard.writeText(formattedNumber).then(() => {
                        alert(`Phone number copied to clipboard: ${formattedNumber}\n\nYou can paste this into your preferred messaging application.`);
                      }).catch(() => {
                        alert(`Please text us at: ${formattedNumber}`);
                      });
                    } else {
                      alert(`Please text us at: ${formattedNumber}`);
                    }
                  }
                }}
                className="w-full border-2 border-olive text-olive py-3 rounded-full hover:bg-olive hover:text-white transition-colors duration-200 font-semibold flex items-center justify-center space-x-2"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Send Message</span>
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-olive focus:border-olive transition-colors"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-olive focus:border-olive transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-olive focus:border-olive transition-colors"
                    placeholder="(571)-276-7014"
                  />
                </div>
                
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                    Service Interest
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-olive focus:border-olive transition-colors"
                  >
                    <option value="">Select a service</option>
                    <option value="lash-lift-tint">Lash Lift + Tinting</option>
                    <option value="volume-lashes">Volume Lash Extensions</option>
                    <option value="hybrid-lashes">Hybrid Lash Extensions</option>
                    <option value="lash-lift">Lash Lift & Tint</option>
                    <option value="brow-shaping">Eyebrow Shaping & Tinting</option>
                    <option value="brow-lamination">Brow Lamination</option>
                    <option value="consultation">Consultation</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-olive focus:border-olive transition-colors resize-none"
                  placeholder="Tell us about your desired look or any questions you have..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-olive text-white py-3 rounded-lg hover:bg-olive transition-colors duration-200 font-semibold text-lg"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;