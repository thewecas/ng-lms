import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { User } from 'src/app/models/user';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {
  hidePassword = true;
  hideConfirmPassword = true;
  title!: string;

  userForm!: FormGroup;
  constructor(
    private readonly fb: FormBuilder,
    private readonly toast: ToastService,
    private readonly userService: UserService,
    @Inject(MAT_DIALOG_DATA) public user: User | null
  ) {}

  ngOnInit() {
    /**
     * initilaize the user form
     */
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/\S.*/)]],
      designation: ['', [Validators.required, Validators.pattern(/\S.*/)]],
      role: ['employee', Validators.required],
    });

    /**
     * if the user object is passed to the component via @Inject
     * then user is trying to update existing user
     * else he is trying to add a new user
     */
    if (!this.user) {
      this.title = 'New User';

      this.userForm.addControl(
        'employeeId',
        this.fb.control('', {
          updateOn: 'blur',
          validators: [Validators.required, Validators.pattern(/PW\d{1,3}/i)],
          asyncValidators: [this.isEmployeeIdExist],
        })
      );

      this.userForm.addControl(
        'email',
        this.fb.control('', {
          updateOn: 'blur',
          validators: [Validators.required, Validators.email],
          asyncValidators: [this.isEmailExist],
        })
      );

      this.userForm.addControl(
        'password',
        this.fb.control('', [
          Validators.required,
          Validators.pattern('[a-zA-Z0-9]{6,16}'),
        ])
      );

      this.userForm.addControl(
        'confirmPassword',
        this.fb.control('', [Validators.required, this.passwordMatch])
      );
    } else {
      this.title = 'Edit User';
      this.userForm.addControl('employeeId', this.fb.control(''));
      this.userForm.addControl('email', this.fb.control(''));
      /**
       * set the values of the form to the values from
       * the user object passed via @Inject
       */
      this.userForm.setValue({
        employeeId: this.user.employeeId,
        name: this.user.name,
        email: this.user.email,
        designation: this.user.designation,
        role: this.user.role,
      });
    }
  }

  onSubmit() {
    if (!this.user)
      /**add new user */
      this.userService
        .addNewUser(
          {
            email: this.userForm.value.email,
            password: this.userForm.value.password,
          },
          {
            name: String(this.userForm.value.name),
            email: String(this.userForm.value.email),
            designation: String(this.userForm.value.designation),
            role: String(this.userForm.value.role),
            employeeId: String(this.userForm.value.employeeId),
            isDeleted: false,
          }
        )
        .subscribe({
          next: () => {
            this.userService.getAllUsers();
            this.toast.show('User Added Succesfully', 'success');
          },
          error: (err) => {
            this.toast.show(err.error.error.message, 'error', true);
          },
        });
    else {
      /**Update exiting user */
      this.userService
        .updateUser(String(this.user.uid), {
          ...this.userForm.value,
          isDeleted: false,
        })
        .subscribe({
          next: () => {
            this.userService.getAllUsers();
            this.toast.show('User Updated Succesfully', 'success');
          },
          error: (err) => {
            this.toast.show(err.error.error.message, 'error', true);
          },
        });
    }
  }

  /**
   * function to set the pattern for confirm password
   */
  private passwordPattern = '';

  /**
   * Async Validator function to check whether the entered Employee Id
   * is already exist/assosiated with anotehr employee
   * @param control - istance of Abstract control of EmployeeId field
   * @returns - observable of type Validation error if the employee id already exist
   */
  isEmployeeIdExist: AsyncValidatorFn = (
    control: AbstractControl
  ): Observable<ValidationErrors | null> => {
    return this.userService
      .checkEmployeeIdTaken(control.value.toLowerCase())
      .pipe(
        map((res) => {
          if (Object.values(res).length !== 0) return { employeeIdTaken: true };
          else return null;
        })
      );
  };

  /**
   * Async Validator function to check whether the entered email Id
   * is already exist/assosiated with anotehr employee
   * @param control - istance of Abstract control of employee field
   * @returns - observable of type Validation error if the Email id already exist
   */
  isEmailExist: AsyncValidatorFn = (
    control: AbstractControl
  ): Observable<ValidationErrors | null> => {
    return this.userService.checkEmailTaken(control.value.toLowerCase()).pipe(
      map((res) => {
        if (Object.values(res).length !== 0) return { emailTaken: true };
        else return null;
      })
    );
  };

  setPattern(pattern: string) {
    this.passwordPattern = pattern;
  }

  /**
   * Validator Function to check whether the
   *  PASSWORD and CONFIRMPASSWORD are same ore not
   * @param control -reference to Abstract control instance
   *  of conifrm password field
   * @returns - Vaidator Error if the password does not match
   */
  passwordMatch: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const confirmPassword = control?.value ?? '';
    return this.passwordPattern !== confirmPassword
      ? {
          passwordMatch: {
            password: this.passwordPattern,
            isMatch: false,
            confirmPassword,
          },
        }
      : null;
  };
}
