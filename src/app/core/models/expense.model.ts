export interface IExpense {
  key?:string
  type: 'income' | 'expense'; 
  amount: number;
  description: string; 
}
