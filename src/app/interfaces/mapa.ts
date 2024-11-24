interface pagina {
  id: number;
  name: string;
  url: string;

}
interface paginas {
  id: number;
  name: string;
  url: string;
  pagina?: pagina[];
}

export interface mapa {
  id:number;
  name: string;
  url: string;
  paginas: paginas[];
}
