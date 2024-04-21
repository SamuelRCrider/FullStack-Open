const reverse = (string) => {
  return string.split("").reverse().join("");
};
const average = (array) => {
  const reducer = (acc, curr) => {
    return acc + curr;
  };

  if (array.length === 0) {
    return 0;
  }
  return array.reduce(reducer, 0) / array.length;
};

module.exports = { reverse, average };
