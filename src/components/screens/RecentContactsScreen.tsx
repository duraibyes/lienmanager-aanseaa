import { useState } from 'react';
import { Users, Mail, Phone, MapPin, Building, Eye, UserCheck, Briefcase, ChevronRight, Loader2 } from 'lucide-react';
import { ProjectContact, useGetProjectContactsQuery } from '../../features/project/ProjectContactApi';
import ContactView from '../Parts/Contact/ContactView';

const primaryGradient = "linear-gradient(-30deg, #0075be, #00aeea 100%)";
const secondaryGradient = "linear-gradient(-30deg, #334756, #003F58 100%)";

function GradientText({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={className}
      style={{
        backgroundImage: secondaryGradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        display: 'inline-block',
      }}
    >
      {children}
    </span>
  );
}

function ContactRow({ contact, onView }: { contact: ProjectContact; onView: () => void }) {
  const name = contact?.contacts
    ?.map((c: { firstName: string; lastName: string }) => `${c.firstName} ${c.lastName}`)
    .join(', ');

  const phone = contact?.contacts?.[0]?.directPhone || contact?.contacts?.[0]?.cell;

  return (
    <div className="group grid grid-cols-[2fr_2fr_1.5fr_1.5fr_auto] items-center gap-4 px-6 py-4 border-b border-slate-100 hover:bg-gradient-to-r hover:from-blue-50/60 hover:to-cyan-50/30 transition-all duration-200 last:border-0">
      {/* Name + Avatar */}
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-bold shadow-md"
          style={{ background: primaryGradient }}
        >
          {name?.[0] ?? '?'}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{name || '—'}</p>
          {contact.title && (
            <p className="text-xs text-slate-400 truncate">{contact.title}</p>
          )}
        </div>
      </div>

      {/* Company + Email */}
      <div className="min-w-0 space-y-0.5">
        {contact.company && (
          <div className="flex items-center gap-1.5 text-slate-600 text-xs truncate">
            <Building className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate font-medium">{contact.company}</span>
          </div>
        )}
        {contact.email && (
          <div className="flex items-center gap-1.5 text-slate-500 text-xs truncate">
            <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{contact.email}</span>
          </div>
        )}
      </div>

      {/* Phone */}
      <div className="min-w-0">
        {phone ? (
          <div className="flex items-center gap-1.5 text-slate-600 text-xs">
            <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{phone}</span>
          </div>
        ) : (
          <span className="text-xs text-slate-300">—</span>
        )}
      </div>

      {/* Location */}
      <div className="min-w-0">
        {contact.city && contact.state ? (
          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{contact.city}, {contact.state}</span>
          </div>
        ) : (
          <span className="text-xs text-slate-300">—</span>
        )}
      </div>

      {/* Action */}
      <button
        onClick={onView}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0075be] bg-blue-50 hover:bg-blue-100 opacity-0 group-hover:opacity-100 transition-all duration-150 whitespace-nowrap"
      >
        <Eye className="w-3.5 h-3.5" />
        View
      </button>
    </div>
  );
}

function StatPill({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
        style={{ background: primaryGradient }}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-xl font-extrabold leading-none" style={{ backgroundImage: secondaryGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          {value}
        </p>
        <p className="text-xs text-slate-400 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function RecentContactsScreen() {
  const { data: projectContactData, isLoading } = useGetProjectContactsQuery();

  const totalCount = (projectContactData?.customerContact?.length || 0) + (projectContactData?.projectContact?.length || 0);
  const customerContactCount = projectContactData?.customerContact?.length || 0;
  const projectContactCount = projectContactData?.projectContact?.length || 0;

  const [selectedContact, setSelectedContact] = useState<ProjectContact | null>(null);
  const [activeTab, setActiveTab] = useState<'customer' | 'industry'>('customer');

  const contacts = activeTab === 'customer'
    ? projectContactData?.customerContact
    : projectContactData?.projectContact;

  return (
    <div className="min-h-screen bg-slate-50/70 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div>
            {/* Accent line */}
            {/* <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-0.5 rounded-full" style={{ background: primaryGradient }} />
              <span className="text-xs font-bold tracking-widest uppercase text-slate-400">Recent Contacts</span>
            </div> */}
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-none">
              <GradientText>Recent Contacts</GradientText>
            </h1>
            <p className="text-slate-500 text-sm mt-2 font-medium">
              Your most recently added customer and industry contacts
            </p>
          </div>

          {/* Stat Pills */}
          <div className="flex flex-wrap gap-3">
            <StatPill label="Total" value={totalCount} icon={Users} />
            <StatPill label="Customers" value={customerContactCount} icon={UserCheck} />
            <StatPill label="Industry" value={projectContactCount} icon={Briefcase} />
          </div>
        </div>

        {/* ── Main Panel ── */}
        <div className="mt-6 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">

          {/* Panel Header with Tab Switcher */}
          <div
            className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100"
            style={{ background: 'linear-gradient(to right, #f8fafc, #f0f7ff)' }}
          >
            <div className="flex items-center gap-2">
              <GradientText className="text-base font-extrabold">
                {activeTab === 'customer' ? 'Customer Contacts' : 'Industry Contacts'}
              </GradientText>
              <span
                className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold text-white"
                style={{ background: primaryGradient }}
              >
                {activeTab === 'customer' ? customerContactCount : projectContactCount}
              </span>
            </div>

            {/* Pill Tab Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-fit">
              {([
                { key: 'customer', label: 'Customers', icon: UserCheck },
                { key: 'industry', label: 'Industry', icon: Briefcase },
              ] as const).map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                    activeTab === key
                      ? 'text-white shadow-md'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                  style={activeTab === key ? { background: primaryGradient } : {}}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-[2fr_2fr_1.5fr_1.5fr_auto] gap-4 px-6 py-2.5 bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span>Name</span>
            <span>Company / Email</span>
            <span>Phone</span>
            <span>Location</span>
            <span className="w-16" />
          </div>

          {/* Table Body */}
          <div className="max-h-[560px] overflow-y-auto slim-scrollbar">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2
                  className="w-8 h-8 animate-spin"
                  style={{ color: '#0075be' }}
                />
                <p className="text-sm text-slate-400 font-medium">Loading contacts…</p>
              </div>
            ) : !contacts?.length ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-1"
                  style={{ background: primaryGradient }}
                >
                  <Users className="w-7 h-7" />
                </div>
                <p className="text-slate-700 font-semibold">No contacts yet</p>
                <p className="text-slate-400 text-sm max-w-xs">
                  {activeTab === 'customer'
                    ? 'Your customer contacts will appear here once added.'
                    : 'Industry contacts will appear here once added.'}
                </p>
              </div>
            ) : (
              contacts.map((contact) => (
                <ContactRow
                  key={contact.id}
                  contact={contact}
                  onView={() => setSelectedContact(contact)}
                />
              ))
            )}
          </div>

          {/* Panel Footer */}
          {!isLoading && !!contacts?.length && (
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <p className="text-xs text-slate-400 font-medium">
                Showing <span className="font-bold text-slate-600">{contacts.length}</span> contacts
              </p>
              <div className="flex items-center gap-1 text-xs font-semibold text-[#0075be] cursor-default select-none">
                <span>Most recent first</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          )}  
        </div>
      </div>

      {/* Contact Detail Drawer */}
      {selectedContact && (
        <ContactView contact={selectedContact} setSelectedContact={setSelectedContact} />
      )}
    </div>
  );
}