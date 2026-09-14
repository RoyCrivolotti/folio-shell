import '@testing-library/jest-dom/vitest'

// jsdom doesn't implement window.scrollTo; useBodyScrollLock calls it on
// unlock, which otherwise logs a "Not implemented" warning on every test.
window.scrollTo = () => {}
