// Shared browser-interaction helpers used across Header, Contact, and Footer.

export const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// Contact details. The *_HREF values go on real <a href> links so crawlers,
// screen readers and the phone's own long-press menu all see a real
// phone/email/SMS link; the click handlers below only decide whether to let
// that link open natively (touch) or to copy instead (mouse/keyboard).
export const PHONE_DISPLAY = '(571)-276-7014';
export const PHONE_HREF = 'tel:+15712767014';
export const SMS_HREF = 'sms:+15712767014';
export const EMAIL = 'info@beyoubeautyhub.com';
export const EMAIL_HREF = `mailto:${EMAIL}`;

// "Copied" toasts must sit above the header, which Header.tsx's force-visible
// loop pins at the maximum z-index. Matching it is enough: the toast is
// appended to <body> after #root, and equal z-index ties resolve by DOM order.
const TOAST_Z_INDEX = 2147483647;

/** The bits of a (React) click event the handlers need. */
type ClickLike = { preventDefault(): void; nativeEvent?: Event };

/**
 * Was this click a finger tap? Uses the click's own pointerType when the
 * browser reports it (a hybrid touchscreen laptop can be tapped OR clicked),
 * otherwise (keyboard, pen, older Safari) falls back to whether the device's
 * primary pointer is coarse. Replaces the old user-agent sniff, which treated
 * iPads (they report as Macs) as desktops.
 */
export const isTouchActivation = (e?: ClickLike): boolean => {
  const pointerType = (e?.nativeEvent as PointerEvent | undefined)?.pointerType;
  if (pointerType === 'touch') return true;
  if (pointerType === 'mouse') return false;
  return (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse)').matches
  );
};

/** Phone link: touch → the tel: href opens the dialer; otherwise copy. */
export const handlePhoneClick = (e: ClickLike, phoneNumber: string = PHONE_DISPLAY) => {
  if (isTouchActivation(e)) return;
  e.preventDefault();
  copyPhoneToClipboard(phoneNumber);
};

/** Email link: touch → the mailto: href opens the mail app; otherwise copy. */
export const handleEmailClick = (e: ClickLike, email: string = EMAIL) => {
  if (isTouchActivation(e)) return;
  e.preventDefault();
  copyEmailToClipboard(email);
};

/**
 * "Text us" link: touch → the sms: href opens Messages; otherwise copy the
 * number and explain (desktop browsers can't send texts).
 */
export const handleTextClick = (e: ClickLike, phoneNumber: string = PHONE_DISPLAY) => {
  if (isTouchActivation(e)) return;
  e.preventDefault();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(phoneNumber).then(() => {
      alert(`Phone number copied to clipboard: ${phoneNumber}\n\nYou can paste this into your preferred messaging application.`);
    }).catch(() => {
      alert(`Please text us at: ${phoneNumber}`);
    });
  } else {
    alert(`Please text us at: ${phoneNumber}`);
  }
};

const copyPhoneToClipboard = (phoneNumber: string) => {
  // No clipboard API (e.g. a non-HTTPS preview): just show the number.
  if (!navigator.clipboard?.writeText) {
    alert('Phone number: ' + phoneNumber);
    return;
  }
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
      z-index: ${TOAST_Z_INDEX};
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
      z-index: ${TOAST_Z_INDEX};
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
