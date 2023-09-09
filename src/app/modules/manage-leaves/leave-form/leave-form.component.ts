import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LeaveService } from 'src/app/services/leave/leave.service';

@Component({
  selector: 'app-leave-form',
  templateUrl: './leave-form.component.html',
  styleUrls: ['./leave-form.component.scss']
})
export class LeaveFormComponent {

  title!: string;


  leaveForm!: FormGroup;
  employeeId!: string;
  uid!: string;
  constructor(private fb: FormBuilder, private leaveService: LeaveService, private authService: AuthService, @Inject(MAT_DIALOG_DATA) public leave: any | null) {
    console.log("Received leave  : ", leave);
    this.employeeId = authService.getEmployeeId();
    this.uid = authService.getUserId();
  }

  ngOnInit() {
    this.leaveForm = this.fb.group({
      fromDate: ['', [Validators.required, this.isValidFromDate]],
      toDate: ['', [Validators.required, this.isValidToDate]],
      reason: ['', Validators.required],
      type: ['', Validators.required]
    });

    if (!this.leave) {
      this.title = 'Apply Leave';
    }
    else {
      this.title = 'Edit Leave';
      this.leaveForm.setValue({
        fromDate: this.leave.fromDate,
        toDate: this.leave.toDate,
        reason: this.leave.reason,
        type: this.leave.type
      });
    }
  }

  onSubmit() {

    if (!this.leave) {
      this.leaveService.addLeave(this.uid, { ...this.leaveForm.value, employeeId: this.employeeId, status: 'Pending' }).subscribe(
        res => {
          console.log(res);
          this.leaveService.isUpdated$.next(true);
        }
      );
    }
    else {
      this.leaveService.editLeave(this.leave.uid, this.leave.leaveId, { ...this.leaveForm.value, status: 'Pending', date: new Date(this.leaveForm.value.date).getTime() }).subscribe(res => {
        console.log(res);
        this.leaveService.isUpdated$.next(true);

      });
    }
  }

  isValidFromDate: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const today = new Date().getTime() - 1000 * 60 * 60 * 24;
    const fromDate = new Date(control.value).getTime();
    return fromDate > today ? null : {
      invalidFromDate: true
    };
  };

  isValidToDate: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const fromDate = new Date(this.leaveForm?.value.fromDate).getTime();
    const today = new Date().getTime() - 1000 * 60 * 60 * 24;
    const toDate = new Date(control.value).getTime();
    return toDate >= fromDate && toDate >= today ? null : {
      invalidToDate: true,
    };
  };



}
