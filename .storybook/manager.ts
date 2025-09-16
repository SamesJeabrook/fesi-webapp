// Suppress known Storybook 9.x manager-preview communication warnings
const originalConsoleError = console.error;
console.error = (...args) => {
  const message = args[0];
  if (
    typeof message === 'string' && 
    (
      message.includes('received currentStoryWasSet but was unable to determine the source') ||
      message.includes('received storyRenderPhaseChanged but was unable to determine the source') ||
      message.includes('received storybook/instrumenter/sync but was unable to determine the source')
    )
  ) {
    // Suppress these specific errors - they're known issues in Storybook 9.1.5
    return;
  }
  originalConsoleError.apply(console, args);
};
