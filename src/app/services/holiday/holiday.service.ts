import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Holiday } from 'src/app/models/holiday';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {
  private holidays: any = null;
  private holidays$ = new BehaviorSubject<any>(this.holidays);
  isUpdated$ = new BehaviorSubject<boolean>(true);

  constructor(private firebase: FirebaseService) {
    this.isUpdated$.subscribe(
      res => this.getAllHolidays()
    );
  }

  addHoliday(holiday: Holiday) {
    return this.firebase.addHoliday(holiday);
  }

  getHolidayData() {
    if (!this.holidays) {
      this.getAllHolidays();
    }
    return this.holidays$.asObservable();
  }

  private getAllHolidays() {
    return this.firebase.fetchAllHolidays().subscribe({
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

  deleteHoliday(id: string) {
    return this.firebase.deleteHoliday(id);
  }

  updateHoliday(id: string, holiday: Holiday) {
    return this.firebase.updateHoliday(id, holiday);
  }
}
