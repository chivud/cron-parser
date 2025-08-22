type ExpressionResult = {
  minutes: number[];
  hours: number[];
  days_of_month: number[];
  months: number[];
  days_of_week: number[];
  command: string;
};

type FiledNames = keyof Omit<ExpressionResult, "command">;

const allowedRanges: {
  field: FiledNames;
  min: number;
  max: number;
}[] = [
  { field: "minutes", min: 0, max: 59 },
  { field: "hours", min: 0, max: 23 },
  { field: "days_of_month", min: 1, max: 31 },
  { field: "months", min: 1, max: 12 },
  { field: "days_of_week", min: 0, max: 6 },
];

export const parseCronExpression = (expression: string): ExpressionResult => {
  //Initial validation
  const fields = expression.trim().split(" ");
  if (fields.length !== 6) {
    throw new Error("Invalid cron expression");
  }

  // Process each field
  const result = fields.slice(0, 5).map((value, index) => {
    const { field, min, max } = allowedRanges[index];

    // Wildcard
    if (value === "*") {
      return wildcardParser(min, max);
    }

    // Integer
    if (value.match(/^\d+$/)) {
      return integerParser(value, min, max, field);
    }

    // Ranges
    if (value.includes("-") && !value.includes("/")) {
      return rangeParser(value, min, max, field);
    }

    // Lists
    if (value.includes(",")) {
      return listParser(value, min, max, field);
    }

    // Step values
    if (value.includes("/")) {
      return stepParser(value, min, max, field);
    }

    throw new Error(`Invalid value '${value}' in field ${field}`);
  });

  return {
    minutes: result[0],
    hours: result[1],
    days_of_month: result[2],
    months: result[3],
    days_of_week: result[4],
    command: fields[5],
  };
};

const wildcardParser = (min: number, max: number): number[] => {
  return Array.from({ length: max - min + 1 }, (_, i) => i + min);
};

const integerParser = (
  value: string,
  min: number,
  max: number,
  field: string,
): number[] => {
  const num = parseInt(value, 10);
  if (num < min || num > max) {
    throw new Error(`Value '${num}' out of range for field ${field}`);
  }
  return [num];
};

const rangeParser = (
  value: string,
  min: number,
  max: number,
  field: string,
): number[] => {
  const splitValues = value.split("-").map((v) => parseInt(v, 10));
  if (splitValues.length !== 2) {
    throw new Error(`Invalid range '${value}' in field ${field}`);
  }
  const [start, end] = splitValues;
  if (isNaN(start) || isNaN(end) || start < min || end > max || start > end) {
    throw new Error(`Invalid range '${value}' in field ${field}`);
  }
  return Array.from({ length: end - start + 1 }, (_, i) => i + start);
};

const listParser = (
  value: string,
  min: number,
  max: number,
  field: string,
): number[] => {
  const parts = value.split(",").map((v) => parseInt(v, 10));
  for (const part of parts) {
    if (isNaN(part) || part < min || part > max) {
      throw new Error(`Invalid list value '${part}' in field ${field}`);
    }
  }
  return parts;
};

const stepParser = (
  value: string,
  min: number,
  max: number,
  field: string,
): number[] => {
  const [base, step] = value.split("/");
  const stepNum = parseInt(step, 10);
  if (isNaN(stepNum) || stepNum <= 0 || stepNum > max) {
    throw new Error(`Invalid step value '${step}' in field ${field}`);
  }
  let rangeStart = min;
  let rangeEnd = max;
  if (base !== "*") {
    if (base.includes("-")) {
      const [start, end] = base.split("-").map((v) => parseInt(v, 10));
      if (
        isNaN(start) ||
        isNaN(end) ||
        start < min ||
        end > max ||
        start > end
      ) {
        throw new Error(`Invalid range '${base}' in field ${field}`);
      }
      rangeStart = start;
      rangeEnd = end;
    } else {
      const num = parseInt(base, 10);
      if (isNaN(num) || num < min || num > max) {
        throw new Error(`Value '${num}' out of range for field ${field}`);
      }
      rangeStart = num;
      rangeEnd = max;
    }
  }
  const result = [];
  for (let i = rangeStart; i <= rangeEnd; i += stepNum) {
    result.push(i);
  }
  return result;
};
