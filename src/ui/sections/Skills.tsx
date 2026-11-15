import { AnimatePresence, motion } from 'framer-motion';
import { skills, systems, type SkillSystem } from '../../content/skills';
import { ui, useUI } from '../../lib/store';
import { MobileScrim, SectionLabel, Shell } from './common';

const ORDER = Object.keys(systems) as SkillSystem[];

export function Skills({ is3D }: { is3D: boolean }) {
  const selectedId = useUI((s) => s.selectedSkill);
  const hoveredId = useUI((s) => s.hoveredSkill);
  const shownId = hoveredId ?? selectedId;
  const skill = skills.find((s) => s.id === shownId) ?? skills[0];

  return (
    <section id="galaxy" data-station="galaxy" className="relative min-h-[100svh] pb-28 pt-[50svh] md:pt-28" aria-labelledby="skills-title">
      <div className="scrim-left pointer-events-none absolute inset-0 hidden md:block" aria-hidden />
      <MobileScrim />
      <Shell className="relative">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel index={3}>Skills galaxy</SectionLabel>
            <h2 id="skills-title" className="display mt-6 text-6xl sm:text-7xl" data-reveal>
              Constellation
              <br />
              of tools
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-mute" data-reveal>
              {is3D ? 'Select a star in the galaxy, or a skill below.' : 'Select a skill below.'} Every skill names the project, role or course
              that backs it.
            </p>

            <div className="mt-10 space-y-7">
              {ORDER.map((sys) => (
                <div key={sys} data-reveal>
                  <p className="eyebrow mb-3">{systems[sys].label}</p>
                  <div className="flex flex-wrap gap-2">
                    {skills
                      .filter((s) => s.system === sys)
                      .map((s) => {
                        const on = s.id === selectedId;
                        return (
                          <button
                            key={s.id}
                            onClick={() => ui.set({ selectedSkill: s.id })}
                            onMouseEnter={() => ui.set({ hoveredSkill: s.id })}
                            onMouseLeave={() => ui.set({ hoveredSkill: null })}
                            onFocus={() => ui.set({ hoveredSkill: s.id })}
                            onBlur={() => ui.set({ hoveredSkill: null })}
                            aria-pressed={on}
                            className={`chip ${on ? 'border-accent text-accent' : 'hover:border-bone/40 hover:text-bone'}`}
                          >
                            {s.name}
                          </button>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail readout */}
          <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <div className="lg:sticky lg:bottom-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                  className="border border-line bg-ink/80 p-6 backdrop-blur-md"
                  aria-live="polite"
                >
                  <p className="eyebrow text-accent">{systems[skill.system].label}</p>
                  <h3 className="display mt-3 text-4xl">{skill.name}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-bone/80">{skill.about}</p>
                  <p className="eyebrow mt-6">Evidence</p>
                  <ul className="mt-2 space-y-1.5">
                    {skill.evidence.map((e) => (
                      <li key={e} className="flex gap-3 text-sm text-mute">
                        <span className="text-accent">→</span>
                        {e}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Shell>
    </section>
  );
}
