const a = [3, 4, 5, 6, 7, 10];

const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

const b = addDecimals(100);

console.log(b);
