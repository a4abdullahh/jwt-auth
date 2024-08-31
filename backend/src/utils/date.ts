export const addDays = (days: number): Date => {
  const today = new Date();
  today.setDate(today.getDate() + days);
  return today;
};

export const subtractDays = (days: number): Date => {
  const today = new Date();
  today.setDate(today.getDate() - days);
  return today;
};
