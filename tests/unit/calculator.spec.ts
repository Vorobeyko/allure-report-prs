import { test, expect } from '@playwright/test';
import {
  step,
  tags,
  tag,
  severity,
  feature,
  story,
  owner,
  attachment,
  parameter,
  description,
  issue,
  ContentType,
} from 'allure-js-commons';
import { Severity } from 'allure-js-commons';
import { Calculator } from '../../src/calculator';

test.describe('Calculator', () => {
  let calc: Calculator;

  test.beforeEach(() => {
    calc = new Calculator();
  });

  test.describe('Addition', () => {
    test('should add two positive numbers', async () => {
      await severity(Severity.CRITICAL);
      await feature('Arithmetic');
      await story('Addition');
      await owner('core-team');
      await tags('smoke', 'unit');

      const result = await step('Calculate 5 + 3', async () => {
        return calc.add(5, 3);
      });

      await step('Verify result equals 8', async () => {
        expect(result).toBe(8);
      });
    });

    test('should add negative numbers', async () => {
      await severity(Severity.NORMAL);
      await feature('Arithmetic');
      await story('Addition');
      await tag('edge-case');

      await parameter('a', '-5');
      await parameter('b', '-3');

      const result = calc.add(-5, -3);
      expect(result).toBe(-8);
    });

    test('should add zero', async () => {
      await severity(Severity.MINOR);
      await feature('Arithmetic');
      await story('Addition');

      expect(calc.add(7, 0)).toBe(7);
      expect(calc.add(0, 7)).toBe(7);
    });
  });

  test.describe('Subtraction', () => {
    test('should subtract numbers', async () => {
      await severity(Severity.NORMAL);
      await feature('Arithmetic');
      await story('Subtraction');

      const result = await step('Calculate 10 - 4', async () => {
        return calc.subtract(10, 4);
      });

      expect(result).toBe(6);
    });
  });

  test.describe('Multiplication', () => {
    test('should multiply numbers', async () => {
      await severity(Severity.NORMAL);
      await feature('Arithmetic');
      await story('Multiplication');

      const result = await step('Calculate 6 * 7', async () => {
        return calc.multiply(6, 7);
      });

      await attachment(
        'Calculation result',
        `6 × 7 = ${result}`,
        ContentType.TEXT
      );

      expect(result).toBe(42);
    });
  });

  test.describe('Division', () => {
    test('should divide numbers', async () => {
      await severity(Severity.NORMAL);
      await feature('Arithmetic');
      await story('Division');

      const result = await step('Calculate 15 / 3', async () => {
        return calc.divide(15, 3);
      });

      expect(result).toBe(5);
    });

    test('should throw on division by zero', async () => {
      await severity(Severity.CRITICAL);
      await feature('Error Handling');
      await story('Division by Zero');
      await issue('https://github.com/your-org/your-repo/issues/1', 'CALC-1: div by zero');
      await description(
        'Division by zero must throw a descriptive error to prevent silent NaN propagation.'
      );

      await step('Attempt divide(10, 0)', async () => {
        expect(() => calc.divide(10, 0)).toThrow('Division by zero');
      });
    });
  });

  test.describe('Power', () => {
    test('should calculate power', async () => {
      await severity(Severity.MINOR);
      await feature('Arithmetic');
      await story('Power');

      await parameter('base', '2');
      await parameter('exponent', '10');

      expect(calc.power(2, 10)).toBe(1024);
    });
  });

  test.describe('Percentage', () => {
    test('should calculate percentage', async () => {
      await severity(Severity.NORMAL);
      await feature('Arithmetic');
      await story('Percentage');

      await parameter('value', '25');
      await parameter('total', '200');

      const result = calc.percentage(25, 200);
      expect(result).toBe(12.5);
    });

    test('should throw when total is zero', async () => {
      await severity(Severity.NORMAL);
      await feature('Error Handling');

      expect(() => calc.percentage(10, 0)).toThrow('Total cannot be zero');
    });
  });
});
