type ProjectDetailsProps = {
    name: string;
    country: string;
    state: string;
    projectType: string;
    customerType: string;
    role: string;
}

const ProjectDetails = ({name, country, state, projectType, customerType, role}:ProjectDetailsProps) => {
    return (
        <div className="p-6 grid md:grid-cols-2 gap-4">
            <div>
                <div className="text-sm text-slate-600">Project Name</div>
                <div className="font-semibold text-slate-900">{name}</div>
            </div>
            <div>
                <div className="text-sm text-slate-600">Country</div>
                <div className="font-semibold text-slate-900">{country}</div>
            </div>
            <div>
                <div className="text-sm text-slate-600">{country === 'United Kingdom' ? 'Region' : 'State'}</div>
                <div className="font-semibold text-slate-900">{state}</div>
            </div>
            <div>
                <div className="text-sm text-slate-600">Project Type</div>
                <div className="font-semibold text-slate-900 capitalize">{projectType}</div>
            </div>
            <div>
                <div className="text-sm text-slate-600">Your Role</div>
                <div className="font-semibold text-slate-900 capitalize">{role}</div>
            </div>
            <div>
                <div className="text-sm text-slate-600">Your Customer</div>
                <div className="font-semibold text-slate-900 capitalize">{customerType}</div>
            </div>
        </div>
    )
}

export default ProjectDetails