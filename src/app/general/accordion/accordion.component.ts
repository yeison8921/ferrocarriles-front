import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { Modal } from 'bootstrap';
import {
  FormGroup,
  FormArray,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { AccordionService } from './accordion.service';

export interface Category {
  name: string;
  id: number;
}

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [
    NgbAccordionModule,
    NgFor,
    NgIf,
    ReactiveFormsModule,
    NgClass,
    NgxDropzoneModule,
  ],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.css',
})
export class AccordionComponent {
  @Input() category: any;
  @Input() isAdmin: boolean = false;
  @Input() sectionId: number = 0;
  @Output() pageSelectionChanged = new EventEmitter<void>();

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private accordionService: AccordionService
  ) {
    this.form = this.fb.group({
      elements: this.fb.array([]), // Initialize empty FormArray
    });
  }

  // Get the elements FormArray
  get elements(): FormArray {
    return this.form.get('elements') as FormArray;
  }

  iconsJson: any = {
    pdf: 'fa-file-pdf',
    xls: 'fa-file-excel',
    xlsx: 'fa-file-excel',
    doc: 'fa-file-word',
    docx: 'fa-file-word',
    ppt: 'fa-file-powerpoint',
    pptx: 'fa-file-powerpoint',
    png: 'fa-image',
    jpg: 'fa-image',
    jpeg: 'fa-image',
  };

  categorySelected: Category = {
    name: '',
    id: 0,
  };

  addCategoryToForm() {
    const hiddenInput = document.getElementById(
      'hiddenField'
    ) as HTMLInputElement;

    const data = this.fb.group({
      seccion_id: [this.sectionId],
      nombre: ['', Validators.required],
      categoria_id: [hiddenInput.value, Validators.required],
    });
    this.elements.push(data);
  }

  removeCategoryForm(index: number) {
    this.elements.removeAt(index);
  }

  openModalCategories() {
    const modalElement = document.getElementById('modalCategories');
    const modalInstance = new Modal(modalElement!);
    modalInstance.show();
  }

  closeModalCategories(): void {
    const modalElement = document.getElementById('modalCategories');
    const modal = Modal.getInstance(modalElement!);
    modal?.hide();
  }

  openModalDocuments() {
    const modalElement = document.getElementById('modalDocuments');
    const modalInstance = new Modal(modalElement!);
    modalInstance.show();
  }

  closeModalDocuments(): void {
    this.resetNgxDropzone();
    const modalElement = document.getElementById('modalDocuments');
    const modal = Modal.getInstance(modalElement!);
    modal?.hide();
  }

  setCategorySelected(categoryName: string, categoryId: number) {
    this.categorySelected = { name: categoryName, id: categoryId };
    document.getElementById(
      'modalTitleCategories'
    )!.innerHTML = `AGREGAR SUBCATEGORÍAS EN <b> ${this.categorySelected.name}</b>`;
    document.getElementById(
      'modalTitleFiles'
    )!.innerHTML = `CARGAR ARCHIVOS EN <b> ${this.categorySelected.name}</b>`;

    const hiddenInputExist = document.getElementById('hiddenField');
    if (hiddenInputExist) {
      hiddenInputExist.remove();
    }

    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = 'hiddenField';
    hiddenInput.id = 'hiddenField';
    hiddenInput.value = this.categorySelected.id.toString();
    const inputHidden = document.getElementById('inputHidden');
    inputHidden?.appendChild(hiddenInput);
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

  changeCategoryName() {
    Swal.fire({
      html: `Actualizar nombre categoría:`,
      input: 'text',
      icon: 'info',
      inputValue: this.categorySelected.name,
      inputAttributes: {
        autocapitalize: 'on',
      },
      allowEscapeKey: false,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: (categoria) => {
        if (categoria == '') {
          Swal.showValidationMessage(
            `Debe diligenciar el nombre de la categoría`
          );
        } else {
          this.accordionService
            .updateCategory(this.categorySelected.id, categoria)
            .subscribe((data) => {
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

  deleteCategory() {
    Swal.fire({
      title: 'Atención',
      html: `¿Está seguro que quiere eliminar la categoría: <b>${this.categorySelected.name}</b>?`,
      icon: 'warning',
      allowEscapeKey: false,
      allowOutsideClick: false,
      showDenyButton: true,
      confirmButtonText: 'Sí, Eliminar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.showLoading();

        this.accordionService
          .deleteCategory(this.categorySelected.id)
          .subscribe((data) => {
            this.showMessage('success', data.message);
            setTimeout(() => {
              this.reloadData();
            }, 2000);
          });
      }
    });
  }

  onSubmit() {
    if (this.elements.length == 0) {
      return;
    }
    this.showLoading();
    this.accordionService
      .addMultipleCategories(this.form.value)
      .subscribe((data) => {
        this.showMessage('success', data.message);
        setTimeout(() => {
          this.closeModalCategories();
          this.reloadData();
        }, 1000);
      });
  }

  reloadData() {
    this.pageSelectionChanged.emit();
  }

  cleanForm() {
    // Clear all controls in the FormArray
    while (this.elements.length > 0) {
      this.elements.removeAt(0);
    }

    // Reset the entire form
    this.form.reset();
  }

  files: File[] = [];

  onSelect(event: any) {
    this.files.push(...event.addedFiles);
  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  resetNgxDropzone() {
    this.files = [];
  }

  deleteDocument(documentName: string, documentId: number) {
    Swal.fire({
      title: 'Atención',
      html: `¿Está seguro que quiere eliminar el archivo: <b>${documentName}</b>?`,
      icon: 'warning',
      allowEscapeKey: false,
      allowOutsideClick: false,
      showDenyButton: true,
      confirmButtonText: 'Sí, Eliminar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.showLoading();

        this.accordionService.deleteDocument(documentId).subscribe((data) => {
          this.showMessage('success', data.message);
          setTimeout(() => {
            this.reloadData();
          }, 1000);
        });
      }
    });
  }

  submitFiles() {
    if (this.files.length == 0) {
      return;
    }

    this.showLoading();

    const hiddenInput = document.getElementById(
      'hiddenField'
    ) as HTMLInputElement;

    const formData = new FormData();
    formData.append('categoria_id', hiddenInput.value);
    this.files.forEach((file) => {
      formData.append('files[]', file, file.name);
    });

    this.accordionService.addMultipleDocuments(formData).subscribe((data) => {
      this.showMessage('success', data.message);
      setTimeout(() => {
        this.closeModalDocuments();
        this.resetNgxDropzone();
        this.reloadData();
      }, 1000);
    });
  }

  downloadDocument(event: Event, filepath: string) {
    event.preventDefault();
    let categoryId = filepath.split('/')[0];
    let filename = filepath.split('/')[1];
    this.accordionService.downloadDocument(categoryId, filename).subscribe({
      next: (response: Blob) => {
        const blobUrl = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.target = '_blank';
        a.download = filename; // Customize filename if needed
        a.click();
        window.URL.revokeObjectURL(blobUrl);
      },
      error: (error) => {
        if (error.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('isAuthenticated');
        }
      },
    });
  }
}
