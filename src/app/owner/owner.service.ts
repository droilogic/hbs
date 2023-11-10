import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';

import { Owner } from "../interfaces/owner";

@Injectable({ providedIn: 'root'})
export class OwnerService {
  private owners: Owner[] = [];
  private ownersUpdated = new Subject<Owner[]>();

  getOwners() {
    // return a NEW Owner array to avoid giving reference to our private object
    return [...this.owners];
  }

  getOwnerUpdateListener() {
    return this.ownersUpdated.asObservable();
  }

  addOwner(owner: Owner) {
    this.owners.push(owner);
    // update & emit new owner list
    this.ownersUpdated.next([...this.owners]);
  }
}