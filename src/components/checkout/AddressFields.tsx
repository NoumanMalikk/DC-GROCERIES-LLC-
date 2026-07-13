"use client";

import { type Control, type FieldErrors, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CheckoutFormValues } from "./checkout-form-schema";

interface AddressFieldsProps {
  control: Control<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
  prefix: "shippingAddress" | "billingAddress";
  idPrefix: string;
}

export function AddressFields({
  control,
  errors,
  prefix,
  idPrefix,
}: AddressFieldsProps) {
  const fieldErrors = errors[prefix];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Label htmlFor={`${idPrefix}-line1`} required>
          Street address
        </Label>
        <Controller
          name={`${prefix}.line1`}
          control={control}
          render={({ field }) => (
            <Input
              id={`${idPrefix}-line1`}
              autoComplete="address-line1"
              error={Boolean(fieldErrors?.line1)}
              {...field}
            />
          )}
        />
        {fieldErrors?.line1 && (
          <p className="mt-1 text-xs text-tomato-red">
            {fieldErrors.line1.message}
          </p>
        )}
      </div>

      <div className="sm:col-span-2">
        <Label htmlFor={`${idPrefix}-line2`}>Apartment, suite, etc.</Label>
        <Controller
          name={`${prefix}.line2`}
          control={control}
          render={({ field }) => (
            <Input
              id={`${idPrefix}-line2`}
              autoComplete="address-line2"
              {...field}
              value={field.value ?? ""}
            />
          )}
        />
      </div>

      <div>
        <Label htmlFor={`${idPrefix}-city`} required>
          City
        </Label>
        <Controller
          name={`${prefix}.city`}
          control={control}
          render={({ field }) => (
            <Input
              id={`${idPrefix}-city`}
              autoComplete="address-level2"
              error={Boolean(fieldErrors?.city)}
              {...field}
            />
          )}
        />
        {fieldErrors?.city && (
          <p className="mt-1 text-xs text-tomato-red">
            {fieldErrors.city.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor={`${idPrefix}-state`} required>
          State
        </Label>
        <Controller
          name={`${prefix}.state`}
          control={control}
          render={({ field }) => (
            <Input
              id={`${idPrefix}-state`}
              autoComplete="address-level1"
              placeholder="GA"
              maxLength={2}
              error={Boolean(fieldErrors?.state)}
              {...field}
              onChange={(e) => field.onChange(e.target.value.toUpperCase())}
            />
          )}
        />
        {fieldErrors?.state && (
          <p className="mt-1 text-xs text-tomato-red">
            {fieldErrors.state.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor={`${idPrefix}-postalCode`} required>
          ZIP code
        </Label>
        <Controller
          name={`${prefix}.postalCode`}
          control={control}
          render={({ field }) => (
            <Input
              id={`${idPrefix}-postalCode`}
              autoComplete="postal-code"
              error={Boolean(fieldErrors?.postalCode)}
              {...field}
            />
          )}
        />
        {fieldErrors?.postalCode && (
          <p className="mt-1 text-xs text-tomato-red">
            {fieldErrors.postalCode.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor={`${idPrefix}-country`}>Country</Label>
        <Controller
          name={`${prefix}.country`}
          control={control}
          render={({ field }) => (
            <Input
              id={`${idPrefix}-country`}
              autoComplete="country-name"
              readOnly
              {...field}
            />
          )}
        />
      </div>
    </div>
  );
}
