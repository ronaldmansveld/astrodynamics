import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Body } from 'src/models/body';
import { BodyService } from '../body/body.service';
import { DataService } from '../data/data.service';
import { OrbitService } from '../orbit/orbit.service';

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
  public altitude = 0;
  public viewbox = 1000;
  public orbitColor = 'blue';
  public satPositions: [number, number][] = [];
  public connections: [number, number][] = [];
  public resonants: { regular?: [number, number], dive?: [number, number] } = {};
  public resonantData: [number, number] = [0, 0];

  constructor(private data: DataService, private bodyService: BodyService, private orbit: OrbitService) { }

  ngOnInit() {
    this.createForm();
    this.bodies$ = this.data.getBodies();
    this.form.valueChanges.subscribe(() => this.onValueChanges());
  }

  public useStationary() {
    if (this.body) {
      this.form.get('alt').setValue(Math.round((this.bodyService.getStationarySma(this.body) - this.body.r)) / 1000);
    }
  }

  public useLOS() {
    if (this.body) {
      this.form.get('alt').setValue(Math.ceil((this.bodyService.minLos(this.body, this.form.get('size').value) - this.body.r) / 1000));
    }
  }

  public get satPeriod(): string {
    const t = this.orbit.getPeriod(this.altitude, this.body);
    return this.formatTime(t);
  }

  public get launcherPeriod(): string {
    const t = this.orbit.getPeriod(this.resonantData[0], this.body);
    return this.formatTime(t);
  }

  public get resonant(): [number, number] {
    return this.resonants[this.form.get('useDive').value ? 'dive' : 'regular'];
  }

  public get satDeltaV(): number {
    const vsat = Math.sqrt(this.body.mu * ((2 / (this.altitude)) - (1 / (this.altitude))));
    const vlan = Math.sqrt(this.body.mu * ((2 / (this.altitude)) - (1 / (this.resonantData[0]))));
    return Math.abs(vsat - vlan);
  }

  public normalize(v: number): number {
    return (v / this.body.r) * 100;
  }

  private formatTime(t: number): string {
    const h = Math.floor(t / 3600);
    t = t % 3600;
    const m = Math.floor(t / 60);
    t = Math.round((t % 60) * 100) / 100;
    let ret = t < 10 ? '0' + t : t;
    ret = (m < 10 ? '0' + m : m) + ':' + ret;
    return h + ':' + ret;
  }

  private createForm() {
    this.form = new FormGroup({
      body: new FormControl(null),
      size: new FormControl(4),
      alt: new FormControl(0),
      useDive: new FormControl(false)
    });
  }

  private onValueChanges() {
    this.data.getBody(this.form.get('body').value).subscribe(body => {
      const size = this.form.get('size').value;
      this.body = body;
      this.minLos = this.bodyService.minLos(body, size);
      this.updateViewbox();
      if (body && this.form.get('alt').value > 0) {
        this.altitude = (this.form.get('alt').value * 1000 + body.r);
        this.orbitColor = this.altitude > this.minLos && this.altitude > this.body.atm ? 'blue' : 'red';
        this.calcSatPositions();
        this.connLines();
        this.getResonance();
      }
    });
  }

  private updateViewbox() {
    const params = [this.minLos, this.body.r, this.altitude];
    if (this.resonantData && this.resonantData[0]) {
      params.push(this.resonantData[0] + Math.sqrt(Math.pow(this.resonantData[0], 2) - Math.pow(this.resonantData[1], 2)));
    }
    this.viewbox = (Math.max(...params) * 1.1);
  }

  private getResonance() {
    this.resonants = {};
    const resonantAs = this.orbit.getResonantA(this.altitude, this.form.get('size').value);
    if (resonantAs[1] > this.body.atm) {
      this.resonants.dive = [this.altitude, resonantAs[1]];
    }
    if (this.body.name !== 'Sun') {
      this.bodyService.getSoi(this.body).subscribe(soi => {
        if (soi > resonantAs[0]) {
          this.resonants.regular = [resonantAs[0], this.altitude];
        }
        this.drawResonanceOrbit();
      });
    } else {
      this.resonants.regular = [resonantAs[0], this.altitude];
      this.drawResonanceOrbit();
    }
  }

  private drawResonanceOrbit() {
    const orbitData = this.resonants[this.form.get('useDive').value ? 'dive' : 'regular'];
    const apo = orbitData[0];
    const peri = orbitData[1];
    const sma = this.orbit.getSemiMajorAxis(apo, peri);
    const smi = this.orbit.getSemiMinorAxis(sma, peri);
    this.resonantData = [sma, smi];
    this.updateViewbox();
  }

  private calcSatPositions() {
    const center = 0;
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
    const center = 0;
    for (let i = 0; i < this.satPositions.length - 1; i++) {
      for (let j = i + 1; j < this.satPositions.length; j++) {
        const sat1 = this.satPositions[i];
        const sat2 = this.satPositions[j];
        const y1 = center - sat1[0];
        const x1 = sat1[1] - center;
        const y2 = center - sat2[0];
        const x2 = sat2[1] - center;
        const c = Math.sqrt(Math.pow(this.altitude, 2) - (0.25 * (Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))));
        if (c > this.body.r) {
          this.connections.push([i, j]);
        }
      }
    }
  }

}
