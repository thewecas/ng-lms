import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Holiday } from 'src/app/models/holiday';
import { } from '../../../assets/holidays.json';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {
  private holidays: any = null;
  private holidays$ = new BehaviorSubject<any>(this.holidays);
  isUpdated$ = new BehaviorSubject<boolean>(true);
  holiday = [
    {
      "title": "Republic Day",
      "date": "2023-01-23",
      "description": "Republic Day is the day when India marks and celebrates the date on which the Constitution of India came into effect on 26 January 1950.",
      "type": "National"
    },
    {
      "title": "Holi",
      "date": "2023-03-08",
      "description": "Holi is a popular and significant Hindu festival celebrated as the Festival of Colours, Love and Spring.",
      "type": "National"
    },
    {
      "title": "Ram Navami",
      "date": "2023-03-30",
      "description": "Rama Navami is a Hindu festival that celebrates the birth of Rama, one the most popularly revered deities in Hinduism, also known as the seventh avatar of Vishnu. ",
      "type": "National"
    },
    {
      "title": "Mahavir Jayanti",
      "date": "2023-04-04",
      "description": "Mahavir Jayanti os an important religious festivals in Jainism. It celebrates the birth of Lord Mahavir, the twenty-fourth and last Tirthankara of present Avasarpini.",
      "type": "National"
    },
    {
      "title": "Good Friday",
      "date": "2023-04-07",
      "description": "Good Friday is a Christian holiday commemorating the crucifixion of Jesus and his death at Calvary. It is observed during Holy Week as part of the Paschal Triduum.",
      "type": "National"
    },
    {
      "title": "Birthday of Dr. B. R. Ambedkar",
      "date": "2023-04-14",
      "description": "Ambedkar Jayanti or Bhim Jayanti is observed on 14 April to commemorate the memory of B. R. Ambedkar, Indian politician and social reformer.",
      "type": "National"
    },
    {
      "title": "Id-ul-Fitr ",
      "date": "2023-04-22",
      "description": "The religious holiday of Eid al-Fitr is celebrated by Muslims worldwide because it marks the end of the month-long dawn-to-sunset fasting of Ramadan.",
      "type": "National"
    },
    {
      "title": "Independence Day",
      "date": "2023-08-15",
      "description": "Independence Day is celebrated annually on 15 August as a public holiday in India commemorating the nation's independence from the United Kingdom on 15 August 1947.",
      "type": "National"
    },
    {
      "title": "Janmashtami",
      "date": "2023-09-06",
      "description": "Janmashtami is an annual Hindu festival that celebrates the birth of Krishna, the eighth avatar of Vishnu.",
      "type": "National"
    },
    {
      "title": "Ganesh Chaturthi",
      "date": "2023-09-19",
      "description": "Ganesh Chaturthi is a Hindu festival commemorating the birth of the Hindu god Ganesha. The festival is marked with the installation of Ganesha's clay idols privately in homes and publicly on elaborate pandals.",
      "type": "Restricted"
    },
    {
      "title": "Dussehra",
      "date": "2023-10-24",
      "description": "Dussehra is a major Hindu festival celebrated every year at the end of Navaratri. It is observed on the tenth day of the month of Ashvin. ",
      "type": "National"
    },
    {
      "title": "Diwali",
      "date": "2023-11-12",
      "description": "Diwali is the Hindu festival of lights with its variations also celebrated in other Indian religions. It symbolises the spiritual 'victory of light over darkness, good over evil, and knowledge over ignorance'",
      "type": "National"
    },
    {
      "title": "Christmas Day",
      "date": "2023-12-25",
      "description": "Christmas is an annual festival commemorating the birth of Jesus Christ, observed primarily on December 25 as a religious and cultural celebration among billions of people around the world.",
      "type": "National"
    },
    {
      "title": "Onam",
      "date": "2023-08-28",
      "description": "Onam is an annual Indian - regional harvest or cultural festival related to Hinduism celebrated mostly by the people of Kerala, irrespective of faith and community.",
      "type": "Restricted"
    },
    {
      "title": "Ugadi",
      "date": "2023-03-22",
      "description": "Ugadi is New Year's Day according to the Hindu calendar and is celebrated in the states of Andhra Pradesh, Telangana, Karnataka and Goa in India.",
      "type": "National"
    },

  ];
  constructor(private firebase: FirebaseService) {
    this.isUpdated$.subscribe(
      res => this.getAllHolidays()
    );


    // for (let hol of this.holiday) {
    //   const obj = { ...hol, date: new Date(hol.date).getTime() };
    //   this.addHoliday(obj).subscribe();

    // }
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
