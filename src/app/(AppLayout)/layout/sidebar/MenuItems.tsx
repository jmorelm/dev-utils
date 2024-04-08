import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import KeyIcon from '@mui/icons-material/Key';
import DifferenceIcon from '@mui/icons-material/Difference';
import { uniqueId } from "lodash";

const Menuitems = [
  {
    navLavel: true,
    subheader: "Utilidades"
  },
  {
    id: uniqueId(),
    title: "Generar Swagger.json",
    icon: CloudDownloadIcon,
    href: "/util/swagger_gen",
  },
  {
    id: uniqueId(),
    title: "JSON Editor",
    icon: AccountTreeIcon,
    href: "/util/json_viewer",
  },
  {
    id: uniqueId(),
    title: "Generar API Key",
    icon: KeyIcon,
    href: "/util/api_key",
  },
  {
    id: uniqueId(),
    title: "Comparar Texto",
    icon: DifferenceIcon,
    href: "/util/comparison_tool",
  },
];

export default Menuitems;
