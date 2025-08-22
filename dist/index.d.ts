type ExpressionResult = {
    minutes: number[];
    hours: number[];
    days_of_month: number[];
    months: number[];
    days_of_week: number[];
    command: string;
};
export declare const parseCronExpression: (expression: string) => ExpressionResult;
export {};
