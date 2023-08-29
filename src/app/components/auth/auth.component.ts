import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AuthErrorPipe } from 'src/app/pipes/auth-error.pipe';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderComponent } from '../loader/loader.component';




@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    LoaderComponent,
    MatSnackBarModule,
    AuthErrorPipe
  ],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  isPasswordHidden: boolean = true;
  signInForm!: FormGroup;
  errorMessage: string = '';
  errorSubscription!: Subscription;

  constructor(private fb: FormBuilder, private authService: AuthService, private _snackBar: MatSnackBar) {
    console.log("Auth Component");
  }

  ngOnInit() {
    this.errorSubscription = this.authService.errorMessage$.subscribe(error => this.errorMessage = error);

    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.authService.onLogin(this.signInForm.value);

  }

  ngOnDestroy() {
    this.errorSubscription.unsubscribe();
    this.errorMessage = '';
  }



}
