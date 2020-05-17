import { Component, OnInit } from '@angular/core';
import { DataService } from '../data/data.service';
import { Body } from 'src/models/body';
import { Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { BodyService } from '../body/body.service';

@Component({
  selector: 'astro-resonance',
  templateUrl: './resonance.component.html',
  styleUrls: ['./resonance.component.scss']
})
export class ResonanceComponent implements OnInit {

  public bodies$: Observable<Body[]>;
  public form: FormGroup;

  public body: Body;
  public minLos: number;
  public altitude: number;
  public viewbox = 1000;
  public orbitColor = 'blue';
  public satPositions: [number, number][] = [];
  public connections: [number, number][] = [];

  constructor(private data: DataService, private bodyService: BodyService) { }

  ngOnInit() {
    this.createForm();
    this.bodies$ = this.data.getBodies();
    this.form.valueChanges.subscribe(() => this.onValueChanges());
  }

  public useStationary() {
    if (this.body) {
      this.form.get('alt').setValue((this.bodyService.getStationarySma(this.body) - this.body.r) / 1000);
    }
  }

  private createForm() {
    this.form = new FormGroup({
      body: new FormControl(null),
      size: new FormControl(4),
      alt: new FormControl(0)
    });
  }

  private onValueChanges() {
    this.data.getBody(this.form.get('body').value).subscribe(body => {
      const size = this.form.get('size').value;
      this.body = body;
      this.minLos = this.bodyService.minLos(body, size) / this.body.r * 100;
      this.altitude = (this.form.get('alt').value * 1000 + body.r) / this.body.r * 100;
      this.orbitColor = this.altitude > this.minLos ? 'blue' : 'red';
      this.viewbox = (Math.max(this.minLos, 100, this.altitude) * 2 + 100);
      this.calcSatPositions();
      this.connLines();
    });
  }

  private calcSatPositions() {
    const center = this.viewbox / 2;
    const alt = this.altitude;
    const size = this.form.get('size').value;
    this.satPositions = [];
    for (let i = 0; i < this.form.get('size').value; i++) {
      this.satPositions.push([
        center - alt * Math.cos(i * 2 * Math.PI / size),
        center + alt * Math.sin(i * 2 * Math.PI / size)
      ]);
    }
  }

  private connLines() {
    this.connections = [];
    const center = this.viewbox / 2;
    for (let i = 0; i < this.satPositions.length - 1; i++) {
      for (let j = i + 1; j < this.satPositions.length; j++) {
        const sat1 = this.satPositions[i];
        const sat2 = this.satPositions[j];
        const y1 = center - sat1[0];
        const x1 = sat1[1] - center;
        const y2 = center - sat2[0];
        const x2 = sat2[1] - center;
        const c = Math.sqrt(Math.pow(this.altitude, 2) - (0.25 * (Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))));
        if (c > 100) {
          this.connections.push([i, j]);
        }
      }
    }
  }

}
