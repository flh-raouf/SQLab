function isMacOS(): boolean {
  return /mac/i.test(navigator.platform ?? navigator.userAgent);
}

export function modKey(): string {
  return isMacOS() ? "⌘" : "Ctrl";
}
