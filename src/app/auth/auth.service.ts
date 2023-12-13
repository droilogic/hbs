import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { response } from 'express';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';


import { User } from 'src/app/interfaces/user';

@Injectable({ providedIn: 'root'})
export class AuthService {
  private backendAuthVector = "http://localhost:3333/api/auth";
  private userAuthenticated = false;
  private userId: string;
  private userName: string;
  private roleId: string;
  private userAccessLevel = 999;  // 999 means NOT LOGGED IN
  private authToken: string;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: NodeJS.Timeout;
  private users: User[] = [];
  private usersUpdated = new Subject<{ users: User[], rc: number }>();

  constructor (private http: HttpClient, private router: Router) {}

  // make token available to other modules/services
  getAuthToken() {
    return this.authToken;
  }

  // make authenticated status available to other modules/services
  getAuthStatus() {
    return this.userAuthenticated;
  }

  // make userId available to other modules/services
  getAuthUserId() {
    return this.userId;
  }

  // make userId available to other modules/services
  getAuthUserName() {
    return this.userName;
  }

  // make roleId available to other modules/services
  getAuthRoleId() {
    return this.roleId;
  }

  // make user access level available to other modules/services
  getAuthUserAccLvl() {
    return this.userAccessLevel;
  }

  // make avaiable the subject that can push auth status to other components
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }


  getUsers(itemsPerPage: number, currPage: number) {
    const qParams = `?ps=${itemsPerPage}&pg=${currPage}`;
    // no need to unsubscribe; handled by angular itself
    this.http.get<{
      msgId: string,
      msgDescr: string,
      cnt: number,
      data: any
    }>(this.backendAuthVector + qParams)
    .pipe(map((userData) => {
      return {
        users: userData.data.map(user => {
          return {
            id: user._id,
            rv: user.rv,
            email: user.email,
            pwd: user.pwd,
            role_id: user.role_id,
            name: user.name,
            phone: user.phone,
            comments: user.comments
          }
        }),
        rc: userData.cnt
      }
    }))
    .subscribe(userTransformedData => {
      this.users = userTransformedData.users;
      this.usersUpdated.next({ users: [...this.users], rc: userTransformedData.rc });
    });
  }

  getUserById(userid: string) {
    return this.http.get<{
      msgId: string,
      msgDescr: string,
      data: any
    }>(this.backendAuthVector + "/" + userid);
  }

  getUserUpdateListener() {
    return this.usersUpdated.asObservable();
  }

  addUser(user: User) {

    // console.log("AuthService.addUser.user: " + JSON.stringify(user));
    // data OK

    const userData: User = {
      "id": "",
      "rv": 0,
      "email": user.email,
      "pwd": user.pwd,
      "role_id": user.role_id,
      "name": user.name,
      "phone": user.phone,
      "comments": user.comments
    }

    return this.http.post<{
      msgId: string,
      msgDescr: string,
      data: User
    }>(this.backendAuthVector + "/signup", userData).subscribe((responseData) => {
      // using angular router to navigate to another page
      console.log(responseData);
      
      // this.router.navigate(["/signup"]);
    }, err => {
      console.log("AuthService.addUser API_ERROR: " + err);
      
      this.authStatusListener.next(false);
    });
  }

  updateUser(user: User) {
    let userData: User | FormData;

    userData = {
      id: user.id,
      rv: user.rv,
      email: user.email,
      pwd: user.pwd,
      role_id: user.role_id,
      name: user.name,
      phone: user.phone,
      comments: user.comments
    } as User;

    console.log("AuthService.updateUser.userData:");
    console.dir(userData);

    this.http.put<{
      msgId: string,
      msgDescr: string,
      data: string
    }>(this.backendAuthVector + "/" + user.id, userData).subscribe(userData => {
      // using angular router to navigate to another page
      this.router.navigate(["/user-list"]);
    });
  }

  deleteUser(id: string) {
    // superadmin cannot be deleted!
    if (id === "655dcb44623570df8d7c566d") {
      return;
    }
    return this.http.delete(this.backendAuthVector + "/" + id);
  }


  signinUser(email: string, password: string) {
    const authData = {
      email: email,
      pwd: password
    }
    this.http.post<{
      msgId: string,
      msgDescr: string,
      data: string,
      userId: string,
      userName: string,
      roleId: string,
      acclvl: number,
      expiresIn: number
    }>(this.backendAuthVector + "/signin", authData)
      .subscribe(response => {
        console.log(response);
        // data OK
        const token = response.data;
        this.authToken = token;
        this.userId = response.userId;
        this.userName = response.userName;
        this.roleId = response.roleId;
        this.userAccessLevel = response.acclvl;
        if (token) {
          const expiresInDuration = response.expiresIn;
          // save authData to browser's local storage
          const nowDTS = new Date();
          const expDTS = new Date(nowDTS.getTime() + expiresInDuration * 1000);
          this.storeAuthData(this.authToken, this.userId, this.userName, this.roleId, this.userAccessLevel, expDTS);
          // take care of the expiring timer
          this.tokenTimer = this.createAuthTimer(expiresInDuration);
          // mark user as logged in
          this.userAuthenticated = true;

          // emit that we had a login event
          this.authStatusListener.next(true);
          // this must be changed to bookings
          this.router.navigate(["/hotel-list"]);
        }
      }, err => {
        this.authStatusListener.next(false);
      });
  }

  signinUserAuto() {
    const authData = this.restoreAuthData();

    if (!authData) {
      console.log("AuthService.signinUserAuto: invalid authentication data found on local storage.");
      return;
    }
 
    const nowDTS = new Date();
    // is expiration date valid?
    const isValidDTS = nowDTS < authData.expDTS;
    if (isValidDTS) {
      console.log("AuthService.signinUserAuto: found and restored valid authenticatiob data from local storage.");
      // data OK
      this.userAuthenticated = true;
      this.authToken = authData.authToken;
      this.userId = authData.userId;
      this.userName = authData.userName;
      this.roleId = authData.roleId;
      this.userAccessLevel = authData.userAccLvl;
      // set the expiring timer (divide by 1000 because getTime returns milliseconds)
      this.tokenTimer = this.createAuthTimer((authData.expDTS.getTime() - nowDTS.getTime()) / 1000);
      // emit that we had a login event
      this.authStatusListener.next(true);
    }

  }

  signoutUser() {
    console.log("AuthService.signoutUser: Successfully signing off user: " + this.userId + " (" + this.userName + ")");
    // data OK
    
    this.authToken = null;
    this.userAuthenticated = false;
    this.userId = null;
    this.roleId = null;
    this.userAccessLevel = 999;
    console.log("AuthService.signoutUser: Signing off complete.");
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    // redirecting to our hotel list (or maybe offers?)
    this.router.navigate(["/hotel-list"]);
  }

  // methods for browser local storage handling
  private storeAuthData(token: string, userId: string, userName: string, roleId: string, userAccLvl: Number, expDts: Date) {
    // save to local storage
    localStorage.setItem("hbsAuthToken", token);
    localStorage.setItem("hbsAuthUserId", userId);
    localStorage.setItem("hbsAuthUserName", userName);
    localStorage.setItem("hbsAuthRoleId", roleId);
    localStorage.setItem("hbsAuthUserAccLvl", "" + userAccLvl);
    localStorage.setItem("hbsAuthExpDts", expDts.toISOString());
  }

  private clearAuthData() {
    // clear from local storage
    localStorage.removeItem("hbsAuthToken");
    localStorage.removeItem("hbsAuthUserId");
    localStorage.removeItem("hbsAuthUserName");
    localStorage.removeItem("hbsAuthRoleId");
    localStorage.removeItem("hbsAuthUserAccLvl");
    localStorage.removeItem("hbsAuthExpDts");
  }

  private restoreAuthData() {
    // fetch from local storage
    const authTokenFetched = localStorage.getItem("hbsAuthToken");
    const userIdFetched = localStorage.getItem("hbsAuthUserId");
    const userNameFetched = localStorage.getItem("hbsAuthUserName");
    const roleIdFetched = localStorage.getItem("hbsAuthRoleId");
    const userAccessLevelFetched = parseInt(localStorage.getItem("hbsAuthUserAccLvl"));
    const expirationDtsFetched = localStorage.getItem("hbsAuthExpDts");

    // console.log("AuthService.restoreAuthData.authTokenFetched: " + authTokenFetched);
    // console.log("AuthService.restoreAuthData.userIdFetched: " + userIdFetched);
    // console.log("AuthService.restoreAuthData.userNameFetched: " + userNameFetched);
    // console.log("AuthService.restoreAuthData.roleIdFetched: " + roleIdFetched);
    // console.log("AuthService.restoreAuthData.userAccessLevelFetched: " + userAccessLevelFetched);
    // console.log("AuthService.restoreAuthData.expirationDtsFetched: " + expirationDtsFetched);
    // data OK

    // check if we have ALL data
    if (!authTokenFetched || !userIdFetched || !userNameFetched || !roleIdFetched || Number.isNaN(userAccessLevelFetched) || !expirationDtsFetched) {
      console.log("AuthService.restoreAuthData: data is invalid.");
      return;
    }
    return {
      authToken: authTokenFetched,
      userId: userIdFetched,
      userName: userNameFetched,
      roleId: roleIdFetched,
      userAccLvl: userAccessLevelFetched,
      expDTS: new Date(expirationDtsFetched)
    }

  }

  private createAuthTimer(interval: number) {
    console.log("AuthService.createAuthTimer: setting to " + interval + "s");
    // data OK
    return setTimeout(() => {
      // force logout after timer expires
      this.signoutUser();
    }, interval * 1000);
  }

}
