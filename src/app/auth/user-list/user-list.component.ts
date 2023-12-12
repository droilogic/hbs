import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  totalUsers = 0;
  usersPerPage = 2;
  currPage = 1;
  pageSizeOptions = [2, 3, 5];
  isLoading = false;
  userAuthenticated = false;
  userLevel = 999;
  private userSubscription: Subscription;
  private authStatusSubscription: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.authService.getUsers(this.usersPerPage, this.currPage);
    this.userSubscription = this.authService.getUserUpdateListener().subscribe((userData: { users: User[], rc: number }) => {
      this.isLoading = false;
      this.users = userData.users;
      this.totalUsers = userData.rc;
    });
    // this is required to properly reflect authentication status
    // when accessing this page for the first time
    // (before subscribing to AuthStatusListener)
    this.userAuthenticated = this.authService.getAuthStatus();
    this.userLevel = this.authService.getAuthUserAccLvl();
    this.authStatusSubscription = this.authService.getAuthStatusListener().subscribe(isAuth => {
      this.userAuthenticated = isAuth;
      this.userLevel = this.authService.getAuthUserAccLvl();
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.authStatusSubscription.unsubscribe();
  }

  onDelete(userId: string) {
    this.authService.deleteUser(userId).subscribe(() => {
      this.authService.getUsers(this.usersPerPage, this.currPage);
    });
  }

  onPageChange(evt: PageEvent) {
    this.isLoading = true;
    // pageIndex is zero based
    this.currPage = evt.pageIndex + 1;
    this.usersPerPage = evt.pageSize;
    this.authService.getUsers(this.usersPerPage, this.currPage);
  }

}
