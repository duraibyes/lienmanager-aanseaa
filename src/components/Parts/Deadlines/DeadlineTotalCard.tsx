
const DeadlineTotalCard = ({ title, value, icon: Icon }: { title: string, value: number | undefined, icon: React.ElementType }) => {
    return (
        <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-2xl border border-slate-100 shadow-md hover:shadow-sm transition-all w-full h-[64px]">

            <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0 bg-primary-gradient"
            >
                <Icon className="w-4 h-4" />
            </div>

            <div className="flex flex-col justify-center flex-1 overflow-hidden">

                <p className="text-lg sm:text-xl font-bold leading-tight truncate">
                    {value ?? 0}
                </p>

                <p className="text-sm text-slate-500 truncate">
                    {title}
                </p>

            </div>
        </div>
    )
}

export default DeadlineTotalCard