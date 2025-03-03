import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
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
  @Output() onGetFuncionario = new EventEmitter<number>();
  @Output() onResetFormFuncionario = new EventEmitter<number>();
  @Output() onOpenModalFuncionarios = new EventEmitter<void>();

  funcionarioId: number = 0;

  constructor(
    private directorioService: DirectorioService,
    private router: Router
  ) {}

  openModalFuncionarios() {
    this.onOpenModalFuncionarios.emit();
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

        this.directorioService.deleteFuncionario(funcionarioId).subscribe({
          next: (data) => {
            this.showMessage('success', data.message);
            setTimeout(() => {
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
                'Ha ocurrido un error al eliminar el funcionario, por favor inténtelo de nuevo'
              );
            }
          },
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

        this.directorioService.deleteArea(areaId).subscribe({
          next: (data) => {
            this.showMessage('success', data.message);
            setTimeout(() => {
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
                'Ha ocurrido un error al eliminar el área, por favor inténtelo de nuevo'
              );
            }
          },
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
          this.directorioService.updateArea(areaId, area).subscribe({
            next: (data) => {
              this.showMessage('success', data.message);
              setTimeout(() => {
                this.reloadData();
              }, 2000);
            },
            error: (error) => {
              if (error.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('isAuthenticated');
                this.router.navigate(['/login']);
              } else {
                this.showMessage(
                  'error',
                  'Ha ocurrido un error al actualizar la información, por favor inténtelo de nuevo'
                );
              }
            },
          });
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  }

  reloadData() {
    this.pageSelectionChanged.emit();
  }

  resetForm(areaId: number) {
    this.onResetFormFuncionario.emit(areaId);
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
    this.onGetFuncionario.emit(this.funcionarioId);
  }
}
