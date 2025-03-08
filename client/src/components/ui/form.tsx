import * as React from "react";
import { useFormContext } from "react-hook-form";

const Form = ({ children, ...props }: React.HTMLProps<HTMLFormElement>) => (
  <form {...props}>{children}</form>
);

const FormField = ({ name, render }: { name: string; render: any }) => {
  const { control } = useFormContext();
  return render({ field: { name, control } });
};

const FormItem = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-2">{children}</div>
);

const FormLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="font-semibold">{children}</label>
);

const FormControl = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

const FormMessage = () => <p className="text-red-500 text-sm">Invalid input</p>;

export { Form, FormField, FormItem, FormLabel, FormControl, FormMessage };
