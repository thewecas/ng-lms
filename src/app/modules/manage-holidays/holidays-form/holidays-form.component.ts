import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HolidayService } from 'src/app/services/holiday/holiday.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-holidays-form',
  templateUrl: './holidays-form.component.html',
  styleUrls: ['./holidays-form.component.scss'],
})
export class HolidaysFormComponent implements OnInit {
  title: string = 'Add holiday';

  holidayForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private holidayService: HolidayService,
    private toast: ToastService,
    @Inject(MAT_DIALOG_DATA) public holiday: any | null
  ) {}

  ngOnInit() {
    this.holidayForm = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(/\S.*/),
        ],
      ],
      date: ['', Validators.required],
      description: [
        '',
        [
          Validators.required,
          Validators.maxLength(200),
          Validators.pattern(/\S.*/),
        ],
      ],
      type: ['', Validators.required],
    });
    if (!this.holiday) {
      this.title = 'New Holiday';
    } else {
      this.title = 'Update Holiday';
      this.holidayForm.setValue({
        title: this.holiday.title,
        description: this.holiday.description,
        date: new Date(this.holiday.date),
        type: this.holiday.type,
      });
    }
  }

  onSubmit() {
    if (!this.holiday)
      this.holidayService
        .addHoliday({
          ...this.holidayForm.value,
          date: new Date(this.holidayForm.value.date).getTime(),
        })
        .subscribe({
          next: (res) => {
            this.holidayService.isUpdated$.next(true);
            this.toast.show('Holiday Added successfuly', 'success');
          },
          error: (err) =>
            this.toast.show(err.error.error.message, 'error', true),
        });
    else {
      this.holidayService
        .updateHoliday(this.holiday.id, {
          ...this.holidayForm.value,
          date: new Date(this.holidayForm.value.date).getTime(),
        })
        .subscribe({
          next: (res) => {
            this.holidayService.isUpdated$.next(true);
            this.toast.show('Holiday Updated successfuly', 'success');
          },
          error: (err) => {
            this.toast.show(err.error.error.message, 'error', true);
          },
        });
    }
  }
}
