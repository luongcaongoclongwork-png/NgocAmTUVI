"use client";

import { startTransition, type ComponentProps } from "react";

/**
 * <form> for admin edit screens that keeps what the admin typed when the
 * server rejects the save. With `<form action={fn}>`, React 19 resets every
 * uncontrolled field to its defaultValue after the action — so a single
 * "Vui lòng nhập tiêu đề" wiped a half-written article. Submitting through
 * onSubmit instead dispatches the same useActionState action without that
 * automatic reset. (Successful saves redirect away, so nothing lingers.)
 */
export default function KeepValuesForm({
  action,
  ...props
}: Omit<ComponentProps<"form">, "action" | "onSubmit"> & { action: (formData: FormData) => void }) {
  return (
    <form
      {...props}
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget, (e.nativeEvent as SubmitEvent).submitter);
        startTransition(() => action(formData));
      }}
    />
  );
}
