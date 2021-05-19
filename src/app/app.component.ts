import { Component, OnInit, VERSION } from '@angular/core';
import { AccountService } from './core/services/account.service';
import { Observable, Subject } from 'rxjs';
import { Account, createAccount, createParamSearch } from './core/model/account.model';
import { takeUntil } from 'rxjs/operators';
import { Accounts } from './core/data/account';
import * as faker from 'faker';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  total: any;
  page: number = 1;
  typeSubmit: any = 'ADD';
  isLoading: boolean = false;
  name = 'Angular ' + VERSION.major;
  account: Account[] = [];
  unSubscribeAll: Subject<any>;
  isOpenAddAccount = false;
  isOpenEditAccount = false;
  selectedAccount: Account | undefined;
  searchStr = '';

  constructor(private accountService: AccountService) {
    // read data from file to localstorage
    this.unSubscribeAll = new Subject<any>();
    this.loadDataToLocal();
  }

  ngOnInit(): void {
    this.getAllAccount(this.page);
    this.total = localStorage.getItem('accounts')?.length
  }

  loadDataToLocal(): void {
    localStorage.setItem('accounts', JSON.stringify(Accounts));
  }


  getAllAccount(p: number): void {
    this.accountService.getAccounts(createParamSearch({
      last_name: this.searchStr,
      start: p,
      limit: 25
    }))
      .pipe(takeUntil(this.unSubscribeAll))
      .subscribe((resp: Account[]) => {
        this.isLoading = true
        this.account = resp;
      }, (err: Error) => {
        this.account = [];
      });
  }

  openAddAccount(): void {
    this.isOpenEditAccount = false;
    this.isOpenAddAccount = true;
  }

  openEdit(acc: Account): void {
    this.selectedAccount = acc;
    this.isOpenAddAccount = false;
    this.isOpenEditAccount = true;
  }

  onSubmitAdd(f: NgForm) {
    this.saveNew(f.value);
  }

  onSubmitEdit(f: NgForm) {
    this.saveEdit(f.value, this.selectedAccount?._id);
  }

  saveEdit(acc: any, id: any): void {
    const editedAccount = acc;
    // createAccount({
    //   balance: parseInt(faker.finance.amount(0, 99999), 0),
    //   age: 25,
    //   lastname: faker.name.lastName(),
    //   firstname: faker.name.lastName(),
    //   city: this.selectedAccount?.city,
    //   account_number: this.selectedAccount?.account_number,
    //   address: this.selectedAccount?.address,
    //   email: this.selectedAccount?.email,
    //   employer: this.selectedAccount?.employer,
    //   gender: 'F',
    //   state: this.selectedAccount?.state,
    //   _id: this.selectedAccount?._id
    // });

    this.accountService.editAccount(id, editedAccount)
      .pipe(takeUntil(this.unSubscribeAll))
      .subscribe((resp: Account[]) => {
        this.getAllAccount(this.page);
        this.isOpenEditAccount = false;
      }, (err: Error) => {
        this.account = [];
      });
  }

  saveNew(acc: any): void {
    const newAccount = acc;
    // createAccount({
    //   balance: parseInt(faker.finance.amount(0, 99999), 0),
    //   age: 25,
    //   lastname: faker.name.lastName(),
    //   firstname: faker.name.lastName(),
    //   city: faker.address.city(),
    //   account_number: faker.finance.account(),
    //   address: faker.address.streetAddress(),
    //   email: faker.internet.email(),
    //   employer: faker.name.lastName(),
    //   gender: 'F',
    //   state: faker.address.stateAbbr()
    // });

    this.accountService.addAccount(newAccount)
      .pipe(takeUntil(this.unSubscribeAll))
      .subscribe((resp: Account[]) => {
        this.getAllAccount(0);
        this.isOpenAddAccount = false;
      }, (err: Error) => {
        this.account = [];
      });
  }
  deleteAcc(acc: any): void {
    this.accountService.deleteAccount(acc).subscribe((res: any) => {
      this.getAllAccount(this.page)
      alert('xoa thanh cong')
    }), (err: Error) => {
      this.account = [];
    }
  }

  search(): void {
    this.getAllAccount(this.page);
  }
}
