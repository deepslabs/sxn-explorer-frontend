import type { ElementType } from 'react';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function getSvgComponent(value: unknown): ElementType | undefined {
  if (typeof value === 'function') {
    return value as ElementType;
  }

  if (isRecord(value) && typeof value.default === 'function') {
    return value.default as ElementType;
  }

  return undefined;
}

export function getSvgSrc(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value;
  }

  if (isRecord(value) && typeof value.src === 'string') {
    return value.src;
  }

  if (isRecord(value) && isRecord(value.default) && typeof value.default.src === 'string') {
    return value.default.src;
  }

  return undefined;
}
