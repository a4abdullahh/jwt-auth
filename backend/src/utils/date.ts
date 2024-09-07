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

export const addMinutes = (minutes: number): Date => {
  const today = new Date();
  today.setMinutes(today.getMinutes() + minutes);
  return today;
};

export const subtractMinutes = (minutes: number): Date => {
  const today = new Date();
  today.setDate(today.getMinutes() - minutes);
  return today;
};
