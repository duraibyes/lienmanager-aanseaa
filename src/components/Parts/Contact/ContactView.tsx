import { Building, Globe, Mail, MapPin, Phone, Users, X } from "lucide-react";
import { ProjectContact } from "../../../features/project/ProjectContactApi";

type ContactViewProps = {
    contact: ProjectContact;
    setSelectedContact: (contact: ProjectContact | null) => void;
}

const ContactView = ({ contact, setSelectedContact }: ContactViewProps) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedContact(null)}>
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-900">Contact Details</h2>
                    <button
                        onClick={() => setSelectedContact(null)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                            {contact?.contacts?.map((c, index) => (
                                <h3 className="text-xl font-bold text-slate-900" key={index}>
                                    {c.firstName} {c.lastName}
                                </h3>
                            ))}
                            {/* {contact?.title && (
                                            <p className="text-slate-600">{contact.title}</p>
                                        )} */}
                        </div>
                    </div>

                    {contact.company && (
                        <div className="bg-slate-50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-slate-600 mb-3">Company Information</h4>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <Building className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-slate-500">Company Name</p>
                                        <p className="text-slate-900 font-medium">{contact.company}</p>
                                    </div>
                                </div>
                                {contact.website && (
                                    <div className="flex items-start gap-3">
                                        <Globe className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-slate-500">Website</p>
                                            <a href={`https://${contact.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                                                {contact.website}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="bg-slate-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-slate-600 mb-3">Contact Information</h4>
                        <div className="space-y-3">
                            {contact.email && (
                                <div className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-slate-500">Email</p>
                                        <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline font-medium">
                                            {contact.email}
                                        </a>
                                    </div>
                                </div>
                            )}
                            {contact?.contacts?.map((c,index) => (
                                <div key={index}>
                                    {c.directPhone &&
                                        <div className="flex items-start gap-3">
                                            <Phone className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm text-slate-500">Direct Phone</p>
                                                <a href={`tel:${c?.directPhone}`} className="text-slate-900 hover:text-blue-600 font-medium">
                                                    {c.directPhone}
                                                </a>
                                            </div>
                                        </div>
                                    }
                                    {c.cell &&
                                        <div className="flex items-start gap-3">
                                            <Phone className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm text-slate-500">Cell Phone</p>
                                                <a href={`tel:${c.cell}`} className="text-slate-900 hover:text-blue-600 font-medium">
                                                    {c?.cell}
                                                </a>
                                            </div>
                                        </div>
                                    }
                                </div>
                            ))}

                        </div>
                    </div>

                    {(contact.address || contact.city || contact.state || contact.zip) && (
                        <div className="bg-slate-50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-slate-600 mb-3">Address</h4>
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    {contact.address && <p className="text-slate-900">{contact.address}</p>}
                                    <p className="text-slate-900">
                                        {contact.city && `${contact.city}, `}
                                        {contact.state && `${contact.state} `}
                                        {contact.zip}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="text-xs text-slate-500 text-center pt-4 border-t border-slate-200">
                        Added on {new Date(contact.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactView