import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
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
        }
      );
    }
    else {
      this.leaveService.editLeave(this.leave.uid, this.leave.leaveId, { ...this.leaveForm.value, status: 'Pending', date: new Date(this.leaveForm.value.date).getTime() }).subscribe(res => {
        console.log(res);

      });
    }
  }



}
