import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataModel } from 'src/models/data';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Body } from '../../models/body';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  public getData() {
    return this.http.get<DataModel>('assets/data/rss.json');
  }

  public getBodies() {
    return this.getData().pipe(
      map(data => data.bodies)
    );
  }

  public getBody(body: string): Observable<Body> {
    return this.getData().pipe(
      map(data => data.bodies),
      map(bodies => bodies.filter(b => b.name === body)[0])
    );
  }
}
