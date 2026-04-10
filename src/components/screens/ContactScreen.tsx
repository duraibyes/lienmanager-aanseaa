import { useCallback, useState } from "react";
import Swal from "sweetalert2";
import { 
  Users, Mail, Phone, MapPin, Building, UserCheck, 
  Plus, Loader2, Globe, Home, Trash2, Edit2 
} from "lucide-react";
import { 
  useDeleteCustomerContactMutation, 
  useGetCustomerContactsQuery 
} from "../../features/project/ProjectContactApi";
import { CustomerContactDB } from "../../types/contact";
import AddContactModal from "../modals/AddContactModal";

// --- Design Constants ---
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

// --- Sub-Components ---

function StatPill({ label, value, icon: Icon }: { label: string; value: number; icon: any }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: primaryGradient }}>
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

const ContactScreen = () => {
  // --- Logic & State ---
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortModel, setSortModel] = useState({ field: "created_at", sort: "desc" });
  const [showAddModal, setShowAddModal] = useState(false);
  const [contact, setContact] = useState<CustomerContactDB | null>(null);

  const { data, isLoading } = useGetCustomerContactsQuery({
    page: page + 1,
    per_page: pageSize,
    sort_by: sortModel.field,
    sort_dir: sortModel.sort,
  });

  const [deleteCustomerContact] = useDeleteCustomerContactMutation();

  const rows = data?.data || [];
  const total = data?.meta?.total || 0;

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete this contact?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      buttonsStyling: false,
      customClass: {
        confirmButton: "bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 mx-2",
        cancelButton: "bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mx-2",
      },
    });
    if (result.isConfirmed) {
      try {
        await deleteCustomerContact({ id }).unwrap();
        Swal.fire({ title: "Deleted!", icon: "success", timer: 1500, showConfirmButton: false });
      } catch (error) {
        Swal.fire({ title: "Error!", text: "Failed to delete contact.", icon: "error" });
      }
    }
  };

  const handleEdit = useCallback((selectedRow: CustomerContactDB) => {
    setContact(selectedRow);
    setShowAddModal(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/70 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              <GradientText>Customer Contacts</GradientText>
            </h1>
            <p className="text-slate-500 text-sm mt-2 font-medium">
              Manage and organize your customer relationships efficiently.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <StatPill label="Total Contacts" value={total} icon={Users} />
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-blue-200"
              style={{ background: primaryGradient }}
            >
              <Plus className="w-5 h-5" />
              Add Contact
            </button>
          </div>
        </div>

        {/* --- Main Table Panel --- */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          
          {/* Table Header Row */}
          <div className="grid grid-cols-[1.5fr_1.5fr_1.5fr_1fr_1fr_auto] gap-4 px-6 py-4 bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span>Name & Title</span>
            <span>Company & Web</span>
            <span>Contact Info</span>
            <span>Location</span>
            <span>Address</span>
            <span className="text-right px-4">Actions</span>
          </div>

          {/* Table Body */}
          <div className="min-h-[400px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <p className="text-sm text-slate-400">Fetching records...</p>
              </div>
            ) : rows.length === 0 ? (
              <div className="text-center py-20 text-slate-400">No contacts found.</div>
            ) : (
              rows.map((row: CustomerContactDB) => (
                <div key={row.id} className="group grid grid-cols-[1.5fr_1.5fr_1.5fr_1fr_1fr_auto] items-center gap-4 px-6 py-4 border-b border-slate-50 hover:bg-blue-50/30 transition-colors last:border-0">
                  
                  {/* Name + Title */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-bold shadow-sm" style={{ background: primaryGradient }}>
                      {row.first_name?.[0]}{row.last_name?.[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {row.first_name} {row.last_name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate uppercase font-medium">{row.title || 'No Title'}</p>
                    </div>
                  </div>

                  {/* Company + Website */}
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-600 text-xs truncate">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium">{row.company_name}</span>
                    </div>
                    {row.website && (
                      <div className="flex items-center gap-1.5 text-blue-500 text-[11px] truncate">
                        <Globe className="w-3.5 h-3.5 text-blue-300" />
                        <a href={row.website} target="_blank" rel="noreferrer" className="hover:underline">{row.website}</a>
                      </div>
                    )}
                  </div>

                  {/* Email + Phones */}
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{row.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {row.direct_phone && (
                         <div className="flex items-center gap-1 text-[11px] text-slate-400">
                           <Phone className="w-3 h-3" /> {row.direct_phone}
                         </div>
                      )}
                      {row.cell && (
                         <div className="flex items-center gap-1 text-[11px] text-slate-400">
                           <UserCheck className="w-3 h-3" /> {row.cell}
                         </div>
                      )}
                    </div>
                  </div>

                  {/* City/State */}
                  <div className="text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{row.city}, {row.state}</span>
                    </div>
                    <p className="ml-5 text-[10px] text-slate-400">ZIP: {row.zip}</p>
                  </div>

                  {/* Full Address */}
                  <div className="min-w-0 flex items-start gap-1.5 text-xs text-slate-500">
                    <Home className="w-3.5 h-3.5 text-slate-300 mt-0.5 flex-shrink-0" />
                    <span className="truncate">{row.address}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEdit(row)}
                      className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(Number(row.id))}
                      className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* --- Pagination Footer --- */}
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-medium text-slate-500">
              Showing <span className="text-slate-800 font-bold">{rows.length}</span> of <span className="text-slate-800 font-bold">{total}</span> contacts
            </div>
            
            <div className="flex items-center gap-4">
              {/* Simple Pagination Logic */}
              <div className="flex items-center gap-2">
                 <select 
                  value={pageSize} 
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="text-xs border-slate-200 rounded-md p-1 outline-none"
                 >
                   {[10, 25, 50].map(size => <option key={size} value={size}>Show {size}</option>)}
                 </select>
              </div>
              <div className="flex gap-1">
                <button 
                  disabled={page === 0}
                  onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1 text-xs font-bold rounded border bg-white disabled:opacity-50"
                >
                  Prev
                </button>
                <button 
                  disabled={(page + 1) * pageSize >= total}
                  onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1 text-xs font-bold rounded border bg-white disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddContactModal 
          isOpen={showAddModal} 
          onClose={() => { setShowAddModal(false); setContact(null); }} 
          editData={contact} 
        />
      )}
    </div>
  );
};

export default ContactScreen;