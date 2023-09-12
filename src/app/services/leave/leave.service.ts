import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Leave } from 'src/app/models/leave';
import { AuthService } from '../auth/auth.service';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  private userLeaves: any = null;
  private allLeaves: any = null;
  private allLeaves$ = new BehaviorSubject<any>([]);
  private userLeaves$ = new BehaviorSubject<any>([]);
  isUpdated$ = new Subject<boolean>();

  constructor(private firebase: FirebaseService, private authService: AuthService) {
  }


  getLeavesData() {
    if (!this.allLeaves)
      this.getAllLeaves();
    return this.allLeaves$
      .asObservable();
  }

  getAllLeaves() {
    return this.firebase.fetchAllLeaves().subscribe({
      next: res => {
        this.allLeaves = res;
        const leavesArr: Leave[] = [];
        Object.entries(res).forEach(([uid, val]) => {
          Object.entries(val).forEach(([leaveId, leave]) => {
            leavesArr.push({ ...Object(leave), leaveId: leaveId, uid: uid });
          });
        });
        this.allLeaves$.next(leavesArr);
      },
      error: err => {
        console.log(err);
      }
    });
  };


  addLeave(uid: string, leave: Leave) {
    return this.firebase.addLeave(uid, leave);
  }

  editLeave(uid: string, leaveId: string, leave: Leave) {
    return this.firebase.editLeave(uid, leaveId, leave);
  }

  getLeavesByUser(uid: string) {
    if (!this.userLeaves) {
      this.fetchLeavesByUser(uid);
    }
    return this.userLeaves$
      .asObservable();
  }

  fetchLeavesByUser(uid: string) {
    this.firebase.fetchLeavesByUser(uid).subscribe(
      {
        next: (res: any) => {
          let data: Leave[] = [];
          if (res) {
            data = Object.entries(res).map(([key, val]) => {
              return { ...Object(val), leaveId: key, uid: uid };
            });
          }
          this.userLeaves$.next(data);
        },
        error: err => {
          console.log(err);
        }
      });
  }


  deleteLeave(uid: string, leaveId: string) {
    return this.firebase.deleteLeave(uid, leaveId);
  }

  updateStatus(uid: string, leaveId: string, status: 'Approved' | 'Rejected') {
    return this.firebase.updateStatus(uid, leaveId, status);
  }



}
