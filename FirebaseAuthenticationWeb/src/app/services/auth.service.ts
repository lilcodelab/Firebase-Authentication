import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  OAuthProvider,
  User,
  createUserWithEmailAndPassword,
  deleteUser,
  getAdditionalUserInfo,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Observable, filter, map, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RegisterDto } from '../models/RegisterDto';
import { UserRole } from '../models/UserRoles';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authState = new BehaviorSubject<User | null | undefined>(undefined);

  constructor(
    private auth: Auth,
    private router: Router,
    private http: HttpClient,
    private messageService: MessageService
  ) {

    onAuthStateChanged(this.auth, (user) => {
      this.authState.next(user);
    });
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.authState.asObservable().pipe(
      filter(value => value !== undefined),
      map(user => !!user)
    );
  }

  getCurrentUserToken(): Promise<string | null> {
    const user = this.authState.value;
    if (user) {
      return user.getIdToken();
    } else {
      return Promise.resolve(null);
    }
  }

  get currentUser(): User {
    return this.authState.value!;
  }

  signupUser(user: RegisterDto): Promise<any> {
    return createUserWithEmailAndPassword(this.auth, user.email, user.password)
      .then((result) => {
        this.setUserClaim(UserRole.Customer).pipe(take(1)).subscribe(() => {
          result.user.getIdToken(true).then(() => {
            this.router.navigate(['/home']);
          });
        });
        return result.user;
      })
      .then((user) => {
        return sendEmailVerification(user);
      })
      .catch((error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message || 'Unexpected Error' });
        throw error;
      });
  }

  setUserClaim(userRole: UserRole) {
    const payload = {
      Role: userRole
    };
    return this.http.post<UserRole>(`${environment.apiUrl}/api/home/SetUserClaim`, payload);
  }

  loginUser(user: RegisterDto): Promise<any> {
    return signInWithEmailAndPassword(this.auth, user.email, user.password)
      .then(() => {
        this.router.navigate(['/home']);
      }).catch((error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message || 'Unexpected Error' });
        throw error;
      });
  }

  logout(): void {
    signOut(this.auth).then(() => {
      this.router.navigate(['/']);
    });
  }

  deleteAccount(): void {
    deleteUser(this.auth.currentUser!).then(() => {
      this.router.navigate(['/']);
    });
  }

  googleAuth() {
    return this.loginWithPopup(new GoogleAuthProvider());
  }

  microsoftAuth() {
    return this.loginWithPopup(new OAuthProvider('microsoft.com'));
  }

  loginWithPopup(provider: any) {
    return signInWithPopup(this.auth, provider).then((result) => {
      const isFirstLogin = getAdditionalUserInfo(result)?.isNewUser

      if (isFirstLogin) {
        this.setUserClaim(UserRole.Customer)
          .pipe(take(1))
          .subscribe(
            () => {
              result.user.getIdToken(true).then(() => {
                this.router.navigate(['/home']);
              });
            }
          );
      }
      else {
        this.router.navigate(['/home']);
      }
    }).catch((error) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message || 'Unexpected Error' });
      throw error;
    });
  }

  sendPasswordResetEmail(email: string) {
    sendPasswordResetEmail(this.auth, email)
      .then(() => {
        this.router.navigate(['/']);
      }).catch((error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message || 'Unexpected Error' });
        throw error;
      });
  }
}
