import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  selectedSymbol: string = ''

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.selectedSymbol = params['simbolo'];
    });
  }

  ngOnInit(): void {
  }

}
