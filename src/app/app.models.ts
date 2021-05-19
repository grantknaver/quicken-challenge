interface StudentExpenses {
    expenseName: string;
    expenseCost: number;
}

export interface Student {
    name: string;
    expenses: StudentExpenses[];
}

export interface StudentTotals {
    name: string;
    total?: number;
    totalExpenses?: number;
    need2Pay?: number
}