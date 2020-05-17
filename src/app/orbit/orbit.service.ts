import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Body } from 'src/models/body';
import { DataService } from '../data/data.service';

@Injectable({
  providedIn: 'root'
})
export class OrbitService {

  constructor(private data: DataService) { }

  public getPeriod(a: number, body: Body): number {
    return 2 * Math.PI * Math.sqrt(Math.pow(a, 3) / body.mu);
  }

  public getSmaForPeriod(period: number, body: Body): number {
    return Math.pow((body.mu * Math.pow(period, 2)) / (4 * Math.pow(Math.PI, 2)), 1 / 3);
  }

  public getSoi(body: Body): Observable<number> {
    if (!body.orbit) {
      return of(-1);
    }
    return this.data.getBody(body.orbit.ref).pipe(
      map(b => body.orbit.a * Math.pow(body.m / b.m, 2 / 5))
    );
  }

  public getResonantA(a: number, numSats: number): number[] {
    const resonant = [];
    resonant.push(a * Math.pow(1 + 1 / numSats, 2 / 3));
    resonant.push(a * Math.pow(1 - 1 / numSats, 2 / 3));
    return resonant;
  }
}
