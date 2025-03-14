import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class HttpClientZipCodeService {
  private baseUrl = 'https://viacep.com.br/ws'
  constructor(private http: HttpClient) { }

  getZipCode(cep: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${cep}/json/`)
      .pipe(
        map(response => response),
        catchError(this.handleError)
      )
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
}
