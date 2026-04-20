import React from 'react'
import { Button } from '../ui/button';

type Props = {
    label: string;
    onClickFunction: () => void;
    icon?: React.ElementType
}
const OutlinePrimaryIcon = ({ label, onClickFunction, icon: Icon }: Props) => {
    return (
        <Button
            variant="outline"
            size="sm"
            onClick={onClickFunction}
            className="gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
        >
            {Icon &&
                <Icon className="h-4 w-4" />
            }
            <span className="hidden sm:inline">{label}</span>
        </Button>
    )
}

export default OutlinePrimaryIcon