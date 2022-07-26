import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  searchedSymbol: string = '';

  constructor() { }
}
