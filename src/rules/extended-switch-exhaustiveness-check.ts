import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';
import type { Type } from 'typescript';

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/mikinovation/extend-switch-exhaustiveness-check/blob/main/docs/rules/${name}.md`,
);

export const extendedSwitchExhaustivenessCheck = createRule<[], 'missingDefaultWithSatisfiesNever' | 'defaultCaseNeedsSatisfiesNever' | 'defaultCaseNeedsThrowError'>({
  name: 'extended-switch-exhaustiveness-check',
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce exhaustive switch statements with satisfies never in default case for union types',
    },
    schema: [],
    messages: {
      missingDefaultWithSatisfiesNever: 'Switch statement on union type must have a default case with "throw new Error(`${value satisfies never} ...`)"',
      defaultCaseNeedsSatisfiesNever: 'Default case in switch statement on union type must use "throw new Error(`${value satisfies never} ...`)"',
      defaultCaseNeedsThrowError: 'Default case in switch statement on union type must throw an Error with template literal containing "satisfies never"',
    },
  },
  defaultOptions: [],
  create(context) {
    const services = ESLintUtils.getParserServices(context);
    const checker = services.program.getTypeChecker();

    function isUnionType(type: Type): boolean {
      return type.isUnion() && type.types.length > 1;
    }

    function hasThrowErrorWithSatisfiesNever(defaultCase: TSESTree.SwitchCase): boolean {
      if (!defaultCase.consequent || defaultCase.consequent.length === 0) {
        return false;
      }

      for (const statement of defaultCase.consequent) {
        if (statement.type === 'ThrowStatement' &&
            statement.argument &&
            statement.argument.type === 'NewExpression' &&
            statement.argument.callee.type === 'Identifier' &&
            statement.argument.callee.name === 'Error' &&
            statement.argument.arguments &&
            statement.argument.arguments.length > 0) {
          
          const errorArg = statement.argument.arguments[0];
          if (errorArg.type === 'TemplateLiteral') {
            // Check if template literal contains a satisfies never expression
            for (const expression of errorArg.expressions) {
              if (expression.type === 'TSSatisfiesExpression' &&
                  expression.typeAnnotation.type === 'TSNeverKeyword') {
                return true;
              }
            }
          }
        }
      }

      return false;
    }

    function hasSatisfiesNeverExpression(defaultCase: TSESTree.SwitchCase): boolean {
      if (!defaultCase.consequent || defaultCase.consequent.length === 0) {
        return false;
      }

      for (const statement of defaultCase.consequent) {
        if (statement.type === 'ExpressionStatement' &&
            statement.expression.type === 'TSSatisfiesExpression' &&
            statement.expression.typeAnnotation.type === 'TSNeverKeyword') {
          return true;
        }
      }

      return false;
    }

    return {
      SwitchStatement(node: TSESTree.SwitchStatement): void {
        const discriminantType = checker.getTypeAtLocation(
          services.esTreeNodeToTSNodeMap.get(node.discriminant),
        );

        if (!isUnionType(discriminantType)) {
          return;
        }

        const defaultCase = node.cases.find(case_ => case_.test === null);

        if (!defaultCase) {
          context.report({
            node,
            messageId: 'missingDefaultWithSatisfiesNever',
          });
          return;
        }

        if (!hasThrowErrorWithSatisfiesNever(defaultCase)) {
          // Check if it at least has satisfies never expression
          if (hasSatisfiesNeverExpression(defaultCase)) {
            context.report({
              node: defaultCase,
              messageId: 'defaultCaseNeedsThrowError',
            });
          } else {
            context.report({
              node: defaultCase,
              messageId: 'defaultCaseNeedsSatisfiesNever',
            });
          }
        }
      },
    };
  },
});
