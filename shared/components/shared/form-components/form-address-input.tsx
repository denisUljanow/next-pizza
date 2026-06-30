"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "../../ui/input";
import { ClearButton } from "../clear-button";
import { ErrorText } from "../error-text";
import { RequiredSymbol } from "../required-symbol";

type PhotonFeature = {
  properties: {
    name?: string;
    street?: string;
    housenumber?: string;
    postcode?: string;
    city?: string;
    district?: string;
    country?: string;
  };
};

type PhotonResponse = {
  features?: PhotonFeature[];
};

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  cityName?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

const buildAddressLabel = (feature: PhotonFeature) => {
  const { name, street, housenumber, postcode, city, district, country } = feature.properties;
  const streetLine = [street ?? name, housenumber].filter(Boolean).join(" ");
  const cityLine = [postcode, city ?? district].filter(Boolean).join(" ");

  return [streetLine, cityLine, country].filter(Boolean).join(", ");
};

export const FormAddressInput: React.FC<Props> = ({
  className,
  name,
  cityName,
  label,
  required,
  ...props
}) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const field = register(name);
  const value = (watch(name) ?? "") as string;
  const errorText = errors[name]?.message as string | undefined;
  const [suggestions, setSuggestions] = React.useState<PhotonFeature[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const query = value.trim();

    if (query.length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams({
          q: query,
          limit: "5",
          lang: "de",
        });

        const response = await fetch(`https://photon.komoot.io/api/?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Photon request failed");
        }

        const data = (await response.json()) as PhotonResponse;
        setSuggestions(data.features ?? []);
        setOpen(true);
      } catch {
        if (!controller.signal.aborted) {
          setSuggestions([]);
          setOpen(false);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [value]);

  const onClickClear = () => {
    setValue(name, "", { shouldDirty: true, shouldValidate: true });
    setSuggestions([]);
    setOpen(false);
  };

  const onSelectSuggestion = (feature: PhotonFeature) => {
    const address = buildAddressLabel(feature);
    const city = feature.properties.city ?? feature.properties.district ?? "";

    setValue(name, address, { shouldDirty: true, shouldValidate: true });

    if (cityName && city) {
      setValue(cityName, city, { shouldDirty: true, shouldValidate: true });
    }

    setOpen(false);
    setSuggestions([]);
  };

  return (
    <div className={className}>
      {label && (
        <p className="font-medium mb-2">
          {label} {required && <RequiredSymbol />}
        </p>
      )}

      <div className="relative">
        <Input
          className="h-12 text-md"
          {...field}
          {...props}
          autoComplete="street-address"
          onBlur={(event) => {
            field.onBlur(event);
            window.setTimeout(() => setOpen(false), 150);
          }}
          onChange={(event) => {
            field.onChange(event);
            setOpen(true);
          }}
          onFocus={() => {
            if (suggestions.length > 0) {
              setOpen(true);
            }
          }}
        />

        {value && <ClearButton onClick={onClickClear} />}

        {open && (suggestions.length > 0 || loading) && (
          <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-md border bg-white shadow-lg">
            {loading && suggestions.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-400">Adressen werden gesucht...</div>
            )}

            {suggestions.map((suggestion, index) => (
              <button
                key={`${buildAddressLabel(suggestion)}-${index}`}
                type="button"
                className="block w-full px-4 py-3 text-left text-sm hover:bg-gray-50"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onSelectSuggestion(suggestion)}>
                {buildAddressLabel(suggestion)}
              </button>
            ))}
          </div>
        )}
      </div>

      {errorText && <ErrorText className="mt-2" text={errorText} />}
    </div>
  );
};
