import { Injectable } from '@nestjs/common';
import omit from 'lodash.omit'
import pick from 'lodash.pick'

@Injectable()
export class CommonUtilsService {
  wait(timeout = 1000) {
    return new Promise((res) => {
      setTimeout(() => res(null), timeout);
    });
  }

  deleteProperties<T extends object>(object: T, properties: Array<keyof T>) {
    return omit(object, properties)
  }

  getProperties<T extends object>(object: T, properties: Array<keyof T>) {
    return pick(object, properties)
  }
}
