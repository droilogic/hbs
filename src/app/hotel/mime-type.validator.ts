import { AbstractControl } from "@angular/forms";
import { Observable, Observer, of } from "rxjs";

export const mimeType = (ctrl: AbstractControl): Promise<{[key: string]: any}> | Observable<{[key: string]: any}> => {
  // check if ctrl contains a string (in case of update and no change on image)
  if (typeof(ctrl.value) === "string") {
    // immediately return an observable
    return of(null);
  }
  const file = ctrl.value as File;
  const fileReader = new FileReader();
  //const frObs = Observable.create((obs: Observer<{[key: string]: any}>) => {
  const frObs = new Observable((obs: Observer<{[key: string]: any}>) => {
      fileReader.addEventListener("loadend", () => {
      const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
      let header = "";
      let isValid = false;
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16);
      }
      switch (header) {
        case "89504e47":
          // png
          isValid = true;
          break;
        case "ffd8ffe0":
        case "ffd8ffe1":
        case "ffd8ffe2":
        case "ffd8ffe3":
        case "ffd8ffe8":
        case "ffd8ffdb":
          // jpg family
          isValid = true;
          break;
        default:
          isValid = false; // Or you can use the blob.type as fallback
          break;
      }
      if (isValid) {
        obs.next(null);
      } else {
        obs.next({invalidMimeType: true});
      }
      obs.complete();
  });
    fileReader.readAsArrayBuffer(file);
  });

  return frObs;
};