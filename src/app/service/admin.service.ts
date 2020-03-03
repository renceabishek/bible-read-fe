import { Injectable } from '@angular/core';
import { Participants } from '../model/Participants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
}
