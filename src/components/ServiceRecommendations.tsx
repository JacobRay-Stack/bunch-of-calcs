"use client";

import { SERVICES, CALCULATOR_SERVICES } from "@/lib/services";

interface ServiceRecommendationsProps {
  calculatorSlug: string;
  contextLine?: string;
}

export default function ServiceRecommendations({
  calculatorSlug,
  contextLine,
}: ServiceRecommendationsProps) {
  const serviceKeys = CALCULATOR_SERVICES[calculatorSlug];
  if (!serviceKeys || serviceKeys.length === 0) return null;

  const services = serviceKeys
    .map((key) => SERVICES[key])
    .filter(Boolean);

  // Append UTM params so you can track which calculator drives affiliate clicks
  const withUtm = (url: string, serviceName: string) => {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}utm_source=bunchofcalcs&utm_medium=affiliate&utm_campaign=${calculatorSlug}&utm_content=${serviceName.toLowerCase().replace(/\s+/g, "-")}`;
  };

  return (
    <div className="mt-10 print:hidden">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Ready to put these numbers to work?
        </h2>
        {contextLine ? (
          <p className="text-sm text-gray-600 dark:text-gray-400">{contextLine}</p>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tools that pair well with this calculator.
          </p>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <a
            key={service.name}
            href={withUtm(service.url, service.name)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            aria-label={`${service.cta} -- opens in a new tab`}
            className="group flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-teal-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-teal-600"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-gray-900 group-hover:text-teal-600 dark:text-gray-100 dark:group-hover:text-teal-400">
                  {service.name}
                </span>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  {service.tag}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{service.description}</p>
            </div>
            <div className="mt-4">
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600 group-hover:text-teal-700 dark:text-teal-400 dark:group-hover:text-teal-300">
                {service.cta}
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </div>
          </a>
        ))}
      </div>
      <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
        We may earn a commission if you sign up through these links, at no extra
        cost to you. We only recommend tools we&apos;d use ourselves.
      </p>
    </div>
  );
}
