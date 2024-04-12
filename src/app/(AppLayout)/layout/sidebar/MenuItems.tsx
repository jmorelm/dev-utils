import AccountTreeIcon from '@mui/icons-material/AccountTree';
import KeyIcon from '@mui/icons-material/Key';
import DifferenceIcon from '@mui/icons-material/Difference';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import { uniqueId } from "lodash";

const Menuitems = [
  {
    navLavel: true,
    subheader: "Utilidades"
  },
  // {
  //   id: uniqueId(),
  //   title: "Generar Swagger.json",
  //   icon: CloudDownloadIcon,
  //   href: "/util/swagger_gen",
  // },
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
  {
    id: uniqueId(),
    title: "PLSQL Analyzer",
    icon: TroubleshootIcon,
    href: "/util/plsql_editor",
  },
  {
    id: uniqueId(),
    title: "Base64 Tools",
    icon: SwapHorizIcon,
    href: "/util/base64_tools",
  },
  {
    id: uniqueId(),
    title: "Oracle - EF",
    icon: SwapHorizIcon,
    href: "/util/oracle_to_entity_framework",
  },
];

export default Menuitems;
