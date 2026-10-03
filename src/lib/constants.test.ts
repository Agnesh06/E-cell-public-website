import { describe, it, expect } from 'vitest';
import { getActiveNavKey } from './constants';

describe('nav route helper', () => {
  it('maps home, about, projects and collaboration routes to the correct nav key', () => {
    expect(getActiveNavKey('/', '')).toBe('home');
    expect(getActiveNavKey('/', '#about')).toBe('about');
    expect(getActiveNavKey('/projects', '')).toBe('projects');
    expect(getActiveNavKey('/projects', '#details')).toBe('projects');
    expect(getActiveNavKey('/collaboration', '')).toBe('contact');
    expect(getActiveNavKey('/team', '')).toBe('home');
  });
});
