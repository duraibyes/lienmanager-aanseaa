import { useState } from 'react';
import { Users, Mail, Phone, MapPin, Building, Eye } from 'lucide-react';
import TotalContactCard from '../Parts/Contact/TotalContactCard';
import { ProjectContact, useGetProjectContactsQuery } from '../../features/project/ProjectContactApi';
import ContactView from '../Parts/Contact/ContactView';
import IconButton from '../Button/IconButton';

export default function RecentContactsScreen() {

  const { data: projectContactData, isLoading } = useGetProjectContactsQuery();

  const totalCount = (projectContactData?.customerContact?.length || 0) + (projectContactData?.projectContact?.length || 0);
  const customerContactCount = projectContactData?.customerContact?.length || 0;
  const projectContactCount = projectContactData?.projectContact?.length || 0;

  const [selectedContact, setSelectedContact] = useState<ProjectContact | null>(null);
  const [activeTab, setActiveTab] = useState<"customer" | "industry">("customer");

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="px-2 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Contacts</h1>
            <p className="text-lg text-slate-600">
              View your all contacts
            </p>
          </div>
          <TotalContactCard
            totalCount={totalCount}
            customerContactCount={customerContactCount}
            projectContactCount={projectContactCount}
            isLoading={isLoading}
          />
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-slate-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab("customer")}
              className={`pb-3 text-sm font-medium transition-colors ${activeTab === "customer"
                ? "border-b-2 border-primary text-primary"
                : "text-slate-500 hover:text-slate-700"
                } block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand px-3 py-2.5 shadow-xs placeholder:text-body`}
            >
              Customer Contacts ({customerContactCount})
            </button>

            <button
              onClick={() => setActiveTab("industry")}
              className={`pb-3 text-sm font-medium transition-colors ${activeTab === "industry"
                ? "border-b-2 border-primary text-primary"
                : "text-slate-500 hover:text-slate-700"
                } block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand px-3 py-2.5 shadow-xs placeholder:text-body`}
            >
              Industry Contacts ({projectContactCount})
            </button>
          </div>
        </div>
        <div className="bg-neutral-primary-soft border border-default rounded-base shadow-xs w-full">
          <ul role="list" className="divide-y divide-default p-4 sm:p-6 flex flex-col">

            {(activeTab === "customer"
              ? projectContactData?.customerContact
              : projectContactData?.projectContact
            )?.map((contact) => (

              <li key={contact.id} className="py-4">

                <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 w-full">

                  {/* Avatar */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>

                  {/* Name */}
                  <div className="min-w-[140px]">
                    {contact?.contacts?.map((c: any, index: number) => (
                      <p key={index} className="font-semibold text-slate-900 truncate">
                        {c.firstName} {c.lastName}
                      </p>
                    ))}
                    <p className="text-xs text-slate-500">
                      {new Date(contact.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Title */}
                  {contact.title && (
                    <div className="min-w-[120px] text-sm text-slate-600 truncate">
                      {contact.title}
                    </div>
                  )}

                  {/* Company */}
                  {contact.company && (
                    <div className="flex items-center gap-2 min-w-[160px] truncate">
                      <Building className="w-4 h-4 text-slate-400" />
                      <span className="truncate">{contact.company}</span>
                    </div>
                  )}

                  {/* Email */}
                  {contact.email && (
                    <div className="flex items-center gap-2 min-w-[180px] truncate">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="truncate">{contact.email}</span>
                    </div>
                  )}

                  {/* Phone */}
                  {(contact?.contacts?.directPhone || contact?.contacts?.cell) && (
                    <div className="flex items-center gap-2 min-w-[140px]">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span>
                        {contact.contacts.directPhone || contact.contacts.cell}
                      </span>
                    </div>
                  )}

                  {/* Location */}
                  {contact.city && contact.state && (
                    <div className="flex items-center gap-2 min-w-[160px] truncate">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="truncate">
                        {contact.city}, {contact.state}
                      </span>
                    </div>
                  )}

                  {/* Button */}
                  <div className="ml-auto">
                    <IconButton
                      icon={Eye}
                      variant="primary"
                      title="View Details"
                      onClick={() => setSelectedContact(contact)}
                    />

                  </div>

                </div>

              </li>
            ))}
          </ul>
        </div>

        {selectedContact && (
          <ContactView contact={selectedContact} setSelectedContact={setSelectedContact} />
        )}
      </div>
    </div>
  );
}
