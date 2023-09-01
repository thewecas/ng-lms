import { AuthErrorPipe } from './auth-error.pipe';

describe('AuthErrorPipe', () => {
  it('create an instance', () => {
    const pipe = new AuthErrorPipe();
    expect(pipe).toBeTruthy();
  });
});
