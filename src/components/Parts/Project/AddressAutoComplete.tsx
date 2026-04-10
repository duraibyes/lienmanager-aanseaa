import { useRef } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { MapPin } from "lucide-react";
import Swal from "sweetalert2";
import { ProjectWizardData } from "../../../types/project";
import { GOOGLE_API_KEY } from "../../../utils/constant";
import { County, State } from "../../../types/master";

const libraries: ("places")[] = ["places"];

type AddressProps = {
    readonly data: ProjectWizardData;
    readonly onUpdate: (data: Partial<ProjectWizardData>) => void;
    readonly states: State[];
    readonly counties: County[];
}

const AddressAutocomplete = ({ data, onUpdate, states, counties }: AddressProps) => {
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    const selectedState = states?.find((s: any) => s.id === Number(data.stateId));

    const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
        autocompleteRef.current = autocomplete;

        // Restrict search
        autocomplete.setComponentRestrictions({
            country: "US",
        });
    };

    const onPlaceChanged = () => {
        const place = autocompleteRef.current?.getPlace();

        if (!place || !place.address_components) return;

        let cityVal = "";
        let zipVal = "";
        let countyVal = "";
        let state = "";

        place.address_components.forEach((component) => {
            const types = component.types;

            if (types.includes("locality")) {
                cityVal = component.long_name;
            }

            if (types.includes("postal_code")) {
                zipVal = component.long_name;
            }

            if (types.includes("administrative_area_level_2")) {
                countyVal = component.long_name;
            }
            if (types.includes("administrative_area_level_1")) state = component.long_name;

        });

        // ✅ Validate STATE
        if (selectedState && selectedState.name !== state) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: `Only ${selectedState.name} state address is allowed, but selected ${state}`,
            });
            onUpdate({ jobAddress: "" });
            return;
        }

        // ✅ Match COUNTY with DB
        let matchedCounty = counties?.find((c: any) =>
            countyVal.toLowerCase().includes(c.name.toLowerCase())
        );

        onUpdate({ jobAddress: place.formatted_address || "" });

        onUpdate({ jobCity: cityVal })
        onUpdate({ jobZip: zipVal })
        onUpdate({ jobCity: cityVal })
        onUpdate({ jobCountyId: matchedCounty ? matchedCounty.id : 0 })

        console.log(' countyVal ', countyVal);

    };

    return (
        <LoadScript
            googleMapsApiKey={GOOGLE_API_KEY}
            libraries={libraries}
        >
            {/* Address */}
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <div className="relative">
                    <input
                        type="text"
                        value={data.jobAddress}
                        onChange={(e) => onUpdate({ jobAddress: e.target.value })}
                        placeholder="Street address of job site"
                        className="w-full px-4 py-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                </div>

            </Autocomplete>
        </LoadScript>
    );
};

export default AddressAutocomplete;