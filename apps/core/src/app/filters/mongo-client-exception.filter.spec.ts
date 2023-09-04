import { MongoClientExceptionFilter } from './mongo-client-exception.filter';

describe('MongoClientExceptionFilter', () => {
  it('should be defined', () => {
    expect(new MongoClientExceptionFilter()).toBeDefined();
  });
});
