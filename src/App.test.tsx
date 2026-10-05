// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

let reducedMotion = false;
const motionPreferenceListeners = new Set<(event: MediaQueryListEvent) => void>();
const scrollIntoView = vi.fn();
const dialogMethods = {
  showModal: Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal'),
  close: Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close'),
};
const originalScrollIntoView = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollIntoView');

beforeAll(() => {
  // jsdom has no native dialog lifecycle or layout scrolling; emulate those platform APIs.
  Object.defineProperties(HTMLDialogElement.prototype, {
    showModal: {
      configurable: true,
      value(this: HTMLDialogElement) { this.setAttribute('open', ''); },
    },
    close: {
      configurable: true,
      value(this: HTMLDialogElement) {
        this.removeAttribute('open');
        this.dispatchEvent(new Event('close'));
      },
    },
  });
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: scrollIntoView,
  });
});

afterAll(() => {
  for (const [method, descriptor] of Object.entries(dialogMethods)) {
    if (descriptor) Object.defineProperty(HTMLDialogElement.prototype, method, descriptor);
    else Reflect.deleteProperty(HTMLDialogElement.prototype, method);
  }
  if (originalScrollIntoView) {
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', originalScrollIntoView);
  } else {
    Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView');
  }
});

function setMotionPreference(value: boolean) {
  reducedMotion = value;
  const event = Object.assign(new Event('change'), {
    matches: value,
    media: '(prefers-reduced-motion)',
  }) as MediaQueryListEvent;
  motionPreferenceListeners.forEach(listener => listener(event));
}

beforeEach(() => {
  setMotionPreference(false);
  window.history.replaceState(null, '', '/');
  vi.stubGlobal('matchMedia', vi.fn((query: string) => ({
    get matches() { return reducedMotion && query.includes('prefers-reduced-motion'); },
    media: query,
    onchange: null,
    addListener: (listener: (event: MediaQueryListEvent) => void) => {
      if (query.includes('prefers-reduced-motion')) motionPreferenceListeners.add(listener);
    },
    removeListener: (listener: (event: MediaQueryListEvent) => void) => motionPreferenceListeners.delete(listener),
    addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
      if (query.includes('prefers-reduced-motion')) motionPreferenceListeners.add(listener);
    },
    removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => motionPreferenceListeners.delete(listener),
    dispatchEvent: vi.fn(),
  })));
  vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
  scrollIntoView.mockClear();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const tab = (name: 'JadeWords' | 'Forma' | 'Roam' | 'Relay') => screen.getByRole('tab', { name: new RegExp(name, 'i') });
const caseLink = () => screen.getByRole('link', { name: /read case study/i });
const expectBackdrop = (id: string) => {
  const backdrop = document.querySelector('.portfolio-backdrop');
  expect(backdrop).toHaveAttribute('data-project', id);
  expect(backdrop).toHaveAttribute('aria-hidden', 'true');
  expect(backdrop?.querySelectorAll('.backdrop-layer.is-active')).toHaveLength(1);
  expect(backdrop?.querySelector('.backdrop-layer.is-active')).toHaveAttribute('data-backdrop-project', id);
};

function arriveAt(path: string) {
  act(() => {
    window.history.replaceState(null, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
}

describe('The Living Showcase', () => {
  it('moves the skip-link focus to main without changing the application route', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('link', { name: /skip to content/i }));
    expect(screen.getByRole('main')).toHaveFocus();
    expect(window.location.pathname).toBe('/');
    expect(tab('JadeWords')).toHaveAttribute('aria-selected', 'true');
  });

  it('exposes JadeWords screens immediately with a safe website link and optional expansion', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(tab('JadeWords')).toHaveAttribute('aria-selected', 'true');
    expectBackdrop('jade-words');
    const visit = screen.getAllByRole('link', { name: /view jade words/i })[0];
    expect(visit).toHaveAttribute('href', 'https://jadewords.com/');
    expect(visit).toHaveAttribute('target', '_blank');
    expect(visit).toHaveAttribute('rel', expect.stringContaining('noopener'));
    expect(visit).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
    expect(screen.queryByRole('link', { name: /read case study/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /download|get the app|app store|google play/i })).not.toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'JadeWords screen viewer' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Vocabulary' })).toBeEnabled();
    const preview = screen.getByRole('button', { name: /expand showcase/i });
    await user.click(preview);
    expect(screen.getByRole('button', { name: /exit demo/i })).toHaveFocus();
    await user.keyboard('{Escape}');
    await waitFor(() => expect(preview).toHaveFocus());
    expect(tab('JadeWords')).toHaveAttribute('aria-selected', 'true');
  });

  it('keeps one selection through repeated and rapid project changes without scrolling', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(tab('JadeWords')).toHaveAttribute('aria-selected', 'true');

    vi.mocked(window.scrollTo).mockClear();
    scrollIntoView.mockClear();
    for (const name of ['Roam', 'Relay', 'Forma', 'JadeWords', 'Roam', 'Forma'] as const) {
      await user.click(tab(name));
      expect(tab(name)).toHaveAttribute('aria-selected', 'true');
      if (name === 'JadeWords') {
        expect(screen.getAllByRole('link', { name: /view jade words/i })[0]).toHaveAttribute('href', 'https://jadewords.com/');
        expectBackdrop('jade-words');
      } else {
        expect(caseLink()).toHaveAttribute('href', `/work/${name.toLowerCase()}/`);
        expectBackdrop(name.toLowerCase());
      }
    }

    act(() => {
      fireEvent.click(tab('Relay'));
      fireEvent.click(tab('Roam'));
      fireEvent.click(tab('Relay'));
    });
    expect(tab('Relay')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getAllByRole('tab').filter(element => element.getAttribute('aria-selected') === 'true')).toHaveLength(1);
    expect(caseLink()).toHaveAttribute('href', '/work/relay/');
    expectBackdrop('relay');
    expect(window.scrollTo).not.toHaveBeenCalled();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it('keeps the reading selection when another project is hovered', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(tab('Forma'));
    await user.hover(tab('Roam'));
    expect(tab('Forma')).toHaveAttribute('aria-selected', 'true');
    expect(tab('Roam')).toHaveAttribute('aria-selected', 'false');
    expect(caseLink()).toHaveAttribute('href', '/work/forma/');
    await user.unhover(tab('Roam'));
    expect(caseLink()).toHaveAttribute('href', '/work/forma/');
  });

  it('scopes arrow keys to the project strip and moves focus with selection', async () => {
    const user = userEvent.setup();
    render(<App />);
    tab('JadeWords').focus();
    await user.keyboard('{ArrowRight}');
    expect(tab('Forma')).toHaveFocus();
    expect(tab('Forma')).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{End}');
    expect(tab('Relay')).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(tab('JadeWords')).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(tab('Relay')).toHaveFocus();
    await user.keyboard('{Home}');
    expect(tab('JadeWords')).toHaveFocus();

    const globalSpace = new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true, cancelable: true });
    window.dispatchEvent(globalSpace);
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(globalSpace.defaultPrevented).toBe(false);
    expect(tab('JadeWords')).toHaveAttribute('aria-selected', 'true');
  });

  it('exits the inline demo with Escape or its exit button and restores the entry focus', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(tab('Forma'));
    await user.click(screen.getByRole('button', { name: /explore demo/i }));
    expect(screen.getAllByRole('button', { name: /exit demo/i })[0]).toBeVisible();
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('button', { name: /exit demo/i })).not.toBeInTheDocument());
    await waitFor(() => expect(screen.getByRole('button', { name: /explore demo/i })).toHaveFocus());

    await user.click(screen.getByRole('button', { name: /explore demo/i }));
    await user.click(screen.getAllByRole('button', { name: /exit demo/i })[0]);
    await waitFor(() => expect(screen.getByRole('button', { name: /explore demo/i })).toHaveFocus());
    expect(tab('Forma')).toHaveAttribute('aria-selected', 'true');
  });

  it('requires a new explicit Explore action after changing projects', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(tab('Forma'));
    await user.click(screen.getByRole('button', { name: /explore demo/i }));
    await user.click(tab('Roam'));
    expect(screen.getByRole('button', { name: /explore demo/i })).toHaveAttribute('aria-expanded', 'false');
    await user.click(tab('Forma'));
    expect(screen.getByRole('button', { name: /explore demo/i })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('button', { name: /exit demo/i })).not.toBeInTheDocument();
  });

  it('keeps immersion when Escape belongs to the Resume overlay', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(tab('Forma'));
    await user.click(screen.getByRole('button', { name: /explore demo/i }));
    await user.click(screen.getByRole('button', { name: /^resume$/i }));
    await user.keyboard('{Escape}');
    // Native modal dismissal is verified in a browser; jsdom only checks the stage's Escape scope.
    expect(screen.getAllByRole('button', { name: /exit demo/i })[0]).toBeVisible();
    await user.click(screen.getByRole('button', { name: /close resume/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.getByRole('button', { name: /explore demo/i })).toHaveFocus());
  });

  it('opens a direct case study and follows browser-originated route changes', async () => {
    arriveAt('/work/roam/');
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: /roam/i })).toBeVisible();
    expectBackdrop('roam');
    expect(screen.getByRole('link', { name: /all projects/i })).toHaveAttribute('href', '/');
    arriveAt('/work/relay/');
    expect(await screen.findByRole('heading', { level: 1, name: /relay/i })).toBeVisible();
    expectBackdrop('relay');
    arriveAt('/');
    expect(await screen.findByRole('tab', { name: /jadewords/i })).toBeVisible();
    expectBackdrop('jade-words');
  });

  it('renders the direct JadeWords overview without fictional evidence or unverified author claims', async () => {
    arriveAt('/work/jade-words/');
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: /JadeWords/i })).toBeVisible();
    expectBackdrop('jade-words');
    expect(screen.getByRole('link', { name: /all projects/i })).toHaveAttribute('href', '/');
    expect(screen.queryByText(/Fictional case study|Author input needed|No results are claimed/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /impact & evidence|role & contribution/i })).not.toBeInTheDocument();
    arriveAt('/work/forma/');
    expect(await screen.findByRole('heading', { name: /role & contribution/i })).toBeVisible();
    expectBackdrop('forma');
  });

  it('upgrades a legacy hash after the application is already mounted', async () => {
    render(<App />);
    act(() => {
      window.history.replaceState(null, '', '/#/work/roam');
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(await screen.findByRole('heading', { level: 1, name: /roam/i })).toBeVisible();
    expect(window.location.pathname).toBe('/work/roam/');
    expect(window.location.hash).toBe('');
    expectBackdrop('roam');
  });

  it('honors native Back and Forward after case navigation', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(tab('Relay'));
    await user.click(caseLink());
    expect(await screen.findByRole('heading', { level: 1, name: /relay.*concept study/i })).toBeVisible();
    await user.click(screen.getByRole('link', { name: /all projects/i }));
    expect(await screen.findByRole('tab', { name: /relay/i })).toBeVisible();

    act(() => window.history.back());
    expect(await screen.findByRole('heading', { level: 1, name: /relay.*concept study/i })).toBeVisible();
    expectBackdrop('relay');
    act(() => window.history.forward());
    expect(await screen.findByRole('tab', { name: /relay/i })).toBeVisible();
    expectBackdrop('relay');
  });

  it('provides a way back from an unknown case-study route', async () => {
    const user = userEvent.setup();
    arriveAt('/work/missing-project/');
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: /nothing here/i })).toBeVisible();
    await user.click(screen.getByRole('link', { name: /all projects/i }));
    expect(await screen.findByRole('tab', { name: /jadewords/i })).toBeVisible();
  });

  it('opens the biography placeholder and returns through Work', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('link', { name: /^about$/i }));
    expect(await screen.findByRole('heading', { level: 1, name: /long phi\s*nguyen/i })).toBeVisible();
    expect(screen.getByText(/biography content has not been provided/i)).toBeVisible();
    expect(window.location.pathname).toBe('/about/');
    await user.click(screen.getByRole('link', { name: /^work$/i }));
    expect(await screen.findByRole('tab', { name: /jadewords/i })).toBeVisible();
  });

  it('shows an honest Resume placeholder and lets the user close it', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /^resume$/i }));
    expect(screen.getByRole('dialog', { name: /resume/i })).toBeVisible();
    expect(screen.getByRole('dialog')).toHaveTextContent(/(not (yet )?(available|added)|unavailable|placeholder)/i);
    expect(screen.queryByRole('link', { name: /download resume/i })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /close/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('responds immediately when reduced motion changes during immersion', () => {
    vi.useFakeTimers();
    try {
      render(<App />);
      fireEvent.click(tab('Forma'));
      fireEvent.click(screen.getByRole('button', { name: /explore demo/i }));
      const stage = screen.getByRole('region', { name: /forma project showcase/i });
      act(() => vi.advanceTimersByTime(2600));
      expect(stage).toHaveAttribute('data-chrome', 'quiet');

      act(() => setMotionPreference(true));
      expect(stage).toHaveAttribute('data-chrome', 'visible');
      act(() => vi.advanceTimersByTime(10000));
      expect(stage).toHaveAttribute('data-chrome', 'visible');

      act(() => setMotionPreference(false));
      act(() => vi.advanceTimersByTime(2499));
      expect(stage).toHaveAttribute('data-chrome', 'visible');
      act(() => vi.advanceTimersByTime(1));
      expect(stage).toHaveAttribute('data-chrome', 'quiet');
    } finally {
      vi.useRealTimers();
    }
  });

  it('keeps selection and demo controls usable with reduced motion', async () => {
    setMotionPreference(true);
    const user = userEvent.setup();
    render(<App />);
    await user.click(tab('Roam'));
    await user.click(tab('Relay'));
    expect(tab('Relay')).toHaveAttribute('aria-selected', 'true');
    await user.click(screen.getByRole('button', { name: /explore demo/i }));
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.getByRole('button', { name: /explore demo/i })).toHaveFocus());
    expect(caseLink()).toHaveAttribute('href', '/work/relay/');
  });
});
