const sum = require('../server/sum');

test('Test Case 1: Adds 1 + 2 to equals 3', () => {
    expect(sum(1, 2)).toBe(3);
})

test('Test Case 2: Adds 3 + 4 to equals 7', () => {
    expect(sum(3, 4)).toBe(7);
})