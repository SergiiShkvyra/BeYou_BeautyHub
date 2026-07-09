import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { scrollToSection, handlePhoneClick, copyEmailToClipboard } from './interactions';

const DESKTOP_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const MOBILE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

function setUserAgent(ua: string) {
  Object.defineProperty(window.navigator, 'userAgent', {
    value: ua,
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

describe('handlePhoneClick', () => {
  it('desktop: copies the number and shows a toast that auto-dismisses', async () => {
    setUserAgent(DESKTOP_UA);
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard(writeText);

    handlePhoneClick('(571)-276-7014');
    await flushMicrotasks();

    expect(writeText).toHaveBeenCalledWith('(571)-276-7014');
    expect(document.body.textContent).toContain(
      'Phone number copied to clipboard!',
    );

    vi.advanceTimersByTime(3000);
    expect(document.body.textContent).not.toContain(
      'Phone number copied to clipboard!',
    );
  });

  it('desktop: falls back to alert when the clipboard write fails', async () => {
    setUserAgent(DESKTOP_UA);
    const writeText = vi.fn().mockRejectedValue(new Error('denied'));
    setClipboard(writeText);
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    handlePhoneClick('(571)-276-7014');
    await flushMicrotasks();

    expect(alertSpy).toHaveBeenCalledWith('Phone number: (571)-276-7014');
  });

  it('mobile: does not touch the clipboard (opens the dialer instead)', () => {
    setUserAgent(MOBILE_UA);
    const writeText = vi.fn();
    setClipboard(writeText);

    handlePhoneClick('(571)-276-7014');

    expect(writeText).not.toHaveBeenCalled();
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
