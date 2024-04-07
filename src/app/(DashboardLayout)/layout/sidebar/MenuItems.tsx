import {
  IconCode,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navLavel: true,
    subheader: "Utilidades"
  },
  {
    id: uniqueId(),
    title: "Generador Swagger",
    icon: IconCode,
    href: "/util/swagger_gen",
  },
  {
    id: uniqueId(),
    title: "JSON Editor",
    icon: IconCode,
    href: "/util/json_viewer",
  },
];

export default Menuitems;
