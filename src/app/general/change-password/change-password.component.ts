import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth/login/auth.service';

export interface Category {
  name: string;
  id: number;
}

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [NgbAccordionModule, NgFor, NgIf, ReactiveFormsModule, NgClass],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  @Input() area: any;
  @Input() isAdmin!: boolean;
  @Output() pageSelectionChanged = new EventEmitter<void>();

  passwordRegex: string =
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&/])[A-Za-zd@$!%*?&/]{8,}$';
  form: FormGroup;
  name: string | null = '';
  arrayValdationRules = [
    '',
    Validators.compose([
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&/])[A-Za-z\\d@$!%*?&/]{8,}$'
      ),
    ]),
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.form = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: this.arrayValdationRules,
        confirmPassword: this.arrayValdationRules,
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  passwordsMatchValidator(
    group: AbstractControl
  ): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      return { passwordsMismatch: true }; // Return an error if passwords don't match
    }

    return null; // Valid case
  }

  isPasswordsMismatch(): boolean {
    return this.form.errors?.['passwordsMismatch'] && this.form.touched;
  }

  ngOnInit(): void {
    this.name = this.authService.name();
  }

  showMessage(
    icono: any = '',
    titulo: string = '',
    html: string = '',
    timer: number = 2000
  ) {
    Swal.fire({
      icon: icono,
      title: titulo,
      html: html,
      showConfirmButton: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      timer: timer,
    });
  }

  showLoading() {
    Swal.fire({
      text: 'Espere un poco por favor.',
      imageUrl: 'assets/loading.gif',
      imageWidth: 70,
      imageHeight: 70,
      showConfirmButton: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
    });
  }

  closeLoading() {
    Swal.close();
  }

  showPassword(inputId: string, iconId: string) {
    var field = document.getElementById(inputId);
    const type =
      field?.getAttribute('type') === 'password' ? 'text' : 'password';
    field?.setAttribute('type', type);

    var icon = document.getElementById(iconId);
    if (icon?.classList.contains('fa-eye')) {
      icon?.classList.remove('fa-eye');
      icon?.classList.add('fa-eye-slash');
    } else {
      icon?.classList.remove('fa-eye-slash');
      icon?.classList.add('fa-eye');
    }
  }

  checkCurrentPassword() {
    this.showLoading();
    this.authService
      .checkCurrentPassword(this.form.get('currentPassword')?.value)
      .subscribe((data) => {
        this.closeLoading();
        if (data.status) {
          this.authService
            .updatePassword(this.form.get('newPassword')?.value)
            .subscribe((data) => {
              this.showMessage('success', data.message);
              setTimeout(() => {
                this.router.navigate(['index']);
              }, 2000);
            });
        } else {
          Swal.fire({
            text: 'La contraseña actual es incorrecta, por favor valide la información',
            icon: 'warning',
            showCancelButton: false,
            allowEscapeKey: false,
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
            }
          });
        }
      });
  }
}
