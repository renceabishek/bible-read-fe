import { Injectable } from '@angular/core';
import { Profile } from '../model/Profile';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DailyData } from '../model/DailyData';
import { ProfileGet } from '../model/ProfilesGet';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  public getProfiles(): Observable<ProfileGet[]> {
    return this.http.get<ProfileGet[]>('/admin/profile/all');
  }

  public getProfile(uniqueId): Observable<Profile> {
    return this.http.get<Profile>('/admin/profile/'+uniqueId);
  }

  public saveProfile(profile): Observable<any> {
    return this.http.post('/admin/profile', profile, { responseType: 'text'})
  }

  public updateProfile(profile, uniqueId) {
    return this.http.put('/admin/profile'+uniqueId, profile,  { responseType: 'text'})
    .subscribe(data => {
    })
  }

  public viewBibleInfo(): Observable<DailyData[]> {
    return this.http.get<DailyData[]>('/bible/all');
  }

  public postBibleInfo(dailyData): Observable<any> {
   return this.http.post('/bible/all', dailyData,  { responseType: 'text'});
  }

  public putBibleInfo(dailyData, uniqueId): Observable<any> {
   return this.http.put('/bible/all/'+uniqueId, dailyData,  { responseType: 'text'});
  }

  public deleteBibleInfo(uniqueId): Observable<any> {
    return this.http.delete<any>('/bible/date/'+uniqueId);
  }
}
