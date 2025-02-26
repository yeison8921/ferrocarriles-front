import { Component } from '@angular/core';
import { UsuarioService } from './usuario.service';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { Modal } from 'bootstrap';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../../auth/login/auth.service';
import { Router } from '@angular/router';
import 'datatables.net';
import 'datatables.net-buttons';
import 'datatables.net-buttons/js/buttons.html5.js';
import 'jszip';

declare var $: any; // Import jQuery globally

interface Rol {
  value: number;
  viewValue: string;
}

interface User {
  name: string;
  email: string;
  rol_id: number;
  password: string;
}

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    NgClass,
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css',
})
export class UsuarioComponent {
  form: FormGroup;
  // formPassword: FormGroup;

  arrayValidationRules = [
    Validators.compose([
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&/])[A-Za-z\\d@$!%*?&/]{8,}$'
      ),
    ]),
  ];

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        rol_id: [''],
        password: ['', this.arrayValidationRules],
        confirmPassword: ['', this.arrayValidationRules],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  isCreate: boolean = true; //true => create, false => edit
  resetPassword: boolean = false;
  users: any[] = [];
  user: User = {
    name: '',
    email: '',
    rol_id: 0,
    password: '',
  };
  userId: number | null = null;
  roles: Rol[] = [];
  rol: number = 0;

  passwordsMatchValidator(
    group: AbstractControl
  ): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      return { passwordsMismatch: true }; // Return an error if passwords don't match
    } else {
      return null; // Valid case
    }
  }

  isPasswordsMismatch(): boolean {
    return this.form.errors?.['passwordsMismatch'] && this.form.touched;
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

  openModal() {
    const modalElement = document.getElementById('modalUsers');
    const modalInstance = new Modal(modalElement!);
    modalInstance.show();
  }

  closeModal(): void {
    const modalElement = document.getElementById('modalUsers');
    const modal = Modal.getInstance(modalElement!);
    modal?.hide();
  }

  ngOnInit(): void {
    this.authService.getRolByToken().subscribe((data) => {
      if (data.rol != 1) {
        this.router.navigate(['index']);
      }
    });
    this.usuarioService.getRoles().subscribe((data) => {
      this.roles = data.data;
    });
    this.getUsers();
  }

  setPasswordValidator() {
    this.form.reset();
    const passwordControl = this.form.get('password');
    const confirmPasswordControl = this.form.get('confirmPassword');
    if (this.isCreate || this.resetPassword) {
      passwordControl?.setValidators([
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&/])[A-Za-z\\d@$!%*?&/]{8,}$'
        ),
      ]);
      confirmPasswordControl?.setValidators([
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&/])[A-Za-z\\d@$!%*?&/]{8,}$'
        ),
      ]);
    } else {
      passwordControl?.clearValidators();
      confirmPasswordControl?.clearValidators();
    }
    passwordControl?.updateValueAndValidity();
    confirmPasswordControl?.updateValueAndValidity();
  }

  getUsers() {
    this.usuarioService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        if ($.fn.dataTable.isDataTable('#usersTable')) {
          $('#usersTable').DataTable().destroy();
        }

        setTimeout(() => {
          $('#usersTable').DataTable({
            responsive: false,
            dom:
              "<'row'<'col-sm-12 mb-4'B>><'row'<'col-sm-12 mb-2 col-md-6'l><'col-sm-12 mb-2 col-md-6'f>>" +
              "<'row'<'col-sm-12'tr>>" +
              "<'row'<'mt-2 d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto'i><'mt-2 d-md-flex justify-content-between align-items-center dt-layout-end col-md-auto ms-auto'p>>",
            language: {
              lengthMenu: 'Ver _MENU_ registros por página',
              zeroRecords: 'No hay información, lo sentimos.',
              info: 'Mostrando página _PAGE_ de _PAGES_',
              infoEmpty: 'No hay registros disponibles',
              infoFiltered: '(Filtrado de _MAX_ registros totales)',
              search: 'Filtrar:',
              paginate: {
                first: 'Primera',
                last: 'Ultima',
                next: 'Siguiente',
                previous: 'Anterior',
              },
            },
            buttons: [
              {
                extend: 'excelHtml5',
                text: '<i class="fa-solid fa-file-excel"></i> Excel',
                className: 'btn btn-sm btn-success',
              },
            ],
          });
        }, 500);
      },
      error: (error) => {
        if (error.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('isAuthenticated');
          this.router.navigate(['/login']);
          this.closeLoading();
        }
      },
    });
  }

  getUserById() {
    this.usuarioService.getUser(this.userId).subscribe((data) => {
      this.form.patchValue({
        name: data.name,
        email: data.email,
        rol_id: data.rol_id,
      });
    });
  }

  deleteUser(name: string, userId: number) {
    Swal.fire({
      title: 'Atención',
      html: `¿Está seguro que quiere eliminar el usuario: <b>${name}</b>?`,
      icon: 'warning',
      allowEscapeKey: false,
      allowOutsideClick: false,
      showDenyButton: true,
      confirmButtonText: 'Sí, Eliminar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.showLoading();

        this.usuarioService.deleteUser(userId).subscribe((data) => {
          this.showMessage('success', data.message);
          setTimeout(() => {
            this.getUsers();
          }, 1000);
        });
      }
    });
  }

  onSubmit() {
    this.showMessage();

    if (this.resetPassword) {
      this.authService
        .resetPassword(this.userId, this.form.get('password')?.value)
        .subscribe({
          next: (data) => {
            this.showMessage('success', data.message);
            setTimeout(() => {
              this.router.navigate(['index']);
            }, 1000);
          },
          error: (error) => {
            this.showMessage(
              'error',
              'Hubo un error al restablecer la contraseña, por favor inténtelo nuevamente'
            );
          },
        });
    } else if (this.isCreate) {
      this.usuarioService.createUser(this.form.value).subscribe({
        next: (data) => {
          this.closeModal();
          this.showMessage('success', data.message);
        },
        error: (error) => {
          if (
            error.error.errors.email[0] == 'The email has already been taken.'
          ) {
            this.showMessage(
              'warning',
              'Atención',
              'El correo ya se encuentra registrado en el sistema, por favor compruebe la informacion'
            );
          }
        },
      });
    } else {
      this.usuarioService
        .updateUser(this.userId, this.form.value)
        .subscribe((data) => {
          this.closeModal();
          this.showMessage('success', data.message);
        });
    }
    setTimeout(() => {
      window.location.reload();
    }, 1000);
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
}
