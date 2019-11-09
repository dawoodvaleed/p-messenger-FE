import { Injectable } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';

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
    const month = (d.getUTCMonth() + 1) > 9 ? (d.getUTCMonth() + 1) : `0${(d.getUTCMonth() + 1)}`
    const date = d.getUTCDate() > 9 ? d.getUTCDate() : `0${d.getUTCDate()}`
    const hours = d.getUTCHours() > 9 ? d.getUTCHours() : `0${d.getUTCHours()}`
    const minutes = d.getUTCMinutes() > 9 ? d.getUTCMinutes() : `0${d.getUTCMinutes()}`
    const seconds = d.getUTCSeconds() > 9 ? d.getUTCSeconds() : `0${d.getUTCSeconds()}`
    return `${d.getUTCFullYear()}-${month}-${date} ${hours}:${minutes}:${seconds}`
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

@Pipe({ name: 'dateToLocal' })
export class ConvertDate implements PipeTransform {
  transform(value: string): string {
    let d = new Date(value)
    return `${d.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: '2-digit' })} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
}