import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
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
export class UsuarioComponent implements AfterViewInit {
  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.email],
      rol_id: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  form: FormGroup;

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

  ngAfterViewInit(): void {
    // $('#example').DataTable({
    //   paging: true,
    //   searching: true,
    //   ordering: true,
    //   info: true,
    // });
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
    this.usuarioService.getRoles().subscribe((data) => {
      this.roles = data.data;
    });
    this.getUsers();
  }

  getUsers() {
    this.usuarioService.getUsers().subscribe((data) => {
      if ($.fn.DataTable.isDataTable('#usersTable')) {
        $('#usersTable').DataTable().clear().destroy();
      }
      this.users = data;
      setTimeout(() => {
        $('#usersTable').DataTable();
      }, 1000);

      // setTimeout(() => {
      //   this.cdRef.detectChanges();
      // }, 1000);
      // setTimeout(() => {
      // }, 1000);
    });
  }

  getUserById() {
    this.usuarioService.getUser(this.userId).subscribe((data) => {
      this.user = data;
    });
  }

  onSubmit() {
    this.showMessage();
    this.usuarioService.createUser(this.form.value).subscribe((data) => {
      this.showMessage('success', data.message);
      this.closeModal();

      this.getUsers();
      // setTimeout(() => {
      // }, 1000);
    });
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
