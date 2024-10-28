const THEME_KEY = 'lml_theme_preference';

export function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    // Use system preference as default
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }

  // Watch for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}

export function getTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}

export function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}

function applyTheme(theme) {
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme);

  // Update meta theme-color
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  
  if (metaThemeColor) {
    metaThemeColor.content = theme === 'dark' ? '#1f2937' : '#ffffff';
  }
}

// Call initTheme on page loads
document.addEventListener('DOMContentLoaded', initTheme);
