import { Component, OnInit } from '@angular/core';
import { UbiService } from '../../services/ubi.service';

@Component({
  selector: 'tax-form',
  templateUrl: './tax-form.component.html',
  styleUrls: ['./tax-form.component.scss']
})
export class TaxFormComponent implements OnInit {

  model = {
    estimationModel: 'cubic',
    taxBracketStart: 1000000,
    taxBracketStep: 1000000,
    taxPercentStep: 1,
    amountPerAdult: 300,
    amountPerChild: 100
  };

  constructor(public ubi: UbiService) {
  }

  ngOnInit() {
    this.model.estimationModel = this.ubi.estimationModel;
    this.model.taxBracketStart = this.ubi.taxBracketStart;
    this.model.taxBracketStep = this.ubi.taxBracketStep;
    this.model.taxPercentStep = this.ubi.taxPercentStep;
    this.model.amountPerAdult = this.ubi.amountPerAdult;
    this.model.amountPerChild = this.ubi.amountPerChild;
  }

  change() {
    this.ubi.calculate(this.model);
  }
}
