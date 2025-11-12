import { clsx } from 'clsx';
import type { LoadingSpinnerProps } from './types';

export function getLoadingSpinnerClassName(props: LoadingSpinnerProps): string {
  const { size = 'medium', className } = props;

  return clsx(
    'flex items-center justify-center',
    {
      'h-8 w-8': size === 'small',
      'h-12 w-12': size === 'medium',
      'h-16 w-16': size === 'large',
    },
    className
  );
}
