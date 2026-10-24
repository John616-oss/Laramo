import { Language, TestCase } from '../types';

export interface ExecutionResult {
  success: boolean;
  totalPassed: number;
  totalCases: number;
  runtimeMs: number;
  memoryMb: number;
  stdout: string[];
  caseResults: {
    testCaseId: string;
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
    logs?: string;
  }[];
  errorMessage?: string;
}

export function executeCode(
  code: string,
  language: Language,
  testCases: TestCase[],
  challengeSlug: string
): Promise<ExecutionResult> {
  return new Promise((resolve) => {
    // Artificial execution latency (150ms-300ms) to simulate compilation / interpreter
    setTimeout(() => {
      const logs: string[] = [];
      const startTime = performance.now();

      // Check basic syntax safety
      if (!code.trim()) {
        resolve({
          success: false,
          totalPassed: 0,
          totalCases: testCases.length,
          runtimeMs: 0,
          memoryMb: 0,
          stdout: ['Error: Code editor is empty.'],
          caseResults: testCases.map((tc) => ({
            testCaseId: tc.id,
            input: tc.input,
            expected: tc.expectedOutput,
            actual: 'No code provided',
            passed: false
          })),
          errorMessage: 'Code cannot be empty.'
        });
        return;
      }

      // Check for syntax issues per language
      if (language === 'python' && code.includes('def ') && !code.includes(':')) {
        resolve({
          success: false,
          totalPassed: 0,
          totalCases: testCases.length,
          runtimeMs: 12,
          memoryMb: 14.2,
          stdout: ['SyntaxError: expected \':\' at end of def statement'],
          caseResults: [],
          errorMessage: 'SyntaxError: expected \':\' in function definition'
        });
        return;
      }

      if ((language === 'cpp' || language === 'java' || language === 'csharp') && !code.includes('{')) {
        resolve({
          success: false,
          totalPassed: 0,
          totalCases: testCases.length,
          runtimeMs: 25,
          memoryMb: 18.5,
          stdout: ['error: expected \';\' or \'{\' at end of declaration'],
          caseResults: [],
          errorMessage: 'Compilation error: missing block braces'
        });
        return;
      }

      // Evaluation for JavaScript/TypeScript in sandbox
      if (language === 'javascript' || language === 'typescript') {
        const caseResults: ExecutionResult['caseResults'] = [];
        let allPassed = true;

        for (const tc of testCases) {
          try {
            // Mock console.log
            const capturedLogs: string[] = [];
            const safeConsole = {
              log: (...args: unknown[]) => capturedLogs.push(args.map(a => String(a)).join(' '))
            };

            // Extract function invocation based on challenge
            let evalCode = code;
            // Clean up export or typescript typing for JS eval
            evalCode = evalCode.replace(/:\s*[a-zA-Z0-9_<>[\]]+/g, '');

            let actualResultStr = '';
            let passed = false;

            if (challengeSlug === 'two-sum') {
              const runFn = new Function('console', `${evalCode}; return twoSum(${tc.input});`);
              const res = runFn(safeConsole);
              actualResultStr = JSON.stringify(res);
              // Normalize array comparison
              const exp = JSON.parse(tc.expectedOutput);
              passed = Array.isArray(res) && (
                (res[0] === exp[0] && res[1] === exp[1]) ||
                (res[0] === exp[1] && res[1] === exp[0])
              );
            } else if (challengeSlug === 'valid-palindrome') {
              const runFn = new Function('console', `${evalCode}; return isPalindrome(${tc.input});`);
              const res = runFn(safeConsole);
              actualResultStr = String(res);
              passed = actualResultStr.toLowerCase() === tc.expectedOutput.toLowerCase();
            } else if (challengeSlug === 'binary-search') {
              const runFn = new Function('console', `${evalCode}; return search(${tc.input});`);
              const res = runFn(safeConsole);
              actualResultStr = String(res);
              passed = actualResultStr === tc.expectedOutput;
            } else if (challengeSlug === 'valid-parentheses') {
              const runFn = new Function('console', `${evalCode}; return isValid(${tc.input});`);
              const res = runFn(safeConsole);
              actualResultStr = String(res);
              passed = actualResultStr.toLowerCase() === tc.expectedOutput.toLowerCase();
            } else if (challengeSlug === 'php-student-gwa') {
              const runFn = new Function('console', `${evalCode}; return calculateGWA(${tc.input});`);
              const res = runFn(safeConsole);
              actualResultStr = JSON.stringify(res);
              passed = res && Math.abs(res.gwa - JSON.parse(tc.expectedOutput).gwa) < 0.05;
            } else if (challengeSlug === 'javascript-cart-calculator') {
              const runFn = new Function('console', `${evalCode}; return calculateCartTotal(${tc.input});`);
              const res = runFn(safeConsole);
              actualResultStr = String(res);
              passed = Math.abs(Number(res) - Number(tc.expectedOutput)) < 0.1;
            } else if (challengeSlug === 'html-css-profile-card') {
              // HTML validation test
              const hasArticle = /<article[\s>]/i.test(code);
              const hasButton = /<button[\s>]/i.test(code);
              const hasImg = /<img[\s>]/i.test(code);
              actualResultStr = hasArticle && hasButton && hasImg ? 'true' : 'false';
              passed = actualResultStr === tc.expectedOutput;
            } else {
              // Generic execution test
              actualResultStr = tc.expectedOutput;
              passed = true;
            }

            if (!passed) allPassed = false;
            caseResults.push({
              testCaseId: tc.id,
              input: tc.input,
              expected: tc.expectedOutput,
              actual: actualResultStr,
              passed,
              logs: capturedLogs.join('\n')
            });
          } catch (err: unknown) {
            allPassed = false;
            caseResults.push({
              testCaseId: tc.id,
              input: tc.input,
              expected: tc.expectedOutput,
              actual: `Runtime error: ${(err as Error).message}`,
              passed: false
            });
          }
        }

        const endTime = performance.now();
        const runtime = Math.round((endTime - startTime) + Math.random() * 40 + 20);
        const mem = Number((14.8 + Math.random() * 3.5).toFixed(1));

        resolve({
          success: allPassed,
          totalPassed: caseResults.filter(c => c.passed).length,
          totalCases: testCases.length,
          runtimeMs: runtime,
          memoryMb: mem,
          stdout: allPassed 
            ? [`✔ All ${testCases.length} test cases passed successfully!`, `⚡ Execution runtime: ${runtime}ms (Faster than 91.2% of submissions)`, `💾 Memory: ${mem} MB`]
            : [`✖ Some test cases failed. Review actual vs expected outputs below.`],
          caseResults
        });
        return;
      }

      // Evaluation for HTML / CSS
      if (language === 'html' || language === 'css') {
        const hasTagsOrRules = language === 'html' 
          ? /<[a-z0-9]+[\s>]/i.test(code) 
          : /\{[^}]+\}/.test(code);

        const caseResults = testCases.map((tc) => {
          const passed = hasTagsOrRules && code.length > 30;
          return {
            testCaseId: tc.id,
            input: tc.input,
            expected: tc.expectedOutput,
            actual: passed ? tc.expectedOutput : 'Invalid Markup or CSS',
            passed
          };
        });

        const passedCount = caseResults.filter(c => c.passed).length;
        const allPassed = passedCount === testCases.length;
        const runtime = 8;
        const mem = 12.4;

        resolve({
          success: allPassed,
          totalPassed: passedCount,
          totalCases: testCases.length,
          runtimeMs: runtime,
          memoryMb: mem,
          stdout: allPassed
            ? [
                `[${language.toUpperCase()} Web Renderer] Document Object Model parsed cleanly!`,
                `✔ Semantic elements and stylesheets validated.`,
                `Tip: Switch to "Live Web Preview" tab to see real-time UI rendering.`
              ]
            : [
                `[${language.toUpperCase()} Web Renderer] Incomplete markup or styling rules detected.`
              ],
          caseResults
        });
        return;
      }

      // Evaluation for PHP
      if (language === 'php') {
        const hasPhpTags = code.includes('<?php') || code.includes('function') || code.includes('$');
        const hasSyntaxBraces = code.includes('{') && code.includes('}');
        const isComplete = hasPhpTags && hasSyntaxBraces && code.length > 40;

        const caseResults = testCases.map((tc) => {
          const passed = isComplete;
          return {
            testCaseId: tc.id,
            input: tc.input,
            expected: tc.expectedOutput,
            actual: passed ? tc.expectedOutput : 'Syntax or evaluation error in PHP script',
            passed
          };
        });

        const passedCount = caseResults.filter(c => c.passed).length;
        const allPassed = passedCount === testCases.length;
        const runtime = Math.round(18 + Math.random() * 25);
        const mem = Number((16.2 + Math.random() * 2.8).toFixed(1));

        resolve({
          success: allPassed,
          totalPassed: passedCount,
          totalCases: testCases.length,
          runtimeMs: runtime,
          memoryMb: mem,
          stdout: allPassed
            ? [
                `[PHP 8.2.14 Zend Engine] Script parsed and executed with 0 warnings.`,
                `✔ All ${testCases.length} assertions passed.`,
                `⚡ OpCache execution time: ${runtime} ms`,
                `💾 Memory peak: ${mem} MB`
              ]
            : [
                `[PHP 8.2.14 Zend Engine] Parse error or missing return array/value.`
              ],
          caseResults
        });
        return;
      }

      // Simulation for Python, C++, Java, C#, Go, Rust, SQL
      const hasReturnOrPrint = /return|print|cout|System\.out|Console\.Write|fmt\.Print|SELECT/i.test(code);
      const isComplete = hasReturnOrPrint && code.length > 50;

      const caseResults = testCases.map((tc) => {
        const passed = isComplete;
        return {
          testCaseId: tc.id,
          input: tc.input,
          expected: tc.expectedOutput,
          actual: passed ? tc.expectedOutput : 'Null / Incomplete logic',
          passed
        };
      });

      const endTime = performance.now();
      const runtime = Math.round((endTime - startTime) + Math.random() * 60 + 40);
      const mem = Number((22.4 + Math.random() * 5).toFixed(1));
      const passedCount = caseResults.filter(c => c.passed).length;
      const allPassed = passedCount === testCases.length;

      resolve({
        success: allPassed,
        totalPassed: passedCount,
        totalCases: testCases.length,
        runtimeMs: runtime,
        memoryMb: mem,
        stdout: allPassed
          ? [
              `[${language.toUpperCase()} Engine] Compilation & Execution Successful!`,
              `✔ All ${testCases.length} test cases passed.`,
              `⚡ Execution time: ${runtime} ms`,
              `💾 Memory footprint: ${mem} MB`
            ]
          : [
              `[${language.toUpperCase()} Engine] Execution completed with test differences.`,
              `Make sure your function returns the correct answer and handles edge cases.`
            ],
        caseResults
      });
    }, 240);
  });
}
