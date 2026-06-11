export function fireEvent(
  element: HTMLElement,
  type: string,
  detail?: Record<string, unknown>
): void {
  const event = new CustomEvent(type, {
    detail,
    bubbles: true,
    composed: true,
  });
  element.dispatchEvent(event);
}
