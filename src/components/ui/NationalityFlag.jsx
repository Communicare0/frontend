import ReactCountryFlag from "react-country-flag";
import { NATIONALITY_ISO_MAP } from "@/constants/nationalityIsoMap";

export default function NationalityFlag({ nationality, size = 20 }) {
    const iso = NATIONALITY_ISO_MAP[nationality];
    if(!iso) return null;
    console.log("NationalityFlag:", { nationality, iso });
    return (
        <ReactCountryFlag
            countryCode={iso}
            svg
            style={{
                width: size,
                height: size,
                verticalAlign: "middle"
            }}
        />
    );
}