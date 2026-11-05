import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  scrollToSection,
  isTouchActivation,
  handlePhoneClick,
  handleEmailClick,
  handleTextClick,
  copyEmailToClipboard,
  PHONE_DISPLAY,
  PHONE_HREF,
  SMS_HREF,
  EMAIL,
  EMAIL_HREF,
} from './interactions';

/** A click as the handlers see it: pointerType undefined = browser didn't say. */
function click(pointerType?: string) {
  return {
    preventDefault: vi.fn(),
    nativeEvent: (pointerType === undefined ? undefined : { pointerType }) as Event | undefined,
  };
}

/** Stub the (pointer: coarse) media query used when a click has no pointerType. */
function setCoarsePointer(coarse: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    value: (q: string) => ({ matches: coarse && q === '(pointer: coarse)', media: q }),
    configurable: true,
  });
}

function setClipboard(writeText: ReturnType<typeof vi.fn> | undefined) {
  Object.defineProperty(window.navigator, 'clipboard', {
    value: writeText ? { writeText } : undefined,
    configurable: true,
  });
}

/** Flush pending microtasks (clipboard .then chains) under fake timers. */
async function flushMicrotasks() {
  await Promise.resolve();
  await Promise.resolve();
}

beforeEach(() => {
  vi.useFakeTimers();
  document.body.innerHTML = '';
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('scrollToSection', () => {
  it('calls scrollIntoView with smooth behavior on the target element', () => {
    const el = document.createElement('section');
    el.id = 'services';
    el.scrollIntoView = vi.fn();
    document.body.appendChild(el);

    scrollToSection('services');

    expect(el.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('does nothing (no throw) when the id does not exist', () => {
    expect(() => scrollToSection('does-not-exist')).not.toThrow();
  });
});

describe('isTouchActivation', () => {
  it("trusts the click's own pointerType first", () => {
    setCoarsePointer(false);
    expect(isTouchActivation(click('touch'))).toBe(true);
    setCoarsePointer(true); // e.g. a hybrid touchscreen laptop clicked with a mouse
    expect(isTouchActivation(click('mouse'))).toBe(false);
  });

  it('falls back to (pointer: coarse) for keyboard/pen/unknown clicks', () => {
    setCoarsePointer(true);
    expect(isTouchActivation(click(''))).toBe(true);
    expect(isTouchActivation(click())).toBe(true);
    setCoarsePointer(false);
    expect(isTouchActivation(click('pen'))).toBe(false);
  });
});

describe('handlePhoneClick', () => {
  it('mouse: blocks the tel: link, copies the number and shows a toast that auto-dismisses', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard(writeText);
    const e = click('mouse');

    handlePhoneClick(e, PHONE_DISPLAY);
    await flushMicrotasks();

    expect(e.preventDefault).toHaveBeenCalled();
    expect(writeText).toHaveBeenCalledWith(PHONE_DISPLAY);
    expect(document.body.textContent).toContain('Phone number copied to clipboard!');

    vi.advanceTimersByTime(3000);
    expect(document.body.textContent).not.toContain('Phone number copied to clipboard!');
  });

  it('mouse: falls back to alert when the clipboard write fails or is missing', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    setClipboard(vi.fn().mockRejectedValue(new Error('denied')));
    handlePhoneClick(click('mouse'), PHONE_DISPLAY);
    await flushMicrotasks();
    expect(alertSpy).toHaveBeenCalledWith('Phone number: ' + PHONE_DISPLAY);

    alertSpy.mockClear();
    setClipboard(undefined);
    handlePhoneClick(click('mouse'), PHONE_DISPLAY);
    expect(alertSpy).toHaveBeenCalledWith('Phone number: ' + PHONE_DISPLAY);
  });

  it('touch: lets the tel: link open the dialer (no preventDefault, no clipboard)', () => {
    const writeText = vi.fn();
    setClipboard(writeText);
    const e = click('touch');

    handlePhoneClick(e, PHONE_DISPLAY);

    expect(e.preventDefault).not.toHaveBeenCalled();
    expect(writeText).not.toHaveBeenCalled();
  });
});

describe('handleEmailClick', () => {
  it('mouse: blocks the mailto: link and copies the address', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard(writeText);
    const e = click('mouse');

    handleEmailClick(e, EMAIL);
    await flushMicrotasks();

    expect(e.preventDefault).toHaveBeenCalled();
    expect(writeText).toHaveBeenCalledWith(EMAIL);
  });

  it('touch: lets the mailto: link open the mail app', () => {
    const writeText = vi.fn();
    setClipboard(writeText);
    const e = click('touch');

    handleEmailClick(e, EMAIL);

    expect(e.preventDefault).not.toHaveBeenCalled();
    expect(writeText).not.toHaveBeenCalled();
  });
});

describe('handleTextClick', () => {
  it('mouse: blocks the sms: link, copies the number and explains via alert', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard(writeText);
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const e = click('mouse');

    handleTextClick(e, PHONE_DISPLAY);
    await flushMicrotasks();

    expect(e.preventDefault).toHaveBeenCalled();
    expect(writeText).toHaveBeenCalledWith(PHONE_DISPLAY);
    expect(alertSpy.mock.calls[0]?.[0]).toContain(PHONE_DISPLAY);
  });

  it('touch: lets the sms: link open Messages', () => {
    const e = click('touch');
    handleTextClick(e, PHONE_DISPLAY);
    expect(e.preventDefault).not.toHaveBeenCalled();
  });
});

describe('contact hrefs', () => {
  it('are well-formed tel:/sms:/mailto: links for the business', () => {
    expect(PHONE_HREF).toBe('tel:+15712767014');
    expect(SMS_HREF).toBe('sms:+15712767014');
    expect(EMAIL_HREF).toBe('mailto:info@beyoubeautyhub.com');
  });
});

describe('copyEmailToClipboard', () => {
  it('copies via the clipboard API and shows the success toast', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard(writeText);

    copyEmailToClipboard('info@beyoubeautyhub.com');
    await flushMicrotasks();

    expect(writeText).toHaveBeenCalledWith('info@beyoubeautyhub.com');
    expect(document.body.textContent).toContain(
      'Email address copied to clipboard!',
    );
  });

  it('shows the address itself when the clipboard write fails', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'));
    setClipboard(writeText);

    copyEmailToClipboard('info@beyoubeautyhub.com');
    await flushMicrotasks();

    expect(document.body.textContent).toContain('Email: info@beyoubeautyhub.com');
  });

  it('uses the execCommand fallback when the clipboard API is missing', async () => {
    setClipboard(undefined);
    document.execCommand = vi.fn().mockReturnValue(true);

    copyEmailToClipboard('info@beyoubeautyhub.com');
    await flushMicrotasks();

    expect(document.execCommand).toHaveBeenCalledWith('copy');
    expect(document.body.textContent).toContain(
      'Email address copied to clipboard!',
    );
  });

  it('toast auto-dismisses after ~3.3 seconds', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard(writeText);

    copyEmailToClipboard('info@beyoubeautyhub.com');
    await flushMicrotasks();
    expect(document.body.textContent).toContain('copied to clipboard');

    vi.advanceTimersByTime(3300);
    expect(document.body.textContent).not.toContain('copied to clipboard');
  });
});
