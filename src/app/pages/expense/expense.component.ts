import { Component, OnDestroy, OnInit } from '@angular/core';
import { IExpense } from '../../core/models/expense.model';
import { ExpenseService } from '../../core/services/expense.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.scss',
})
export class ExpenseComponent implements OnInit, OnDestroy {
  expenses!: IExpense[];
  totalExpenses = 0;
  subscription: Subscription = new Subscription();
  constructor(
    private expenseService: ExpenseService,
    private router: Router,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.getAllExpenses();
  }

  getAllExpenses() {
    this.subscription.add(
      this.expenseService
        .getAllExpenses()
        .snapshotChanges()
        .subscribe({
          next: (data) => {
            console.log(data);
            this.expenses = [];
            data.forEach((item) => {
              let expense = item.payload.toJSON() as IExpense;
              console.log(expense);
              if (expense.type === 'expense') {
                this.totalExpenses += expense.amount;
              } else {
                this.totalExpenses -= expense.amount;
              }
              console.log(this.totalExpenses);
              this.expenses.push({
                key: item.key || '',
                type: expense.type,
                description: expense.description,
                amount: expense.amount,
              });
            });
          },
        })
    );
  }

  trackById(index: number, item: IExpense): number {
    return Number(item.key);
  }
  onRemove(key: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.expenseService.deleteExpense(key).then(() => {
          this.recalculateTotalExpenses();
          this.toastr.success('Expense successfully deleted!', 'Success');
        });
      }
    });
  }

  recalculateTotalExpenses() {
    this.totalExpenses = 0;
    this.getAllExpenses();
  }
  onEdit(key: string) {
    this.router.navigate(['/expense-form', key]);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
