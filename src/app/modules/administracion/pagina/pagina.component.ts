import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormsModule,
  FormGroup,
  FormArray,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PaginaService } from './pagina.service';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { AccordionComponent } from '../../../general/accordion/accordion.component';
import { DirectorioComponent } from '../../../general/directorio/directorio.component';
import { Modal } from 'bootstrap';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {
  ClassicEditor,
  Bold,
  Essentials,
  Italic,
  Mention,
  Paragraph,
  Undo,
  Image,
  Alignment,
  List,
  Indent,
  Heading,
  Table,
  Link,
  AutoLink,
} from 'ckeditor5';
import { AccordionService } from '../../../general/accordion/accordion.service';

interface Page {
  value: number;
  viewValue: string;
}
export interface Category {
  name: string;
  id: number;
}

@Component({
  selector: 'app-pagina',
  standalone: true,
  imports: [
    NgbAccordionModule,
    AccordionComponent,
    DirectorioComponent,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    NgFor,
    NgIf,
    NgClass,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './pagina.component.html',
  styleUrl: './pagina.component.css',
})
export class PaginaComponent {
  form: FormGroup;
  formArea: FormGroup;

  constructor(
    private paginaService: PaginaService,
    private fb: FormBuilder,
    private accordionService: AccordionService,
    private router: Router
  ) {
    this.form = this.fb.group({
      elements: this.fb.array([]), // Initialize empty FormArray
    });

    this.formArea = this.fb.group({
      nombre: ['', Validators.required],
      directorio_id: [''],
    });
  }

  resetFormArea() {
    this.formArea.reset();
  }

  ngOnInit(): void {
    this.paginaService.getSelectPages().subscribe({
      next: (data) => {
        console.log(data);
        this.pages = data.data;
      },
      error: (error) => {
        if (error.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('isAuthenticated');
          this.router.navigate(['/login']);
        }
      },
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

  // Get the elements FormArray
  get elements(): FormArray {
    return this.form.get('elements') as FormArray;
  }

  addCategoryToForm() {
    const data = this.fb.group({
      seccion_id: [this.sectionId],
      nombre: ['', Validators.required],
      categoria_id: [null],
    });
    this.elements.push(data);
  }

  removeCategoryForm(index: number) {
    this.elements.removeAt(index);
  }
  pages: Page[] = [];
  page: number = 0;
  sectionId: number = 0;
  categoriasForm: any[] = [];
  sections: any[] = [];
  areas: any[] = [];
  directorioId: number = 0;

  categorySelected: Category = {
    name: '',
    id: 0,
  };

  public editorContent: string = '';

  public Editor = ClassicEditor;
  public config = {
    toolbar: [
      'undo',
      'redo',
      '|',
      'bold',
      'italic',
      'heading',
      '|',
      'alignment:left',
      'alignment:right',
      'alignment:center',
      'alignment:justify',
      '|',
      'bulletedList',
      'numberedList',
      'todoList',
      'outdent',
      'indent',
      '|',
      'insertTable',
      '|',
      'link',
    ],
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
    },
    image: {
      toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side'],
    },
    simpleUpload: {
      uploadUrl: 'YOUR_IMAGE_UPLOAD_URL', // Replace with your API endpoint for image upload
    },
    plugins: [
      Bold,
      Essentials,
      Italic,
      Mention,
      Paragraph,
      Undo,
      Image,
      Alignment,
      List,
      Indent,
      Heading,
      Table,
      Link,
      AutoLink,
    ],
    // mention: {
    //     Mention configuration
    // }
  };

  closeLoading() {
    Swal.close();
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

  onPageSelectionChange() {
    this.showLoading();
    this.paginaService.getPage(this.page).subscribe((data) => {
      if (this.page > 0 && this.page <= 6) {
        this.editorContent = data.contenido;
      }
      if (this.page >= 7 && this.page <= 12) {
        this.sections = data.secciones;
        this.sectionId = this.sections[0]['id'];
      }
      if (this.page == 13) {
        this.directorioId = data.directorios[0].id;
        this.areas = data.directorios[0].areas;
      }
      this.closeLoading();
    });
  }

  onSubmit() {
    this.showLoading();
    let json = {
      contenido: this.editorContent,
    };
    this.paginaService.updatePage(this.page, json).subscribe((data) => {
      this.showMessage('success', data.message);
      this.page = 0;
    });
  }

  onSubmitCatergorias() {
    this.showLoading();
    this.accordionService
      .addMultipleCategories(this.form.value)
      .subscribe((data) => {
        this.showMessage('success', data.message);
        setTimeout(() => {
          this.closeModalCategoriesPrincipal();
          this.cleanForm();
          this.onPageSelectionChange();
        }, 2000);
      });
  }

  cleanForm() {
    // Clear all controls in the FormArray
    while (this.elements.length > 0) {
      this.elements.removeAt(0);
    }

    // Reset the entire form
    this.form.reset();
  }

  openModalCategoriesPrincipal() {
    const modalElement = document.getElementById('modalCategoriaPrincipal');
    const modalInstance = new Modal(modalElement!);
    modalInstance.show();
  }

  closeModalCategoriesPrincipal(): void {
    const modalElement = document.getElementById('modalCategoriaPrincipal');
    const modal = Modal.getInstance(modalElement!);
    modal?.hide();
  }

  openModalArea() {
    const modalElement = document.getElementById('modalArea');
    const modalInstance = new Modal(modalElement!);
    modalInstance.show();
  }

  closeModalArea(): void {
    const modalElement = document.getElementById('modalArea');
    const modal = Modal.getInstance(modalElement!);
    modal?.hide();
  }

  setCurrentCategory(categoryName: string, categoryId: number) {
    this.categorySelected.name = categoryName;
    this.categorySelected.id = categoryId;
  }

  updateCurrentCategory(categoryName: string, categoryId: number) {
    this.categorySelected.name = categoryName;
    this.categorySelected.id = categoryId;
  }

  onSubmitArea() {
    this.formArea.patchValue({ directorio_id: this.directorioId });

    this.paginaService.addArea(this.formArea.value).subscribe((data) => {
      this.showMessage('success', data.message);
      setTimeout(() => {
        this.closeModalArea();
        this.onPageSelectionChange();
      }, 1000);
    });
  }
}
