# typescript-eslint-extended-switch-exhaustiveness

ESLint plugin that enforces `throw new Error(\`\${value satisfies never} ...\`)` in default cases for union types.

## Installation

```bash
npm install --save-dev typescript-eslint-extended-switch-exhaustiveness
```

## Usage

### ESLint Flat Config

```javascript
import extendedSwitchExhaustiveness from 'typescript-eslint-extended-switch-exhaustiveness';

export default [
  {
    plugins: {
      'extended-switch-exhaustiveness': extendedSwitchExhaustiveness,
    },
    rules: {
      'extended-switch-exhaustiveness/extended-switch-exhaustiveness-check': 'error',
    },
  },
];
```

## Rule Details

This rule enforces that switch statements on union types must have a default case with `throw new Error` and `value satisfies never` to ensure exhaustiveness checking.

### Examples

**Correct**

```typescript
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
      throw new Error(`${status satisfies never} is unexpected value`);
  }
}
```

**Incorrect**

```typescript
type Status = 'loading' | 'success' | 'error';

function handleStatus(status: Status) {
  switch (status) {
    case 'loading':
      return 'Loading...';
    case 'success':
      return 'Success!';
    case 'error':
      return 'Error!';
    // Missing default case with satisfies never
  }
}
```

```typescript
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
      // Missing satisfies never in template literal
      throw new Error('Unknown status');
  }
}
```

```typescript
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
      // satisfies never alone is not enough - must be in throw Error with template literal
      status satisfies never;
      break;
  }
}
```

## License

MIT
