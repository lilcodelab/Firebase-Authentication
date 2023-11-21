import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthTestDto } from '../models/AuthTestDto';

@Injectable({ providedIn: 'root' })
export class HomeService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<AuthTestDto> {
    return this.http.get<AuthTestDto>(`${environment.apiUrl}/api/home/GetAll`);
  }
}
