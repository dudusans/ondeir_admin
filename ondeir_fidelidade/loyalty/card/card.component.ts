import { Component, OnInit, Injector, ViewChild, ElementRef, HostListener } from '@angular/core';

import { LoyaltyEntity } from '../../../ondeir_admin_shared/models/loyalty/loyalty';
import { LoyaltyProgramEntity } from '../../../ondeir_admin_shared/models/loyalty/loyaltyProgram';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @ViewChild('container') div: ElementRef;

  loyalty: LoyaltyEntity;
  program: LoyaltyProgramEntity;
  pointsBox: Array<number>;
  boxWidth: number = 0;

  constructor(private injector: Injector) {
    this.loyalty = this.injector.get("loyalty");
    this.program = this.injector.get("program");
  }

  ngOnInit() {
    this.createBoxes();
  }

  onResize(event) {
    this.createBoxes();
  }

  createBoxes() {
    this.pointsBox = new Array<number>();

    for (let i = 0; i < this.loyalty.usageType.usageGoal; i++) {
      if (this.program && i < this.program.Points.length) {
        this.pointsBox.push(-1);
      } else {
        this.pointsBox.push(i);
      }
    }

    if (this.loyalty.usageType.usageGoal > 6) {
      this.boxWidth = (this.div.nativeElement.offsetWidth - 30) / 6;
    } else {
      this.boxWidth = (this.div.nativeElement.offsetWidth - 30) / this.loyalty.usageType.usageGoal;
    }
  }
}
