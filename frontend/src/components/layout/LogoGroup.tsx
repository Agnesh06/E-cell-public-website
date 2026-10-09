import { site } from '@/data/site'

export function LogoGroup() {
  return (
    <div className="logo-group" aria-label="Brand and partner logos">
      {site.logos.map((logo, index) => {
        const img = (
          <img
            src={logo.src}
            alt={logo.alt}
            className="logo-group__image grayscale select-none"
            height={36}
          />
        )

        return (
          <div
            key={index}
            className="logo-group__item"
          >
            {logo.href ? (
              <a
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                className="logo-group__link"
              >
                {img}
              </a>
            ) : (
              img
            )}
          </div>
        )
      })}
    </div>
  )
}

export default LogoGroup
