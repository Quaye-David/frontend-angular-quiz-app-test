import { TestBed } from '@angular/core/testing';
import { ThemeService } from '../core/services/theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let getItemSpy: jest.SpyInstance;
  let setItemSpy: jest.SpyInstance;

  beforeEach(() => {
    // Setup localStorage spies
    getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
    setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    TestBed.configureTestingModule({
      providers: [ThemeService]
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('initialization', () => {
    it('should create the service', () => {
      service = TestBed.inject(ThemeService);
      expect(service).toBeTruthy();
    });

    it('should initialize with light theme by default', () => {
      getItemSpy.mockImplementation(() => null);
      service = TestBed.inject(ThemeService);
      expect(service.isDarkTheme).toBe(false);
    });

    it('should initialize with dark theme if saved', () => {
      getItemSpy.mockImplementation(() => 'dark');
      service = TestBed.inject(ThemeService);
      expect(service.isDarkTheme).toBe(true);
    });
  });

  describe('theme toggling', () => {
    beforeEach(() => {
      service = TestBed.inject(ThemeService);
    });

    it('should toggle from light to dark theme', () => {
      service.isDarkTheme = false;
      service.toggleTheme();
      expect(service.isDarkTheme).toBe(true);
      expect(setItemSpy).toHaveBeenCalledWith('theme', 'dark');
    });

    it('should toggle from dark to light theme', () => {
      service.isDarkTheme = true;
      service.toggleTheme();
      expect(service.isDarkTheme).toBe(false);
      expect(setItemSpy).toHaveBeenCalledWith('theme', 'light');
    });
  });

  describe('direct theme setting', () => {
    beforeEach(() => {
      service = TestBed.inject(ThemeService);
    });

    it('should set dark theme', () => {
      service.setDarkTheme(true);
      expect(service.isDarkTheme).toBe(true);
      expect(setItemSpy).toHaveBeenCalledWith('theme', 'dark');
    });

    it('should set light theme', () => {
      service.setDarkTheme(false);
      expect(service.isDarkTheme).toBe(false);
      expect(setItemSpy).toHaveBeenCalledWith('theme', 'light');
    });

    it('should not make unnecessary changes when setting same theme', () => {
      service.isDarkTheme = false;
      jest.clearAllMocks();
      service.setDarkTheme(false);
      expect(setItemSpy).toHaveBeenCalledWith('theme', 'light');
    });
  });

  describe('persistence', () => {
    it('should persist theme changes to localStorage', () => {
      service = TestBed.inject(ThemeService);
      service.setDarkTheme(true);
      expect(setItemSpy).toHaveBeenCalledWith('theme', 'dark');
    });

    it('should handle localStorage errors gracefully', () => {
      // Setup spies
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const mockError = new Error('Storage error');

      // Mock localStorage.setItem to throw
      setItemSpy.mockImplementation(() => {
        throw mockError;
      });

      // Act
      service = TestBed.inject(ThemeService);
      expect(() => service.setDarkTheme(true)).not.toThrow();

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('Failed to save theme:', mockError);

      // Cleanup
      consoleSpy.mockRestore();
    });
  });
});