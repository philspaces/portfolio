import AxeBuilder from '@axe-core/playwright';
import { expect, test as base } from '@playwright/test';
import type { Page } from '@playwright/test';

const test = base.extend<{ pageErrors: void }>({
  pageErrors: [async ({ page }, use) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error' && /hydration|hydrating|didn't match|Minified React error/i.test(message.text())) {
        errors.push(message.text());
      }
    });
    await use();
    expect(errors, 'No JavaScript or React hydration errors during the browser flow').toEqual([]);
  }, { auto: true }],
});

async function arrive(page: Page, path = '/') {
  await page.goto(path);
  // Buttons are server-rendered. Wait for client:load before exercising them.
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
  await expect(page.locator('.portfolio')).toBeVisible();
}

async function expectProject(page: Page, id: string) {
  await expect(page.locator('.portfolio')).toHaveAttribute('data-project', id);
  await expect(page.locator('.portfolio-backdrop')).toHaveAttribute('data-project', id);
  await expect(page.locator('.backdrop-layer.is-active')).toHaveCount(1);
  await expect(page.locator('.backdrop-layer.is-active')).toHaveAttribute('data-backdrop-project', id);
}

async function select(page: Page, name: string) {
  const tab = page.getByRole('tab', { name: new RegExp(name) });
  await tab.click();
  await expect(tab).toHaveAttribute('aria-selected', 'true');
  await expectProject(page, name === 'JadeWords' ? 'jade-words' : name.toLowerCase());
}

async function explore(page: Page, label = 'Explore demo') {
  await page.getByRole('button', { name: label, exact: true }).click();
  await expect(page.locator('.showcase-stage')).toHaveClass(/is-immersed/);
  await expect(page.getByRole('button', { name: 'Exit demo', exact: true })).toBeFocused();
}

async function expectNoOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
}

test('JadeWords is featured with an explicit screen preview and a native external website link', async ({ page, context }, testInfo) => {
  await arrive(page);
  await expectProject(page, 'jade-words');
  await expect(page.getByRole('tab', { selected: true })).toHaveText(/JadeWords/);
  const visit = page.getByRole('link', { name: /View Jade Words/ }).first();
  await expect(visit).toHaveAttribute('href', 'https://jadewords.com/');
  await expect(visit).toHaveAttribute('target', '_blank');
  await expect(visit).toHaveAttribute('rel', /noopener/);
  await expect(visit).toHaveAttribute('rel', /noreferrer/);
  await expect(page.getByRole('link', { name: /Download|get the app|App Store|Google Play/i })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Read case study', exact: true })).toHaveCount(0);
  expect(await page.locator('video').count()).toBe(0);
  await testInfo.attach('jadewords-browse', {
    body: await page.screenshot({ path: `output/jade-words/screenshots/${testInfo.project.name}-browse.png` }),
    contentType: 'image/png',
  });

  // Verify native new-tab navigation without depending on the public product server.
  await context.route('https://jadewords.com/', route => route.fulfill({
    status: 200, contentType: 'text/html', body: '<!doctype html><title>JadeWords website destination</title>',
  }));
  const popupPromise = page.waitForEvent('popup');
  await visit.click();
  const popup = await popupPromise;
  await expect(popup).toHaveURL('https://jadewords.com/');
  expect(await popup.evaluate(() => window.opener)).toBeNull();
  await popup.close();
  await expect(page).toHaveURL(/\/$/);
  await expectProject(page, 'jade-words');

  await explore(page, 'Explore preview');
  const viewer = page.getByRole('region', { name: 'JadeWords screen viewer', exact: true });
  await expect(viewer.getByRole('button', { name: 'Vocabulary', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await viewer.getByRole('button', { name: 'Grammar', exact: true }).click();
  await expect(viewer.getByRole('button', { name: 'Grammar', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(viewer.getByRole('img', { name: 'JadeWords grammar app screen', exact: true })).toBeVisible();
  await viewer.getByRole('button', { name: 'Writing', exact: true }).click();
  await expect(viewer.getByRole('img', { name: 'JadeWords writing app screen', exact: true })).toBeVisible();
  await expect(viewer.locator('.jade-screen-layer.is-current')).toHaveCSS('opacity', '1');
  await page.locator('.showcase-stage').scrollIntoViewIfNeeded();
  await testInfo.attach('jadewords-writing-preview', {
    body: await page.screenshot({ path: `output/jade-words/screenshots/${testInfo.project.name}-writing-preview.png` }),
    contentType: 'image/png',
  });
  await viewer.getByRole('button', { name: 'Open app preview', exact: true }).click();
  const video = viewer.locator('video');
  await expect(video).toHaveAttribute('controls', '');
  await expect(video).not.toHaveAttribute('autoplay', '');
  await expect(video).toBeFocused();
  expect(await video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  const firstVideo = await video.elementHandle();
  await video.evaluate((element: HTMLVideoElement) => element.play());
  await viewer.getByRole('button', { name: 'Back to app screens', exact: true }).click();
  await expect(viewer.getByRole('button', { name: 'Open app preview', exact: true })).toBeFocused();
  expect(await firstVideo!.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  await viewer.getByRole('button', { name: 'Open app preview', exact: true }).click();
  await expect(video).toBeFocused();
  expect(await video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  const playingVideo = await video.elementHandle();
  await video.evaluate((element: HTMLVideoElement) => element.play());
  expect(await video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(false);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Explore preview', exact: true })).toBeFocused();
  await expect(page.locator('video')).toHaveCount(0);
  expect(await playingVideo!.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  await explore(page, 'Explore preview');
  await expect(viewer.getByRole('button', { name: 'Vocabulary', exact: true })).toBeVisible();
  await expect(page.locator('video')).toHaveCount(0);
  await page.getByRole('button', { name: 'Exit demo', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Explore preview', exact: true })).toBeFocused();
  await expectNoOverflow(page);
});

test('missing JadeWords screens and preview keep the structural backdrop and explicit fallback usable', async ({ page }) => {
  await page.route('**/jade-words/screens/*.webp', route => route.abort());
  await page.route('**/jade-words/media/features.mp4', route => route.abort());
  await arrive(page);
  await expectProject(page, 'jade-words');
  await expect(page.locator('.backdrop-jade .backdrop-art')).toHaveCount(0);
  await expect(page.locator('.backdrop-jade .backdrop-fallback')).toBeAttached();
  await expect(page.locator('.stage-scene .jade-screen-layer.is-current').getByText('App screen unavailable', { exact: true })).toBeVisible();
  await explore(page, 'Explore preview');
  const viewer = page.getByRole('region', { name: 'JadeWords screen viewer', exact: true });
  await viewer.getByRole('button', { name: 'Grammar', exact: true }).click();
  await expect(viewer.getByRole('button', { name: 'Grammar', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(viewer.locator('.jade-screen-layer.is-current').getByText('App screen unavailable', { exact: true })).toBeVisible();
  await viewer.getByRole('button', { name: 'Open app preview', exact: true }).click();
  await expect(viewer.getByRole('status')).toHaveText(/App preview unavailable/);
  await expect(viewer.getByRole('button', { name: 'Back to app screens', exact: true })).toBeFocused();
  await viewer.getByRole('button', { name: 'Back to app screens', exact: true }).click();
  await expect(viewer.getByRole('button', { name: 'Writing', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Explore preview', exact: true })).toBeFocused();
  await expectNoOverflow(page);
});

test('JadeWords overview has clean routing, Back/Forward, and real static HTML without release claims', async ({ page, browser, baseURL }) => {
  await arrive(page);
  await page.getByRole('heading', { level: 2, name: /JadeWords/ }).getByRole('link', { name: 'JadeWords', exact: true }).click();
  await expect(page).toHaveURL(/\/work\/jade-words\/$/);
  await expect(page.getByRole('heading', { level: 1, name: /JadeWords/ })).toBeFocused();
  await expectProject(page, 'jade-words');
  await expect(page).toHaveTitle(/JadeWords.*Long Phi Nguyen/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Chinese/i);
  await expect(page.locator('.case-header').getByText('Coming soon to iOS & Android', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Role & contribution|Impact & evidence/ })).toHaveCount(0);
  await expect(page.getByText(/Fictional case study|Author input needed|No results are claimed/)).toHaveCount(0);
  await page.goBack();
  await expect(page.getByRole('tab', { selected: true })).toHaveText(/JadeWords/);
  await page.goForward();
  await expect(page.getByRole('heading', { level: 1, name: /JadeWords/ })).toBeVisible();
  await page.reload();
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
  await expectProject(page, 'jade-words');
  await arrive(page, '/#/work/jade-words');
  await expect(page).toHaveURL(/\/work\/jade-words\/$/);
  await expectProject(page, 'jade-words');

  const staticContext = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const staticPage = await staticContext.newPage();
  try {
    const response = await staticPage.goto('/work/jade-words/');
    expect(response?.status()).toBe(200);
    await expect(staticPage.getByRole('heading', { level: 1, name: /JadeWords/ })).toBeVisible();
    await expect(staticPage.getByRole('link', { name: /View Jade Words/ }).first()).toHaveAttribute('href', 'https://jadewords.com/');
    await expect(staticPage.locator('.case-header').getByText('Coming soon to iOS & Android', { exact: true })).toBeVisible();
    await expect(staticPage.getByRole('link', { name: 'All projects', exact: true })).toHaveAttribute('href', '/');
    await expect(staticPage.getByRole('heading', { name: /Role & contribution|Impact & evidence/ })).toHaveCount(0);
    await expect(staticPage.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  } finally {
    await staticContext.close();
  }
});

test('rapid selection keeps one backdrop, readable selection, and scoped keyboard navigation', async ({ page }) => {
  await arrive(page);
  await page.getByRole('tab', { name: /Roam/ }).hover();
  await expect(page.getByRole('tab', { selected: true })).toHaveText(/JadeWords/);

  for (const name of ['Roam', 'Relay', 'JadeWords', 'Forma', 'Relay', 'Roam', 'Forma']) await select(page, name);
  await expect(page.locator('.stage-scene')).toHaveCount(1);
  await page.getByRole('tab', { name: /Forma/ }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { selected: true })).toHaveText(/Roam/);
  await expectProject(page, 'roam');
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('tab', { selected: true })).toHaveText(/Forma/);
  await page.keyboard.press('End');
  await expect(page.getByRole('tab', { selected: true })).toHaveText(/Relay/);
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { selected: true })).toHaveText(/JadeWords/);
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('tab', { selected: true })).toHaveText(/Relay/);
  await page.keyboard.press('Home');
  await expect(page.getByRole('tab', { selected: true })).toHaveText(/JadeWords/);
  await page.getByRole('heading', { level: 1 }).focus();
  await page.keyboard.press('ArrowRight');
  await expectProject(page, 'jade-words');
  expect(await page.evaluate(() => document.dispatchEvent(new KeyboardEvent('keydown', {
    key: ' ', bubbles: true, cancelable: true,
  })))).toBe(true);
  await expectNoOverflow(page);
});

test('case routes, Back/Forward, reload, and the legacy hash preserve the selected concept', async ({ page }) => {
  await arrive(page);
  await select(page, 'Relay');
  await page.getByRole('link', { name: 'Read case study', exact: true }).click();
  await expect(page).toHaveURL(/\/work\/relay\/$/);
  await expect(page.getByRole('heading', { level: 1, name: /Relay/ })).toBeFocused();
  await expectProject(page, 'relay');
  await expect(page).toHaveTitle(/Relay.*Long Phi Nguyen/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Relay/i);

  await page.goBack();
  await expect(page.getByRole('tab', { selected: true })).toHaveText(/Relay/);
  await expectProject(page, 'relay');
  await page.goForward();
  await expect(page.getByRole('heading', { level: 1, name: /Relay/ })).toBeVisible();
  await expectProject(page, 'relay');
  await page.reload();
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
  await expectProject(page, 'relay');
  await page.getByRole('link', { name: 'All projects', exact: true }).click();
  await expect(page.getByRole('tab', { selected: true })).toHaveText(/Relay/);

  await arrive(page, '/#/work/roam');
  await expect(page).toHaveURL(/\/work\/roam\/$/);
  await expect(page.getByRole('heading', { level: 1, name: /Roam/ })).toBeVisible();
  await expectProject(page, 'roam');
  await arrive(page, '/work/forma/');
  await expectProject(page, 'forma');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Forma/i);
});

test('all case studies contain meaningful static HTML when JavaScript is disabled', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  try {
    for (const name of ['Forma', 'Roam', 'Relay']) {
      const response = await page.goto(`/work/${name.toLowerCase()}/`);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1, name: new RegExp(name) })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Role & contribution', exact: true })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Impact & evidence', exact: true })).toBeVisible();
      await expect(page.getByText('No results are claimed for this fictional concept.', { exact: true })).toBeVisible();
      await expect(page.getByRole('link', { name: 'All projects', exact: true })).toHaveAttribute('href', '/');
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', new RegExp(name));
    }
    await page.goto('/about/');
    await expect(page.getByRole('heading', { level: 1, name: 'Long Phi Nguyen' })).toBeVisible();
    await expect(page.getByText(/Biography content has not been provided/)).toBeVisible();
  } finally {
    await context.close();
  }
});

test('Forma filters, selection, save, Escape, and Exit use real controls and restore entry focus', async ({ page }) => {
  await arrive(page);
  await select(page, 'Forma');
  await explore(page);
  const demo = page.getByRole('region', { name: 'Forma fictional interactive demo', exact: true });
  await demo.getByRole('button', { name: 'Objects', exact: true }).click();
  await expect(demo.getByRole('button', { name: 'Objects', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(demo.locator('.demo-forma-feature h4')).toHaveText('The blue contour');
  await demo.getByRole('button', { name: 'Save sample study', exact: true }).click();
  await expect(demo.getByRole('button', { name: 'Remove sample study from saved', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Explore demo', exact: true })).toBeFocused();
  await expect(page.locator('.showcase-stage')).not.toHaveClass(/is-immersed/);
  await explore(page);
  await page.getByRole('button', { name: 'Exit demo', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Explore demo', exact: true })).toBeFocused();
  await expectNoOverflow(page);
});

test('Roam destination and itinerary controls work on desktop and touch layouts', async ({ page, isMobile }) => {
  await arrive(page);
  await select(page, 'Roam');
  await explore(page);
  const demo = page.getByRole('region', { name: 'Roam fictional interactive demo', exact: true });
  const destination = demo.getByRole('button', { name: 'Old quarter', exact: true }).first();
  if (isMobile) await destination.tap(); else await destination.click();
  await expect(destination).toHaveAttribute('aria-pressed', 'true');
  await expect(demo.locator('.demo-phone-route h3')).toHaveText('A day in the city');
  const add = demo.getByRole('button', { name: 'Add a little detour', exact: true });
  if (isMobile) await add.tap(); else await add.click();
  await expect(demo.getByRole('button', { name: 'Remove optional stop', exact: true })).toBeVisible();
  await expect(demo.locator('.demo-roam-disclaimer')).toHaveText(/Old quarter: 4 sample stops/);
  await demo.getByRole('button', { name: /Garden square/ }).click();
  await expect(demo.locator('.demo-roam-disclaimer')).toHaveText(/Garden square selected/);
  await demo.getByRole('button', { name: 'Remove optional stop', exact: true }).click();
  await expect(demo.locator('.demo-roam-disclaimer')).toHaveText(/Old quarter: 3 sample stops/);
  await expectNoOverflow(page);
});

test('Relay queues, resumes, simulates failure, and retries explicitly', async ({ page }) => {
  await arrive(page, '/work/relay/');
  await explore(page);
  const demo = page.getByRole('region', { name: 'Relay fictional interactive demo', exact: true });
  const log = demo.getByRole('log', { name: 'Sample event activity', exact: true });
  await expect(demo.getByRole('button', { name: 'Retry failed', exact: true })).toBeDisabled();
  await demo.getByRole('button', { name: 'Pause workers', exact: true }).click();
  await demo.getByRole('button', { name: 'Send sample event', exact: true }).click();
  await expect(log).toHaveText(/Queued while sample workers are paused/);
  await demo.getByRole('button', { name: 'Resume workers', exact: true }).click();
  await expect(log).toHaveText(/1 queued sample event processed/);
  await demo.getByRole('button', { name: 'Fail next event', exact: true }).click();
  await demo.getByRole('button', { name: 'Send sample event', exact: true }).click();
  await expect(log).toHaveText(/Simulated timeout; available to retry/);
  await expect(demo.getByRole('button', { name: 'Retry failed', exact: true })).toBeEnabled();
  await demo.getByRole('button', { name: 'Retry failed', exact: true }).click();
  await expect(log).toHaveText(/1 failed sample event delivered/);
  await expect(demo.getByRole('button', { name: 'Retry failed', exact: true })).toBeDisabled();
  await expectNoOverflow(page);
});

test('idle chrome keeps Exit visible, reveals on input, and stays visible for focused controls', async ({ page, isMobile }) => {
  await arrive(page);
  await select(page, 'Forma');
  await explore(page);
  const stage = page.locator('.showcase-stage');
  await expect(stage).toHaveAttribute('data-chrome', 'quiet');
  await expect(page.getByRole('button', { name: 'Exit demo', exact: true })).toBeVisible();
  await expect(page.locator('.stage-info')).toHaveCSS('opacity', '0');
  if (isMobile) {
    // Touch the noninteractive toolbar label: reveal must not depend on hover.
    const box = await page.locator('.immerse-label').boundingBox();
    expect(box).not.toBeNull();
    await page.touchscreen.tap(box!.x + 2, box!.y + 2);
  } else {
    const box = await stage.boundingBox();
    expect(box).not.toBeNull();
    await page.mouse.move(box!.x + 20, box!.y + 90);
  }
  await expect(stage).toHaveAttribute('data-chrome', 'visible');
  await page.getByRole('button', { name: 'Exit demo', exact: true }).focus();
  await expect(stage).toHaveAttribute('data-chrome', 'quiet');
  await page.keyboard.press('Tab');
  await expect(stage).toHaveAttribute('data-chrome', 'visible');
  expect(await page.locator('.demo-interactive').evaluate(el => el.contains(document.activeElement))).toBe(true);
  await page.waitForTimeout(2_700);
  await expect(stage).toHaveAttribute('data-chrome', 'visible');
  await page.getByRole('link', { name: 'Read case study', exact: true }).focus();
  await page.waitForTimeout(2_700);
  await expect(stage).toHaveAttribute('data-chrome', 'visible');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Explore demo', exact: true })).toBeFocused();
});

test('live reduced motion reveals idle labels and disables transitions without disabling demos', async ({ page }) => {
  await arrive(page);
  await select(page, 'Forma');
  await explore(page);
  const stage = page.locator('.showcase-stage');
  await expect(stage).toHaveAttribute('data-chrome', 'quiet');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(stage).toHaveAttribute('data-chrome', 'visible');
  expect(await page.locator('.backdrop-layer').first().evaluate(el => parseFloat(getComputedStyle(el).transitionDuration))).toBeLessThan(0.01);
  await page.waitForTimeout(2_700);
  await expect(stage).toHaveAttribute('data-chrome', 'visible');
  await page.getByRole('button', { name: 'Spaces', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Spaces', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Exit demo', exact: true }).focus();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(stage).toHaveAttribute('data-chrome', 'quiet');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Explore demo', exact: true })).toBeFocused();
});

test('missing concept assets keep the structural backdrop, fallback, and demo usable', async ({ page }) => {
  await page.route('**/concept-art.webp', route => route.abort());
  await page.route('**/roam-atmosphere.webp', route => route.abort());
  await arrive(page);
  await select(page, 'Forma');
  await expect(page.getByText('Concept image unavailable', { exact: true }).first()).toBeVisible();
  await expect(page.locator('.backdrop-architecture .backdrop-art')).toHaveAttribute('hidden', '');
  await explore(page);
  await page.getByRole('button', { name: 'Objects', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Objects', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Escape');
  await select(page, 'Roam');
  await expect(page.locator('.backdrop-coast .backdrop-art')).toHaveAttribute('hidden', '');
  await expectProject(page, 'roam');
  await expectNoOverflow(page);
});

test('natural scrolling reaches architecture and About, and unknown routes offer recovery', async ({ page, isMobile }) => {
  await arrive(page);
  await select(page, 'Forma');
  const before = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 1_300);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before + 200);
  await page.getByRole('heading', { name: 'Under the surface.' }).scrollIntoViewIfNeeded();
  await expect(page.locator('.architecture-visual')).toHaveCSS('position', isMobile ? 'static' : 'sticky');
  await expectNoOverflow(page);
  await page.getByRole('link', { name: 'About this portfolio', exact: true }).click();
  await expect(page).toHaveURL(/\/about\/$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Long Phi Nguyen' })).toBeFocused();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.getByText(/Biography content has not been provided/)).toBeVisible();
  await page.getByRole('link', { name: 'Work', exact: true }).click();
  await expect(page.getByRole('tab', { selected: true })).toHaveText(/Forma/);
  const response = await page.goto('/work/does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Nothing here. Yet.' })).toBeVisible();
  await page.getByRole('link', { name: 'All projects', exact: true }).click();
  await expect(page.getByRole('tab', { selected: true })).toHaveText(/JadeWords/);
});

test('Resume is an honest native dialog and its Escape does not exit the underlying demo', async ({ page }) => {
  await arrive(page);
  await select(page, 'Forma');
  await explore(page);
  await page.getByRole('button', { name: 'Resume', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Resume', exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveText(/A resume has not been provided yet/);
  await expect(dialog.getByRole('link', { name: /Download/ })).toHaveCount(0);
  await page.keyboard.press('Tab');
  expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(page.locator('.showcase-stage')).toHaveClass(/is-immersed/);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Explore demo', exact: true })).toBeFocused();
});

test('browse, real preview, fictional demos, and Resume have no serious or critical WCAG violations', async ({ page }, testInfo) => {
  await arrive(page);
  for (const view of ['Browse', 'JadeWords', 'Forma', 'Roam', 'Relay', 'Resume']) {
    if (view === 'JadeWords') await explore(page, 'Explore preview');
    else if (view === 'Forma' || view === 'Roam' || view === 'Relay') {
      await page.keyboard.press('Escape');
      await select(page, view);
      await explore(page);
    } else if (view === 'Resume') {
      await page.getByRole('button', { name: 'Resume', exact: true }).click();
    }
    await expect(page.locator('.stage-scene')).toHaveCount(1);
    if (view !== 'Browse' && view !== 'Resume') {
      // A scan should see the active controls, with focused-demo idle protection.
      await page.locator(view === 'JadeWords' ? '.jade-showcase--interactive' : '.demo-interactive').getByRole('button').first().focus();
    }
    if (view === 'JadeWords') {
      const viewer = page.getByRole('region', { name: 'JadeWords screen viewer', exact: true });
      await viewer.getByRole('button', { name: 'Writing', exact: true }).click();
      await expect(viewer.locator('.jade-screen-layer.is-current')).toHaveCSS('opacity', '1');
      await page.locator('.showcase-stage').scrollIntoViewIfNeeded();
      await testInfo.attach('jadewords-writing-preview', {
        body: await page.screenshot({ path: `output/jade-words/screenshots/${testInfo.project.name}-writing-preview.png` }),
        contentType: 'image/png',
      });
    }
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    const violations = results.violations.filter(item => item.impact === 'serious' || item.impact === 'critical');
    await testInfo.attach(`accessibility-${view.toLowerCase()}`, {
      body: JSON.stringify(violations, null, 2), contentType: 'application/json',
    });
    expect.soft(violations.map(({ id, impact, nodes }) => ({
      id, impact, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
    })), `${view} serious/critical WCAG violations`).toEqual([]);
  }
});
