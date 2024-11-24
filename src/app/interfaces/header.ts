export interface Menu {
  id: number;
  nombre: string;
  url: string;
  urlactive?: boolean;
  icono?: string;
  active: boolean;
  submenu?: Menu[];
}
