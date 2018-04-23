import { Component, OnInit, Input, Injector } from '@angular/core';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.scss']
})
export class QrcodeComponent implements OnInit {
  @Input() qrHash: string;

  constructor(private injector: Injector) {
    if (injector && injector.get('qrcode')) {
      this.qrHash = this.injector.get('qrcode');
    }
  }

  ngOnInit() {
  }

}
