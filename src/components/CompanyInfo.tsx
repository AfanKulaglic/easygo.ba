import { Building2 } from 'lucide-react'
import { COMPANY } from '@/lib/company'

export default function CompanyInfo({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-surface rounded-2xl p-5 lg:p-6 border border-white/5 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Building2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-text mb-1">Podaci o društvu</h2>
          <p className="text-sm text-muted leading-relaxed">
            <span className="text-text font-medium">{COMPANY.name}</span>
            <br />
            Sjedište firme: {COMPANY.address}
            <br />
            JIB: {COMPANY.jib}
            <br />
            Registarski broj: MBS: {COMPANY.mbs}
          </p>
        </div>
      </div>
    </div>
  )
}
