"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent, type ReactNode } from "react";

type AutoSubmitFilterFormProps = {
  children: ReactNode;
};

export function AutoSubmitFilterForm({ children }: AutoSubmitFilterFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  function navigateWithFilters() {
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const params = new URLSearchParams();

    formData.forEach((value, key) => {
      const stringValue = String(value).trim();
      if (!stringValue) return;
      if (key === "sort" && stringValue === "editorial") return;
      params.set(key, stringValue);
    });

    const query = params.toString();
    router.push(query ? `/schoenen?${query}` : "/schoenen");
  }

  function submitSoon(delay = 0) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsUpdating(true);
    timeoutRef.current = setTimeout(() => {
      navigateWithFilters();
    }, delay);
  }

  function handleChange(event: FormEvent<HTMLFormElement>) {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) return;
    if (target.type === "hidden") return;

    if (target instanceof HTMLInputElement && target.type === "number") {
      submitSoon(450);
      return;
    }

    submitSoon();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsUpdating(true);
    navigateWithFilters();
  }

  return (
    <form action="/schoenen" className="filter-form" onChange={handleChange} onInput={handleChange} onSubmit={handleSubmit} ref={formRef}>
      {children}
      <p aria-live="polite" className="filter-live-status">
        {isUpdating ? "Resultaten bijwerken..." : "Filters werken direct zodra je iets kiest."}
      </p>
    </form>
  );
}
