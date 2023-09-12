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

  /**
   * Fetch the holiday data observable
   * @returns - observable of type Holiday
   */
  getHolidayData() {
    if (!this.holidays) {
      this.getAllHolidays();
    }
    return this.holidays$
      .asObservable()
      .pipe(skipWhile(res => res.length == 0));
  }

  /**
   * fetehes the holiday data from database,
   * Calls the next method of `holidays$` subject
   */
  getAllHolidays() {
    this.firebase
      .fetchAllHolidays()
      .subscribe({
        next: (res) => {
          this.holidays = res;
          const holidayData = Object.entries(res)
            .map(([key, val]) => {
              return { ...val, id: key };
            });
          this.holidays$.next(holidayData);
        },
      }
      );
  }

  /**
   * Add holiday to the database
   * @param holiday - Object of type `Holiday` 
   * @returns - Object of type `Holiday` 
   */
  addHoliday(holiday: Holiday) {
    return this.firebase.addHoliday(holiday);
  }

  /**
   * delete existing holiday
   * @param id - id of holiday
   * @returns - id of holiday
   */
  deleteHoliday(id: string) {
    return this.firebase.deleteHoliday(id);
  }

  /**
   * Update the existing holiday 
   * @param id - id of the holiday
   * @param holiday - `Holiday` object with updated data
   * @returns - `Holiday` object with updated data
   */
  updateHoliday(id: string, holiday: Holiday) {
    return this.firebase.updateHoliday(id, holiday);
  }
}
