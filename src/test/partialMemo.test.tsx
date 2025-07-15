/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { partialMemo } from '@ptolemy2002/react-utils'; // Adjust import path as needed

// Setup directly in test file (alternative to setup file)
expect.extend(matchers);

// Mock console.warn to test warning messages
const mockConsoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

// Clean up after each test
beforeEach(() => {
  cleanup();
});

beforeEach(() => {
  mockConsoleWarn.mockClear();
});

// Test components
interface TestProps {
  name: string;
  age: number;
  children?: React.ReactNode;
}

const TestComponent = vi.fn(({ name, age, children }: TestProps) => (
  <div>
    <span data-testid="name">{name}</span>
    <span data-testid="age">{age}</span>
    {children}
  </div>
));

const TestComponentWithRenderDeps = vi.fn(({ name, age, children, renderDeps }: TestProps & { renderDeps?: unknown[] }) => (
  <div>
    <span data-testid="name">{name}</span>
    <span data-testid="age">{age}</span>
    <span data-testid="render-deps">{JSON.stringify(renderDeps)}</span>
    {children}
  </div>
));

// Test wrapper component to control re-renders
function TestWrapper({ 
  Component, 
  name, 
  age, 
  children, 
  renderDeps 
}: { 
  Component: React.ComponentType<any>; 
  name: string; 
  age: number; 
  children?: React.ReactNode;
  renderDeps?: unknown[] | false | null;
}) {
  return (
    <Component 
      name={name} 
      age={age}
      renderDeps={renderDeps}
    >
      {children}
    </Component>
  );
}

describe('partialMemo', () => {
  beforeEach(() => {
    TestComponent.mockClear();
    TestComponentWithRenderDeps.mockClear();
  });

  describe('Basic memoization', () => {
    it('should not re-render when no deps specified and props unchanged', () => {
      const MemoizedComponent = partialMemo(TestComponent);
      
      const { rerender } = render(
        <TestWrapper Component={MemoizedComponent} name="John" age={25} />
      );

      expect(TestComponent).toHaveBeenCalledTimes(1);

      // Re-render with same props
      rerender(
        <TestWrapper Component={MemoizedComponent} name="John" age={25} />
      );

      expect(TestComponent).toHaveBeenCalledTimes(1); // Should not re-render
    });

    it('should not re-render at all when any prop changes with no deps specified', () => {
      const MemoizedComponent = partialMemo(TestComponent, undefined);
      
      const { rerender } = render(
        <TestWrapper Component={MemoizedComponent} name="John" age={25} />
      );

      expect(TestComponent).toHaveBeenCalledTimes(1);

      // Re-render with different name
      rerender(
        <TestWrapper Component={MemoizedComponent} name="Jane" age={25} />
      );

      expect(TestComponent).toHaveBeenCalledTimes(1); // Should not re-render
    });
  });

  describe('Dependency-based memoization', () => {
    it('should only re-render when specified prop dependencies change', () => {
      const MemoizedComponent = partialMemo(TestComponent, ['name']);
      
      const { rerender } = render(
        <TestWrapper Component={MemoizedComponent} name="John" age={25} />
      );

      expect(TestComponent).toHaveBeenCalledTimes(1);

      // Change age (not in deps) - should not re-render
      rerender(
        <TestWrapper Component={MemoizedComponent} name="John" age={30} />
      );

      expect(TestComponent).toHaveBeenCalledTimes(1);

      // Change name (in deps) - should re-render
      rerender(
        <TestWrapper Component={MemoizedComponent} name="Jane" age={30} />
      );

      expect(TestComponent).toHaveBeenCalledTimes(2);
    });

    it('should handle multiple prop dependencies', () => {
      const MemoizedComponent = partialMemo(TestComponent, ['name', 'age']);
      
      const { rerender } = render(
        <TestWrapper Component={MemoizedComponent} name="John" age={25} />
      );

      expect(TestComponent).toHaveBeenCalledTimes(1);

      // Change name - should re-render
      rerender(
        <TestWrapper Component={MemoizedComponent} name="Jane" age={25} />
      );

      expect(TestComponent).toHaveBeenCalledTimes(2);

      // Change age - should re-render
      rerender(
        <TestWrapper Component={MemoizedComponent} name="Jane" age={30} />
      );

      expect(TestComponent).toHaveBeenCalledTimes(3);
    });
  });

  describe('Custom comparison functions', () => {
    it('should use custom comparison function when provided', () => {
      const customComparison = vi.fn((prev: TestProps, next: TestProps) => {
        // Only re-render if age difference is greater than 5
        return Math.abs(prev.age - next.age) <= 5;
      });

      const MemoizedComponent = partialMemo(TestComponent, [customComparison]);
      
      const { rerender } = render(
        <TestWrapper Component={MemoizedComponent} name="John" age={25} />
      );

      expect(TestComponent).toHaveBeenCalledTimes(1);

      // Age difference of 3 - should not re-render
      rerender(
        <TestWrapper Component={MemoizedComponent} name="John" age={28} />
      );

      expect(TestComponent).toHaveBeenCalledTimes(1);
      expect(customComparison).toHaveBeenCalled();

      // Age difference of 7 - should re-render
      rerender(
        <TestWrapper Component={MemoizedComponent} name="John" age={35} />
      );

      expect(TestComponent).toHaveBeenCalledTimes(2);
    });

    it('should provide defaultBehavior function to custom comparison', () => {
      let capturedDefaultBehavior: ((prop: keyof TestProps) => boolean) | null = null;

      const customComparison = vi.fn((prev: TestProps, next: TestProps, defaultBehavior) => {
        capturedDefaultBehavior = defaultBehavior;
        return defaultBehavior('name');
      });

      const MemoizedComponent = partialMemo(TestComponent, [customComparison]);
      
      const { rerender } = render(
        <TestWrapper Component={MemoizedComponent} name="John" age={25} />
      );

      // Trigger the comparison
      rerender(
        <TestWrapper Component={MemoizedComponent} name="John" age={30} />
      );

      expect(capturedDefaultBehavior).toBeTruthy();
      expect(customComparison).toHaveBeenCalled();
    });
  });

  describe('renderDeps functionality', () => {
    it('should re-render when renderDeps change', () => {
      const MemoizedComponent = partialMemo(TestComponent, ['name']);
      
      const { rerender } = render(
        <TestWrapper 
          Component={MemoizedComponent} 
          name="John" 
          age={25} 
          renderDeps={[1, 2, 3]} 
        />
      );

      expect(TestComponent).toHaveBeenCalledTimes(1);

      // Same props, different renderDeps - should re-render
      rerender(
        <TestWrapper 
          Component={MemoizedComponent} 
          name="John" 
          age={25} 
          renderDeps={[1, 2, 4]} 
        />
      );

      expect(TestComponent).toHaveBeenCalledTimes(2);
    });

    it('should always re-render when renderDeps is falsy', () => {
      const MemoizedComponent = partialMemo(TestComponent, ['name']);
      
      const { rerender } = render(
        <TestWrapper 
          Component={MemoizedComponent} 
          name="John" 
          age={25} 
          renderDeps={false} 
        />
      );

      expect(TestComponent).toHaveBeenCalledTimes(1);

      // Same props, falsy renderDeps - should always re-render
      rerender(
        <TestWrapper 
          Component={MemoizedComponent} 
          name="John" 
          age={25} 
          renderDeps={false} 
        />
      );

      expect(TestComponent).toHaveBeenCalledTimes(2);

      // Test with null
      rerender(
        <TestWrapper 
          Component={MemoizedComponent} 
          name="John" 
          age={25} 
          renderDeps={null} 
        />
      );

      expect(TestComponent).toHaveBeenCalledTimes(3);
    });

    it('should re-render when renderDeps array length changes', () => {
      const MemoizedComponent = partialMemo(TestComponent, ['name']);
      
      const { rerender } = render(
        <TestWrapper 
          Component={MemoizedComponent} 
          name="John" 
          age={25} 
          renderDeps={[1, 2]} 
        />
      );

      expect(TestComponent).toHaveBeenCalledTimes(1);

      // Different length renderDeps - should re-render
      rerender(
        <TestWrapper 
          Component={MemoizedComponent} 
          name="John" 
          age={25} 
          renderDeps={[1, 2, undefined]} 
        />
      );

      expect(TestComponent).toHaveBeenCalledTimes(2);
    });

    it('should warn when renderDeps is the same object reference', () => {
      const MemoizedComponent = partialMemo(TestComponent, ['name']);
      const sameRenderDeps = [1, 2, 3];
      
      const { rerender } = render(
        <TestWrapper 
          Component={MemoizedComponent} 
          name="John" 
          age={25} 
          renderDeps={sameRenderDeps} 
        />
      );

      // Use same object reference - should trigger warning
      rerender(
        <TestWrapper 
          Component={MemoizedComponent} 
          name="John" 
          age={25} 
          renderDeps={sameRenderDeps} 
        />
      );

      expect(mockConsoleWarn).toHaveBeenCalledWith(
        'Render deps are the same object across parent renders. This should not happen.'
      );
    });
  });

  describe('children prop handling', () => {
    it('should not re-render when only children change and children is in deps', () => {
      const MemoizedComponent = partialMemo(TestComponent, ['children']);
      
      const { rerender } = render(
        <TestWrapper Component={MemoizedComponent} name="John" age={25}>
          <span>Child 1</span>
        </TestWrapper>
      );

      expect(TestComponent).toHaveBeenCalledTimes(1);

      // Change children - should not re-render due to special handling
      rerender(
        <TestWrapper Component={MemoizedComponent} name="John" age={25}>
          <span>Child 2</span>
        </TestWrapper>
      );

      expect(TestComponent).toHaveBeenCalledTimes(1);
    });
  });

  describe('passRenderDeps parameter', () => {
    it('should not pass renderDeps to component by default', () => {
      const MemoizedComponent = partialMemo(TestComponent);
      
      render(
        <TestWrapper 
          Component={MemoizedComponent} 
          name="John" 
          age={25} 
          renderDeps={[1, 2, 3]} 
        />
      );

      expect(TestComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John',
          age: 25
        }),
        expect.anything() // React context
      );

      expect(TestComponent).toHaveBeenCalledWith(
        expect.not.objectContaining({
          renderDeps: expect.anything()
        }),
        expect.anything()
      );
    });

    it('should pass renderDeps to component when passRenderDeps is true', () => {
      const MemoizedComponent = partialMemo(TestComponentWithRenderDeps, [], undefined, true);
      
      render(
        <TestWrapper 
          Component={MemoizedComponent} 
          name="John" 
          age={25} 
          renderDeps={[1, 2, 3]} 
        />
      );

      expect(TestComponentWithRenderDeps).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John',
          age: 25,
          renderDeps: [1, 2, 3]
        }),
        expect.anything()
      );
    });
  });

  describe('Display name handling', () => {
    it('should use provided display name', () => {
      const MemoizedComponent = partialMemo(TestComponent, [], 'CustomName');
      
      expect(MemoizedComponent.displayName).toBe('Memo(CustomName)');
    });

    it('should use component displayName if available', () => {
      // @ts-expect-error We want to add a display name where it didn't exist before.
      TestComponent.displayName = 'TestDisplayName';
      const MemoizedComponent = partialMemo(TestComponent);
      
      expect(MemoizedComponent.displayName).toBe('Memo(TestDisplayName)');
    });

    it('should use component name as fallback', () => {
      // @ts-expect-error We want to remove the display name whether it existed before or not.
      delete TestComponent.displayName;
      const MemoizedComponent = partialMemo(TestComponent);
      
      expect(MemoizedComponent.displayName).toBe('Memo(spy)');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty deps array', () => {
      const MemoizedComponent = partialMemo(TestComponent, []);
      
      const { rerender } = render(
        <TestWrapper Component={MemoizedComponent} name="John" age={25} />
      );

      expect(TestComponent).toHaveBeenCalledTimes(1);

      // Change props - should not re-render with empty deps
      rerender(
        <TestWrapper Component={MemoizedComponent} name="Jane" age={30} />
      );

      expect(TestComponent).toHaveBeenCalledTimes(1);
    });

    it('should handle component with no props', () => {
      const NoPropsComponent = vi.fn(() => <div>No props</div>);
      const MemoizedComponent = partialMemo(NoPropsComponent);
      
      const { rerender } = render(<MemoizedComponent />);
      
      expect(NoPropsComponent).toHaveBeenCalledTimes(1);

      rerender(<MemoizedComponent />);
      
      expect(NoPropsComponent).toHaveBeenCalledTimes(1); // Should not re-render
    });

    it('should handle mixed prop and function dependencies', () => {
      const customComparison = vi.fn(() => true); // Never re-render
      const MemoizedComponent = partialMemo(TestComponent, ['age', customComparison]);
      
      const { rerender } = render(
        <TestWrapper Component={MemoizedComponent} name="John" age={25} />
      );

      expect(TestComponent).toHaveBeenCalledTimes(1);

      // Change name (prop dep) - should not re-render due name not being in deps and customComparison always returning true
      rerender(
        <TestWrapper Component={MemoizedComponent} name="Jane" age={25} />
      );

      expect(TestComponent).toHaveBeenCalledTimes(1);
      expect(customComparison).toHaveBeenCalled();
    });
  });
});