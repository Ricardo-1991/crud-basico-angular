import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class HttpClientUserService {
  private baseUrl = 'http://localhost:3000'
  private userSubject = new BehaviorSubject<any[]>([]);
  users$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) { }
  loadUsers(): void {
     this.http.get<any>(`${this.baseUrl}/user`)
      .pipe(
        catchError(this.handleError)
      ).subscribe(users => this.userSubject.next(users));
  }

  getUsers(): Observable<any[]> {
    return this.users$;
  }

  createUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/user`, user)
      .pipe(
        tap(newUser => {
          const currentUsers = this.userSubject.getValue();
          this.userSubject.next([...currentUsers, newUser]);
        }),
        catchError(this.handleError)
      )
  }

  deleteUser(id: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/user/${id}`)
      .pipe(
        tap(() => {
          const currentUsers = this.userSubject.getValue();
          this.userSubject.next(currentUsers.filter(user => user.id !== id));
        }),
        catchError(this.handleError)
      )
  }

  updateUser(id: any, user: any): Observable<any> {
    console.log("aqui")
    return this.http.put<any>(`${this.baseUrl}/user/${id}`, user)
      .pipe(
        tap(updatedUser => {
          const currentUsers = this.userSubject.getValue();
          const index = currentUsers.findIndex(u => u.id === id);
          if (index !== -1) {
            currentUsers[index] = updatedUser;
            this.userSubject.next(currentUsers);
          }
        }),
        catchError(this.handleError)
      )
    }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
}
