import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subject } from 'rxjs/internal/Subject';
import { skipWhile } from 'rxjs/internal/operators/skipWhile';
import { Leave } from 'src/app/models/leave';
import { AuthService } from '../auth/auth.service';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable({
  providedIn: 'root',
})
export class LeaveService {
  private userLeaves: Leave[] | null = null;
  private allLeaves: Leave[] | null = null;
  private allLeaves$ = new BehaviorSubject<Leave[] | null>(null);
  private userLeaves$ = new BehaviorSubject<Leave[] | null>(null);
  isUpdated$ = new Subject<boolean>();

  constructor(
    private firebase: FirebaseService,
    private authService: AuthService
  ) {}

  getLeavesData() {
    if (!this.allLeaves) this.getAllLeaves();
    return this.allLeaves$
      .asObservable()
      .pipe(skipWhile((res) => res === null));
  }

  getAllLeaves() {
    return this.firebase.fetchAllLeaves().subscribe({
      next: (res) => {
        const leavesArr: Leave[] = [];
        Object.entries(res).forEach(([uid, val]) => {
          Object.entries(val).forEach(([leaveId, leave]) => {
            leavesArr.push({ ...Object(leave), leaveId: leaveId, uid: uid });
          });
        });
        this.allLeaves = leavesArr;
        this.allLeaves$.next(leavesArr);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

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
      .asObservable()
      .pipe(skipWhile((res) => res === null));
  }

  fetchLeavesByUser(uid: string) {
    this.firebase.fetchLeavesByUser(uid).subscribe({
      next: (res) => {
        let data: Leave[] = [];
        if (res) {
          data = Object.entries(res).map(([key, val]) => {
            return { ...Object(val), leaveId: key, uid: uid };
          });
        }
        this.userLeaves$.next(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  deleteLeave(uid: string, leaveId: string) {
    return this.firebase.deleteLeave(uid, leaveId);
  }

  updateStatus(uid: string, leaveId: string, status: 'Approved' | 'Rejected') {
    return this.firebase.updateStatus(uid, leaveId, status);
  }
}
