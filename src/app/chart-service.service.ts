import { Injectable } from '@angular/core';
import { TotalCounts } from '../app/model/TotalCounts'
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { DailyData } from './model/DailyData';

@Injectable({
  providedIn: 'root'
})
export class ChartServiceService {
  

  constructor(private http: HttpClient) { }

  public getTotalCounts(): Observable<TotalCounts[]> {
    console.log("in service");
    var get=this.http.get<TotalCounts[]>('/bible/totalCounts');
    console.log("after serve");
    return get;
  }

  public viewBibleInfo(): Observable<DailyData[]> {
    return this.http.get<DailyData[]>('/bible/all');
  }
}

