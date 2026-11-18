import type { ProductIconType, ProductId } from '../domain/products';

interface IllustrationProps {
  readonly productId: ProductId;
  readonly iconType?: ProductIconType;
  readonly className?: string;
}

/**
 * Barcha mahsulot turlari uchun maxsus chizilgan inline SVG illyustratsiyalar
 */
export function ProductIllustration({
  productId,
  iconType,
  className = 'w-14 h-14',
}: IllustrationProps) {
  const resolvedType: ProductIconType =
    iconType ??
    (productId === 'M01'
      ? 'paper'
      : productId === 'M02'
        ? 'notebook'
        : productId === 'M03'
          ? 'pen'
          : productId === 'M04'
            ? 'folder'
            : productId === 'M06'
              ? 'printer'
              : productId === 'M07'
                ? 'organizer'
                : 'box');

  switch (resolvedType) {
    case 'paper':
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          aria-hidden="true"
          className={className}
        >
          <rect
            x="10"
            y="18"
            width="44"
            height="34"
            rx="4"
            className="fill-slate-200 dark:fill-slate-700"
          />
          <rect
            x="12"
            y="14"
            width="42"
            height="34"
            rx="4"
            className="fill-white stroke-ink-primary dark:fill-slate-800 dark:stroke-blue-400"
            strokeWidth="2.2"
          />
          <path
            d="M12 38H54M12 43H54"
            className="stroke-slate-300 dark:stroke-slate-600"
            strokeWidth="1.5"
          />
          <rect
            x="18"
            y="20"
            width="16"
            height="10"
            rx="2"
            className="fill-ink-primary dark:fill-blue-500"
          />
          <text
            x="26"
            y="27.5"
            textAnchor="middle"
            className="fill-white font-mono text-[8px] font-bold"
          >
            A4
          </text>
          <line
            x1="38"
            y1="22"
            x2="48"
            y2="22"
            className="stroke-slate-400"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="38"
            y1="27"
            x2="45"
            y2="27"
            className="stroke-lime-accent dark:stroke-lime-bright"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'notebook':
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          aria-hidden="true"
          className={className}
        >
          <rect
            x="15"
            y="10"
            width="36"
            height="44"
            rx="4"
            className="fill-amber-50 stroke-ink-primary dark:fill-slate-800 dark:stroke-blue-400"
            strokeWidth="2.2"
          />
          <rect
            x="15"
            y="10"
            width="7"
            height="44"
            rx="2"
            className="fill-ink-primary dark:fill-blue-600"
          />
          <rect
            x="27"
            y="18"
            width="18"
            height="11"
            rx="2"
            className="fill-white stroke-slate-300 dark:fill-slate-900 dark:stroke-slate-600"
            strokeWidth="1.5"
          />
          <line
            x1="30"
            y1="22"
            x2="42"
            y2="22"
            className="stroke-ink-primary dark:stroke-blue-400"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <line
            x1="30"
            y1="25.5"
            x2="38"
            y2="25.5"
            className="stroke-amber-accent dark:stroke-amber-bright"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M42 54V45L45 47.5L48 45V54"
            className="fill-lime-accent dark:fill-lime-bright"
          />
        </svg>
      );

    case 'pen':
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          aria-hidden="true"
          className={className}
        >
          <path
            d="M44 12L52 20L24 48L13 51L16 40L44 12Z"
            className="fill-white stroke-ink-primary dark:fill-slate-800 dark:stroke-blue-400"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path
            d="M38 18L46 26"
            className="stroke-ink-primary dark:stroke-blue-400"
            strokeWidth="2.2"
          />
          <path
            d="M44 12L52 20L48 24L40 16L44 12Z"
            className="fill-ink-primary dark:fill-blue-500"
          />
          <path
            d="M47 11L55 19L51 23"
            className="stroke-amber-accent dark:stroke-amber-bright"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13 51L18 49L15 46L13 51Z"
            className="fill-ink-primary dark:fill-blue-400"
          />
          <path
            d="M14 53C19 53 23 50 28 52C33 54 38 51 44 53"
            className="stroke-lime-accent dark:stroke-lime-bright"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'folder':
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          aria-hidden="true"
          className={className}
        >
          <path
            d="M10 18C10 15.7909 11.7909 14 14 14H26L31 19H50C52.2091 19 54 20.7909 54 23V46C54 48.2091 52.2091 50 50 50H14C11.7909 50 10 48.2091 10 46V18Z"
            className="fill-amber-50 stroke-ink-primary dark:fill-slate-800 dark:stroke-blue-400"
            strokeWidth="2.2"
          />
          <rect
            x="16"
            y="24"
            width="32"
            height="20"
            rx="2"
            className="fill-white stroke-slate-300 dark:fill-slate-900 dark:stroke-slate-600"
            strokeWidth="1.5"
          />
          <circle
            cx="22"
            cy="31"
            r="2"
            className="fill-ink-primary dark:fill-blue-400"
          />
          <circle
            cx="22"
            cy="37"
            r="2"
            className="fill-ink-primary dark:fill-blue-400"
          />
          <line
            x1="28"
            y1="31"
            x2="42"
            y2="31"
            className="stroke-ink-primary dark:stroke-blue-400"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="28"
            y1="37"
            x2="38"
            y2="37"
            className="stroke-lime-accent dark:stroke-lime-bright"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'printer':
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          aria-hidden="true"
          className={className}
        >
          <rect
            x="18"
            y="10"
            width="28"
            height="14"
            rx="2"
            className="fill-white stroke-ink-primary dark:fill-slate-800 dark:stroke-blue-400"
            strokeWidth="2"
          />
          <rect
            x="10"
            y="22"
            width="44"
            height="22"
            rx="5"
            className="fill-ink-primary dark:fill-blue-600"
          />
          <rect
            x="18"
            y="36"
            width="28"
            height="18"
            rx="2"
            className="fill-white stroke-ink-primary dark:fill-slate-800 dark:stroke-blue-400"
            strokeWidth="2"
          />
          <circle cx="46" cy="29" r="2.5" className="fill-lime-bright" />
          <line
            x1="23"
            y1="43"
            x2="41"
            y2="43"
            className="stroke-slate-400"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="23"
            y1="48"
            x2="35"
            y2="48"
            className="stroke-lime-accent dark:stroke-lime-bright"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'organizer':
    case 'lamp':
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          aria-hidden="true"
          className={className}
        >
          <rect
            x="12"
            y="26"
            width="40"
            height="26"
            rx="4"
            className="fill-white stroke-ink-primary dark:fill-slate-800 dark:stroke-blue-400"
            strokeWidth="2.2"
          />
          <rect
            x="18"
            y="12"
            width="8"
            height="16"
            rx="2"
            className="fill-amber-accent dark:fill-amber-bright"
          />
          <rect
            x="30"
            y="15"
            width="8"
            height="13"
            rx="2"
            className="fill-ink-primary dark:fill-blue-500"
          />
          <rect
            x="41"
            y="18"
            width="6"
            height="10"
            rx="2"
            className="fill-lime-accent dark:fill-lime-bright"
          />
          <line
            x1="12"
            y1="38"
            x2="52"
            y2="38"
            className="stroke-slate-300 dark:stroke-slate-600"
            strokeWidth="2"
          />
        </svg>
      );

    case 'box':
    default:
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          aria-hidden="true"
          className={className}
        >
          <path
            d="M12 22L32 12L52 22V44L32 54L12 44V22Z"
            className="fill-amber-50 stroke-ink-primary dark:fill-slate-800 dark:stroke-blue-400"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path
            d="M12 22L32 32L52 22"
            className="stroke-ink-primary dark:stroke-blue-400"
            strokeWidth="2.2"
          />
          <path
            d="M32 32V54"
            className="stroke-ink-primary dark:stroke-blue-400"
            strokeWidth="2.2"
          />
          <path
            d="M22 17L42 27"
            className="stroke-lime-accent dark:stroke-lime-bright"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}
