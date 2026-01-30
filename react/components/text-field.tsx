import { Field } from "@adn-ui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";

export interface TextFieldProps extends React.ComponentProps<typeof Field.Root> {
  label: string;
}

export function TextField({ label, ...props }: TextFieldProps) {
  return (
    <Field.Root {...props}>
      <Field.Label>{label}</Field.Label>
      <Field.Input />
      <Field.ErrorMessage />
    </Field.Root>
  );
}

export function PasswordField({ label, ...props }: TextFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <Field.Root {...props}>
      <Field.Label>{label}</Field.Label>
      <div className='relative'>
        <Field.Input
          type={isPasswordVisible ? "text" : "password"}
          className='pl-10'
        />
        <button
          type='button'
          onClick={() => setIsPasswordVisible((prev) => !prev)}
          className='absolute top-1/2 right-3 -translate-y-1/2'
        >
          <Icon
            icon={isPasswordVisible ? "mdi:eye-off-outline" : "mdi:eye-outline"}
            className='text-muted-foreground size-5'
          />
        </button>
      </div>
      <Field.ErrorMessage />
    </Field.Root>
  );
}
