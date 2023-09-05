import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Leave } from 'src/app/models/leave';
import { AuthService } from '../auth/auth.service';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  private leaves !: {};
  private leaves$ = new BehaviorSubject<{}>([]);
  isUpdated$ = new BehaviorSubject<boolean>(true);



  dum = [

    {
      fromDate: new Date().getTime(),
      toDate: new Date().getTime(),
      reason: "Pooja celebration",
      type: "Loss of Pay",
      employeeId: 'pws1',
      status: "Pending"
    },
    {
      fromDate: new Date().getTime(),
      toDate: new Date().getTime(),
      reason: "Wedding Aniversart celebration",
      type: "Casual Leave",
      employeeId: 'pws2',

      status: "Pending"
    },
    {
      fromDate: new Date().getTime(),
      toDate: new Date().getTime(),
      reason: "Goa trip",
      type: "Sick Leave",
      employeeId: 'pws1',

      status: "Pending"
    },
    {
      fromDate: new Date().getTime(),
      toDate: new Date().getTime(),
      reason: "BirthDay celebration",
      type: "Paternity Leave",
      employeeId: 'pws2',
      status: "Pending"
    },
  ];

  constructor(private firebase: FirebaseService, private authService: AuthService) {


    this.isUpdated$.subscribe();
    /*    for (let i = 0; i < this.dum.length; i++) {
         if (i % 2 == 0)
           this.addLeave("eredfdsfsfd", this.dum[i]).subscribe();
         else
           this.addLeave("sddfdsdfdsfs", this.dum[i]).subscribe();
       }
       this.getAllLeaves();
       
    */
  }

  ngOnInit() {
    console.log("Leave service");

  }

  getLeavesData() {
    if (!this.leaves)
      this.getAllLeaves();
    return this.leaves$.asObservable();
  }

  private getAllLeaves() {
    return this.firebase.fetchAllLeaves().subscribe(res => {
      this.leaves = res;
      console.log(res);

      const leavesArr: Leave[] = [];
      Object.entries(res).forEach(([uid, val]) => {
        Object.entries(val).forEach(([leaveId, leave]) => {
          leavesArr.push({ ...Object(leave), leaveId: leaveId, uid: uid });
        });
      });
      console.log("Arr, \n", leavesArr);

      this.leaves$.next(leavesArr);
    });
  };


  addLeave(uid: string, leave: Leave) {
    return this.firebase.addLeave(uid, leave);
  }

  editLeave(uid: string, leaveId: string, leave: Leave) {
    return this.firebase.editLeave(uid, leaveId, leave);
  }

  getLeavesByUser(uid: string) {
    if (!this.leaves) {
      this.firebase.fetchLeavesByUser(uid).pipe(
        map((res: any) => {
          let data: Leave[] = [];
          if (res) {
            data = Object.entries(res).map(([key, val]) => {
              return { ...Object(val), leaveId: key, uid: uid };
            });
          }
          this.leaves$.next(data);
          return data;
        })
      ).subscribe();
    }
    return this.leaves$.asObservable();
  }


  deleteLeave(uid: string, leaveId: string) {
    return this.firebase.deleteLeave(uid, leaveId);
  }

  updateStatus(uid: string, leaveId: string, status: 'Approved' | 'Rejected') {
    return this.firebase.updateStatus(uid, leaveId, status);
  }



}
