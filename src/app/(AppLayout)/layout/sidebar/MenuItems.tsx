import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DifferenceIcon from '@mui/icons-material/Difference';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import { v4 } from 'uuid';
import { AccountTree, ChangeCircle, Grading } from '@mui/icons-material';

const Menuitems = [
  {
    navLavel: true,
    subheader: "Utilidades"
  },
  {
    id: v4(),
    title: "JSON Editor",
    icon: AccountTreeIcon,
    href: "/util/json_viewer",
  },
  {
    id: v4(),
    title: "Comparar Texto",
    icon: DifferenceIcon,
    href: "/util/comparison_tool",
  },
  {
    id: v4(),
    title: "Herramientas Base64",
    icon: ChangeCircle,
    href: "/util/base64_tools",
  },
  {
    id: v4(),
    title: "Oracle a Entity Framework",
    icon: DynamicFormIcon,
    href: "/util/ef_generator",
  },
  {
    id: v4(),
    title: "Analisis PL/SQL",
    icon: AccountTree,
    href: "/util/plsql_tree",
  },
  {
    id: v4(),
    title: "Pasos de compilacion",
    icon: Grading,
    href: "/qa/comp_steps",
  },
];

export default Menuitems;
