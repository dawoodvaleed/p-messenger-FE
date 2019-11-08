import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  get windowRef() {
    return window;
  }

  getDate() {
    const d = new Date()
    const month = (d.getMonth() + 1) > 9 ? (d.getMonth() + 1) : `0${(d.getMonth() + 1)}`
    const date = d.getDate() > 9 ? d.getDate() : `0${d.getDate()}`
    const hours = d.getHours() > 9 ? d.getHours() : `0${d.getHours()}`
    const minutes = d.getMinutes() > 9 ? d.getMinutes() : `0${d.getMinutes()}`
    const seconds = d.getSeconds() > 9 ? d.getSeconds() : `0${d.getSeconds()}`
    return `${d.getFullYear()}-${month}-${date} ${hours}:${minutes}:${seconds}`
  }

  generateRandom(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}

