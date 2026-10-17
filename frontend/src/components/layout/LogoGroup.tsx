import { site } from '@/data/site'

export function LogoGroup() {
  return (
    <div className="logo-group" aria-label="Brand and partner logos">
      {site.logos.map((logo, index) => {
        const img = (
          <div className="flex items-center justify-center w-full h-full rounded-full bg-white shadow-md border border-black/5 p-1 sm:p-1.5 transition-all duration-300 hover:scale-110 hover:shadow-lg overflow-hidden shrink-0">
            <img
              src={logo.src}
              alt={logo.alt}
              className="logo-group__image w-full h-full object-contain select-none pointer-events-none"
              loading="eager"
              decoding="async"
            />
          </div>
        )

        return (
          <div
            key={index}
            className="logo-group__item flex items-center justify-center shrink-0"
          >
            {logo.href ? (
              <a
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                className="logo-group__link w-full h-full flex items-center justify-center rounded-full no-underline"
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
