import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})

export class AccountService {
  url: any = 'https://money-bee-backend.herokuapp.com/api/accounts';
  notificationSubject: any = new BehaviorSubject<any>(null);
  notification: any = this.notificationSubject.asObservable();
  errorSubject: any = new BehaviorSubject<any>(null);
  errorMessage: any = this.errorSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  postAccount(DollarInput: string, AccountType: string) {
    const jwt = sessionStorage.getItem('jwt');
    const authHeader = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwt,
      })
    };

   this.http.post(`${this.url}`, { "type": AccountType, "routingNumber": 394058927, "userId": sessionStorage.getItem('userId'), "balance": DollarInput}, authHeader).toPromise().then((res: any) => {
     if (res && res.accountNumber) {
       this.router.navigateByUrl('/dashboard');
     }
   }) .catch((err: HttpErrorResponse) => {
     this.errorSubject.next(err.error.message)
   }); 
  }

  withdraw(dollarAmount: string){
    const currentAccount = sessionStorage.getItem('accountNumber');
    const jwt = sessionStorage.getItem('jwt');
    const authHeader = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + jwt,
      })
    };

    this.http.put(`${this.url}/${currentAccount}/withdraw/${dollarAmount}`, {}, authHeader).toPromise().then((res: any) => {
      if(res.transactionType && res.dollarAmount){
        this.errorSubject.next(null);
        if(res.overDrafted == true){
          this.notificationSubject.next("You have over drafted your account and have been charged a $25 fee.");
          sessionStorage.setItem('notification', 'You have over drafted your account and have been charged a $25 fee.');
        }else{
          this.notificationSubject.next(`Your ${res.transactionType} of $${res.dollarAmount} was successful!`);
          sessionStorage.setItem('notification', `Your ${res.transactionType} of $${res.dollarAmount} was successful!`);
        }
        this.router.navigateByUrl('/dashboard');
      }
    }).catch((err: HttpErrorResponse) => {
      this.errorSubject.next(err.error.message)
    });
  }

  deposit(dollarAmount: string){
    const currentAccount = sessionStorage.getItem('accountNumber');
    const jwt = sessionStorage.getItem('jwt');
    const authHeader = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + jwt,
      })
    };
    this.http.put(`${this.url}/${currentAccount}/deposit/${dollarAmount}`, {}, authHeader).toPromise().then((res: any) => {
      if(res.transactionType && res.dollarAmount){
        this.errorSubject.next(null);
        this.notificationSubject.next(`Your ${res.transactionType} of $${res.dollarAmount} was successful!`);
        this.router.navigateByUrl('/dashboard');
      }
    }).catch((err: HttpErrorResponse) => {
      this.errorSubject.next(err.error.message)
    });
  }

  transfer(dollarAmount: string, targetAccount: number){
    const currentAccount = sessionStorage.getItem('accountNumber');
    const jwt = sessionStorage.getItem('jwt');
    const authHeader = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + jwt,
      })
    };

    if(targetAccount != 0){
      this.http.put(`${this.url}/transfer`, { "fromAccountId": currentAccount, "toAccountId": targetAccount, "dollarAmount": dollarAmount }, authHeader).toPromise().then((res: any) =>{
        if(res.transactionType && res.dollarAmount){
          this.errorSubject.next(null);
          if(res.overDrafted == true){
            this.notificationSubject.next("You have over drafted your account and have been charged a $25 fee.");
            sessionStorage.setItem('notification', 'You have over drafted your account and have been charged a $25 fee.')
          }else{
            this.notificationSubject.next(`Your ${res.transactionType} of $${res.dollarAmount} was successful!`);
            sessionStorage.setItem('notification', `Your ${res.transactionType} of $${res.dollarAmount} was successful!`);
          }
          this.router.navigateByUrl('/dashboard');
        }
      }).catch((err: HttpErrorResponse) => {
        this.errorSubject.next(err.error.message)
      });
    }else{
      this.errorSubject.next("Account not selected")
    }
  }

  delete(accountNumber: string) {
    const jwt = sessionStorage.getItem('jwt');
    const authHeader = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + jwt,
      })
    };
    this.http.delete(`${this.url}/${accountNumber}`, authHeader).toPromise().then((res: any) =>{
      if (res) {
        this.notificationSubject.next(sessionStorage.getItem('notification'));
        this.router.navigateByUrl('/dashboard');
      }
    }) .catch((err: HttpErrorResponse) => {
      this.errorSubject.next(err.error.message)
    });   
    }
  }
