import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DifferenceIcon from '@mui/icons-material/Difference';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import { uniqueId } from "lodash";
import { ChangeCircle, Grading } from '@mui/icons-material';

const Menuitems = [
  {
    navLavel: true,
    subheader: "Utilidades"
  },
  {
    id: uniqueId(),
    title: "JSON Editor",
    icon: AccountTreeIcon,
    href: "/util/json_viewer",
  },
  {
    id: uniqueId(),
    title: "Comparar Texto",
    icon: DifferenceIcon,
    href: "/util/comparison_tool",
  },
  {
    id: uniqueId(),
    title: "Herramientas Base64",
    icon: ChangeCircle,
    href: "/util/base64_tools",
  },
  {
    id: uniqueId(),
    title: "Oracle a Entity Framework",
    icon: DynamicFormIcon,
    href: "/util/ef_generator",
  },
  {
    id: uniqueId(),
    title: "Pasos de compilacion",
    icon: Grading,
    href: "/qa/comp_steps",
  },
];

export default Menuitems;
