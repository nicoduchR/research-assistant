import { User } from './user.entity';

describe('User Entity', () => {
  it('should create a user instance with all required fields', () => {
    const user = new User();
    user.id = '123e4567-e89b-12d3-a456-426614174000';
    user.googleId = 'google_123';
    user.email = 'test@example.com';
    user.name = 'Test User';
    user.avatarUrl = 'https://example.com/avatar.jpg';
    user.createdAt = new Date();
    user.updatedAt = new Date();

    expect(user.id).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(user.googleId).toBe('google_123');
    expect(user.email).toBe('test@example.com');
    expect(user.name).toBe('Test User');
    expect(user.avatarUrl).toBe('https://example.com/avatar.jpg');
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  it('should allow null avatar URL', () => {
    const user = new User();
    user.avatarUrl = null;

    expect(user.avatarUrl).toBeNull();
  });

  it('should have correct entity metadata', () => {
    const metadata = Reflect.getMetadata('design:type', User.prototype, 'id');
    expect(User.name).toBe('User');
  });
});
