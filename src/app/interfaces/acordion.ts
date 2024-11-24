export interface AcordionSimple {
  id: number;
  nombre: string;
  contenido: string;
}

export interface File {
  id: number;
  tipo: string;
  nombre: string;
  url: string;
}

export interface AcordionFiles {
  id: number;
  nombre: string;
  files: File[];
}

export interface AcordionAnidadoFiles {
  id: number;
  nombre: string;
  acordion?: AcordionFiles[];
  files?: File[];
}

export interface AcordionAnidado {
  id: number;
  nombre: string;
  acordion?: AcordionAnidadoFiles[];
  files?: File[];
}
