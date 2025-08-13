
export const useNumberFormatter = () => {
  const formatNumber = (num: number) => {
    if (num % 1 === 0) return num.toString();
    return num.toFixed(num < 10 ? 1 : 1);
  };

  return { formatNumber };
};
