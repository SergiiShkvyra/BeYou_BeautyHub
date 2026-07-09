import { test, expect, Page } from './fixtures';
import { gotoHome, mockEmailJS } from './helpers';

const VALID = {
  name: 'Jane Tester',
  email: 'jane.tester@example.com',
  phone: '(571)-555-0100',
  service: 'volume-lashes',
  message: 'Automated test inquiry — please ignore.',
};

async function fillForm(page: Page, data: Partial<typeof VALID>) {
  if (data.name !== undefined) await page.locator('#name').fill(data.name);
  if (data.email !== undefined) await page.locator('#email').fill(data.email);
  if (data.phone !== undefined) await page.locator('#phone').fill(data.phone);
  if (data.service !== undefined)
    await page.locator('#service').selectOption(data.service);
  if (data.message !== undefined) await page.locator('#message').fill(data.message);
}

const submitButton = (page: Page) =>
  page.getByRole('button', { name: /send email/i });

test.describe('booking form (EmailJS mocked — no real emails sent)', () => {
  test('happy path: submits, shows success, clears the form', async ({ page }) => {
    const captured = await mockEmailJS(page);
    await gotoHome(page);

    await fillForm(page, VALID);
    await submitButton(page).click();

    await expect(
      page.getByText(/thank you for your message/i),
    ).toBeVisible();

    // Form is cleared on success.
    await expect(page.locator('#name')).toHaveValue('');
    await expect(page.locator('#email')).toHaveValue('');
    await expect(page.locator('#message')).toHaveValue('');

    // The intercepted EmailJS payload carries the right template params.
    expect(captured.body).not.toBeNull();
    const body = captured.body as {
      service_id: string;
      template_id: string;
      template_params: Record<string, string>;
    };
    expect(body.service_id).toBe('service_gl0u0p6');
    expect(body.template_id).toBe('template_v1xwasf');
    expect(body.template_params.from_name).toBe(VALID.name);
    expect(body.template_params.from_email).toBe(VALID.email);
    expect(body.template_params.message).toBe(VALID.message);
  });

  test('optional fields default to placeholder values in the payload', async ({
    page,
  }) => {
    const captured = await mockEmailJS(page);
    await gotoHome(page);

    await fillForm(page, { name: VALID.name, email: VALID.email, message: VALID.message });
    await submitButton(page).click();
    await expect(page.getByText(/thank you for your message/i)).toBeVisible();

    const params = (captured.body as { template_params: Record<string, string> })
      .template_params;
    expect(params.phone).toBe('Not provided');
    expect(params.service).toBe('Not specified');
  });

  test('EmailJS failure shows the error message and keeps the form data', async ({
    page,
  }) => {
    await mockEmailJS(page, { status: 500 });
    await gotoHome(page);

    await fillForm(page, VALID);
    await submitButton(page).click();

    await expect(page.getByText(/unable to send message/i)).toBeVisible();
    // Data must NOT be cleared on failure so the visitor can retry.
    await expect(page.locator('#name')).toHaveValue(VALID.name);
    await expect(page.locator('#message')).toHaveValue(VALID.message);
  });

  test('missing message triggers the required-fields validation error', async ({
    page,
  }) => {
    const captured = await mockEmailJS(page);
    await gotoHome(page);

    await fillForm(page, { name: VALID.name, email: VALID.email });
    await submitButton(page).click();

    await expect(
      page.getByText(/please fill in all required fields/i),
    ).toBeVisible();
    expect(captured.body, 'no network call should be made').toBeNull();
  });

  test('email without a dot in the domain triggers the format validation error', async ({
    page,
  }) => {
    const captured = await mockEmailJS(page);
    await gotoHome(page);

    // "jane@example" passes native type=email validation but fails the app's
    // stricter regex, exercising the JS validation branch.
    await fillForm(page, { name: VALID.name, email: 'jane@example', message: VALID.message });
    await submitButton(page).click();

    await expect(page.getByText(/valid email address/i)).toBeVisible();
    expect(captured.body, 'no network call should be made').toBeNull();
  });

  test('typing after an error clears the status message', async ({ page }) => {
    await mockEmailJS(page);
    await gotoHome(page);

    await fillForm(page, { name: VALID.name, email: VALID.email });
    await submitButton(page).click();
    await expect(page.getByText(/please fill in all required fields/i)).toBeVisible();

    await page.locator('#message').fill('now filled');
    await expect(
      page.getByText(/please fill in all required fields/i),
    ).toBeHidden();
  });
});
