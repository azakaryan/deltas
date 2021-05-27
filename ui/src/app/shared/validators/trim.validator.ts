import {FormControl} from "@angular/forms";

export const trimValidator: any = ({ value }: FormControl) => {
  if (!value) return null;

  if (value.startsWith(' ') || value.endsWith(' ')) {
    return {
      trimError: { message: 'control has incorrect whitespace' },
    };
  }
  return null;
};
