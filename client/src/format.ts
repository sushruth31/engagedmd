/** Groups a card number into blocks of four digits for display while typing. */
export const formatCardNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 19);
  return digits.replace(/(.{4})/g, '$1 ').trim();
};
