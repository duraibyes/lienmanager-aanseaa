import { Mail, MapPin, Phone } from "lucide-react"
import { ProjectViewResponse } from "../../../types/project"

const ContactProjectView = ({ project }: { project: ProjectViewResponse | null }) => {

    const noContacts =
        !project?.customerContacts &&
        (!project?.industryContacts || project.industryContacts.length === 0);
    return (
        <div className="space-y-4">
            {noContacts && (
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-500">No contacts available</p>
                </div>
            )}

            {
                project?.customerContacts && (
                    <div key={project?.customerContacts?.id} className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{project?.customerContacts?.get_contacts?.first_name} {project?.customerContacts?.get_contacts?.last_name}</h3>
                                <p className="text-sm text-gray-600">{project?.customerContacts?.company?.company}</p>
                            </div>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                {project?.customerContacts?.get_contacts?.contact_role?.name ?? project?.customerContacts?.get_contacts?.title}
                            </span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            {project?.customerContacts?.get_contacts?.email && (
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm">{project?.customerContacts?.get_contacts?.email}</span>
                                </div>
                            )}
                            {project?.customerContacts?.get_contacts?.phone && (
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm">{project?.customerContacts?.get_contacts?.phone}</span>
                                </div>
                            )}
                            {project?.customerContacts?.address && (
                                <div className="flex items-center gap-2 text-gray-700">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm">
                                        {project?.customerContacts?.address}, {project?.customerContacts?.city},  {project?.customerContacts?.zip}
                                    </span>
                                </div>
                            )}
                        </div>

                    </div>)
            }
            {project?.industryContacts?.map((contact) => (
                <div key={contact.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{contact.contact_name}</h3>
                            <p className="text-sm text-gray-600">{contact.company.company}</p>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                            {contact.contact_type}
                        </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        {contact.email && (
                            <div className="flex items-center gap-2 text-gray-700">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className="text-sm">{contact.email}</span>
                            </div>
                        )}
                        {contact.phone && (
                            <div className="flex items-center gap-2 text-gray-700">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span className="text-sm">{contact.phone}</span>
                            </div>
                        )}
                        {contact.address && (
                            <div className="flex items-center gap-2 text-gray-700">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-sm">
                                    {contact.address}, {contact.city}, {contact.zip}
                                </span>
                            </div>
                        )}
                    </div>

                </div>
            ))}
        </div>
    )
}

export default ContactProjectView