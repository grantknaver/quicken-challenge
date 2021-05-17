interface StudentExpenses {
    expenseName: string;
    expenseCost: number;
}

export interface Student {
    name: string;
    expenses: StudentExpenses[];
}