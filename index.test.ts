import { parseCronExpression } from "./index";

describe("Test Cron Expressions", () => {
  test("Valid: * * * * * ls", () => {
    const expression = "* * * * * ls";
    const expected = {
      minutes: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
        38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55,
        56, 57, 58, 59,
      ],
      hours: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23,
      ],
      days_of_month: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
      ],
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      days_of_week: [0, 1, 2, 3, 4, 5, 6],
      command: "ls",
    };
    const result = parseCronExpression(expression);
    expect(result).toEqual(expected);
  });
  test("Valid: */15 0 1,2,3,15 */2 1-5 /usr/bin/find", () => {
    const expression = "*/15 0 1,2,3,15 */2 1-5 /usr/bin/find";
    const expected = {
      minutes: [0, 15, 30, 45],
      hours: [0],
      days_of_month: [1, 2, 3, 15],
      months: [1, 3, 5, 7, 9, 11],
      days_of_week: [1, 2, 3, 4, 5],
      command: "/usr/bin/find",
    };
    const result = parseCronExpression(expression);
    expect(result).toEqual(expected);
  });
  test("Valid: 1/15 0 1 1 0 /usr/bin/find", () => {
    const expression = "1/15 0 1 1 0 /usr/bin/find";
    const expected = {
      minutes: [1, 16, 31, 46],
      hours: [0],
      days_of_month: [1],
      months: [1],
      days_of_week: [0],
      command: "/usr/bin/find",
    };
    const result = parseCronExpression(expression);
    expect(result).toEqual(expected);
  });

  test("Valid: 1-20/5 0 1 1 0 /usr/bin/find", () => {
    const expression = "1-20/5 0 1 1 0 /usr/bin/find";
    const expected = {
      minutes: [1, 6, 11, 16],
      hours: [0],
      days_of_month: [1],
      months: [1],
      days_of_week: [0],
      command: "/usr/bin/find",
    };
    const result = parseCronExpression(expression);
    expect(result).toEqual(expected);
  });

  test('Invalid char: "👽 * * * * /usr/bin/invalid"', () => {
    const expression = "👽 * * * * /usr/bin/invalid";
    expect(() => parseCronExpression(expression)).toThrow(
      "Invalid value '👽' in field minutes",
    );
  });

  test("Invalid value: 60 * * * * /usr/bin/invalid", () => {
    const expression = "60 * * * * /usr/bin/invalid";
    expect(() => parseCronExpression(expression)).toThrow(
      "Value '60' out of range for field minutes",
    );
  });
  test("Invalid expression: * * * *", () => {
    const expression = "* * * *";
    expect(() => parseCronExpression(expression)).toThrow(
      "Invalid cron expression",
    );
  });
  test("Invalid range: 6-2 0 1,2,3,15 */2 1-5 /usr/bin/find", () => {
    const expression = "6-2 0 1,2,3,15 */2 1-5 /usr/bin/find";
    expect(() => parseCronExpression(expression)).toThrow(
      "Invalid range '6-2' in field minutes",
    );
  });
  test("Invalid range: 1-2-3 0 1,2,3,15 */2 1-5 /usr/bin/find", () => {
    const expression = "1-2-3 0 1,2,3,15 */2 1-5 /usr/bin/find";
    expect(() => parseCronExpression(expression)).toThrow(
      "Invalid range '1-2-3' in field minutes",
    );
  });
  test("Invalid range: 1-66/5 * * * * /usr/bin/find", () => {
    const expression = "1-66/5 * * * * /usr/bin/find";
    expect(() => parseCronExpression(expression)).toThrow(
      "Invalid range '1-66' in field minutes",
    );
  });
  test("Invalid range: 66/15 0 1,2,3,15 */2 1-5 /usr/bin/find", () => {
    const expression = "66/15 0 1,2,3,15 */2 1-5 /usr/bin/find";
    expect(() => parseCronExpression(expression)).toThrow(
      "Value '66' out of range for field minutes",
    );
  });
  test('Invalid range: "a-b * * * * /usr/bin/invalid"', () => {
    const expression = "a-b * * * * /usr/bin/invalid";
    expect(() => parseCronExpression(expression)).toThrow(
      "Invalid range 'a-b' in field minutes",
    );
  });
  test("Invalid list value: */15 1,2,3 1,2,3,15 */2 1-5 /usr/bin/find", () => {
    const expression = "*/15 1,2,66 1,2,3,15 */2 1-5 /usr/bin/find";
    expect(() => parseCronExpression(expression)).toThrow(
      "Invalid list value '66' in field hours",
    );
  });
  test("Invalid step: */* 0 1,2,3,15 */2 1-5 /usr/bin/find", () => {
    const expression = "*/66 0 1,2,3,15 */2 1-5 /usr/bin/find";
    expect(() => parseCronExpression(expression)).toThrow(
      "Invalid step value '66' in field minutes",
    );
  });
  test("Invalid step: */* 0 1,2,3,15 */2 1-5 /usr/bin/find", () => {
    const expression = "*/* 0 1,2,3,15 */2 1-5 /usr/bin/find";
    expect(() => parseCronExpression(expression)).toThrow(
      "Invalid step value '*' in field minutes",
    );
  });
  test("Invalid step: a/b 0 1,2,3,15 */2 1-5 /usr/bin/find", () => {
    const expression = "a/b 0 1,2,3,15 */2 1-5 /usr/bin/find";
    expect(() => parseCronExpression(expression)).toThrow(
      "Invalid step value 'b' in field minutes",
    );
  });
});
