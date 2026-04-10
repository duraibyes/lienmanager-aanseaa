import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Customer } from "../types/customer";


interface Props {
    readonly companies: any[];
    readonly customer: Customer;
    readonly updateCustomer: (field: keyof Customer, value: any) => void;
}

export default function CompanyAutocomplete({
    companies,
    customer,
    updateCustomer,
}: Props) {
    const [inputValue, setInputValue] = useState(customer.company ?? "");
    useEffect(() => {
        setInputValue(customer.company ?? "");
    }, [customer.company]);
    return (
        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
                Company<span className="text-red-600">*</span>:
            </label>

            <Autocomplete
                freeSolo
                options={(companies ?? []).filter((c) => c.company)}
                getOptionLabel={(option) =>
                    typeof option === "string"
                        ? option
                        : option.company ?? ""
                }
                isOptionEqualToValue={(option, value) =>
                    typeof value !== "string" && option.id === value.id
                }
                value={
                    (companies ?? []).find((c) => c.id === customer?.companyId) || null
                }
                inputValue={inputValue}
                onInputChange={(_, newInputValue) => {
                    setInputValue(newInputValue);
                    updateCustomer("company", newInputValue);
                    updateCustomer("companyId", null);
                    updateCustomer("company_id", null);
                }}
                onChange={(_, newValue) => {
                    if (typeof newValue === "string") {
                        // User typed new company
                        updateCustomer("company", newValue);
                        updateCustomer("companyId", null);
                        updateCustomer("company_id", null);
                    } else if (newValue) {
                        // User selected existing company
                        console.log(' newValue ', newValue, newValue?.data?.address)
                        updateCustomer("company", newValue.company ?? "");
                        updateCustomer("companyId", newValue.id);
                        updateCustomer("company_id", newValue.id);
                        updateCustomer("website", newValue?.data?.website);
                        updateCustomer("address", newValue?.data?.address);
                        updateCustomer("city", newValue?.data?.city);
                        updateCustomer("state_id", newValue?.data?.state_id);
                        updateCustomer("zip", newValue?.data?.zip);
                        updateCustomer("phone", newValue?.data?.phone);
                        updateCustomer("fax", newValue?.data?.fax);
                    }
                }}
                renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                        {option.company}
                    </li>
                )}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder="Type or select company"
                        size="small"
                    />
                )}
            />
        </div>
    );
}
