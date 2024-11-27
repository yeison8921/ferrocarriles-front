import { Component } from '@angular/core';
import { UsuarioService } from './usuario.service';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../../auth/login/auth.service';
import { Router } from '@angular/router';

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
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css',
})
export class UsuarioComponent {
  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      rol_id: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  form: FormGroup;

  isCreate: boolean = true; //true => create, false => edit
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
        this.router.navigate(['entidad/informacion-general']);
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
    if (this.isCreate) {
      passwordControl?.setValidators([
        Validators.required,
        Validators.minLength(8),
      ]);
    } else {
      passwordControl?.clearValidators();
    }
    passwordControl?.updateValueAndValidity();
  }

  getUsers() {
    this.usuarioService.getUsers().subscribe((data) => {
      this.users = data;

      // if ($.fn.dataTable.isDataTable('#usersTable')) {
      //   $('#usersTable').DataTable().destroy();
      // }

      // setTimeout(() => {
      //   $('#usersTable').DataTable();
      // }, 1000);
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
    if (this.isCreate) {
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
      this.getUsers();
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
