/**
 * OurozBackground – Shared decorative background system
 * Renders: grain texture, Moroccan arch, ⵣ watermark, sand dunes
 */

interface OurozBackgroundProps {
  showArch?: boolean;
  showWatermark?: boolean;
  showDunes?: boolean;
}

export default function OurozBackground({
  showArch = true,
  showWatermark = true,
  showDunes = true,
}: OurozBackgroundProps) {
  return (
    <>
      {/* 1. Grain texture overlay */}
      <div
        className="fixed inset-0 z-[100] pointer-events-none opacity-[0.04] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 2. Subtle warm radial glow */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(253, 248, 240, 0.5) 0%, transparent 70%)',
        }}
      />

      {/* 3. Moroccan arch — left side decorative element */}
      {showArch && (
        <div className="absolute left-0 top-0 bottom-0 w-[200px] lg:w-[280px] z-[5] pointer-events-none overflow-hidden">
          {/* Arch shape */}
          <div className="absolute inset-0 flex flex-col items-center">
            {/* Arch background */}
            <div
              className="w-[180px] lg:w-[240px] mt-[100px] flex-1 relative"
              style={{
                background: 'linear-gradient(180deg, #E8D5BE 0%, #D4C4A8 40%, #C9B896 100%)',
                borderRadius: '120px 120px 0 0',
                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.08), 4px 0 20px rgba(0,0,0,0.04)',
              }}
            >
              {/* Inner arch cutout */}
              <div
                className="absolute left-1/2 -translate-x-1/2 top-[30px] w-[120px] lg:w-[160px] h-[300px] lg:h-[400px]"
                style={{
                  background: 'linear-gradient(180deg, #C9B48A 0%, #B8A47A 50%, #A89468 100%)',
                  borderRadius: '80px 80px 0 0',
                  boxShadow: 'inset 0 10px 30px rgba(0,0,0,0.15)',
                }}
              >
                {/* Lantern */}
                <div className="absolute left-1/2 -translate-x-1/2 top-[20px] flex flex-col items-center">
                  {/* Chain */}
                  <div className="w-[1px] h-[30px] lg:h-[50px] bg-[var(--color-charcoal)]/20" />
                  {/* Lantern body */}
                  <div
                    className="w-[20px] lg:w-[28px] h-[35px] lg:h-[48px] rounded-[4px]"
                    style={{
                      background: 'linear-gradient(180deg, #8B7332 0%, #6B5522 50%, #4B3812 100%)',
                      boxShadow: '0 0 15px rgba(212, 175, 55, 0.3), 0 0 30px rgba(212, 175, 55, 0.15)',
                    }}
                  >
                    {/* Glow */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[40px] lg:w-[60px] h-[40px] lg:h-[60px] rounded-full opacity-40"
                      style={{
                        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.4) 0%, transparent 70%)',
                      }}
                    />
                  </div>
                  {/* Bottom point */}
                  <div
                    className="w-0 h-0"
                    style={{
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: '8px solid #4B3812',
                    }}
                  />
                </div>

                {/* Shadow/light play inside arch */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[60%]"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.1) 0%, transparent 100%)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. OUROZ logo watermark — right side, large, faded */}
      {showWatermark && (
        <div className="absolute right-[-20px] lg:right-[60px] top-[100px] lg:top-[120px] z-[2] pointer-events-none select-none">
          <img
            src="/logo/logo.png"
            alt=""
            aria-hidden="true"
            draggable={false}
            className="w-[280px] sm:w-[380px] lg:w-[460px] h-auto opacity-[0.12]"
            style={{ filter: 'contrast(0.9) saturate(0.9)' }}
          />
        </div>
      )}

      {/* 5. Sand dunes foreground — bottom */}
      {showDunes && (
        <div className="absolute bottom-0 left-0 right-0 z-[8] pointer-events-none h-[180px] lg:h-[260px]">
          {/* Back dune */}
          <div
            className="absolute bottom-0 left-[-5%] right-[-5%] h-[140px] lg:h-[200px]"
            style={{
              background: 'linear-gradient(180deg, transparent 0%, #E2CDB3 30%, #D8C3A5 100%)',
              borderRadius: '50% 60% 0 0 / 100% 100% 0 0',
            }}
          />
          {/* Front dune */}
          <div
            className="absolute bottom-0 left-[-10%] right-[-10%] h-[100px] lg:h-[160px]"
            style={{
              background: 'linear-gradient(180deg, transparent 0%, #DCC8A8 20%, #D4BC9A 100%)',
              borderRadius: '40% 55% 0 0 / 100% 100% 0 0',
            }}
          />
          {/* Foreground dune */}
          <div
            className="absolute bottom-0 left-[-8%] right-[-8%] h-[70px] lg:h-[120px]"
            style={{
              background: 'linear-gradient(180deg, transparent 0%, #D6C09E 30%, #CCAF8A 100%)',
              borderRadius: '45% 50% 0 0 / 100% 100% 0 0',
            }}
          />
        </div>
      )}
    </>
  );
}
