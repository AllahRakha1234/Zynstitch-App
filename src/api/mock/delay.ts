export function mockDelay(ms = 450) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}
