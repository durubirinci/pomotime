import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function Icon({ children, ...props }: IconProps): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  )
}

export const PlayIcon = (p: IconProps): React.JSX.Element => (
  <Icon {...p}>
    <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
  </Icon>
)
export const PauseIcon = (p: IconProps): React.JSX.Element => (
  <Icon {...p} strokeWidth={3.4}>
    <path d="M8.5 6v12M15.5 6v12" />
  </Icon>
)
export const ResetIcon = (p: IconProps): React.JSX.Element => (
  <Icon {...p}>
    <path d="M4.5 12a7.5 7.5 0 1 0 2.4-5.5" />
    <path d="M4 4.5v4.2h4.2" />
  </Icon>
)
export const SkipIcon = (p: IconProps): React.JSX.Element => (
  <Icon {...p}>
    <path d="M5.5 6v12l9-6z" fill="currentColor" />
    <path d="M18.5 6v12" />
  </Icon>
)
export const GearIcon = (p: IconProps): React.JSX.Element => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8" />
  </Icon>
)
export const PinIcon = (p: IconProps): React.JSX.Element => (
  <Icon {...p}>
    <path d="M9 4h6l-1 6 3.5 3.5h-11L10 10z" />
    <path d="M12 13.5V20" />
  </Icon>
)
export const SoundIcon = (p: IconProps): React.JSX.Element => (
  <Icon {...p}>
    <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z" />
    <path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.8 7.8 0 0 1 0 11" />
  </Icon>
)
export const MuteIcon = (p: IconProps): React.JSX.Element => (
  <Icon {...p}>
    <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z" />
    <path d="M16 9.5l5 5M21 9.5l-5 5" />
  </Icon>
)
export const ShrinkIcon = (p: IconProps): React.JSX.Element => (
  <Icon {...p}>
    <path d="M20 4l-6 6M14 5.5V10h4.5M4 20l6-6M10 18.5V14H5.5" />
  </Icon>
)
export const ExpandIcon = (p: IconProps): React.JSX.Element => (
  <Icon {...p}>
    <path d="M14 10l6-6M15.5 4H20v4.5M10 14l-6 6M8.500 20H4v-4.5" />
  </Icon>
)
export const MinusIcon = (p: IconProps): React.JSX.Element => (
  <Icon {...p} strokeWidth={3}>
    <path d="M6 12h12" />
  </Icon>
)
export const PlusIcon = (p: IconProps): React.JSX.Element => (
  <Icon {...p} strokeWidth={3}>
    <path d="M6 12h12M12 6v12" />
  </Icon>
)
export const CloseIcon = (p: IconProps): React.JSX.Element => (
  <Icon {...p} strokeWidth={3}>
    <path d="M7 7l10 10M17 7L7 17" />
  </Icon>
)
export const HeartIcon = (p: IconProps): React.JSX.Element => (
  <Icon {...p} stroke="none">
    <path
      d="M12 21s-7.5-4.6-9.6-9.3C.9 8.3 2.9 4.5 6.6 4.5c2.1 0 3.9 1.1 5.4 3 1.5-1.9 3.3-3 5.4-3 3.7 0 5.7 3.8 4.2 7.2C19.5 16.4 12 21 12 21z"
      fill="currentColor"
    />
  </Icon>
)

/** A carrot for the session row: orange when earned, a pale outline when not. */
export function CarrotIcon({
  filled,
  ...props
}: IconProps & { filled: boolean }): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden {...props}>
      <g transform="rotate(38 12 12)">
        <path
          d="M9.5 6.5 Q6.5 2.5 9 1 Q10.8 3 11.5 5.5 Q12 2 14.2 1 Q16.5 3 14.5 6.5Z"
          fill={filled ? '#7fcf8f' : 'none'}
          stroke={filled ? '#63b874' : 'currentColor'}
          strokeWidth={1.3}
          strokeLinejoin="round"
        />
        <path
          d="M12 23 Q10.6 22.5 10 20 L7.6 9.5 Q7.6 6 12 6 Q16.4 6 16.4 9.5 L14 20 Q13.4 22.500 12 23Z"
          fill={filled ? '#ffa24a' : 'none'}
          stroke={filled ? '#f08a30' : 'currentColor'}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        {filled && (
          <path
            d="M9.5 11.5h3M11.5 16h2.6"
            stroke="#f08a30"
            strokeWidth={1.3}
            strokeLinecap="round"
            fill="none"
          />
        )}
      </g>
    </svg>
  )
}
