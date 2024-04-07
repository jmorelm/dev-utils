import {
  IconCode,
} from "@tabler/icons-react";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

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
];

export default Menuitems;
