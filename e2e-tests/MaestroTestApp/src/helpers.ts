export function showError(message: string): void {
  let el = document.getElementById('error-message');
  if (!el) {
    el = document.createElement('p');
    el.id = 'error-message';
    el.style.color = 'red';
    el.style.fontSize = '14px';
    document.getElementById('app')?.appendChild(el);
  }
  el.textContent = `Error: ${message}`;
}

export function clearError(): void {
  const el = document.getElementById('error-message');
  if (el) el.remove();
}
