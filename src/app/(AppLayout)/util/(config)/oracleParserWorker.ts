/// <reference lib="webworker" />

import { mapOracleToCSharp } from '../(functions)/queryUtils';
import { WorkerInput, WorkerOutput } from '../(interface)/WorkerTypes';

declare const self: Worker;
const ctx: Worker = self as any;

ctx.onmessage = (event: MessageEvent<WorkerInput>) => {
  const script = event.data.script;
  const result = parseOracleScript(script);
  ctx.postMessage({ result });
};

function parseOracleScript(script: string): any {
  const lines = script.split('\n');
  let tableName = '';
  const parsedLines = [];

  for (const line of lines) {
    if (line.trim().startsWith('--') || line.trim().startsWith('/*')) {
      continue;
    }

    if (line.trim().endsWith(';')) {
      continue;
    }

    const createTableMatch = RegExp(/CREATE TABLE (\w+)/i).exec(line.trim());

    if (createTableMatch) {
      tableName = transformToPascalCase(createTableMatch[1]);
      continue;
    }

    const matches = /^\s*(\w+)\s+(\w+)/.exec(line);
    if (matches?.[1] && matches?.[2]) {
      const originalName = matches[1];
      const oracleDataType = matches[2];
      const transformedName = transformToPascalCase(originalName);
      const cSharpType = mapOracleToCSharp(oracleDataType);
      const isId = originalName.toLowerCase() === 'id';

      parsedLines.push({
        originalName,
        transformedName,
        cSharpType,
        isId
      });
    }
  }

  return parsedLines;
}

function transformToPascalCase(name: string): string {
  return name.split('_')
             .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
             .join('');
}