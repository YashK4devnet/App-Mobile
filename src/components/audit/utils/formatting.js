/**
 * Returns a greeting based on the current time of day.
 * @returns {string} The appropriate greeting (e.g., "Good Morning")
 */
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};
