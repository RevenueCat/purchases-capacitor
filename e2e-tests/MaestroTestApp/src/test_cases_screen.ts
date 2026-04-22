import { TEST_CASES } from './test_cases';

export function showTestCases() {
  const app = document.getElementById('app')!;
  app.innerHTML = '<h1>Test Cases</h1>';
  Object.values(TEST_CASES).forEach((tc) => {
    const btn = document.createElement('button');
    btn.textContent = tc.title;
    btn.addEventListener('click', tc.show);
    app.appendChild(btn);
  });
}
