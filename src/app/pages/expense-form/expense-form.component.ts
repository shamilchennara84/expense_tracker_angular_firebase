import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ExpenseService } from '../../core/services/expense.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { IExpense } from '../../core/models/expense.model';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrl: './expense-form.component.scss',
})
export class ExpenseFormComponent implements OnInit, OnDestroy {
  expenseForm!: FormGroup;
  subscription: Subscription = new Subscription();
  expenseId = '';
  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private toaster: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.subscription.add(
      this.activatedRoute.params.subscribe({
        next: (params) => {
          this.expenseId = params['id'];
          this.getExpense(this.expenseId);
        },
      })
    );
  }

  initializeForm(): void {
    this.expenseForm = this.fb.group({
      type: new FormControl('', Validators.required),
      amount: new FormControl(0, [
        Validators.required,
        Validators.min(1),
        Validators.max(100000),
      ]),
      description: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      const expenseData = this.expenseForm.value;

      if (this.expenseId) {
        this.subscription.add(
          this.expenseService
            .updateExpense(this.expenseId, expenseData)
            .subscribe({
              next: () => {
                this.toaster.success('Expense updated successfully!');
                this.router.navigate(['/']);
              },
              error: (error) => {
                this.toaster.error('Failed to update expense.');
                console.error(error);
              },
            })
        );
      } else {
        this.subscription.add(
          this.expenseService.addExpense(expenseData).subscribe({
            next: () => {
              this.toaster.success('Expense created successfully!');
              this.router.navigate(['/']);
            },
            error: (error) => {
              this.toaster.error('Failed to create expense.');
              console.error(error);
            },
          })
        );
      }
    }
  }

  getExpense(key: string) {
    this.subscription.add(
      this.expenseService
        .getExpense(key)
        .snapshotChanges()
        .subscribe({
          next: (data) => {
            let expense = data.payload.toJSON() as IExpense;
            this.expenseForm.setValue(expense);
          },
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
