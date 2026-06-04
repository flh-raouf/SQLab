---
name: TanStack Form
description: |
  TanStack Form with Zod validation in React. Form state management, field validation,
  and Zod schema integration.
  Keywords: TanStack Form, useForm, Field, form validation, zod schema, onSubmit
---

# TanStack Form

> **Documentation:** [tanstack.com/form](https://tanstack.com/form) | Use `context7` for API reference

Use TanStack Form (`@tanstack/react-form`) with Zod for form state management.

## Zod Schema Generation

Schemas are generated from backend models and extended in feature slices:

```typescript
// Generated in @/generated/schemas.ts (auto-generated from backend)
import { z } from 'zod';
export const LoginSchema = z.object({ email: z.string().email(), password: z.string() });
export type LoginFormData = z.infer<typeof LoginSchema>;

// Extended in feature schemas.ts
// From src/features/auth/schemas.ts
import { ChangePasswordModelSchema } from '@/generated/schemas';

export const ChangePasswordSchema = ChangePasswordModelSchema.extend({
    confirm_password: z.string().min(6).max(100)
}).refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password']
});
export type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;

// Re-export generated schemas
export { LoginSchema, type LoginFormData } from '@/generated/schemas';
```

## Basic Form Pattern

Example usage in a React component:

```tsx
import { useForm } from '@tanstack/react-form';
import * as Field from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { type LoginFormData, LoginSchema } from '@/features/auth/schemas';
import { ariaInvalid, mapFieldErrors } from '@/shared/validation';

export function LoginForm() {
    const form = useForm({
        defaultValues: {
            email: '',
            password: ''
        } as LoginFormData,
        validators: {
            onChange: LoginSchema,
        },
        onSubmit: async ({ value }) => {
            // Perform submission logic
            await login(value.email, value.password);
        }
    });

    return (
        <form 
            onSubmit={(e) => { 
                e.preventDefault(); 
                e.stopPropagation();
                form.handleSubmit(); 
            }}
        >
            <form.Field
                name="email"
                children={(field) => (
                    <Field.Field data-invalid={ariaInvalid(field)}>
                        <Field.Label htmlFor={field.name}>Email</Field.Label>
                        <Input
                            id={field.name}
                            type="email"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={ariaInvalid(field)}
                        />
                        <Field.Error errors={mapFieldErrors(field.state.meta.errors)} />
                    </Field.Field>
                )}
            />

            <form.Subscribe
                selector={(state) => state.isSubmitting}
                children={(isSubmitting) => (
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Logging in...' : 'Log In'}
                    </Button>
                )}
            />
        </form>
    );
}
```

## Form in Dialog Pattern

Close dialog only after successful submission:

```tsx
const [open, setOpen] = useState(false);

const form = useForm({
    defaultValues: { name: '' },
    validators: {
        onChange: mySchema,
    },
    onSubmit: async ({ value }) => {
        await createMutation.mutateAsync(value);
        setOpen(false);
    }
});
```

## References

See [heroui-native](../heroui-native/SKILL.md) for component patterns.
