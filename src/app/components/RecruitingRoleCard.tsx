import { motion } from 'motion/react';
import { Mail, type LucideIcon } from 'lucide-react';
import { Button } from './Button';

export interface RoleDetail {
  icon: LucideIcon;
  label: string;
  text: string;
}

interface RecruitingRoleCardProps {
  title: string;
  /** Lead paragraphs — the story of the role, in the volunteer's language. */
  intro: string[];
  /** "What we hope you bring". */
  brings: string[];
  /** "What you gain". */
  gains: string[];
  /** The green panel down the right-hand side. */
  details: RoleDetail[];
  applyHref: string;
  applyLabel: string;
  /** The line under the buttons explaining what to send. */
  applyNote: string;
}

/**
 * One open volunteer role on the Programs page. The layout is shared so a new
 * role is a block of content rather than another copy of the markup — the
 * wrapping <section> and its spacing stay with the page.
 */
export function RecruitingRoleCard({
  title,
  intro,
  brings,
  gains,
  details,
  applyHref,
  applyLabel,
  applyNote,
}: RecruitingRoleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="rounded-3xl border border-primary/10 bg-card shadow-2xl shadow-primary/10 overflow-hidden">
        <div className="grid lg:grid-cols-5">
          {/* Role story */}
          <div className="lg:col-span-3 p-10 md:p-14">
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 text-secondary px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] mb-6">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              Now recruiting · Volunteer role
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-primary mb-6 leading-tight">
              {title}
            </h2>
            <div className="max-w-[70ch] space-y-9 text-muted-foreground leading-relaxed text-lg mb-8">
              {intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-3">
              What we hope you bring
            </p>
            <ul className="space-y-2 mb-8">
              {brings.map((item) => (
                <li
                  key={item}
                  className="text-sm text-muted-foreground flex items-start"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mr-3 mt-2 shrink-0"></div>
                  {item}
                </li>
              ))}
            </ul>

            <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-3">
              What you gain
            </p>
            <ul className="space-y-2 mb-10">
              {gains.map((item) => (
                <li
                  key={item}
                  className="text-sm text-muted-foreground flex items-start"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mr-3 mt-2 shrink-0"></div>
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={applyHref}
                className="inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-300 font-medium active:scale-95 hover:scale-[1.02] bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 px-8 py-4 text-lg"
              >
                <Mail size={20} aria-hidden="true" />
                {applyLabel}
              </a>
              <Button href="/contact" variant="outline" size="lg">
                Ask a Question
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">{applyNote}</p>
          </div>

          {/* Practical details */}
          <div className="lg:col-span-2 bg-primary text-primary-foreground p-10 md:p-14">
            <h3 className="font-serif text-2xl text-white mb-8">
              Practical Details
            </h3>
            <div className="space-y-7">
              {details.map(({ icon: Icon, label, text }) => (
                <div key={label} className="flex items-start gap-4">
                  <Icon size={22} aria-hidden="true" className="text-accent mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-white mb-1">{label}</p>
                    <p className="text-sm text-primary-foreground/80 leading-relaxed">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
