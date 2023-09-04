import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

type FormatOptions = 'ms' | 'seconds' | 'timestamp'

@Injectable()
export class DateUtilsService {
  constructor() {
    dayjs.extend(utc);
  }

  now<T>(unit: FormatOptions = 'timestamp') {
    return this._formatDate(dayjs(), unit) as T;
  }

  private _formatDate<T>(
    dateObject: dayjs.Dayjs,
    unit: FormatOptions
  ): string | number {
    switch (unit) {
      case 'timestamp':
        return dateObject.toISOString();
      case 'ms':
        return dateObject.valueOf();
      case 'seconds':
        return dateObject.unix();
      default:
        return dateObject.toISOString();
    }
  }
}
