import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Holiday } from 'src/app/models/holiday';
import { HolidayService } from 'src/app/services/holiday/holiday.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-holidays-form',
  templateUrl: './holidays-form.component.html',
})
export class HolidaysFormComponent implements OnInit {
  title = 'Add holiday';

  holidayForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private holidayService: HolidayService,
    private toast: ToastService,
    @Inject(MAT_DIALOG_DATA)
    public holiday: Holiday | null /**If the `holiday` is not null then we are updating the existing holiday */
  ) {}

  ngOnInit() {
    this.holidayForm = this.fb.group({
      /**Initilaize the form */
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
      this.title = 'Edit Holiday';
      this.holidayForm.setValue({
        title: this.holiday.title,
        description: this.holiday.description,
        date: new Date(this.holiday.date),
        type: this.holiday.type,
      });
    }
  }

  onSubmit() {
    if (!this.holiday) {
      /**Add new Holiday */
      this.holidayService
        .addHoliday({
          ...this.holidayForm.value,
          date: new Date(this.holidayForm.value.date).getTime(),
        })
        .subscribe({
          next: () => {
            this.holidayService.getAllHolidays();
            this.toast.show('Holiday Added successfuly', 'success');
          },
          error: (err) =>
            this.toast.show(err.error.error.message, 'error', true),
        });
    } else {
      /**Update existing Holiday */
      if (this.holiday.id)
        this.holidayService
          .updateHoliday(this.holiday.id, {
            ...this.holidayForm.value,
            date: new Date(this.holidayForm.value.date).getTime(),
          })
          .subscribe({
            next: () => {
              this.holidayService.getAllHolidays();
              this.toast.show('Holiday Updated successfuly', 'success');
            },
            error: (err) => {
              this.toast.show(err.error.error.message, 'error', true);
            },
          });
    }
  }
}
