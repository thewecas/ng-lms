import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, skipWhile } from 'rxjs';
import { Holiday } from 'src/app/models/holiday';
import { } from '../../../assets/holidays.json';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {
  private holidays: any = null;

  private holidays$ = new BehaviorSubject<any>([]);
  isUpdated$ = new Subject<boolean>();
  constructor(private firebase: FirebaseService) {

  }

  getHolidayData() {
    if (!this.holidays) {
      this.getAllHolidays();
    }
    return this.holidays$
      .asObservable()
      .pipe(skipWhile(res => res.length == 0));
  }

  getAllHolidays() {
    this.firebase.fetchAllHolidays().subscribe({
      next: (res) => {
        this.holidays = res;
        const holidayData = Object.entries(res).map(([key, val]) => {
          return { ...val, id: key };
        });
        this.holidays$.next(holidayData);
      },
      error: err => console.log(err)

    }
    );
  }

  addHoliday(holiday: Holiday) {
    return this.firebase.addHoliday(holiday);
  }


  deleteHoliday(id: string) {
    return this.firebase.deleteHoliday(id);
  }

  updateHoliday(id: string, holiday: Holiday) {
    return this.firebase.updateHoliday(id, holiday);
  }
}
