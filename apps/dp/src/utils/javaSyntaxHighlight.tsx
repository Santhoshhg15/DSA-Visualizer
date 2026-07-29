import React from 'react';

export interface Token {
  text: string;
  type:
    | 'keyword'
    | 'type'
    | 'method'
    | 'identifier'
    | 'string'
    | 'char'
    | 'number'
    | 'comment'
    | 'operator'
    | 'punctuation'
    | 'annotation'
    | 'default';
}

// VS Code Dark+ palette — used in dark theme
const TOKEN_COLORS_DARK: Record<Token['type'], string> = {
  keyword:     '#569CD6',
  type:        '#4EC9B0',
  method:      '#DCDCAA',
  identifier:  '#9CDCFE',
  string:      '#CE9178',
  char:        '#CE9178',
  number:      '#B5CEA8',
  comment:     '#6A9955',
  operator:    '#D4D4D4',
  punctuation: '#D4D4D4',
  annotation:  '#DCDCAA',
  default:     '#D4D4D4',
};

// VS Code Light+ palette — used in light theme
const TOKEN_COLORS_LIGHT: Record<Token['type'], string> = {
  keyword:     '#0000FF',   // bright blue keyword
  type:        '#267F99',   // teal type
  method:      '#795E26',   // brown/gold method
  identifier:  '#001080',   // dark navy identifier
  string:      '#A31515',   // dark red string
  char:        '#A31515',
  number:      '#098658',   // dark green number
  comment:     '#008000',   // green comment
  operator:    '#2B2620',   // matches --text-color
  punctuation: '#2B2620',
  annotation:  '#795E26',
  default:     '#2B2620',
};

// Export legacy name for backwards compatibility (dark mode default)
export const TOKEN_COLORS = TOKEN_COLORS_DARK;

function getTokenColors(): Record<Token['type'], string> {
  const theme = document.documentElement.getAttribute('data-theme');
  return theme === 'light' ? TOKEN_COLORS_LIGHT : TOKEN_COLORS_DARK;
}

const KEYWORDS = new Set([
  'public',
  'private',
  'protected',
  'static',
  'final',
  'class',
  'interface',
  'extends',
  'implements',
  'void',
  'return',
  'if',
  'else',
  'for',
  'while',
  'do',
  'switch',
  'case',
  'default',
  'break',
  'continue',
  'new',
  'this',
  'super',
  'import',
  'package',
  'throws',
  'try',
  'catch',
  'finally',
  'abstract',
  'synchronized',
  'volatile',
  'transient',
  'instanceof',
  'enum',
  'null',
  'true',
  'false',
]);

const TYPE_KEYWORDS = new Set([
  'int',
  'long',
  'double',
  'float',
  'boolean',
  'char',
  'byte',
  'short',
  'String',
  'Integer',
  'Long',
  'Double',
  'Float',
  'Boolean',
  'Character',
  'Object',
  'void',
]);

const CONTROL_KEYWORDS = new Set(['if', 'for', 'while', 'switch', 'catch']);

export function tokenizeJavaLine(line: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const n = line.length;

  while (i < n) {
    // 1. Single line comments //
    if (line.substring(i, i + 2) === '//') {
      tokens.push({ text: line.substring(i), type: 'comment' });
      break;
    }

    // 2. Whitespace
    if (/\s/.test(line[i])) {
      const start = i;
      while (i < n && /\s/.test(line[i])) {
        i++;
      }
      tokens.push({ text: line.substring(start, i), type: 'default' });
      continue;
    }

    // 3. String literals "..."
    if (line[i] === '"') {
      const start = i;
      i++; // skip opening quote
      while (i < n && line[i] !== '"') {
        if (line[i] === '\\' && i + 1 < n) {
          i += 2; // skip escape sequence
        } else {
          i++;
        }
      }
      if (i < n && line[i] === '"') {
        i++; // skip closing quote
      }
      tokens.push({ text: line.substring(start, i), type: 'string' });
      continue;
    }

    // 4. Character literals '...'
    if (line[i] === "'") {
      const start = i;
      i++;
      while (i < n && line[i] !== "'") {
        if (line[i] === '\\' && i + 1 < n) {
          i += 2;
        } else {
          i++;
        }
      }
      if (i < n && line[i] === "'") {
        i++;
      }
      tokens.push({ text: line.substring(start, i), type: 'char' });
      continue;
    }

    // 5. Annotations @Annotation
    if (line[i] === '@') {
      const start = i;
      i++;
      while (i < n && /\w/.test(line[i])) {
        i++;
      }
      tokens.push({ text: line.substring(start, i), type: 'annotation' });
      continue;
    }

    // 6. Number literals
    if (/\d/.test(line[i]) || (line[i] === '.' && i + 1 < n && /\d/.test(line[i + 1]))) {
      const start = i;
      if (line.substring(i, i + 2).toLowerCase() === '0x') {
        i += 2;
        while (i < n && /[0-9a-fA-F]/.test(line[i])) i++;
      } else {
        while (i < n && /[\d.]/.test(line[i])) i++;
        if (i < n && /[fFdDlL]/.test(line[i])) i++;
      }
      tokens.push({ text: line.substring(start, i), type: 'number' });
      continue;
    }

    // 7. Words / Identifiers / Keywords / Types / Methods
    if (/[a-zA-Z_$]/.test(line[i])) {
      const start = i;
      while (i < n && /[a-zA-Z0-9_$]/.test(line[i])) {
        i++;
      }
      const word = line.substring(start, i);

      // Check lookahead for method call '(' (ignoring whitespace between word and '(')
      let lookaheadIdx = i;
      while (lookaheadIdx < n && /\s/.test(line[lookaheadIdx])) {
        lookaheadIdx++;
      }
      const isFollowedByParen = lookaheadIdx < n && line[lookaheadIdx] === '(';

      if (KEYWORDS.has(word)) {
        tokens.push({ text: word, type: 'keyword' });
      } else if (TYPE_KEYWORDS.has(word)) {
        tokens.push({ text: word, type: 'type' });
      } else if (isFollowedByParen && !CONTROL_KEYWORDS.has(word)) {
        tokens.push({ text: word, type: 'method' });
      } else if (/[A-Z]/.test(word[0])) {
        tokens.push({ text: word, type: 'type' });
      } else {
        tokens.push({ text: word, type: 'identifier' });
      }
      continue;
    }

    // 8. Operators (multi-character then single character)
    const twoChars = line.substring(i, i + 2);
    if (
      ['==', '!=', '<=', '>=', '&&', '||', '++', '--', '+=', '-=', '*=', '/=', '->', '::'].includes(
        twoChars
      )
    ) {
      tokens.push({ text: twoChars, type: 'operator' });
      i += 2;
      continue;
    }

    if (['+', '-', '*', '/', '%', '=', '<', '>', '!', '&', '|', '^', '~', '?', ':'].includes(line[i])) {
      tokens.push({ text: line[i], type: 'operator' });
      i++;
      continue;
    }

    // 9. Punctuation
    if ([';', ',', '.', '(', ')', '{', '}', '[', ']'].includes(line[i])) {
      tokens.push({ text: line[i], type: 'punctuation' });
      i++;
      continue;
    }

    // Fallback single char
    tokens.push({ text: line[i], type: 'default' });
    i++;
  }

  return tokens;
}

export const JavaCodeLine: React.FC<{ line: string }> = ({ line }) => {
  const colors = getTokenColors();
  const tokens = tokenizeJavaLine(line);
  return (
    <>
      {tokens.map((token, idx) => (
        <span
          key={idx}
          style={{
            color: colors[token.type],
            fontStyle: token.type === 'comment' ? 'italic' : 'normal',
          }}
        >
          {token.text}
        </span>
      ))}
    </>
  );
};
