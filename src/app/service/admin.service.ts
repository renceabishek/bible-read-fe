import { Injectable } from '@angular/core';
import { Profile } from '../model/Profile';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DailyData } from '../model/DailyData';
import { ProfileGet } from '../model/ProfilesGet';
import { tap, catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

let header = new HttpHeaders();
    header.append('Content-Type', 'multipart/form-data');
    header.set('Accept', 'application/json');
    const options = { headers: header };

//const options = { headers: new HttpHeaders().set('Content-Type', 'multipart/form-data') };

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

  public saveProfile(profile, file): Observable<any> {

    let formdata = new FormData();
    const blobOverrides = new Blob([JSON.stringify(profile)], {
      type: 'application/json',
    });

    formdata.append('profile', blobOverrides);
    formdata.append('file', file);

  
    return this.http.post('/admin/profile', formdata, { responseType: 'text'})
  }

  public updateProfile(profile, file, uniqueId): Observable<any> {

    let formdata = new FormData();
    const blobOverrides = new Blob([JSON.stringify(profile)], {
      type: 'application/json',
    });

    formdata.append('profile', blobOverrides);
    formdata.append('file', file);

     return this.http.patch('/admin/profile/'+uniqueId, formdata,  { responseType: 'text'});
  }

  public deleteProfile(uniqueId): Observable<any> {
    return this.http.delete<any>('/admin/profile/'+uniqueId);
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
