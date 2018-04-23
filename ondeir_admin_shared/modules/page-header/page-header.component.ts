import { Component, OnInit, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    selector: 'app-page-header',
    templateUrl: './page-header.component.html',
    styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit {
    @Input() heading: string;
    @Input() icon: string;
    @Input() canGoBack: boolean = false;

    constructor(private location: Location) {}

    ngOnInit() {}

    goBack() {
      this.location.back();
    }
}
