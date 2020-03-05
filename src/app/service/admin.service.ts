import { Injectable } from '@angular/core';
import { Participants } from '../model/Participants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DailyData } from '../model/DailyData';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  public getParticipantsInfo(): Observable<Participants[]> {
    return this.http.get<Participants[]>('/admin/participants/all');
  }

  public postParticipantsInfo(name, file) {
    return this.http.post<any>('/admin/participants/admin', { name: name, file: file })
    .subscribe(data => {
    })
  }

  public viewBibleInfo(): Observable<DailyData[]> {
    return this.http.get<DailyData[]>('/bible/all');
  }

  public postBibleInfo(dailyData): Observable<any> {
   return this.http.post('/bible/all', dailyData,  { responseType: 'text'});
  }

  public deleteBibleInfo(uniqueId): Observable<any> {
    return this.http.delete<any>('/bible/date/'+uniqueId);
  }
}
