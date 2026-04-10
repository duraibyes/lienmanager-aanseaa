import { Trash2 } from "lucide-react";
import { ContactRole } from "../../types/contact";
import { CustomerContact } from "../../types/customer";

type customercontProps = {
    contacts: CustomerContact[];
    customerContactRoles: ContactRole[];
    updateContact: (index: number, field: keyof CustomerContact, value: string | number) => void;
    contactErrors: Record<number, { email?: string; directPhone?: string; cell?: string; firstName?: string }>;
    removeContact: (index: number) => void;
    validateContactField: (index: number, field: "email" | "directPhone" | "cell" | "firstName", value: string) => void;
    isMultiple?: boolean;
}

const CustomerContactListForm = ({ contacts, customerContactRoles, updateContact, contactErrors, removeContact, validateContactField, isMultiple = true }: customercontProps) => {

    return (
        <>
            {contacts.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full border border-slate-300">
                        <thead className="bg-slate-100">
                            <tr>
                                <th className="px-3 py-2 text-left text-sm font-semibold text-slate-700 border border-slate-300">
                                    Title <span className="text-red-600">*</span>
                                </th>
                                <th className="px-3 py-2 text-left text-sm font-semibold text-slate-700 border border-slate-300">
                                    First Name <span className="text-red-600">*</span>
                                </th>
                                <th className="px-3 py-2 text-left text-sm font-semibold text-slate-700 border border-slate-300">
                                    Last Name
                                </th>
                                <th className="px-3 py-2 text-left text-sm font-semibold text-slate-700 border border-slate-300">
                                    Email
                                </th>
                                <th className="px-3 py-2 text-left text-sm font-semibold text-slate-700 border border-slate-300">
                                    Direct Phone
                                </th>
                                <th className="px-3 py-2 text-left text-sm font-semibold text-slate-700 border border-slate-300">
                                    Cell
                                </th>
                                {isMultiple &&
                                    <th className="px-3 py-2 text-left text-sm font-semibold text-slate-700 border border-slate-300">
                                        Action
                                    </th>
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.map((contact, index) => (
                                <tr key={index} className="bg-white">
                                    <td className="px-3 py-2 border border-slate-300">
                                        <select
                                            value={contact.role_id}
                                            onChange={(e) => updateContact(index, 'role_id', Number(e.target.value))}
                                            className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                                        >
                                            {customerContactRoles?.map((role: ContactRole) => (
                                                <option key={role.id} value={role.id}>
                                                    {role.name}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-3 py-2 border border-slate-300">
                                        <input
                                            type="text"
                                            value={contact.firstName}
                                            onChange={(e) => {
                                                updateContact(index, 'firstName', e.target.value);
                                                validateContactField(index, "firstName", e.target.value);
                                            }}
                                            placeholder="N/A"
                                            className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                                        />
                                        {contactErrors[index]?.firstName && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {contactErrors[index].firstName}
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-3 py-2 border border-slate-300">
                                        <input
                                            type="text"
                                            value={contact.lastName}
                                            onChange={(e) => updateContact(index, 'lastName', e.target.value)}
                                            placeholder="N/A"
                                            className={`w-full px-2 py-1 border  rounded text-sm focus:ring-2 focus:ring-blue-500  ${contactErrors[index]?.firstName ? "border-red-500" : "border-slate-300"}`}
                                        />
                                    </td>
                                    <td className="px-3 py-2 border border-slate-300">
                                        <input
                                            type="email"
                                            value={contact.email}
                                            onChange={(e) => {
                                                updateContact(index, "email", e.target.value);
                                                validateContactField(index, "email", e.target.value);
                                            }}

                                            placeholder="N/A"
                                            className={`w-full px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500
      ${contactErrors[index]?.email ? "border-red-500" : "border-slate-300"}
    `}
                                        />
                                        {contactErrors[index]?.email && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {contactErrors[index].email}
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-3 py-2 border border-slate-300">
                                        <input
                                            type="text"
                                            value={contact.directPhone}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
                                                updateContact(index, "directPhone", value);
                                                validateContactField(index, "directPhone", value);
                                            }}
                                            placeholder="Direct Phone"
                                            className={`w-full px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500
      ${contactErrors[index]?.directPhone ? "border-red-500" : "border-slate-300"}
    `}
                                        />
                                        {contactErrors[index]?.directPhone && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {contactErrors[index].directPhone}
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-3 py-2 border border-slate-300">
                                        <input
                                            type="text"
                                            value={contact.cell}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
                                                updateContact(index, "cell", value);
                                                validateContactField(index, "cell", value);
                                            }}
                                            placeholder="Cell Phone"
                                            className={`w-full px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500
      ${contactErrors[index]?.cell ? "border-red-500" : "border-slate-300"}
    `}
                                        />
                                        {contactErrors[index]?.cell && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {contactErrors[index].cell}
                                            </p>
                                        )}
                                    </td>
                                    {isMultiple &&
                                        <td className="px-3 py-2 border border-slate-300 text-center">
                                            <button
                                                onClick={() => removeContact(index)}
                                                className="text-red-600 hover:text-red-800 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    }
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}</>
    )
}

export default CustomerContactListForm