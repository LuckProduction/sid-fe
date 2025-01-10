export const dummySektor = Array.from({ length: 10 }, (_, index) => ({
  _id: (index + 1).toString(),
  name: index === 1 ? 'filter' : 'dummy'
}));
