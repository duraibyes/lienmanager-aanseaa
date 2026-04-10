import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { useState } from "react";
import { LienAdd } from "../components/screens/attorney/AttorneySignupScreen";

interface Props {
  readonly companies: any[];
  readonly customer: LienAdd;
  readonly updateCustomer: (field: keyof LienAdd, value: any) => void;
  readonly isFetching: boolean;
}

export default function CompanyAutocompleteLien({
  companies,
  customer,
  updateCustomer,
  isFetching
}: Props) {

  const [inputValue, setInputValue] = useState(customer.newCompanyName ?? "");

  const options = companies ?? [];

  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Company<span className="text-red-600">*</span>
      </label>

      <Autocomplete
        freeSolo
        loading={isFetching}
        options={options}

        getOptionLabel={(option: any) =>
          typeof option === "string" ? option : option.company ?? ""
        }

        filterOptions={(options, params) => {
          const filtered = options.filter((o) =>
            o.company?.toLowerCase().includes(params.inputValue.toLowerCase())
          );

          const exists = options.some(
            (o) => o.company?.toLowerCase() === params.inputValue.toLowerCase()
          );

          if (params.inputValue !== "" && !exists) {
            filtered.push({
              id: "create",
              company: `Create "${params.inputValue}"`,
              inputValue: params.inputValue
            });
          }

          return filtered;
        }}

        value={options.find((c) => c.id === customer.companyId) || null}

        inputValue={inputValue}

        onInputChange={(_, value) => {
          setInputValue(value);
          updateCustomer("newCompanyName", value);
        }}

        onChange={(_, value: any) => {

          if (!value) return;

          // CREATE NEW COMPANY
          if (value.inputValue) {

            setInputValue(value.inputValue);

            updateCustomer("companyId", null);
            updateCustomer("newCompanyName", value.inputValue);

            updateCustomer("address", "");
            updateCustomer("city", "");
            updateCustomer("zip", "");
            updateCustomer("companyPhone", "");
            updateCustomer("fax", "");

            return;
          }

          // EXISTING COMPANY SELECTED
          setInputValue(value.company ?? "");

          updateCustomer("companyId", value.id);
          updateCustomer("newCompanyName", value.company ?? "");

          updateCustomer("address", value.address ?? "");
          updateCustomer("city", value.city ?? "");
          updateCustomer("zip", value.zip ?? "");
          updateCustomer("companyPhone", value.phone ?? "");
          updateCustomer("fax", value.fax ?? "");
        }}

        renderOption={(props, option: any) => (
          <li {...props} key={option.id}>
            {option.company}
          </li>
        )}

        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search or create company"
            size="small"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isFetching && <CircularProgress size={18} />}
                  {params.InputProps.endAdornment}
                </>
              )
            }}
          />
        )}
      />
    </div>
  );
}