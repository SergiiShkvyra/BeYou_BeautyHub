import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Calendar, MessageSquare } from 'lucide-react';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset status
    setSubmitStatus({ type: null, message: '' });
    
    // Validate required fields
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitStatus({
        type: 'error',
        message: 'Please fill in all required fields (Name, Email, and Message).'
      });
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus({
        type: 'error',
        message: 'Please enter a valid email address.'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Send email using EmailJS
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone || 'Not provided',
        service: formData.service || 'Not specified',
        message: formData.message,
        to_email: 'info@beyoubeautyhub.com'
      };

      await emailjs.send(
        'service_gl0u0p6',     // Replace with your EmailJS service ID
        'template_v1xwasf',    // Replace with your EmailJS template ID
        templateParams,
        'K3ThLn8wQAncY7wqX'      // Replace with your EmailJS public key
      );
      
      setSubmitStatus({
        type: 'success',
        message: 'Thank you for your message! We have received your inquiry and will contact you soon.'
      });
      
      // Clear form on success
      setFormData({ name: '', email: '', phone: '', service: '', message: '' });
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Unable to send message at this time. Please try again or contact us directly at (571)-276-7014.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    // Clear status when user starts typing
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: '' });
    }
    
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
                <Clock className="h-6 w-6 text-olive mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Hours</h4>
                  <p className="text-gray-600">
                    Mon-Fri: 10:00 AM - 7:00 PM<br />
                    Sat-Sun: 10:00 AM - 4:00 PM
                  </p>
                </div>
              </div>

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
                    className="text-gray-600 hover:text-olive transition-colors duration-200 cursor-pointer"
                  >
                    info@beyoubeautyhub.com
                  </button>
                  <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <MapPin className="h-6 w-6 text-olive mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Location</h4>
                  <button
                    onClick={() => {
                      const address = "424 Maple Ave E Suite 3, Vienna, VA 22180";
                      
                      // Create navigation options
                      const navigationOptions = [
                        {
                          name: "Google Maps",
                          url: "https://www.google.com/maps/place/BeYou+Beauty+Hub/@38.9092402,-77.2568301,17z/data=!3m1!4b1!4m6!3m5!1s0x89b64b00159324fd:0x8b1970ecf4fc771f!8m2!3d38.9092402!4d-77.2568301!16s%2Fg%2F11xgky7njv?entry=ttu&g_ep=EgoyMDI1MDgyNS4wIKXMDSoASAFQAw%3D%3D",
                          icon: "🗺️"
                        },
                        {
                          name: "Apple Maps",
                          url: "https://maps.apple.com/place?place-id=IC0C55897AF474D4C&address=424+Maple+Ave+E%2C+Vienna%2C+VA++22180%2C+United+States&coordinate=38.9092273%2C-77.2568108&name=BeYou+BeautyHub&_provider=9902",
                          icon: "🍎"
                        },
                        {
                          name: "Waze",
                          url: "https://www.waze.com/en-GB/live-map/directions/us/va/vienna/beyou-beauty-hub?navigate=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location&to=place.ChIJ_SSTFQBLtokRH3f89OxwGYs",
                          icon: "🚗"
                        }
                      ];
                      
                      // Create modal
                      const modal = document.createElement('div');
                      modal.style.cssText = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0, 0, 0, 0.5);
                        z-index: 99999;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 20px;
                      `;
                      
                      const modalContent = document.createElement('div');
                      modalContent.style.cssText = `
                        background: #dbd6b2;
                        border-radius: 12px;
                        padding: 24px;
                        max-width: 400px;
                        width: 100%;
                        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                      `;
                      
                      modalContent.innerHTML = `
                        <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #505e47;">
                          Choose Navigation App
                        </h3>
                        <p style="margin: 0 0 20px 0; color: #505e47; font-size: 14px; opacity: 0.8;">
                          ${address}
                        </p>
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                          ${navigationOptions.map(option => `
                            <button 
                              onclick="window.open('${option.url}', '_blank'); document.body.removeChild(document.querySelector('[data-navigation-modal]'))"
                              style="
                                display: flex;
                                align-items: center;
                                gap: 12px;
                                padding: 12px 16px;
                                border: 2px solid #505e47;
                                border-radius: 8px;
                                background: #f5f3e8;
                                cursor: pointer;
                                transition: all 0.2s;
                                font-size: 16px;
                                font-weight: 500;
                                color: #505e47;
                              "
                              onmouseover="this.style.borderColor='#3a4a35'; this.style.backgroundColor='#dbd6b2'"
                              onmouseout="this.style.borderColor='#505e47'; this.style.backgroundColor='#f5f3e8'"
                            >
                              <span style="font-size: 20px;">${option.icon}</span>
                              <span>Open in ${option.name}</span>
                            </button>
                          `).join('')}
                        </div>
                        <button 
                          onclick="document.body.removeChild(document.querySelector('[data-navigation-modal]'))"
                          style="
                            margin-top: 16px;
                            width: 100%;
                            padding: 10px;
                            border: 1px solid #505e47;
                            border-radius: 6px;
                            background: #f5f3e8;
                            cursor: pointer;
                            font-size: 14px;
                            color: #505e47;
                          "
                          onmouseover="this.style.backgroundColor='#dbd6b2'"
                          onmouseout="this.style.backgroundColor='#f5f3e8'"
                        >
                          Cancel
                        </button>
                      `;
                      
                      modal.appendChild(modalContent);
                      modal.setAttribute('data-navigation-modal', 'true');
                      
                      // Close modal when clicking outside
                      modal.addEventListener('click', (e) => {
                        if (e.target === modal) {
                          document.body.removeChild(modal);
                        }
                      });
                      
                      document.body.appendChild(modal);
                    }}
                    className="text-gray-600 hover:text-olive transition-colors duration-200 cursor-pointer text-left"
                  >
                    424 Maple Ave E Suite 3<br />Vienna, VA 22180
                  </button>
                  <p className="text-sm text-gray-500">Free parking available</p>
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
                  
                  // Detect device type
                  const userAgent = navigator.userAgent.toLowerCase();
                  const isAndroid = /android/.test(userAgent);
                  const isIOS = /iphone|ipad|ipod/.test(userAgent);
                  const isMobile = isAndroid || isIOS || /mobile/.test(userAgent);
                  
                  if (isMobile) {
                  }
                  if (isMobile) {
                    // SOLUTION: Use proper link creation with user-initiated click
                    // This bypasses Android's ERR_UNKNOWN_URL_SCHEME restriction
                    const smsUrl = `sms:${phoneNumber}`;
                    
                    try {
                      // Create a proper link element
                      const link = document.createElement('a');
                      link.href = smsUrl;
                      link.target = '_blank';
                      link.rel = 'noopener noreferrer';
                      
                      // Hide the link but add to DOM (required for some browsers)
                      link.style.position = 'absolute';
                      link.style.left = '-9999px';
                      link.style.top = '-9999px';
                      link.style.visibility = 'hidden';
                      document.body.appendChild(link);
                      
                      // Create a proper mouse event (simulates real user click)
                      const clickEvent = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        button: 0,
                        buttons: 1,
                        clientX: 0,
                        clientY: 0
                      });
                      
                      // Dispatch the event (this bypasses security restrictions)
                      const eventDispatched = link.dispatchEvent(clickEvent);
                      
                      // Clean up the DOM
                      setTimeout(() => {
                        if (document.body.contains(link)) {
                          document.body.removeChild(link);
                        }
                      }, 100);
                      
                      // Fallback if event dispatch failed
                      if (!eventDispatched) {
                        throw new Error('Event dispatch failed');
                      }
                      
                    } catch (error) {
                      // Graceful fallback with clear instructions
                      const message = isAndroid 
                        ? `Unable to open messaging app automatically.\n\nPlease text us at: ${formattedNumber}\n\nSteps:\n1. Open your messaging app (Messages, Samsung Messages, etc.)\n2. Create new message\n3. Enter: ${formattedNumber}`
                        : `Please text us at: ${formattedNumber}`;
                      
                      alert(message);
                      
                      // Try to copy number to clipboard as backup
                      if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(formattedNumber).then(() => {
                          // Show additional notification that number was copied
                          setTimeout(() => {
                            alert('Phone number copied to clipboard!');
                          }, 500);
                        }).catch(() => {
                          // Clipboard failed, but we already showed the manual instructions
                        });
                      }
                    }
                  } else {
                    // Desktop - copy to clipboard with instructions
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
                <span>Text us</span>
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send Us an Email</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Status Message */}
              {submitStatus.type && (
                <div className={`p-4 rounded-lg ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  <p className="text-sm font-medium">{submitStatus.message}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
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
                    Email Address *
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
                  Message *
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
                disabled={isSubmitting}
                className={`w-full py-3 rounded-lg font-semibold text-lg transition-colors duration-200 ${
                  isSubmitting
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-olive text-white hover:bg-warm hover:text-olive'
                }`}
              >
                {isSubmitting ? 'Sending...' : 'Send Email'}
              </button>
              
              <p className="text-sm text-gray-500 text-center">
                * Required fields
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;