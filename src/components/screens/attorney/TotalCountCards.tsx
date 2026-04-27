import { StatCard } from '@/components/ui/stat-card'
import { DollarSign, Loader } from 'lucide-react';


type Props = {
    isFetching: boolean;
    totalContracts: any;
    totalAmount: any;
    averageAmount: any;
}

const TotalCountCards = ({ isFetching, totalContracts, totalAmount, averageAmount }: Props) => {

    const cardData = [
        {
            title: 'Total Contracts',
            value: totalContracts || 0,
            icon: isFetching ? Loader : DollarSign,

        },
        {
            title: 'Total Contract Amount',
            value: totalAmount ? totalAmount.toFixed(2) : 0,
            icon: isFetching ? Loader : DollarSign,

        },
        {
            title: 'Average Contract Amount',
            value: averageAmount ? averageAmount.toFixed(2) : 0,
            icon: isFetching ? Loader : DollarSign,

        }
    ];
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {cardData.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    )
}

export default TotalCountCards