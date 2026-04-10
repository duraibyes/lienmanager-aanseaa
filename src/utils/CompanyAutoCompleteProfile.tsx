import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { useState } from "react";
import { ProfileAdd } from "../types/customer";

interface Props {
  readonly companies: any[];
  readonly customer: ProfileAdd;
  readonly updateForm: (field: keyof ProfileAdd, value: any) => void;
  readonly isFetching: boolean;
}

export default function CompanyAutoCompleteProfile({
  companies,
  customer,
  updateForm,
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
          updateForm("newCompanyName", value);
        }}

        onChange={(_, value: any) => {

          if (!value) return;

          // CREATE NEW COMPANY
          if (value.inputValue) {

            setInputValue(value.inputValue);

            updateForm("companyId", null);
            updateForm("newCompanyName", value.inputValue);

            updateForm("address", "");
            updateForm("city", "");
            updateForm("zip", "");
            updateForm("companyPhone", "");
            updateForm("fax", "");

            return;
          }

          // EXISTING COMPANY SELECTED
          setInputValue(value.company ?? "");

          updateForm("companyId", value.id);
          updateForm("newCompanyName", value.company ?? "");

          updateForm("address", value.address ?? "");
          updateForm("city", value.city ?? "");
          updateForm("zip", value.zip ?? "");
          updateForm("companyPhone", value.phone ?? "");
          updateForm("fax", value.fax ?? "");
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