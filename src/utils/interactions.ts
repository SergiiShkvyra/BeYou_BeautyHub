// Shared browser-interaction helpers used across Header, Contact, and Footer.

export const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

export const handlePhoneClick = (phoneNumber: string) => {
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

export const copyEmailToClipboard = (email: string) => {
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
    } catch {
      showNotification('Email: ' + email);
    }
  }
};
