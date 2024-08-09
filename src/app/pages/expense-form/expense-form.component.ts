import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ExpenseService } from '../../core/services/expense.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrl: './expense-form.component.scss',
})
export class ExpenseFormComponent implements OnInit, OnDestroy {
  expenseForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
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

  createExpense() {
    // if (this.expenseForm.valid) {
    //   const expenseData = this.expenseForm.value;
    //   this.expenseService.createExpense(expenseData).subscribe(
    //     () => {
    //       this.toastr.success('Expense created successfully!');
    //       this.expenseForm.reset();
    //     },
    //     (error) => {
    //       this.toastr.error('Failed to create expense.');
    //       console.error(error);
    //     }
    //   );
    // }
  }

  ngOnDestroy(): void {}
}
