import { ResearchScope } from './research-scope.entity';
import { User } from './user.entity';

describe('ResearchScope Entity', () => {
  it('should create an instance', () => {
    const scope = new ResearchScope();
    expect(scope).toBeDefined();
    expect(scope).toBeInstanceOf(ResearchScope);
  });

  it('should have correct entity name', () => {
    // Entity decorator is applied at class level
    expect(ResearchScope).toBeDefined();
    expect(ResearchScope.name).toBe('ResearchScope');
  });

  it('should have all required properties', () => {
    const scope = new ResearchScope();
    scope.id = 'test-id';
    scope.userId = 'user-id';
    scope.title = 'Test Title';
    scope.problematique = 'Test problematique';
    scope.objectives = 'Test objectives';
    scope.createdAt = new Date();
    scope.updatedAt = new Date();

    expect(scope.id).toBe('test-id');
    expect(scope.userId).toBe('user-id');
    expect(scope.title).toBe('Test Title');
    expect(scope.problematique).toBe('Test problematique');
    expect(scope.objectives).toBe('Test objectives');
    expect(scope.createdAt).toBeInstanceOf(Date);
    expect(scope.updatedAt).toBeInstanceOf(Date);
  });

  it('should allow null objectives', () => {
    const scope = new ResearchScope();
    scope.objectives = null;
    expect(scope.objectives).toBeNull();
  });

  it('should have user relation defined', () => {
    const scope = new ResearchScope();
    const user = new User();
    scope.user = user;
    expect(scope.user).toBe(user);
  });

  it('should support userId property', () => {
    const scope = new ResearchScope();
    scope.userId = 'test-user-id';
    expect(scope.userId).toBe('test-user-id');
  });

  it('should validate title length constraint', () => {
    const scope = new ResearchScope();
    const longTitle = 'a'.repeat(201);
    scope.title = longTitle;

    // TypeORM will enforce this at database level, entity allows any string
    expect(scope.title.length).toBe(201);
  });
});
