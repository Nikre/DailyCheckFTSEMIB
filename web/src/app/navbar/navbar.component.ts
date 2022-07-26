import { Component, OnInit } from '@angular/core';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  searchedSymbol: string = ''

  constructor(private searchService: SearchService) { 

  }

  ngOnInit(): void {
  }

  searching() {

  }

}
