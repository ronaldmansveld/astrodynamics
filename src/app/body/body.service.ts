import { Injectable } from '@angular/core';
import { Body } from '../../models/body';
import { OrbitService } from '../orbit/orbit.service';

@Injectable({
  providedIn: 'root'
})
export class BodyService {

  constructor(private orbit: OrbitService) { }

  public minLos(body: Body, numSat: number): number {
    return body.r / Math.cos(Math.PI / numSat);
  }

  public getRotationPeriod(body: Body) {
    if (body.tl) {
      return this.orbit.getPeriod(body.orbit.a, body);
    } else {
      return body.rot;
    }
  }

  public getStationarySma(body: Body) {
    return this.orbit.getSmaForPeriod(this.getRotationPeriod(body), body);
  }
}
