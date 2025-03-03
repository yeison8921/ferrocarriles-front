import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { Modal } from 'bootstrap';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { DirectorioService } from './directorio.service';
import { Router } from '@angular/router';

export interface Category {
  name: string;
  id: number;
}

@Component({
  selector: 'app-directorio',
  standalone: true,
  imports: [NgbAccordionModule, NgFor, NgIf, ReactiveFormsModule, NgClass],
  templateUrl: './directorio.component.html',
  styleUrl: './directorio.component.css',
})
export class DirectorioComponent {
  @Input() area: any;
  @Input() isAdmin!: boolean;
  @Output() pageSelectionChanged = new EventEmitter<void>();

  form: FormGroup;

  isCreate: boolean = true; //true => create, false => edit
  funcionarioId: number = 0;
  areaId: number = 0;

  constructor(
    private fb: FormBuilder,
    private directorioService: DirectorioService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      cargo: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      ubicacion: ['', Validators.required],
      ciudad: ['', Validators.required],
      telefono: ['', Validators.required],
      area_id: [''],
    });
  }

  deleteFuncionario(name: string, funcionarioId: number) {
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

        this.directorioService
          .deleteFuncionario(funcionarioId)
          .subscribe((data) => {
            this.showMessage('success', data.message);
            setTimeout(() => {
              this.reloadData();
            }, 1000);
          });
      }
    });
  }

  deleteArea(areaName: string, areaId: number) {
    Swal.fire({
      title: 'Atención',
      html: `¿Está seguro que quiere eliminar el área: <b>${areaName}</b>?`,
      icon: 'warning',
      allowEscapeKey: false,
      allowOutsideClick: false,
      showDenyButton: true,
      confirmButtonText: 'Sí, Eliminar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.showLoading();

        this.directorioService.deleteArea(areaId).subscribe((data) => {
          this.showMessage('success', data.message);
          setTimeout(() => {
            this.reloadData();
          }, 1000);
        });
      }
    });
  }

  changeAreaName(areaName: string, areaId: number) {
    Swal.fire({
      html: `Actualizar nombre área:`,
      input: 'text',
      icon: 'info',
      inputValue: areaName,
      inputAttributes: {
        autocapitalize: 'on',
      },
      allowEscapeKey: false,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: (area) => {
        if (area == '') {
          Swal.showValidationMessage(`Debe diligenciar el nombre del área`);
        } else {
          this.directorioService.updateArea(areaId, area).subscribe((data) => {
            this.showMessage('success', data.message);
            setTimeout(() => {
              this.reloadData();
            }, 2000);
          });
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  }

  reloadData() {
    this.pageSelectionChanged.emit();
  }

  resetForm() {
    this.form.reset();
  }

  openModalFuncionarios() {
    const modalElement = document.getElementById('modalFuncionarios');
    const modalInstance = new Modal(modalElement!);
    modalInstance.show();
  }

  closeModalFuncionarios(): void {
    const modalElement = document.getElementById('modalFuncionarios');
    const modal = Modal.getInstance(modalElement!);
    modal?.hide();
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

  getFuncionario() {
    this.directorioService
      .getFuncionario(this.funcionarioId)
      .subscribe((data) => {
        this.form.patchValue({
          area_id: data.area_id,
          nombre: data.nombre,
          cargo: data.cargo,
          correo: data.correo,
          ubicacion: data.ubicacion,
          ciudad: data.ciudad,
          telefono: data.telefono,
        });
      });
  }

  onSubmit() {
    if (this.isCreate) {
      this.form.patchValue({ area_id: this.areaId });
      this.directorioService.addFuncionario(this.form.value).subscribe({
        next: (data) => {
          this.showMessage('success', data.message);
          setTimeout(() => {
            this.closeModalFuncionarios();
            this.reloadData();
          }, 1000);
        },
        error: (error) => {
          if (error.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('isAuthenticated');
            this.router.navigate(['/login']);
          } else {
            this.showMessage(
              'error',
              'Ha ocurrido un error al guardar la información, por favor inténtelo de nuevo'
            );
          }
        },
      });
    } else {
      this.directorioService
        .updateFuncionario(this.funcionarioId, this.form.value)
        .subscribe({
          next: (data) => {
            this.showMessage('success', data.message);
            setTimeout(() => {
              this.closeModalFuncionarios();
              this.reloadData();
            }, 1000);
          },
          error: (error) => {
            if (error.status === 401) {
              localStorage.removeItem('token');
              localStorage.removeItem('isAuthenticated');
              this.router.navigate(['/login']);
            } else {
              this.showMessage(
                'error',
                'Ha ocurrido un error al guardar la información, por favor inténtelo de nuevo'
              );
            }
          },
        });
    }
  }
}
