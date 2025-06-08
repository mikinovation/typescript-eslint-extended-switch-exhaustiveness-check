import { extendedSwitchExhaustivenessCheck } from './rules/extended-switch-exhaustiveness-check';

export const rules = {
  'extended-switch-exhaustiveness-check': extendedSwitchExhaustivenessCheck,
};

export const configs = {
  recommended: {
    plugins: ['extended-switch-exhaustiveness'],
    rules: {
      'extended-switch-exhaustiveness/extended-switch-exhaustiveness-check': 'error',
    },
  },
};

const plugin = {
  rules,
  configs,
};

export default plugin;
