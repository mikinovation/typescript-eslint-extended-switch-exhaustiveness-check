import { RuleTester } from '@typescript-eslint/rule-tester';
import * as vitest from 'vitest';
import { extendedSwitchExhaustivenessCheck } from '../rules/extended-switch-exhaustiveness-check';

RuleTester.afterAll = vitest.afterAll;
RuleTester.it = vitest.it;
RuleTester.describe = vitest.describe;

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ['*.ts*']
      },
      tsconfigRootDir: import.meta.dirname,
    }
  }
});

ruleTester.run('extended-switch-exhaustiveness-check', extendedSwitchExhaustivenessCheck, {
  valid: [
    {
      code: `
        type Status = 'loading' | 'success' | 'error';
        function handleStatus(status: Status) {
          switch (status) {
            case 'loading':
              return 'Loading...';
            case 'success':
              return 'Success!';
            case 'error':
              return 'Error!';
            default:
              throw new Error(\`\${status satisfies never} is unexpected value\`);
          }
        }
      `,
    },
    {
      code: `
        const value = 'test';
        switch (value) {
          case 'test':
            return 'Test case';
          default:
            return 'Default case';
        }
      `,
    },
    {
      code: `
        const code = 200;
        switch (code) {
          case 200:
            return 'OK';
          case 404:
            return 'Not Found';
          default:
            return 'Unknown status';
        }
      `,
    },
    {
      code: `
        type Color = 'red' | 'blue' | 'green';
        function getColorName(color: Color) {
          switch (color) {
            case 'red':
              return 'Red';
            case 'blue':
              return 'Blue';
            case 'green':
              return 'Green';
            default:
              throw new Error(\`\${color satisfies never} is unexpected value\`);
          }
        }
      `,
    },
    {
      code: `
        type StatusCode = 200 | 404 | 500;
        function handleStatusCode(code: StatusCode) {
          switch (code) {
            case 200:
              return 'OK';
            case 404:
              return 'Not Found';
            case 500:
              return 'Internal Server Error';
            default:
              throw new Error(\`\${code satisfies never} is unexpected status code\`);
          }
        }
      `,
    },
  ],
  invalid: [
    {
      code: `
        type Status = 'loading' | 'success' | 'error';
        function handleStatus(status: Status) {
          switch (status) {
            case 'loading':
              return 'Loading...';
            case 'success':
              return 'Success!';
            case 'error':
              return 'Error!';
          }
        }
      `,
      errors: [
        {
          messageId: 'missingDefaultWithSatisfiesNever',
        },
      ],
    },
    {
      code: `
        type Color = 'red' | 'blue' | 'green';
        function getColorName(color: Color) {
          switch (color) {
            case 'red':
              return 'Red';
            case 'blue':
              return 'Blue';
            case 'green':
              return 'Green';
            default:
              throw new Error('Unknown color');
          }
        }
      `,
      errors: [
        {
          messageId: 'defaultCaseNeedsSatisfiesNever',
        },
      ],
    },
    {
      code: `
        type Status = 'pending' | 'completed';
        function processStatus(status: Status) {
          switch (status) {
            case 'pending':
              return 'Pending';
            case 'completed':
              return 'Completed';
            default:
              return 'Unknown';
          }
        }
      `,
      errors: [
        {
          messageId: 'defaultCaseNeedsSatisfiesNever',
        },
      ],
    },
    {
      code: `
        type Priority = 'high' | 'medium' | 'low';
        function handlePriority(priority: Priority) {
          switch (priority) {
            case 'high':
              return 'High priority';
            case 'medium':
              return 'Medium priority';
            case 'low':
              return 'Low priority';
            default:
              priority satisfies never;
          }
        }
      `,
      errors: [
        {
          messageId: 'defaultCaseNeedsThrowError',
        },
      ],
    },
    {
      code: `
        type HttpStatus = 200 | 400 | 500;
        function processHttpStatus(status: HttpStatus) {
          switch (status) {
            case 200:
              return 'Success';
            case 400:
              return 'Bad Request';
            case 500:
              return 'Server Error';
          }
        }
      `,
      errors: [
        {
          messageId: 'missingDefaultWithSatisfiesNever',
        },
      ],
    },
    {
      code: `
        type Version = 1 | 2 | 3;
        function handleVersion(version: Version) {
          switch (version) {
            case 1:
              return 'v1';
            case 2:
              return 'v2';
            case 3:
              return 'v3';
            default:
              console.log('Unknown version');
          }
        }
      `,
      errors: [
        {
          messageId: 'defaultCaseNeedsSatisfiesNever',
        },
      ],
    },
  ],
});
